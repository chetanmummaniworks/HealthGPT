from __future__ import annotations

from pydantic import BaseModel, Field

confidence_level: str
class DiseasePredictionRequest(BaseModel):
    symptoms: list[str] = Field(
        ...,
        min_length=1,
        description="List of selected symptom names.",
    )

    top_k: int = Field(
        default=5,
        ge=1,
        le=5,
        description="Number of candidate conditions to return.",
    )


class DiseasePredictionResult(BaseModel):
    rank: int

    disease: str

    model_score: float = Field(
        ge=0.0,
        le=1.0,
    )


class DiseasePredictionResponse(BaseModel):
    results: list[DiseasePredictionResult]

    top_score: float = Field(
        ge=0.0,
        le=1.0,
    )

    top_two_margin: float = Field(
        ge=0.0,
        le=1.0,
    )

    needs_caution: bool
    
    
    confidence_level: str

    message: str

    explanation: str