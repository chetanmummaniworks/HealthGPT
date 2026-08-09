"""SQLAlchemy declarative base.

All ORM models must inherit from Base so Alembic can discover their
metadata for migrations.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""