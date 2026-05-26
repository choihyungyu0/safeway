from app.repositories import climate_repository
from app.schemas.climate import ClimateScenario, CurrentClimate
from app.services.fixture_data import fixture_climate_scenarios, fixture_current_climate


def get_current_climate() -> CurrentClimate:
    scenarios = climate_repository.list_climate_scenarios()
    if scenarios:
        scenario = scenarios[0]
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

    return fixture_current_climate()


def list_climate_scenarios() -> list[ClimateScenario]:
    return climate_repository.list_climate_scenarios() or fixture_climate_scenarios()
