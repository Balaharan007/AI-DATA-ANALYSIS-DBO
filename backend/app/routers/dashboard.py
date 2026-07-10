from __future__ import annotations

from fastapi import APIRouter, Query

from ..services import analysis, dataset_service
from ..storage import store

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard")
async def get_dashboard(dataset_id: str | None = Query(default=None)):
    if not dataset_id:
        datasets = store.list_datasets()
        if not datasets:
            return {"kpis": [], "charts": [], "filters": None}
        dataset_id = datasets[0]["id"]
    df, _ = dataset_service.get_context_df(dataset_id)
    if df is None or df.empty:
        return {"kpis": [], "charts": [], "filters": None}
    return analysis.build_dashboard(df)
