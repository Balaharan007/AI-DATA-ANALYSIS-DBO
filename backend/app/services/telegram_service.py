from __future__ import annotations

import requests
from typing import Optional, Dict, Any
from ..config import settings


class TelegramService:
    """Telegram Bot service for sending files and messages."""

    def __init__(self):
        self.bot_token = settings.telegram_bot_token
        self.chat_id = settings.telegram_chat_id
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"

    def _make_request(self, method: str, data: Dict[str, Any] = None, files: Dict = None) -> Optional[Dict]:
        """Make a request to Telegram Bot API."""
        if not self.bot_token or not self.chat_id:
            print("Telegram bot not configured (missing token or chat_id)")
            return None

        url = f"{self.base_url}/{method}"
        try:
            response = requests.post(url, data=data, files=files, timeout=30)
            response.raise_for_status()
            result = response.json()
            if result.get("ok"):
                return result.get("result")
            else:
                print(f"Telegram API error: {result.get('description')}")
                return None
        except requests.RequestException as e:
            print(f"Telegram request failed: {e}")
            return None

    def send_message(self, text: str, parse_mode: str = "HTML") -> Optional[Dict]:
        """Send a text message to the configured chat."""
        return self._make_request("sendMessage", {
            "chat_id": self.chat_id,
            "text": text,
            "parse_mode": parse_mode
        })

    def send_document(
        self,
        file_content: bytes,
        filename: str,
        caption: str = None,
        parse_mode: str = "HTML"
    ) -> Optional[Dict]:
        """Send a document/file to the configured chat."""
        files = {"document": (filename, file_content)}
        data = {"chat_id": self.chat_id}
        if caption:
            data["caption"] = caption
            data["parse_mode"] = parse_mode

        return self._make_request("sendDocument", data=data, files=files)

    def send_document_sync(
        self,
        file_content: bytes,
        filename: str,
        caption: str = None
    ) -> Optional[Dict]:
        """Synchronous version of send_document for use in non-async contexts."""
        return self.send_document(file_content, filename, caption)

    def send_photo(
        self,
        file_content: bytes,
        filename: str,
        caption: str = None
    ) -> Optional[Dict]:
        """Send a photo to the configured chat."""
        files = {"photo": (filename, file_content)}
        data = {"chat_id": self.chat_id}
        if caption:
            data["caption"] = caption
            data["parse_mode"] = "HTML"

        return self._make_request("sendPhoto", data=data, files=files)

    def get_me(self) -> Optional[Dict]:
        """Get bot information."""
        return self._make_request("getMe")

    def test_connection(self) -> bool:
        """Test if the bot is configured and can connect."""
        if not self.bot_token or not self.chat_id:
            return False
        result = self.get_me()
        return result is not None


# Singleton instance
telegram_service = TelegramService()