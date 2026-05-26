from __future__ import annotations

from functools import lru_cache
from math import asin, cos, radians, sin, sqrt
from pathlib import Path
from typing import Any
import json
import os

from app.schemas.admin import AdminMetric, AdminPayload, AdminSettings, DataStatus
from app.schemas.climate import ClimateScenario, CurrentClimate
from app.schemas.recommendation import RouteRecommendation
from app.schemas.shelter import LatLng, Shelter

def find_repo_root() -> Path:
    configured = os.getenv("SAFEWAY_REPO_ROOT")
    if configured:
        return Path(configured)

    for parent in Path(__file__).resolve().parents:
        if (parent / "src" / "mocks" / "fixtures" / "generated").exists():
            return parent

    return Path(__file__).resolve().parents[3]


FIXTURE_DIR = find_repo_root() / "src" / "mocks" / "fixtures" / "generated"


@lru_cache(maxsize=None)
def read_fixture(name: str) -> Any:
    return json.loads((FIXTURE_DIR / name).read_text(encoding="utf-8"))


def fixture_shelters() -> list[Shelter]:
    return [to_shelter(item) for item in read_fixture("safewayShelters.json")]


def fixture_shelter_by_id(shelter_id: str) -> Shelter | None:
    if shelter_id == "shelter-001":
        return demo_shelter_alias()

    return next((shelter for shelter in fixture_shelters() if shelter.id == shelter_id), None)


def fixture_nearby_shelters(
    lat: float | None = None,
    lng: float | None = None,
    radius_m: int = 500,
    limit: int = 10,
) -> list[Shelter]:
    shelters = fixture_shelters()
    if lat is None or lng is None:
        return sorted(shelters, key=lambda shelter: shelter.recommendation_score, reverse=True)[:limit]

    nearby = []
    for shelter in shelters:
        distance_m = haversine_m(lat, lng, shelter.location.lat, shelter.location.lng)
        if distance_m <= radius_m:
            nearby.append(shelter.model_copy(update={"distance_m": round(distance_m, 1)}))

    return sorted(nearby, key=lambda shelter: shelter.distance_m or 0)[:limit]


def fixture_climate_scenarios() -> list[ClimateScenario]:
    return [
        ClimateScenario(
            name=item["name"],
            temperature=item["temperature"],
            humidity=item["humidity"],
            pm10=item["pm10"],
            pm25=item["pm25"],
            ozone=item["ozone"],
            visibility_km=item["visibilityKm"],
        )
        for item in read_fixture("safewayClimateScenarios.json")
    ]


def fixture_current_climate() -> CurrentClimate:
    scenario = fixture_climate_scenarios()[0]

    return CurrentClimate(
        scenario=scenario.name,
        temperature=scenario.temperature,
        humidity=scenario.humidity,
        pm10=scenario.pm10,
        pm25=scenario.pm25,
        ozone=scenario.ozone,
        visibility_km=scenario.visibility_km,
        observed_at="2025-06-21T14:00:00+09:00",
        heat_status="주의",
        dust_status="좋음",
        fog_status="낮음",
    )


def fixture_route_recommendations(user_type: str = "GENERAL") -> list[RouteRecommendation]:
    routes = [
        to_route_recommendation(item)
        for item in read_fixture("safewayRouteRecommendations.json")
        if item.get("userType") == user_type
    ]
    if not routes:
        routes = [
            to_route_recommendation(item)
            for item in read_fixture("safewayRouteRecommendations.json")
            if item.get("userType") == "GENERAL"
        ]

    return sorted(routes, key=lambda route: route.final_safety_score, reverse=True)[:3]


def fixture_dashboard() -> AdminPayload:
    metadata = read_fixture("safewayImportMetadata.json")
    generated_counts = metadata.get("generatedCounts", {})

    return AdminPayload(
        title="관리자 대시보드",
        generated_from="generated SafeWay fixture fallback",
        metrics=[
            AdminMetric(
                id="shelters",
                label="총 쉼터",
                value=f"{generated_counts.get('shelters', 0)}개",
                delta="SafeWay fixture",
            ),
            AdminMetric(
                id="recommendations",
                label="추천 로그",
                value=f"{generated_counts.get('routeRecommendations', 0)}건",
                delta="fixture",
            ),
        ],
    )


def fixture_data_statuses() -> list[DataStatus]:
    metadata = read_fixture("safewayImportMetadata.json")
    generated_counts = metadata.get("generatedCounts", {})

    return [
        DataStatus(
            id="safeway-processed-data",
            name="SafeWay 처리 분석 데이터",
            provider="세종 SafeWay 로컬 분석",
            status="NORMAL",
            note=(
                f"쉼터 {generated_counts.get('shelters', 0)}개 · "
                f"추천 {generated_counts.get('routeRecommendations', 0)}건 · "
                f"시나리오 {generated_counts.get('climateScenarios', 0)}개"
            ),
            last_collected_at="2025.06.21 14:00",
        )
    ]


def fixture_admin_payload(title: str) -> AdminPayload:
    metadata = read_fixture("safewayImportMetadata.json")
    generated_counts = metadata.get("generatedCounts", {})

    return AdminPayload(
        title=title,
        generated_from="generated SafeWay fixture fallback",
        metrics=[
            AdminMetric(id="shelters", label="SafeWay 쉼터", value=f"{generated_counts.get('shelters', 0)}개"),
            AdminMetric(
                id="routes",
                label="추천 결과",
                value=f"{generated_counts.get('routeRecommendations', 0)}건",
            ),
        ],
        rows=[{"source": "generated fixtures", "status": "fallback-compatible"}],
    )


def fixture_settings() -> AdminSettings:
    weights = read_fixture("safewayUserTypeWeights.json")
    general = next((item for item in weights if item.get("userType") == "GENERAL"), weights[0])

    return AdminSettings(
        scoring_weights={
            "heat": 30,
            "dust": 25,
            "fog": 15,
            "shelter": 20,
            "walking": 10,
        },
        notification_settings={"risk": True, "data": True, "shelter": True},
        user_type_weight_source=(
            "SafeWay generated fixture "
            f"(GENERAL climate {general.get('climateSafetyWeight', 0):.2f})"
        ),
    )


def to_shelter(item: dict[str, Any], distance_m: float | None = None) -> Shelter:
    return Shelter(
        id=item["id"],
        name=item["name"],
        road_address=item.get("roadAddress") or "",
        lot_address=item.get("lotAddress") or "",
        type=item.get("type") or "기타",
        area=item.get("area"),
        capacity=int(item.get("capacity") or 0),
        operation_start_date=item.get("operationStartDate"),
        operation_end_date=item.get("operationEndDate"),
        operation_time=item.get("operationTime") or "09:00 ~ 18:00",
        fan_count=item.get("fanCount"),
        air_conditioner_count=item.get("airConditionerCount"),
        night_open=bool(item.get("nightOpen")),
        holiday_open=bool(item.get("holidayOpen")),
        stay_available=bool(item.get("stayAvailable")),
        recommendation_score=float(item.get("recommendationScore") or 0),
        grade=item.get("grade") or "C",
        location=LatLng(lat=float(item["lat"]), lng=float(item["lng"])),
        facilities=item.get("facilities") or [],
        managing_agency=item.get("managingAgency") or "",
        phone=item.get("phone") or "",
        data_base_date=item.get("dataBaseDate"),
        capacity_score=item.get("capacityScore"),
        area_score=item.get("areaScore"),
        cooling_score=item.get("coolingScore"),
        night_open_score=item.get("nightOpenScore"),
        holiday_open_score=item.get("holidayOpenScore"),
        distance_m=distance_m,
    )


def to_route_recommendation(item: dict[str, Any]) -> RouteRecommendation:
    return RouteRecommendation(
        id=item["id"],
        scenario=item["scenario"],
        user_type=item["userType"],
        route_id=item["routeId"],
        route_name=item["routeName"],
        distance_km=float(item["distanceKm"]),
        shelter_within_500m_count=int(item["shelterWithin500mCount"]),
        climate_safety_score=float(item["climateSafetyScore"]),
        shelter_access_score=float(item["shelterAccessScore"]),
        night_safety_score=float(item["nightSafetyScore"]),
        exposure_score=float(item["exposureScore"]),
        final_safety_score=float(item["finalSafetyScore"]),
        reason=(
            f"{item['routeName']} 경로는 최종 기후안전점수 "
            f"{float(item['finalSafetyScore']):.1f}점으로 추천됩니다."
        ),
    )


def demo_shelter_alias() -> Shelter:
    return Shelter(
        id="shelter-001",
        name="나성동 복합커뮤니티센터 쉼터",
        road_address="세종특별자치시 나성로 33",
        lot_address="세종특별자치시 나성동",
        type="공공시설",
        area=300,
        capacity=120,
        operation_start_date=None,
        operation_end_date=None,
        operation_time="09:00 ~ 18:00",
        fan_count=4,
        air_conditioner_count=6,
        night_open=True,
        holiday_open=True,
        stay_available=False,
        recommendation_score=92,
        grade="A",
        location=LatLng(lat=36.4879, lng=127.2576),
        facilities=["냉방", "좌석", "화장실"],
        managing_agency="세종특별자치시",
        phone="044-120",
    )


def haversine_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    radius_m = 6_371_000
    d_lat = radians(lat2 - lat1)
    d_lng = radians(lng2 - lng1)
    a = sin(d_lat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lng / 2) ** 2

    return 2 * radius_m * asin(sqrt(a))
