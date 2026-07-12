from __future__ import annotations

import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    groq_api_key: str = "your-groq-api-key-here"
    groq_text_model: str = "llama-3.3-70b-versatile"
    groq_fallback_text_model: str = "kimi-k2-instruct"
    groq_vision_model: str = "meta-llama/llama-4-scout-17b-16e-instruct"
    groq_whisper_model: str = "whisper-large-v3-turbo"

    cors_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost:8080"
    # Matches any http(s) origin on localhost / 127.0.0.1 / private LAN IPs on any port.
    # Covers the common case of opening the frontend via a machine's LAN IP
    # (e.g. http://10.5.0.2:8080) instead of localhost. Set to "" to disable and rely
    # solely on the explicit CORS_ORIGINS list above.
    cors_origin_regex: str = (
        r"http://(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|"
        r"192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?"
    )

    data_dir: str = "./data"

    # MongoDB settings
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "information_users"
    mongodb_users_collection: str = "users"

    # JWT settings
    jwt_secret_key: str = "your-secret-key-change-in-production-min-32-chars"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # Telegram Bot settings
    telegram_bot_token: str = "8974667061:AAH49-3urvoK8OkodO9le-vHBZkMueI69vQ"
    telegram_chat_id: str = "6798365742"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def datasets_dir(self) -> Path:
        p = Path(self.data_dir) / "datasets"
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def reports_dir(self) -> Path:
        p = Path(self.data_dir) / "reports"
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def meta_path(self) -> Path:
        p = Path(self.data_dir) / "meta.json"
        return p


settings = Settings()
os.makedirs(settings.data_dir, exist_ok=True)