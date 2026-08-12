from pydantic import BaseModel


class BloodValue(BaseModel):
    test: str
    value: float | None = None
    result: str | None = None
    qualitative_value: str | None = None
    unit: str | None = None
    reference_range: str | None = None
    raw_line: str


class OCRResponse(BaseModel):
    text: str
    values: list[BloodValue]


class ReportAnalysisRequest(BaseModel):
    values: list[BloodValue]


class ReportAnalysisResponse(BaseModel):
    analysis: str