from uuid import uuid4

from fastapi import APIRouter

from app.schemas.feedback import FeedbackCreate, FeedbackResponse

router = APIRouter()


@router.post("", response_model=FeedbackResponse)
def create_feedback(feedback: FeedbackCreate) -> FeedbackResponse:
    return FeedbackResponse(
        id=f"feedback-{uuid4().hex[:8]}",
        route_log_id=feedback.route_log_id,
        rating=feedback.rating,
        comment=feedback.comment,
        tags=feedback.tags,
        status="accepted",
    )
