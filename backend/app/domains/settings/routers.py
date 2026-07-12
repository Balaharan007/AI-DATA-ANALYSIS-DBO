from __future__ import annotations

from fastapi import APIRouter

from ...models import AppSettings
from ...storage import store

router = APIRouter(tags=["settings"])


@router.get("/settings")
async def get_settings():
    return store.get_settings()


@router.put("/settings")
async def update_settings(payload: dict):
    return store.update_settings(payload)