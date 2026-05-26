from app.schemas.admin import AdminMetric, AdminPayload, AdminSettings, DataStatus


DEFAULT_SETTINGS = AdminSettings(
    scoring_weights={"heat": 30, "dust": 25, "fog": 15, "shelter": 20, "walking": 10},
    notification_settings={"risk": True, "data": True, "shelter": True},
)


def get_dashboard() -> AdminPayload:
    return AdminPayload(
        title="관리자 대시보드",
        generated_from="backend deterministic mock",
        metrics=[
            AdminMetric(id="shelters", label="총 쉼터", value="500개", delta="SafeWay fixture"),
            AdminMetric(id="recommendations", label="추천 로그", value="54건", delta="fixture"),
        ],
    )


def get_data_statuses() -> list[DataStatus]:
    return [
        DataStatus(
            id="safeway-processed-data",
            name="SafeWay 처리 분석 데이터",
            provider="세종 세이프웨이 로컬 분석",
            status="NORMAL",
            note="쉼터 500개 · 추천 54건 · 시나리오 3개",
            last_collected_at="2025.06.21 14:00",
        )
    ]


def get_admin_payload(title: str) -> AdminPayload:
    return AdminPayload(
        title=title,
        generated_from="backend deterministic mock",
        metrics=[
            AdminMetric(id="shelters", label="SafeWay 쉼터", value="500개"),
            AdminMetric(id="routes", label="추천 결과", value="54건"),
        ],
        rows=[{"source": "generated fixtures", "status": "fallback-compatible"}],
    )


def get_settings() -> AdminSettings:
    return DEFAULT_SETTINGS


def update_settings(settings: AdminSettings) -> AdminSettings:
    return settings
