from __future__ import annotations

import logging
from typing import Any

from app.core.config import settings
from app.schemas.climate import ClimateScenario

logger = logging.getLogger(__name__)


def list_climate_scenarios() -> list[ClimateScenario] | None:
    if not settings.database_enabled:
        return None

    try:
        from sqlalchemy import select

        from app.db.models import ClimateScenarioModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            rows = session.scalars(select(ClimateScenarioModel).order_by(ClimateScenarioModel.id)).all()
            return [to_schema(row) for row in rows]
    except Exception as exc:
        logger.warning("Climate scenario DB query failed; using fixture fallback: %s", exc)
        return None


def to_schema(row: Any) -> ClimateScenario:
    return ClimateScenario(
        name=row.name,
        temperature=float(row.temperature),
        humidity=float(row.humidity),
        pm10=float(row.pm10),
        pm25=float(row.pm25),
        ozone=float(row.ozone),
        visibility_km=float(row.visibility_km),
    )
