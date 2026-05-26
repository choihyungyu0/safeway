from app.schemas.recommendation import RouteRecommendRequest, RouteRecommendation


ROUTE_RECOMMENDATIONS = [
    RouteRecommendation(
        id="safeway-route-001",
        scenario="일반 여름날",
        user_type="GENERAL",
        route_id="R-001",
        route_name="조치원역 → 조치원읍 중심지",
        distance_km=1.24,
        shelter_within_500m_count=32,
        climate_safety_score=97.2,
        shelter_access_score=100,
        night_safety_score=94,
        exposure_score=93,
        final_safety_score=96.3,
        reason="쉼터 접근성과 최종 기후안전 점수가 가장 높은 경로입니다.",
    ),
    RouteRecommendation(
        id="safeway-route-002",
        scenario="일반 여름날",
        user_type="GENERAL",
        route_id="R-002",
        route_name="정부세종청사 → 세종시청",
        distance_km=2.1,
        shelter_within_500m_count=9,
        climate_safety_score=92,
        shelter_access_score=94,
        night_safety_score=90,
        exposure_score=91,
        final_safety_score=92,
        reason="기존 MVP 화면과 호환되는 세이프웨이 추천 경로입니다.",
    ),
]


def recommend_routes(_request: RouteRecommendRequest) -> list[RouteRecommendation]:
    return ROUTE_RECOMMENDATIONS
