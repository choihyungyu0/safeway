from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any
import json
import os

from app.core.config import settings

try:
    from geoalchemy2.elements import WKTElement
    from sqlalchemy import text
except ImportError as exc:  # pragma: no cover - command should fail clearly before DB work
    raise SystemExit(
        "Database seed dependencies are missing. Run `pip install -r backend/requirements.txt` first."
    ) from exc

from app.db.models import (
    ClimateScenarioModel,
    DataCollectionRunModel,
    RouteRecommendationModel,
    ShelterModel,
    SystemSettingModel,
    UserTypeWeightModel,
)
from app.db.session import session_scope

def find_repo_root() -> Path:
    configured = os.getenv("SAFEWAY_REPO_ROOT")
    if configured:
        return Path(configured)

    for parent in Path(__file__).resolve().parents:
        if (parent / "src" / "mocks" / "fixtures" / "generated").exists():
            return parent

    return Path(__file__).resolve().parents[3]


REPO_ROOT = find_repo_root()
FIXTURE_DIR = REPO_ROOT / "src" / "mocks" / "fixtures" / "generated"


def read_fixture(name: str) -> Any:
    return json.loads((FIXTURE_DIR / name).read_text(encoding="utf-8"))


def require_database_url() -> None:
    if not settings.database_url:
        raise SystemExit("DATABASE_URL is required for seeding. Create backend/.env or export it first.")


def main() -> None:
    require_database_url()

    shelters = read_fixture("safewayShelters.json")
    scenarios = read_fixture("safewayClimateScenarios.json")
    weights = read_fixture("safewayUserTypeWeights.json")
    routes = read_fixture("safewayRouteRecommendations.json")
    scenario_summary = read_fixture("safewayScenarioSummary.json")
    analysis_summary = read_fixture("safewayAnalysisSummary.json")
    import_metadata = read_fixture("safewayImportMetadata.json")

    with session_scope(force=True) as session:
        if session is None:
            raise SystemExit("Database session could not be created. Check DATABASE_URL and dependencies.")

        session.execute(text("SELECT 1"))

        for item in shelters:
            session.merge(to_shelter_model(item))

        for index, item in enumerate(scenarios, start=1):
            session.merge(to_climate_scenario_model(item, index))

        for item in weights:
            session.merge(to_user_type_weight_model(item))

        for item in routes:
            session.merge(to_route_recommendation_model(item))

        generated_counts = import_metadata.get("generatedCounts", {})
        session.merge(
            DataCollectionRunModel(
                id="safeway-processed-data",
                dataset_name="SafeWay processed fixture data",
                provider="SafeWay.zip generated fixtures",
                status="NORMAL",
                collected_at=datetime(2025, 6, 21, 14, 0, tzinfo=timezone.utc),
                row_count=int(generated_counts.get("shelters", 0)),
                message=(
                    f"shelters={generated_counts.get('shelters', 0)}, "
                    f"routes={generated_counts.get('routeRecommendations', 0)}, "
                    f"scenarios={generated_counts.get('climateScenarios', 0)}"
                ),
            )
        )

        session.merge(SystemSettingModel(key="scenario_summary", value_json={"items": scenario_summary}))
        session.merge(SystemSettingModel(key="analysis_summary", value_json=analysis_summary))
        session.merge(SystemSettingModel(key="import_metadata", value_json=import_metadata))
        session.merge(
            SystemSettingModel(
                key="admin_settings",
                value_json={
                    "scoring_weights": {
                        "heat": 30,
                        "dust": 25,
                        "fog": 15,
                        "shelter": 20,
                        "walking": 10,
                    },
                    "notification_settings": {"risk": True, "data": True, "shelter": True},
                    "user_type_weight_source": "database seeded from SafeWay generated fixtures",
                },
            )
        )

    print("SafeWay seed complete")
    print(f"shelters inserted/updated: {len(shelters)}")
    print(f"climate scenarios inserted/updated: {len(scenarios)}")
    print(f"user type weights inserted/updated: {len(weights)}")
    print(f"route recommendations inserted/updated: {len(routes)}")
    print("data collection runs inserted/updated: 1")
    print("system settings inserted/updated: 4")


def to_shelter_model(item: dict[str, Any]) -> ShelterModel:
    lng = item.get("lng")
    lat = item.get("lat")
    geom = WKTElement(f"POINT({lng} {lat})", srid=4326) if lng is not None and lat is not None else None

    return ShelterModel(
        id=item["id"],
        name=item["name"],
        road_address=item.get("roadAddress"),
        lot_address=item.get("lotAddress"),
        type=item.get("type"),
        area=item.get("area"),
        capacity=item.get("capacity"),
        operation_start_date=item.get("operationStartDate"),
        operation_end_date=item.get("operationEndDate"),
        fan_count=item.get("fanCount"),
        air_conditioner_count=item.get("airConditionerCount"),
        night_open=bool(item.get("nightOpen")),
        holiday_open=bool(item.get("holidayOpen")),
        stay_available=bool(item.get("stayAvailable")),
        managing_agency=item.get("managingAgency"),
        phone=item.get("phone"),
        lat=lat,
        lng=lng,
        geom=geom,
        data_base_date=item.get("dataBaseDate"),
        capacity_score=item.get("capacityScore"),
        area_score=item.get("areaScore"),
        cooling_score=item.get("coolingScore"),
        night_open_score=item.get("nightOpenScore"),
        holiday_open_score=item.get("holidayOpenScore"),
        recommendation_score=item.get("recommendationScore"),
        grade=item.get("grade"),
    )


def to_climate_scenario_model(item: dict[str, Any], index: int) -> ClimateScenarioModel:
    return ClimateScenarioModel(
        id=f"scenario-{index:03d}",
        name=item["name"],
        temperature=item["temperature"],
        humidity=item["humidity"],
        pm10=item["pm10"],
        pm25=item["pm25"],
        ozone=item["ozone"],
        visibility_km=item["visibilityKm"],
    )


def to_user_type_weight_model(item: dict[str, Any]) -> UserTypeWeightModel:
    return UserTypeWeightModel(
        id=item["userType"],
        user_type_code=item["userType"],
        user_type_label=item["userTypeLabel"],
        climate_safety_weight=item["climateSafetyWeight"],
        shelter_access_weight=item["shelterAccessWeight"],
        night_safety_weight=item["nightSafetyWeight"],
        exposure_time_weight=item["exposureTimeWeight"],
    )


def to_route_recommendation_model(item: dict[str, Any]) -> RouteRecommendationModel:
    return RouteRecommendationModel(
        id=item["id"],
        scenario=item["scenario"],
        user_type_code=item["userType"],
        user_type_label=item["userTypeLabel"],
        route_id=item["routeId"],
        route_name=item["routeName"],
        distance_km=item["distanceKm"],
        shelter_within_500m_count=item["shelterWithin500mCount"],
        climate_risk_score=item["climateRiskScore"],
        climate_safety_score=item["climateSafetyScore"],
        shelter_access_score=item["shelterAccessScore"],
        night_safety_score=item["nightSafetyScore"],
        exposure_score=item["exposureScore"],
        final_safety_score=item["finalSafetyScore"],
    )


if __name__ == "__main__":
    main()
