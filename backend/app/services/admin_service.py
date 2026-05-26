from app.repositories import admin_repository
from app.schemas.admin import AdminMetric, AdminPayload, AdminSettings, DataStatus
from app.services.fixture_data import (
    fixture_admin_payload,
    fixture_dashboard,
    fixture_data_statuses,
    fixture_settings,
)


def get_dashboard() -> AdminPayload:
    counts = admin_repository.get_dashboard_counts()
    if counts is None:
        return fixture_dashboard()

    return AdminPayload(
        title="관리자 대시보드",
        generated_from="database",
        metrics=[
            AdminMetric(
                id="shelters",
                label="총 쉼터",
                value=f"{counts.get('shelters', 0)}개",
                delta="PostGIS",
            ),
            AdminMetric(
                id="recommendations",
                label="추천 로그",
                value=f"{counts.get('route_recommendations', 0)}건",
                delta="PostgreSQL",
            ),
        ],
    )


def get_data_statuses() -> list[DataStatus]:
    return admin_repository.list_data_statuses() or fixture_data_statuses()


def get_admin_payload(title: str) -> AdminPayload:
    return fixture_admin_payload(title)


def get_settings() -> AdminSettings:
    return admin_repository.get_settings() or fixture_settings()


def update_settings(settings: AdminSettings) -> AdminSettings:
    return admin_repository.update_settings(settings) or settings
