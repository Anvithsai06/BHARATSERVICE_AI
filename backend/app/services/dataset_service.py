import json
import os
from typing import List
from app.models.schemas import ServiceModel

DATA_PATH = os.path.join(os.path.dirname(__file__), "../../data/services.json")


def load_services() -> List[ServiceModel]:
    """Load government services from JSON dataset."""
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return [ServiceModel(**item) for item in raw]


def get_all_services() -> List[ServiceModel]:
    return load_services()


def get_service_by_id(service_id: str) -> ServiceModel | None:
    services = load_services()
    for svc in services:
        if svc.id == service_id:
            return svc
    return None


def get_services_by_category(category: str) -> List[ServiceModel]:
    services = load_services()
    return [s for s in services if s.category.lower() == category.lower()]


def get_all_categories() -> List[str]:
    services = load_services()
    return sorted(list(set(s.category for s in services)))
