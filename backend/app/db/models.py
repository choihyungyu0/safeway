from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Float, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

try:
    from geoalchemy2 import Geometry
except ImportError:  # pragma: no cover - GeoAlchemy2 is a runtime dependency
    Geometry = None  # type: ignore[assignment]


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class ShelterModel(TimestampMixin, Base):
    __tablename__ = "shelters"

    id: Mapped[str] = mapped_column(String(80), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    road_address: Mapped[str | None] = mapped_column(String(500))
    lot_address: Mapped[str | None] = mapped_column(String(500))
    type: Mapped[str | None] = mapped_column(String(100))
    area: Mapped[float | None] = mapped_column(Float)
    capacity: Mapped[int | None] = mapped_column(Integer)
    operation_start_date: Mapped[str | None] = mapped_column(String(20))
    operation_end_date: Mapped[str | None] = mapped_column(String(20))
    fan_count: Mapped[int | None] = mapped_column(Integer)
    air_conditioner_count: Mapped[int | None] = mapped_column(Integer)
    night_open: Mapped[bool] = mapped_column(default=False, nullable=False)
    holiday_open: Mapped[bool] = mapped_column(default=False, nullable=False)
    stay_available: Mapped[bool] = mapped_column(default=False, nullable=False)
    managing_agency: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(100))
    lat: Mapped[float | None] = mapped_column(Float)
    lng: Mapped[float | None] = mapped_column(Float)
    if Geometry is not None:
        geom: Mapped[Any | None] = mapped_column(Geometry("POINT", srid=4326, spatial_index=True))
    else:
        geom: Mapped[str | None] = mapped_column(Text)
    data_base_date: Mapped[str | None] = mapped_column(String(20))
    capacity_score: Mapped[float | None] = mapped_column(Float)
    area_score: Mapped[float | None] = mapped_column(Float)
    cooling_score: Mapped[float | None] = mapped_column(Float)
    night_open_score: Mapped[float | None] = mapped_column(Float)
    holiday_open_score: Mapped[float | None] = mapped_column(Float)
    recommendation_score: Mapped[float | None] = mapped_column(Float)
    grade: Mapped[str | None] = mapped_column(String(20))


class ClimateScenarioModel(TimestampMixin, Base):
    __tablename__ = "climate_scenarios"

    id: Mapped[str] = mapped_column(String(80), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    temperature: Mapped[float] = mapped_column(Float, nullable=False)
    humidity: Mapped[float] = mapped_column(Float, nullable=False)
    pm10: Mapped[float] = mapped_column(Float, nullable=False)
    pm25: Mapped[float] = mapped_column(Float, nullable=False)
    ozone: Mapped[float] = mapped_column(Float, nullable=False)
    visibility_km: Mapped[float] = mapped_column(Float, nullable=False)


class UserTypeWeightModel(TimestampMixin, Base):
    __tablename__ = "user_type_weights"

    id: Mapped[str] = mapped_column(String(80), primary_key=True, index=True)
    user_type_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    user_type_label: Mapped[str] = mapped_column(String(100), nullable=False)
    climate_safety_weight: Mapped[float] = mapped_column(Float, nullable=False)
    shelter_access_weight: Mapped[float] = mapped_column(Float, nullable=False)
    night_safety_weight: Mapped[float] = mapped_column(Float, nullable=False)
    exposure_time_weight: Mapped[float] = mapped_column(Float, nullable=False)


class RouteRecommendationModel(TimestampMixin, Base):
    __tablename__ = "route_recommendations"

    id: Mapped[str] = mapped_column(String(80), primary_key=True, index=True)
    scenario: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    user_type_code: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    user_type_label: Mapped[str] = mapped_column(String(100), nullable=False)
    route_id: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    route_name: Mapped[str] = mapped_column(String(255), nullable=False)
    distance_km: Mapped[float] = mapped_column(Float, nullable=False)
    shelter_within_500m_count: Mapped[int] = mapped_column(Integer, nullable=False)
    climate_risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    climate_safety_score: Mapped[float] = mapped_column(Float, nullable=False)
    shelter_access_score: Mapped[float] = mapped_column(Float, nullable=False)
    night_safety_score: Mapped[float] = mapped_column(Float, nullable=False)
    exposure_score: Mapped[float] = mapped_column(Float, nullable=False)
    final_safety_score: Mapped[float] = mapped_column(Float, nullable=False)


class DataCollectionRunModel(Base):
    __tablename__ = "data_collection_runs"

    id: Mapped[str] = mapped_column(String(80), primary_key=True, index=True)
    dataset_name: Mapped[str] = mapped_column(String(255), nullable=False)
    provider: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    collected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    row_count: Mapped[int | None] = mapped_column(Integer)
    message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )


class SystemSettingModel(Base):
    __tablename__ = "system_settings"

    key: Mapped[str] = mapped_column(String(120), primary_key=True)
    value_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
