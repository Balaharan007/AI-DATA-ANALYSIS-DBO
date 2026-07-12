from __future__ import annotations

from fastapi import APIRouter

from ...domains.anomalies import anomaly_service

router = APIRouter(tags=["anomalies"])

# Anomalies endpoints could be added here if needed
# Currently handled via analysis router