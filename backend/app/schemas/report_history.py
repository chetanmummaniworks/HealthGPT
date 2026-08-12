from datetime import datetime

from pydantic import BaseModel


class ReportHistoryItem(BaseModel):
    id: int
    report_name: str
    extracted_values: list[dict]
    analysis: str | None
    created_at: datetime


class ReportHistoryResponse(BaseModel):
    reports: list[ReportHistoryItem]