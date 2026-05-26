from __future__ import annotations

import logging
from typing import Any

from app.core.config import settings
from app.schemas.admin import AdminSettings, DataStatus

logger = logging.getLogger(__name__)


def get_dashboard_counts() -> dict[str, int] | None:
    if not settings.database_enabled:
        return None

    try:
        from sqlalchemy import func, select

        from app.db.models import RouteRecommendationModel, ShelterModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            return {
                "shelters": int(session.scalar(select(func.count()).select_from(ShelterModel)) or 0),
                "route_recommendations": int(
                    session.scalar(select(func.count()).select_from(RouteRecommendationModel)) or 0
                ),
            }
    except Exception as exc:
        logger.warning("Admin dashboard DB query failed; using fixture fallback: %s", exc)
        return None


def list_data_statuses() -> list[DataStatus] | None:
    if not settings.database_enabled:
        return None

    try:
        from sqlalchemy import select

        from app.db.models import DataCollectionRunModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            rows = session.scalars(select(DataCollectionRunModel).order_by(DataCollectionRunModel.id)).all()
            return [to_data_status(row) for row in rows]
    except Exception as exc:
        logger.warning("Data status DB query failed; using fixture fallback: %s", exc)
        return None


def get_settings() -> AdminSettings | None:
    if not settings.database_enabled:
        return None

    try:
        from app.db.models import SystemSettingModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            row = session.get(SystemSettingModel, "admin_settings")
            if row is None:
                return None

            value = row.value_json
            return AdminSettings(
                scoring_weights=value.get("scoring_weights", {}),
                notification_settings=value.get("notification_settings", {}),
                user_type_weight_source=value.get("user_type_weight_source", "database"),
            )
    except Exception as exc:
        logger.warning("Admin settings DB query failed; using fixture fallback: %s", exc)
        return None


def update_settings(settings_payload: AdminSettings) -> AdminSettings | None:
    if not settings.database_enabled:
        return None

    try:
        from app.db.models import SystemSettingModel
        from app.db.session import session_scope

        with session_scope() as session:
            if session is None:
                return None

            session.merge(
                SystemSettingModel(
                    key="admin_settings",
                    value_json=settings_payload.model_dump(),
                )
            )
            return settings_payload
    except Exception as exc:
        logger.warning("Admin settings update failed; using fixture fallback: %s", exc)
        return None


def to_data_status(row: Any) -> DataStatus:
    collected_at = row.collected_at.strftime("%Y.%m.%d %H:%M") if row.collected_at else "-"

    return DataStatus(
        id=row.id,
        name=row.dataset_name,
        provider=row.provider,
        status=row.status,
        note=row.message or f"{row.row_count or 0} rows",
        last_collected_at=collected_at,
    )
