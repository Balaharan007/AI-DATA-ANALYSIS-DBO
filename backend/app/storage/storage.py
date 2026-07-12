from __future__ import annotations

import json
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import pandas as pd

from app.core.config import settings

_lock = threading.RLock()


def new_id(prefix: str = "") -> str:
    return f"{prefix}{uuid.uuid4().hex[:12]}"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Store:
    """Simple JSON-file backed store for app state, with dataframes kept on disk as CSV
    and mirrored in memory for fast access."""

    def __init__(self) -> None:
        self.meta_path: Path = settings.meta_path
        self._data: dict[str, Any] = {
            "datasets": {},       # id -> Dataset dict
            "reports": {},        # id -> Report dict
            "history": [],        # list of HistoryItem dict
            "automation_runs": [],  # list of WorkflowRun dict
            "settings": {
                "groq_model": settings.groq_text_model,
                "temperature": 0.3,
                "language": "en",
                "theme": "dark",
                "automation_enabled": False,
                "voice_enabled": True,
                "notifications_enabled": True,
            },
        }
        self._dataframes: dict[str, pd.DataFrame] = {}
        self._conversations: dict[str, list[dict]] = {}
        self._load()

    # ---------- persistence ----------
    def _load(self) -> None:
        if self.meta_path.exists():
            try:
                self._data.update(json.loads(self.meta_path.read_text()))
            except Exception:
                pass
        for ds_id in list(self._data["datasets"].keys()):
            csv_path = settings.datasets_dir / f"{ds_id}.csv"
            if csv_path.exists():
                try:
                    self._dataframes[ds_id] = pd.read_csv(csv_path)
                except Exception:
                    self._data["datasets"].pop(ds_id, None)

    def _save(self) -> None:
        self.meta_path.write_text(json.dumps(self._data, indent=2, default=str))

    # ---------- datasets ----------
    def add_dataset(self, df: pd.DataFrame, name: str, dtype: str, extra: Optional[dict] = None) -> dict:
        with _lock:
            ds_id = new_id("ds_")
            csv_path = settings.datasets_dir / f"{ds_id}.csv"
            df.to_csv(csv_path, index=False)
            self._dataframes[ds_id] = df
            record = {
                "id": ds_id,
                "name": name,
                "type": dtype,
                "rows": int(df.shape[0]),
                "columns": int(df.shape[1]),
                "size_bytes": int(csv_path.stat().st_size),
                "uploaded_at": now_iso(),
                "status": "ready",
                "missing_values": int(df.isna().sum().sum()),
            }
            if extra:
                record.update(extra)
            self._data["datasets"][ds_id] = record
            self._save()
            return record

    def get_dataset(self, ds_id: str) -> Optional[dict]:
        return self._data["datasets"].get(ds_id)

    def get_df(self, ds_id: str) -> Optional[pd.DataFrame]:
        return self._dataframes.get(ds_id)

    def list_datasets(self) -> list[dict]:
        return sorted(self._data["datasets"].values(), key=lambda d: d["uploaded_at"], reverse=True)

    def delete_dataset(self, ds_id: str) -> None:
        with _lock:
            self._data["datasets"].pop(ds_id, None)
            self._dataframes.pop(ds_id, None)
            csv_path = settings.datasets_dir / f"{ds_id}.csv"
            if csv_path.exists():
                csv_path.unlink()
            self._save()

    def combined_df(self, ds_ids: list[str]) -> pd.DataFrame:
        """Best-effort merge of multiple datasets on shared column names, else concat."""
        dfs = [self._dataframes[i] for i in ds_ids if i in self._dataframes]
        if not dfs:
            return pd.DataFrame()
        if len(dfs) == 1:
            return dfs[0]
        result = dfs[0]
        for other in dfs[1:]:
            shared = list(set(result.columns) & set(other.columns))
            key_cols = [c for c in shared if result[c].nunique() > 1 or other[c].nunique() > 1]
            if key_cols:
                try:
                    result = result.merge(other, on=key_cols, how="outer", suffixes=("", "_2"))
                    continue
                except Exception:
                    pass
            result = pd.concat([result, other], ignore_index=True, sort=False)
        return result

    # ---------- conversations ----------
    def get_conversation(self, conv_id: str) -> list[dict]:
        return self._conversations.setdefault(conv_id, [])

    def append_conversation(self, conv_id: str, role: str, content: str) -> None:
        self._conversations.setdefault(conv_id, []).append({"role": role, "content": content})
        # keep last 20 turns to bound context size
        self._conversations[conv_id] = self._conversations[conv_id][-20:]

    # ---------- reports ----------
    def add_report(self, record: dict) -> dict:
        with _lock:
            self._data["reports"][record["id"]] = record
            self._save()
            return record

    def list_reports(self) -> list[dict]:
        return sorted(self._data["reports"].values(), key=lambda r: r["created_at"], reverse=True)

    def delete_report(self, report_id: str) -> None:
        with _lock:
            self._data["reports"].pop(report_id, None)
            self._save()

    def get_report(self, report_id: str) -> Optional[dict]:
        return self._data["reports"].get(report_id)

    # ---------- history ----------
    def add_history(self, record: dict) -> None:
        with _lock:
            self._data["history"].insert(0, record)
            self._data["history"] = self._data["history"][:200]
            self._save()

    def list_history(self) -> list[dict]:
        return self._data["history"]

    # ---------- automation ----------
    def add_run(self, record: dict) -> dict:
        with _lock:
            self._data["automation_runs"].insert(0, record)
            self._data["automation_runs"] = self._data["automation_runs"][:100]
            self._save()
            return record

    def list_runs(self) -> list[dict]:
        return self._data["automation_runs"]

    # ---------- settings ----------
    def get_settings(self) -> dict:
        return self._data["settings"]

    def update_settings(self, patch: dict) -> dict:
        with _lock:
            self._data["settings"].update({k: v for k, v in patch.items() if v is not None})
            self._save()
            return self._data["settings"]

    # ---------- Google OAuth tokens ----------
    def get_google_tokens(self, user_id: str) -> Optional[dict]:
        """Get Google OAuth tokens for a user."""
        return self._data.get("google_tokens", {}).get(user_id)

    def save_google_tokens(self, user_id: str, tokens: dict) -> None:
        """Save Google OAuth tokens for a user."""
        with _lock:
            if "google_tokens" not in self._data:
                self._data["google_tokens"] = {}
            self._data["google_tokens"][user_id] = {
                **tokens,
                "updated_at": now_iso()
            }
            self._save()

    def update_google_tokens(self, user_id: str, tokens: dict) -> None:
        """Update Google OAuth tokens for a user (merge with existing)."""
        with _lock:
            if "google_tokens" not in self._data:
                self._data["google_tokens"] = {}
            existing = self._data["google_tokens"].get(user_id, {})
            self._data["google_tokens"][user_id] = {
                **existing,
                **tokens,
                "updated_at": now_iso()
            }
            self._save()

    def delete_google_tokens(self, user_id: str) -> None:
        """Delete Google OAuth tokens for a user."""
        with _lock:
            self._data.get("google_tokens", {}).pop(user_id, None)
            self._save()


store = Store()