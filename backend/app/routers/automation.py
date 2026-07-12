from __future__ import annotations

from fastapi import APIRouter, Body, HTTPException

from ..storage import new_id, now_iso, store

router = APIRouter(tags=["automation"])

SERVICES = [
    {"id": "gmail", "name": "gmail", "label": "Gmail", "connected": False},
    {"id": "telegram", "name": "telegram", "label": "Telegram", "connected": False},
    {"id": "calendar", "name": "calendar", "label": "Calendar", "connected": False},
]


@router.get("/automation")
async def list_automation():
    runs = store.list_runs()
    last_by_service = {}
    for r in runs:
        last_by_service.setdefault(r["service"], r["created_at"])
    services = [{**s, "last_run": last_by_service.get(s["name"])} for s in SERVICES]
    return {"services": services, "runs": runs}


@router.post("/automation")
async def run_automation(payload: dict = Body(...)):
    service = payload.get("service")
    if service not in {s["name"] for s in SERVICES}:
        raise HTTPException(400, f"Unknown automation service '{service}'.")
    # NOTE: this is a functional stub. Wire this up to your n8n webhook / Gmail API /
    # Google Calendar API calls here. For example, POST to an n8n webhook URL configured
    # per-service via environment variables.
    run = {
        "id": new_id("run_"),
        "service": service,
        "status": "success",
        "created_at": now_iso(),
        "message": f"{service} automation triggered (stub — connect a real integration in app/routers/automation.py).",
    }
    return store.add_run(run)
