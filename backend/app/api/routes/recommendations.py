from fastapi import APIRouter

from app.schemas.recommendation import RouteRecommendRequest, RouteRecommendation
from app.services.recommendation_service import recommend_routes

router = APIRouter()


@router.post("/recommend", response_model=list[RouteRecommendation])
def create_route_recommendations(request: RouteRecommendRequest) -> list[RouteRecommendation]:
    return recommend_routes(request)
