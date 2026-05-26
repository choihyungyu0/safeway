from __future__ import annotations

import logging
from typing import Any

from app.core.config import settings
from app.schemas.shelter import LatLng, Shelter

logger = logging.getLogger(__name__)


def list_shelters() -> list[Shelter] | None:
    if not settings.database_enabled:
        return None

    try:
        from sqlalchemy import select

        from app.db.models import ShelterModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            rows = session.scalars(
                select(ShelterModel).order_by(ShelterModel.recommendation_score.desc().nullslast())
            ).all()
            return [to_schema(row) for row in rows]
    except Exception as exc:
        logger.warning("Shelter DB query failed; using fixture fallback: %s", exc)
        return None


def get_shelter_by_id(shelter_id: str) -> Shelter | None:
    if not settings.database_enabled:
        return None

    try:
        from app.db.models import ShelterModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            row = session.get(ShelterModel, shelter_id)
            return to_schema(row) if row is not None else None
    except Exception as exc:
        logger.warning("Shelter detail DB query failed; using fixture fallback: %s", exc)
        return None


def list_nearby_shelters(
    lat: float | None = None,
    lng: float | None = None,
    radius_m: int = 500,
    limit: int = 10,
) -> list[Shelter] | None:
    if not settings.database_enabled:
        return None

    try:
        from geoalchemy2 import Geography
        from sqlalchemy import cast, func, select

        from app.db.models import ShelterModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            if lat is None or lng is None:
                rows = session.scalars(
                    select(ShelterModel)
                    .order_by(ShelterModel.recommendation_score.desc().nullslast())
                    .limit(limit)
                ).all()
                return [to_schema(row) for row in rows]

            point = func.ST_SetSRID(func.ST_MakePoint(lng, lat), 4326)
            shelter_geography = cast(ShelterModel.geom, Geography)
            point_geography = cast(point, Geography)
            distance = func.ST_Distance(shelter_geography, point_geography).label("distance_m")

            rows = session.execute(
                select(ShelterModel, distance)
                .where(ShelterModel.geom.is_not(None))
                .where(func.ST_DWithin(shelter_geography, point_geography, radius_m))
                .order_by(distance)
                .limit(limit)
            ).all()

            return [to_schema(row[0], distance_m=float(row[1])) for row in rows]
    except Exception as exc:
        logger.warning("Nearby shelter DB query failed; using fixture fallback: %s", exc)
        return None


def to_schema(row: Any, distance_m: float | None = None) -> Shelter:
    return Shelter(
        id=row.id,
        name=row.name,
        road_address=row.road_address or "",
        lot_address=row.lot_address or "",
        type=row.type or "기타",
        area=row.area,
        capacity=row.capacity or 0,
        operation_start_date=row.operation_start_date,
        operation_end_date=row.operation_end_date,
        operation_time="09:00 ~ 18:00",
        fan_count=row.fan_count,
        air_conditioner_count=row.air_conditioner_count,
        night_open=bool(row.night_open),
        holiday_open=bool(row.holiday_open),
        stay_available=bool(row.stay_available),
        recommendation_score=float(row.recommendation_score or 0),
        grade=row.grade or "C",
        location=LatLng(lat=float(row.lat or 0), lng=float(row.lng or 0)),
        facilities=derive_facilities(row),
        managing_agency=row.managing_agency or "",
        phone=row.phone or "",
        data_base_date=row.data_base_date,
        capacity_score=row.capacity_score,
        area_score=row.area_score,
        cooling_score=row.cooling_score,
        night_open_score=row.night_open_score,
        holiday_open_score=row.holiday_open_score,
        distance_m=round(distance_m, 1) if distance_m is not None else None,
    )


def derive_facilities(row: Any) -> list[str]:
    facilities = ["화장실"]
    if (row.air_conditioner_count or 0) > 0:
        facilities.append("냉방")
    if (row.fan_count or 0) > 0:
        facilities.append("선풍기")
    if row.night_open:
        facilities.append("야간개방")
    if row.holiday_open:
        facilities.append("휴일개방")

    return facilities
