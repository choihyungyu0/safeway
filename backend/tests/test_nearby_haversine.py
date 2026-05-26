from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.shelter_service import list_nearby_shelters


def test_nearby_shelters_fixture_fallback_uses_haversine_distance():
    shelters = list_nearby_shelters(lat=36.50710104, lng=127.2717122, radius_m=100, limit=5)

    assert shelters
    assert shelters[0].id == "safeway-shelter-001"
    assert shelters[0].distance_m is not None
    assert shelters[0].distance_m <= 1
