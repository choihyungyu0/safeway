from pydantic import BaseModel


class CurrentClimate(BaseModel):
    scenario: str
    temperature: float
    humidity: float
    pm10: float
    pm25: float
    ozone: float
    visibility_km: float
    observed_at: str
    heat_status: str
    dust_status: str
    fog_status: str


class ClimateScenario(BaseModel):
    name: str
    temperature: float
    humidity: float
    pm10: float
    pm25: float
    ozone: float
    visibility_km: float
