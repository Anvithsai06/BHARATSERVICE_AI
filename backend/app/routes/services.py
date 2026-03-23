from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import ServiceModel
from app.services.dataset_service import (
    get_all_services,
    get_service_by_id,
    get_services_by_category,
    get_all_categories,
)

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=List[ServiceModel])
async def list_all_services():
    """List all available government services."""
    return get_all_services()


@router.get("/categories", response_model=List[str])
async def list_categories():
    """Get all available service categories."""
    return get_all_categories()


@router.get("/category/{category}", response_model=List[ServiceModel])
async def get_by_category(category: str):
    """Get services by category."""
    results = get_services_by_category(category)
    if not results:
        raise HTTPException(status_code=404, detail=f"No services found for category: {category}")
    return results


@router.get("/{service_id}", response_model=ServiceModel)
async def get_service(service_id: str):
    """Get a specific service by ID."""
    svc = get_service_by_id(service_id)
    if not svc:
        raise HTTPException(status_code=404, detail=f"Service not found: {service_id}")
    return svc
