"""Application configuration loaded from environment variables.

All settings have sensible defaults so the backend runs locally without a .env file.
In production (Render), set CORS_ORIGINS to the Vercel frontend URL.
"""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration. Reads from env vars or a backend/.env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database
    database_url: str = "sqlite:///./route53.db"

    # Session
    session_ttl_seconds: int = 7 * 24 * 60 * 60  # 7 days

    # CORS
    cors_origins: str = "http://localhost:3000,https://route53.sarvee.in"
    cors_origin_regex: str = r"^https://.*\.(vercel\.app|sarvee\.in)$"

    # Demo credentials (used by seed script)
    demo_email: str = "demo@example.com"
    demo_password: str = "demo1234"
    demo_name: str = "Demo User"


settings = Settings()
