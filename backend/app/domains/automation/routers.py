from __future__ import annotations

from fastapi import APIRouter, Body, HTTPException

from ...storage import new_id, now_iso, store
from ...core.config import settings
from ...integrations.telegram import telegram_service

router = APIRouter(tags=["automation"])


def _get_telegram_connected() -> bool:
    """Check if Telegram bot is configured and can connect."""
    return telegram_service.test_connection()


@router.get("/automation")
async def list_automation():
    runs = store.list_runs()
    last_by_service = {}
    for r in runs:
        last_by_service.setdefault(r["service"], r["created_at"])

    services = [
        {"id": "telegram", "name": "telegram", "label": "Telegram", "connected": _get_telegram_connected()},
    ]
    return {"services": services, "runs": runs}


@router.post("/automation")
async def run_automation(payload: dict = Body(...)):
    service = payload.get("service")
    valid_services = {"telegram"}
    if service not in valid_services:
        raise HTTPException(400, f"Unknown automation service '{service}'.")

    if service == "telegram":
        # Test Telegram connection
        if not _get_telegram_connected():
            raise HTTPException(400, "Telegram bot is not configured. Please check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env")
        result = telegram_service.send_message("✅ <b>Telegram automation test</b>\n\nYour Insight Engine Telegram bot is working correctly!")
        if not result:
            raise HTTPException(500, "Failed to send Telegram message")
        message = "Telegram test message sent successfully"
    else:
        # This shouldn't be reached due to validation above
        raise HTTPException(400, f"Automation service '{service}' is not implemented.")

    run = {
        "id": new_id("run_"),
        "service": service,
        "status": "success",
        "created_at": now_iso(),
        "message": message,
    }
    return store.add_run(run)