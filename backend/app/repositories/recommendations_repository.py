from __future__ import annotations

import logging
from typing import Any

from app.core.config import settings
from app.schemas.recommendation import RouteRecommendation

logger = logging.getLogger(__name__)


def list_route_recommendations(user_type: str = "GENERAL", limit: int = 3) -> list[RouteRecommendation] | None:
    if not settings.database_enabled:
        return None

    try:
        from sqlalchemy import select

        from app.db.models import RouteRecommendationModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            stmt = (
                select(RouteRecommendationModel)
                .where(RouteRecommendationModel.user_type_code == user_type)
                .order_by(RouteRecommendationModel.final_safety_score.desc())
                .limit(limit)
            )
            rows = session.scalars(stmt).all()
            if not rows and user_type != "GENERAL":
                rows = session.scalars(
                    select(RouteRecommendationModel)
                    .where(RouteRecommendationModel.user_type_code == "GENERAL")
                    .order_by(RouteRecommendationModel.final_safety_score.desc())
                    .limit(limit)
                ).all()

            return [to_schema(row) for row in rows]
    except Exception as exc:
        logger.warning("Route recommendation DB query failed; using fixture fallback: %s", exc)
        return None


def count_route_recommendations() -> int | None:
    if not settings.database_enabled:
        return None

    try:
        from sqlalchemy import func, select

        from app.db.models import RouteRecommendationModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            return int(session.scalar(select(func.count()).select_from(RouteRecommendationModel)) or 0)
    except Exception as exc:
        logger.warning("Route recommendation count DB query failed; using fixture fallback: %s", exc)
        return None


def to_schema(row: Any) -> RouteRecommendation:
    return RouteRecommendation(
        id=row.id,
        scenario=row.scenario,
        user_type=row.user_type_code,
        route_id=row.route_id,
        route_name=row.route_name,
        distance_km=float(row.distance_km),
        shelter_within_500m_count=int(row.shelter_within_500m_count),
        climate_safety_score=float(row.climate_safety_score),
        shelter_access_score=float(row.shelter_access_score),
        night_safety_score=float(row.night_safety_score),
        exposure_score=float(row.exposure_score),
        final_safety_score=float(row.final_safety_score),
        reason=(
            f"{row.route_name} 경로는 최종 기후안전점수 "
            f"{float(row.final_safety_score):.1f}점으로 추천됩니다."
        ),
    )
