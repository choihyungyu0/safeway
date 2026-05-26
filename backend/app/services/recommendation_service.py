from app.repositories import recommendations_repository
from app.schemas.recommendation import RouteRecommendRequest, RouteRecommendation
from app.services.fixture_data import fixture_route_recommendations


def recommend_routes(request: RouteRecommendRequest) -> list[RouteRecommendation]:
    return recommendations_repository.list_route_recommendations(
        user_type=request.user_type,
        limit=3,
    ) or fixture_route_recommendations(request.user_type)
