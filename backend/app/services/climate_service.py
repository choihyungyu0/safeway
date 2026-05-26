from app.schemas.climate import ClimateScenario, CurrentClimate


CLIMATE_SCENARIOS = [
    ClimateScenario(
        name="일반 여름날",
        temperature=29,
        humidity=60,
        pm10=35,
        pm25=18,
        ozone=0.03,
        visibility_km=10,
    ),
    ClimateScenario(
        name="폭염주의보",
        temperature=34,
        humidity=68,
        pm10=48,
        pm25=24,
        ozone=0.06,
        visibility_km=8,
    ),
    ClimateScenario(
        name="미세먼지 나쁨",
        temperature=27,
        humidity=55,
        pm10=96,
        pm25=42,
        ozone=0.04,
        visibility_km=5,
    ),
]


def get_current_climate() -> CurrentClimate:
    scenario = CLIMATE_SCENARIOS[0]

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


def list_climate_scenarios() -> list[ClimateScenario]:
    return CLIMATE_SCENARIOS
