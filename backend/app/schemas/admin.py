from pydantic import BaseModel


class AdminMetric(BaseModel):
    id: str
    label: str
    value: str
    delta: str | None = None


class DataStatus(BaseModel):
    id: str
    name: str
    provider: str
    status: str
    note: str
    last_collected_at: str


class AdminSettings(BaseModel):
    scoring_weights: dict[str, int]
    notification_settings: dict[str, bool]
    user_type_weight_source: str = "SafeWay generated fixture"


class AdminPayload(BaseModel):
    title: str
    generated_from: str
    metrics: list[AdminMetric] = []
    rows: list[dict] = []
