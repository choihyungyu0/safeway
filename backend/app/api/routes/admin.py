from fastapi import APIRouter

from app.schemas.admin import AdminPayload, AdminSettings, DataStatus
from app.services.data_status_service import (
    get_admin_payload,
    get_dashboard,
    get_data_statuses,
    get_settings,
    update_settings,
)

router = APIRouter()


@router.get("/dashboard", response_model=AdminPayload)
def read_dashboard() -> AdminPayload:
    return get_dashboard()


@router.get("/climate-risk-map", response_model=AdminPayload)
def read_climate_risk_map() -> AdminPayload:
    return get_admin_payload("기후위험 지도")


@router.get("/shelter-gaps", response_model=AdminPayload)
def read_shelter_gaps() -> AdminPayload:
    return get_admin_payload("쉼터 사각지대 분석")


@router.get("/temporary-shelters", response_model=AdminPayload)
def read_temporary_shelters() -> AdminPayload:
    return get_admin_payload("임시쉼터 후보 관리")


@router.get("/recommendation-logs", response_model=AdminPayload)
def read_recommendation_logs() -> AdminPayload:
    return get_admin_payload("추천 로그 관리")


@router.get("/feedback", response_model=AdminPayload)
def read_feedback() -> AdminPayload:
    return get_admin_payload("피드백 분석")


@router.get("/data-status", response_model=list[DataStatus])
def read_data_status() -> list[DataStatus]:
    return get_data_statuses()


@router.get("/reports", response_model=AdminPayload)
def read_reports() -> AdminPayload:
    return get_admin_payload("분석 리포트")


@router.get("/settings", response_model=AdminSettings)
def read_settings() -> AdminSettings:
    return get_settings()


@router.put("/settings", response_model=AdminSettings)
def save_settings(settings: AdminSettings) -> AdminSettings:
    return update_settings(settings)
