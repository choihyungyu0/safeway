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
    area: float | None = None
    capacity: int
    operation_start_date: str | None = None
    operation_end_date: str | None = None
    operation_time: str
    fan_count: int | None = None
    air_conditioner_count: int | None = None
    night_open: bool
    holiday_open: bool
    stay_available: bool | None = None
    recommendation_score: float
    grade: str
    location: LatLng
    facilities: list[str]
    managing_agency: str
    phone: str
    data_base_date: str | None = None
    capacity_score: float | None = None
    area_score: float | None = None
    cooling_score: float | None = None
    night_open_score: float | None = None
    holiday_open_score: float | None = None
    distance_m: float | None = None


class NearbyShelterQuery(BaseModel):
    lat: float | None = None
    lng: float | None = None
    radius_m: int = 500
    limit: int = 10
