from fastapi import APIRouter

from app.schemas.climate import ClimateScenario, CurrentClimate
from app.services.climate_service import get_current_climate, list_climate_scenarios

router = APIRouter()


@router.get("/current", response_model=CurrentClimate)
def read_current_climate() -> CurrentClimate:
    return get_current_climate()


@router.get("/scenarios", response_model=list[ClimateScenario])
def read_climate_scenarios() -> list[ClimateScenario]:
    return list_climate_scenarios()
