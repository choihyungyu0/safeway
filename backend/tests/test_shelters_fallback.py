from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.shelter_service import get_shelter, list_shelters


def test_list_shelters_uses_generated_fixture_fallback():
    shelters = list_shelters()

    assert len(shelters) >= 100
    assert shelters[0].id.startswith("safeway-shelter-")
    assert shelters[0].name


def test_generated_shelter_detail_fallback_keeps_stable_id():
    shelter = get_shelter("safeway-shelter-001")

    assert shelter is not None
    assert shelter.id == "safeway-shelter-001"
    assert shelter.location.lat
    assert shelter.location.lng


def test_demo_shelter_alias_still_resolves():
    shelter = get_shelter("shelter-001")

    assert shelter is not None
    assert shelter.id == "shelter-001"
