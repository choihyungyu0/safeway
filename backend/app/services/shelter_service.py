from app.schemas.shelter import LatLng, Shelter


SHELTERS = [
    Shelter(
        id="safeway-shelter-001",
        name="도담 방축천변 교량하부",
        road_address="세종특별자치시 양지길 16",
        lot_address="세종특별자치시 도담동 900",
        type="기타",
        capacity=23,
        operation_time="09:00 ~ 18:00",
        night_open=True,
        holiday_open=True,
        recommendation_score=61.5,
        grade="B",
        location=LatLng(lat=36.50710104, lng=127.2717122),
        facilities=["화장실", "좌석", "야간개방", "휴일개방"],
        managing_agency="세종특별자치시 도담동",
        phone="044-301-6219",
    ),
    Shelter(
        id="safeway-shelter-126",
        name="한솔동복합커뮤니티센터 정음관",
        road_address="세종특별자치시 노을3로 85",
        lot_address="세종특별자치시 한솔동 961",
        type="공공시설",
        capacity=120,
        operation_time="09:00 ~ 18:00",
        night_open=True,
        holiday_open=True,
        recommendation_score=100,
        grade="A",
        location=LatLng(lat=36.479896, lng=127.253201),
        facilities=["화장실", "좌석", "냉방", "야간개방", "휴일개방"],
        managing_agency="세종특별자치시 한솔동",
        phone="044-301-6114",
    ),
    Shelter(
        id="shelter-001",
        name="나성동 복합커뮤니티센터 쉼터",
        road_address="세종특별자치시 나성로 33",
        lot_address="세종특별자치시 나성동",
        type="공공시설",
        capacity=120,
        operation_time="09:00 ~ 18:00",
        night_open=True,
        holiday_open=True,
        recommendation_score=92,
        grade="A",
        location=LatLng(lat=36.4879, lng=127.2576),
        facilities=["화장실", "좌석", "냉방"],
        managing_agency="세종특별자치시",
        phone="044-120",
    ),
]


def list_shelters() -> list[Shelter]:
    return SHELTERS


def get_shelter(shelter_id: str) -> Shelter | None:
    return next((shelter for shelter in SHELTERS if shelter.id == shelter_id), None)


def list_nearby_shelters(limit: int = 10) -> list[Shelter]:
    return sorted(SHELTERS, key=lambda shelter: shelter.recommendation_score, reverse=True)[:limit]
