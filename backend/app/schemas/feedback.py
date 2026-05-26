from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    route_log_id: str
    rating: int = Field(ge=1, le=5)
    comment: str | None = None
    tags: list[str] = Field(default_factory=list)


class FeedbackResponse(BaseModel):
    id: str
    route_log_id: str
    rating: int
    comment: str | None = None
    tags: list[str]
    status: str
