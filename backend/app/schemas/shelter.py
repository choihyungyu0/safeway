from pydantic import BaseModel


class LatLng(BaseModel):
    lat: float
    lng: float


class Shelter(BaseModel):
    id: str
    name: str
    road_address: str
    lot_address: str
    type: str
    capacity: int
    operation_time: str
    night_open: bool
    holiday_open: bool
    recommendation_score: float
    grade: str
    location: LatLng
    facilities: list[str]
    managing_agency: str
    phone: str


class NearbyShelterQuery(BaseModel):
    lat: float | None = None
    lng: float | None = None
    limit: int = 10
