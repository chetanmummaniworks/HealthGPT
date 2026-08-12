from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str
    content: str = Field(
        ...,
        min_length=1,
        max_length=4000,
    )


class PredictionContext(BaseModel):
    disease: str
    model_score: float


class ChatContext(BaseModel):
    symptoms: list[str] = Field(default_factory=list)
    predictions: list[PredictionContext] = Field(
        default_factory=list
    )
    top_score: float | None = None
    needs_caution: bool | None = None
    confidence_level: str | None = None


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
    )

    conversation: list[ChatMessage] = Field(
        default_factory=list,
        max_length=20,
    )

    context: ChatContext | None = None


class ChatResponse(BaseModel):
    response: str