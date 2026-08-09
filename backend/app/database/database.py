"""Database engine, session factory, and dependency.

Connection is lazy: no connection is opened until a session is actually
used, so the application can start without PostgreSQL running.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config.settings import get_settings

settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """Provide a database session as a FastAPI dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()