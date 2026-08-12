"""Medical report database model."""

from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    func,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.database.base import Base


class MedicalReport(Base):
    """Stores an analyzed medical report for a user."""

    __tablename__ = "medical_reports"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    report_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="Medical Report",
    )

    extracted_values: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
    )

    analysis: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )