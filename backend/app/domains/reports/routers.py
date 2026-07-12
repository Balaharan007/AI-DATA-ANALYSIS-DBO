from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.storage import store
from app.domains.auth import auth_service
from app.integrations.telegram import telegram_service

router = APIRouter(tags=["reports"])
security = HTTPBearer()


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user ID from JWT token."""
    token = credentials.credentials
    token_data = auth_service.decode_token(token)
    if not token_data or not token_data.email:
        raise HTTPException(401, "Invalid token")
    user = auth_service.get_user_by_email(token_data.email)
    if not user:
        raise HTTPException(401, "User not found")
    return user.id


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


@router.post("/reports/{report_id}/send-telegram")
async def send_report_to_telegram(report_id: str, user_id: str = Depends(get_current_user_id)):
    """Send a generated report to Telegram."""
    report = store.get_report(report_id)
    if not report:
        raise HTTPException(404, "Report not found.")

    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        raise HTTPException(400, "Telegram bot is not configured.")

    try:
        from ...domains.reports import _build_pdf, _build_docx
        from ...domains.datasets import dataset_service
        import pandas as pd

        # Get the files
        pdf_filename = f"report_of_{report['dataset_name']}.pdf"
        docx_filename = f"report_of_{report['dataset_name']}.docx"
        pdf_path = settings.reports_dir / pdf_filename
        docx_path = settings.reports_dir / docx_filename

        # Check if files exist, if not regenerate
        if not pdf_path.exists() or not docx_path.exists():
            # Need to regenerate - get the dataset and rebuild
            df, records = dataset_service.get_context_df(report.get("dataset_id"))
            if df is None:
                raise HTTPException(404, "Dataset not found for this report.")

            # Rebuild charts from the report data
            from ...domains.analysis import analysis
            numeric_cols = df.select_dtypes(include="number").columns.tolist()
            cat_cols = [c for c in df.columns if c not in numeric_cols]

            charts = []
            if cat_cols and numeric_cols:
                bar_spec = analysis.build_chart_spec(
                    df,
                    f"Bar chart showing {numeric_cols[0]} by {cat_cols[0]}",
                    "bar"
                )
                bar_spec["bullet_points"] = [
                    f"This bar chart compares {numeric_cols[0]} across different {cat_cols[0]} categories.",
                    f"The chart highlights which {cat_cols[0]} categories have the highest and lowest {numeric_cols[0]}.",
                    f"Use this to identify top-performing segments and outliers in {numeric_cols[0]}."
                ]
                charts.append(bar_spec)

                if len(numeric_cols) > 1:
                    line_spec = analysis.build_chart_spec(
                        df,
                        f"Line chart showing {numeric_cols[1]} trend over {cat_cols[0]}",
                        "line"
                    )
                    line_spec["bullet_points"] = [
                        f"This line chart shows the trend of {numeric_cols[1]} across {cat_cols[0]}.",
                        f"The chart reveals patterns, growth, or decline in {numeric_cols[1]} across categories.",
                        f"Use this to spot trends and compare {numeric_cols[1]} performance across segments."
                    ]
                    charts.append(line_spec)

            # Rebuild report files
            _build_pdf(df, {}, report['dataset_name'], charts, records, pdf_path)
            _build_docx(df, {}, report['dataset_name'], charts, docx_path)

        # Send both files to Telegram
        results = {}

        # Send PDF
        pdf_content = pdf_path.read_bytes()
        pdf_result = telegram_service.send_document_sync(
            file_content=pdf_content,
            filename=pdf_filename,
            caption=f"📊 Report: {report['dataset_name']} (PDF)"
        )
        if pdf_result:
            results["pdf"] = {
                "message_id": pdf_result.get("message_id"),
                "file_id": pdf_result.get("document", {}).get("file_id")
            }
            # Update report record
            report["telegram_sent"] = True
            report["telegram_pdf_message_id"] = pdf_result.get("message_id")

        # Send DOCX
        docx_content = docx_path.read_bytes()
        docx_result = telegram_service.send_document_sync(
            file_content=docx_content,
            filename=docx_filename,
            caption=f"📄 Report: {report['dataset_name']} (DOCX)"
        )
        if docx_result:
            results["docx"] = {
                "message_id": docx_result.get("message_id"),
                "file_id": docx_result.get("document", {}).get("file_id")
            }
            report["telegram_sent"] = True
            report["telegram_docx_message_id"] = docx_result.get("message_id")

        if not results:
            raise HTTPException(500, "Failed to send files to Telegram. Please check bot configuration.")

        # Save updated report
        store.add_report(report)

        return {
            "success": True,
            "message": "Report sent to Telegram successfully.",
            "files": results
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to send to Telegram: {str(e)}")


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
    from fastapi.responses import FileResponse
    return FileResponse(str(file_path), media_type=media_type, filename=filename)


@router.post("/telegram/test")
async def test_telegram_connection():
    """Test Telegram bot connection."""
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        raise HTTPException(400, "Telegram bot is not configured.")

    try:
        result = telegram_service.send_message(
            "✅ <b>Telegram connection test successful!</b>\n\nYour Insight Engine bot is properly configured and ready to send reports."
        )
        if result:
            return {"success": True, "message": "Telegram test message sent successfully!"}
        else:
            raise HTTPException(500, "Failed to send test message to Telegram")
    except Exception as e:
        raise HTTPException(500, f"Telegram test failed: {str(e)}")