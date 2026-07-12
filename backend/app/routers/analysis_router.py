from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..models import (
    DetectAnomalyRequest, ForecastRequest, GenerateChartRequest,
    GenerateReportRequest, GenerateSqlRequest,
)
from ..services import analysis, anomaly_service, dataset_service, forecast_service, report_service

router = APIRouter(tags=["analysis"])


def _require_df(dataset_id: str):
    df, records = dataset_service.get_context_df(dataset_id)
    if df is None or df.empty:
        raise HTTPException(404, "Dataset not found or empty.")
    return df, records


@router.post("/generate-chart")
async def generate_chart(payload: GenerateChartRequest):
    df, _ = _require_df(payload.dataset_id)
    return analysis.build_chart_spec(df, payload.prompt, payload.type)


@router.post("/generate-report")
async def generate_report(payload: GenerateReportRequest):
    return report_service.generate_report(payload.dataset_id, payload.prompt, payload.user_id)


@router.post("/detect-anomaly")
async def detect_anomaly(payload: DetectAnomalyRequest):
    df, _ = _require_df(payload.dataset_id)
    # Use new anomaly service with user query
    result = anomaly_service.detect_anomalies(df, payload.dataset_id if hasattr(payload, 'dataset_id') else "")
    return anomaly_service.get_anomaly_summary(result)


@router.post("/forecast")
async def forecast(payload: ForecastRequest):
    df, _ = _require_df(payload.dataset_id)
    try:
        # Use new forecast service with user query
        return forecast_service.generate_forecast(df, payload.target)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/generate-sql")
async def generate_sql(payload: GenerateSqlRequest):
    if payload.dataset_id:
        df, _ = _require_df(payload.dataset_id)
    else:
        from ..storage import store
        datasets = store.list_datasets()
        if not datasets:
            raise HTTPException(404, "No datasets available.")
        df, _ = dataset_service.get_context_df(datasets[0]["id"])
    sql = analysis.generate_sql(df, payload.prompt)
    return {"sql": sql}
