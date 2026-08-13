"""Application settings loaded from environment variables.

Uses pydantic-settings. Required variables that are not set will cause
a clear failure at import time so misconfiguration is caught early.
"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Project root is three levels up from this file:
# config/settings.py -> app -> backend -> project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    """Central configuration for the HealthGPT AI backend."""

    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "HealthGPT AI"
    app_version: str = "1.0.0"
    app_description: str = (
        "AI-powered healthcare assistant providing preliminary health "
        "information and healthcare assistance."
    )

    # Database
    database_url: str

    # Authentication (prepared for a future milestone)
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # AI (prepared for a future milestone)
    gemini_api_key: str
    # Google Authentication
    google_client_id: str

    # CORS
    # Comma-separated list of allowed origins, e.g.
    # "http://localhost:5173,http://127.0.0.1:5173"
    allowed_origins: str = (
    "http://localhost:3000,"
    "http://localhost:5173,"
    "http://127.0.0.1:3000,"
    "http://127.0.0.1:5173"
)

    @property
    def cors_origins(self) -> list[str]:
        """Parse the allowed origins into a list."""
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()