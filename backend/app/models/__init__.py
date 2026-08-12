"""ORM models package.

Importing this package registers all models on Base.metadata so Alembic
can autogenerate migrations.
"""
from app.models.medical_report import MedicalReport
from app.models.user import User

__all__ = ["User"]