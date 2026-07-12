from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, Query, UploadFile
from pydantic import BaseModel

from app.storage import store
from app.domains.datasets import dataset_service
from app.domains.datasets.preprocessing_service import validate_dataset, preprocess_dataset
from app.core.config import settings

router = APIRouter(tags=["datasets"])


class PreprocessOptions(BaseModel):
    auto_clean: bool = True
    aggressive_clean: bool = False


@router.post("/upload")
async def upload(file: UploadFile = File(...), auto_clean: bool = Query(True), aggressive_clean: bool = Query(False)):
    record = await dataset_service.ingest_file(file, auto_clean=auto_clean, aggressive_clean=aggressive_clean)
    return {"dataset": record}


@router.get("/datasets")
async def list_datasets():
    return store.list_datasets()


@router.get("/datasets/{dataset_id}")
async def get_dataset(dataset_id: str):
    record = store.get_dataset(dataset_id)
    if not record:
        raise HTTPException(404, "Dataset not found.")
    return record


@router.get("/datasets/{dataset_id}/preview")
async def preview_dataset(dataset_id: str, page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=500)):
    return dataset_service.preview(dataset_id, page, page_size)


@router.get("/datasets/{dataset_id}/preprocessing-report")
async def get_preprocessing_report(dataset_id: str):
    """Get the preprocessing report for a dataset."""
    record = store.get_dataset(dataset_id)
    if not record:
        raise HTTPException(404, "Dataset not found.")

    report = record.get("preprocessing_report")
    if not report:
        # Generate report if not stored
        df = store.get_df(dataset_id)
        if df is None:
            raise HTTPException(404, "Dataset data not found.")
        report_obj = validate_dataset(df, dataset_id, record.get("name", "Unknown"))
        return report_obj.__dict__

    return report


@router.post("/datasets/{dataset_id}/reprocess")
async def reprocess_dataset(dataset_id: str, options: PreprocessOptions):
    """Re-process a dataset with different preprocessing options."""
    record = store.get_dataset(dataset_id)
    if not record:
        raise HTTPException(404, "Dataset not found.")

    df = store.get_df(dataset_id)
    if df is None:
        raise HTTPException(404, "Dataset data not found.")

    # Re-process with new options
    cleaned_df, report = preprocess_dataset(
        df, dataset_id, record.get("name", "Unknown"),
        auto_clean=options.auto_clean,
        aggressive_clean=options.aggressive_clean
    )

    # Update stored dataset
    quality_score = dataset_service._quality_score(cleaned_df)
    missing_values = int(cleaned_df.isna().sum().sum())
    possible_join_keys = dataset_service._detect_join_keys(cleaned_df)

    extra = {
        "quality_score": quality_score,
        "missing_values": missing_values,
        "possible_join_keys": possible_join_keys,
        "detected_tables": 1,
        "preprocessing_report": report.__dict__,
    }

    # Update the dataset in storage
    csv_path = settings.datasets_dir / f"{dataset_id}.csv"
    cleaned_df.to_csv(csv_path, index=False)
    store._dataframes[dataset_id] = cleaned_df
    record.update(extra)
    record["rows"] = int(cleaned_df.shape[0])
    record["columns"] = int(cleaned_df.shape[1])
    record["size_bytes"] = int(csv_path.stat().st_size)
    store._data["datasets"][dataset_id] = record
    store._save()

    return {"dataset": record, "report": report.__dict__}


@router.delete("/datasets/{dataset_id}")
async def delete_dataset(dataset_id: str):
    if not store.get_dataset(dataset_id):
        raise HTTPException(404, "Dataset not found.")
    store.delete_dataset(dataset_id)
    return {"ok": True}