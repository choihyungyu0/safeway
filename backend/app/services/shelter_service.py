from app.repositories import shelters_repository
from app.schemas.shelter import Shelter
from app.services.fixture_data import (
    fixture_nearby_shelters,
    fixture_shelter_by_id,
    fixture_shelters,
)


def list_shelters() -> list[Shelter]:
    return shelters_repository.list_shelters() or fixture_shelters()


def get_shelter(shelter_id: str) -> Shelter | None:
    db_shelter = shelters_repository.get_shelter_by_id(shelter_id)
    if db_shelter is not None:
        return db_shelter

    return fixture_shelter_by_id(shelter_id)


def list_nearby_shelters(
    lat: float | None = None,
    lng: float | None = None,
    radius_m: int = 500,
    limit: int = 10,
) -> list[Shelter]:
    return shelters_repository.list_nearby_shelters(lat, lng, radius_m, limit) or fixture_nearby_shelters(
        lat,
        lng,
        radius_m,
        limit,
    )
