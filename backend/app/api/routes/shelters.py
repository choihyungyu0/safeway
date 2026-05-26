from fastapi import APIRouter, HTTPException, Query

from app.schemas.shelter import Shelter
from app.services.shelter_service import get_shelter, list_nearby_shelters, list_shelters

router = APIRouter()


@router.get("", response_model=list[Shelter])
def read_shelters() -> list[Shelter]:
    return list_shelters()


@router.get("/nearby", response_model=list[Shelter])
def read_nearby_shelters(
    lat: float | None = None,
    lng: float | None = None,
    limit: int = Query(default=10, ge=1, le=50),
) -> list[Shelter]:
    # lat/lng are accepted now so the frontend contract is ready for PostGIS proximity queries.
    _ = (lat, lng)
    return list_nearby_shelters(limit)


@router.get("/{shelter_id}", response_model=Shelter)
def read_shelter(shelter_id: str) -> Shelter:
    shelter = get_shelter(shelter_id)
    if shelter is None:
        raise HTTPException(status_code=404, detail="Shelter not found")

    return shelter
