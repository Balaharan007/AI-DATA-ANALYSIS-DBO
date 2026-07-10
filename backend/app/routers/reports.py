from __future__ import annotations

import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..config import settings
from ..storage import store

router = APIRouter(tags=["reports"])


@router.get("/reports")
async def list_reports():
    reports = store.list_reports()
    # Convert relative URLs to absolute URLs pointing to the backend
    base = "/reports-files"
    for r in reports:
        if r.get("url") and r["url"].startswith("/files/"):
            r["url"] = r["url"].replace("/files/", f"{base}/", 1)
        if r.get("preview_url") and r["preview_url"].startswith("/files/"):
            r["preview_url"] = r["preview_url"].replace("/files/", f"{base}/", 1)
        if r.get("docx_url") and r["docx_url"].startswith("/files/"):
            r["docx_url"] = r["docx_url"].replace("/files/", f"{base}/", 1)
    return reports


@router.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    store.delete_report(report_id)
    return {"ok": True}


@router.get("/reports-files/{filename}")
async def serve_report_file(filename: str):
    """Serve generated report files (PDF, DOCX) directly from the reports directory."""
    file_path = settings.reports_dir / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(404, "Report file not found.")
    # Determine media type
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    media_type_map = {
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    media_type = media_type_map.get(ext, "application/octet-stream")
    return FileResponse(str(file_path), media_type=media_type, filename=filename)
