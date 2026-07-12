from __future__ import annotations

from fastapi import APIRouter

from ...storage import store

router = APIRouter(tags=["history"])


@router.get("/history")
async def list_history():
    return store.list_history()