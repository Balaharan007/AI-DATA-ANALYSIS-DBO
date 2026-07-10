from __future__ import annotations

import os
import io
from typing import Optional
from pathlib import Path

from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

from ..config import settings


_SCOPES = ["https://www.googleapis.com/auth/drive.file"]

_drive_service: Optional[object] = None


def _get_credentials() -> Credentials:
    """Get Google Drive credentials from environment or service account file."""
    # Option 1: Service account key file path
    sa_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_PATH")
    if sa_path and Path(sa_path).exists():
        return service_account.Credentials.from_service_account_file(
            sa_path, scopes=_SCOPES
        )

    # Option 2: Service account JSON from env var
    sa_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    if sa_json:
        import json
        info = json.loads(sa_json)
        return service_account.Credentials.from_service_account_info(
            info, scopes=_SCOPES
        )

    # Option 3: Use settings
    sa_path = settings.google_drive_credentials_path
    if sa_path and Path(sa_path).exists():
        return service_account.Credentials.from_service_account_file(
            sa_path, scopes=_SCOPES
        )

    # Option 4: Service account JSON from settings
    sa_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    if sa_json:
        import json
        info = json.loads(sa_json)
        return service_account.Credentials.from_service_account_info(
            info, scopes=_SCOPES
        )

    # Option 5: OAuth credentials (for user authentication flow)
    # This would require implementing OAuth flow - not implemented here
    raise RuntimeError(
        "Google Drive credentials not configured. "
        "Set GOOGLE_SERVICE_ACCOUNT_PATH, GOOGLE_SERVICE_ACCOUNT_JSON, or configure in .env"
    )


def _get_drive_service():
    """Get or create Google Drive service."""
    global _drive_service
    if _drive_service is None:
        creds = _get_credentials()
        _drive_service = build("drive", "v3", credentials=creds, cache_discovery=False)
    return _drive_service


class DriveService:
    """Google Drive service wrapper for easier usage."""

    def __init__(self):
        self.service = _get_drive_service()
        self.folder_id = settings.google_drive_folder_id or os.getenv("GOOGLE_DRIVE_FOLDER_ID")

    def upload_pdf(self, content: bytes, filename: str) -> Optional[dict]:
        """Upload PDF bytes to Google Drive."""
        return self._upload_bytes(content, filename, "application/pdf")

    def upload_docx(self, content: bytes, filename: str) -> Optional[dict]:
        """Upload DOCX bytes to Google Drive."""
        return self._upload_bytes(content, filename, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

    def _upload_bytes(self, content: bytes, filename: str, mime_type: str) -> Optional[dict]:
        """Upload bytes to Google Drive."""
        try:
            service = self.service

            file_metadata = {"name": filename}
            if self.folder_id:
                file_metadata["parents"] = [self.folder_id]

            media = MediaIoBaseUpload(
                io.BytesIO(content),
                mimetype=mime_type,
                resumable=True,
            )

            file = (
                service.files()
                .create(body=file_metadata, media_body=media, fields="id,name,webViewLink,webContentLink")
                .execute()
            )

            # Make file publicly accessible (optional - remove if not needed)
            try:
                service.permissions().create(
                    fileId=file["id"],
                    body={"type": "anyone", "role": "reader"},
                    fields="id",
                ).execute()
            except Exception:
                pass

            return {
                "id": file.get("id"),
                "name": file.get("name"),
                "webViewLink": file.get("webViewLink"),
                "webContentLink": file.get("webContentLink"),
            }
        except Exception as e:
            print(f"Failed to upload to Google Drive: {e}")
            return None