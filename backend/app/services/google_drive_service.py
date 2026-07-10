from __future__ import annotations

import io
import os
from typing import Optional

from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from google.oauth2 import service_account

from ..config import settings


class GoogleDriveService:
    """Service for uploading files to Google Drive."""

    def __init__(self):
        self.enabled = settings.google_drive_enabled
        self.credentials_path = settings.google_drive_credentials_path
        self.folder_id = settings.google_drive_folder_id
        self._service = None

    def _get_service(self):
        """Get or create Google Drive API service."""
        if self._service is None:
            if not self.enabled:
                raise RuntimeError("Google Drive integration is not enabled")
            if not self.credentials_path or not os.path.exists(self.credentials_path):
                raise RuntimeError(f"Google Drive credentials not found at {self.credentials_path}")
            if not self.folder_id:
                raise RuntimeError("Google Drive folder ID not configured")

            credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path,
                scopes=['https://www.googleapis.com/auth/drive.file']
            )
            self._service = build('drive', 'v3', credentials=credentials)
        return self._service

    def upload_file(
        self,
        file_content: bytes,
        filename: str,
        mime_type: str = "application/pdf"
    ) -> Optional[dict]:
        """
        Upload a file to Google Drive.

        Args:
            file_content: Binary content of the file
            filename: Name of the file
            mime_type: MIME type of the file

        Returns:
            Dictionary with file metadata (id, name, webViewLink) or None if failed
        """
        if not self.enabled:
            return None

        try:
            service = self._get_service()

            file_metadata = {
                'name': filename,
                'parents': [self.folder_id]
            }

            media = MediaIoBaseUpload(
                io.BytesIO(file_content),
                mimetype=mime_type,
                resumable=True
            )

            file = service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id,name,webViewLink,webContentLink'
            ).execute()

            return {
                'id': file.get('id'),
                'name': file.get('name'),
                'webViewLink': file.get('webViewLink'),
                'webContentLink': file.get('webContentLink')
            }
        except Exception as e:
            print(f"Google Drive upload failed: {e}")
            return None

    def upload_pdf(self, pdf_content: bytes, filename: str) -> Optional[dict]:
        """Upload a PDF file to Google Drive."""
        return self.upload_file(pdf_content, filename, "application/pdf")

    def upload_docx(self, docx_content: bytes, filename: str) -> Optional[dict]:
        """Upload a DOCX file to Google Drive."""
        return self.upload_file(
            docx_content,
            filename,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )


# Singleton instance
google_drive_service = GoogleDriveService()