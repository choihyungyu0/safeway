from pydantic import BaseModel


class RouteRecommendRequest(BaseModel):
    start_place: str | None = None
    destination: str | None = None
    user_type: str = "GENERAL"
    transport_mode: str = "WALK"
    preference: str = "SAFE"


class RouteRecommendation(BaseModel):
    id: str
    scenario: str
    user_type: str
    route_id: str
    route_name: str
    distance_km: float
    shelter_within_500m_count: int
    climate_safety_score: float
    shelter_access_score: float
    night_safety_score: float
    exposure_score: float
    final_safety_score: float
    reason: str
