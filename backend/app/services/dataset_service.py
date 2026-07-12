from __future__ import annotations

import io
from typing import Optional

import pandas as pd
from fastapi import HTTPException, UploadFile

from .. import groq_client
from ..storage import store, new_id
from .preprocessing_service import PreprocessingService, validate_dataset, preprocess_dataset

IMAGE_EXTS = {"png", "jpg", "jpeg", "webp", "gif", "bmp"}
CSV_EXTS = {"csv", "tsv"}
EXCEL_EXTS = {"xlsx", "xls"}


def _ext(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


def _quality_score(df: pd.DataFrame) -> float:
    if df.empty:
        return 0.0
    total_cells = df.shape[0] * df.shape[1]
    missing = df.isna().sum().sum()
    completeness = 1 - (missing / total_cells if total_cells else 0)
    dup_ratio = df.duplicated().sum() / max(df.shape[0], 1)
    score = max(0.0, min(1.0, completeness * 0.8 + (1 - dup_ratio) * 0.2))
    return round(score * 100, 1)


def _detect_join_keys(df: pd.DataFrame) -> list[str]:
    keys = []
    for col in df.columns:
        lc = str(col).lower()
        if lc.endswith("_id") or lc == "id" or "code" in lc or lc.endswith("key"):
            keys.append(col)
        elif df[col].is_unique and df.shape[0] > 1 and df[col].notna().all():
            keys.append(col)
    return keys[:5]


async def ingest_file(
    file: UploadFile,
    auto_clean: bool = True,
    aggressive_clean: bool = False,
) -> dict:
    raw = await file.read()
    if not raw:
        raise HTTPException(400, "Uploaded file is empty.")
    ext = _ext(file.filename or "")
    name = file.filename or "dataset"

    if ext in CSV_EXTS:
        try:
            sep = "\t" if ext == "tsv" else None
            df = pd.read_csv(io.BytesIO(raw), sep=sep, engine="python")
        except Exception as e:
            raise HTTPException(400, f"Could not parse CSV file: {e}")
        dtype = "csv"

    elif ext in EXCEL_EXTS:
        try:
            df = pd.read_excel(io.BytesIO(raw))
        except Exception as e:
            raise HTTPException(400, f"Could not parse Excel file: {e}")
        dtype = "csv"

    elif ext in IMAGE_EXTS:
        try:
            mime = f"image/{'jpeg' if ext == 'jpg' else ext}"
            csv_text = groq_client.vision_extract_table_csv(raw, mime=mime)
            df = pd.read_csv(io.StringIO(csv_text))
            if df.empty or df.shape[1] == 0:
                raise ValueError("No tabular data detected in image.")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                422, f"Could not extract a table from this image: {e}"
            )
        dtype = "image"

    else:
        raise HTTPException(
            400,
            f"Unsupported file type '.{ext}'. Please upload CSV, Excel, or an image "
            "of a table.",
        )

    if df.shape[0] == 0 or df.shape[1] == 0:
        raise HTTPException(422, "No usable rows/columns found in the uploaded file.")

    # Run preprocessing pipeline
    from ..models import ColumnMeta
    ds_id = new_id("ds_")
    print(f"DEBUG: Using new_id = {ds_id}")

    # Preprocess the dataset
    cleaned_df, report = preprocess_dataset(df, ds_id, name, auto_clean, aggressive_clean)

    # Calculate quality score
    quality_score = _quality_score(cleaned_df)
    missing_values = int(cleaned_df.isna().sum().sum())
    possible_join_keys = _detect_join_keys(cleaned_df)

    extra = {
        "quality_score": quality_score,
        "missing_values": missing_values,
        "possible_join_keys": possible_join_keys,
        "detected_tables": 1,
        "preprocessing_report": report.__dict__,
    }
    record = store.add_dataset(cleaned_df, name=name, dtype=dtype, extra=extra)

    store.add_history(
        {
            "id": store_new_id(),
            "kind": "export" if False else "conversation",
            "title": f"Uploaded {name}",
            "created_at": record["uploaded_at"],
            "meta": {"dataset_id": record["id"]},
        }
    )
    return record


def store_new_id() -> str:
    return new_id("hist_")


def column_meta(df: pd.DataFrame) -> list[dict]:
    metas = []
    for col in df.columns:
        s = df[col]
        metas.append(
            {
                "name": str(col),
                "dtype": str(s.dtype),
                "unique": int(s.nunique(dropna=True)),
                "missing": int(s.isna().sum()),
                "is_primary_key": bool(s.is_unique and s.notna().all()),
                "is_foreign_key": False,
            }
        )
    return metas


def preview(ds_id: str, page: int = 1, page_size: int = 25) -> dict:
    df = store.get_df(ds_id)
    if df is None:
        raise HTTPException(404, "Dataset not found.")
    start = (page - 1) * page_size
    end = start + page_size
    page_df = df.iloc[start:end]
    return {
        "columns": column_meta(df),
        "rows": _safe_records(page_df),
        "total_rows": int(df.shape[0]),
        "page": page,
        "page_size": page_size,
    }


def _safe_records(df: pd.DataFrame) -> list[dict]:
    """Convert a dataframe slice to JSON-safe records (NaN -> None)."""
    return df.where(pd.notnull(df), None).to_dict(orient="records")


def resolve_dataset_ids(dataset_id: Optional[str]) -> list[str]:
    """dataset_id may be a single id, 'all', or a comma-separated list of ids."""
    if not dataset_id:
        return []
    if dataset_id == "all":
        return [d["id"] for d in store.list_datasets()]
    return [d.strip() for d in dataset_id.split(",") if d.strip()]


def get_context_df(dataset_id: Optional[str]) -> tuple[Optional[pd.DataFrame], list[dict]]:
    ids = resolve_dataset_ids(dataset_id)
    if not ids:
        return None, []
    records = [store.get_dataset(i) for i in ids if store.get_dataset(i)]
    df = store.combined_df(ids)
    return df, records
