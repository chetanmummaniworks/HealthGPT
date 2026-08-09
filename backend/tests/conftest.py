"""Test configuration.

Sets the minimum required environment variables at import time so the
settings and application can be imported without a real .env file or
PostgreSQL running.
"""

import os

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:password@localhost:5432/healthgpt_test",
)
os.environ.setdefault("SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
os.environ.setdefault("GEMINI_API_KEY", "test-gemini-key-not-for-production")