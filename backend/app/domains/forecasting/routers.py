from __future__ import annotations

from fastapi import APIRouter

from ...domains.forecasting import forecast_service

router = APIRouter(tags=["forecasting"])

# Forecasting endpoints could be added here if needed
# Currently handled via analysis router