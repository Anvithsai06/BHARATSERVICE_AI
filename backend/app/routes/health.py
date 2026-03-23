from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.ai.llm_service import check_lm_studio_connection
from app.services.dataset_service import load_services

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    ai_connected = await check_lm_studio_connection()
    services = load_services()
    return HealthResponse(
        status="ok",
        ai_connected=ai_connected,
        total_services=len(services),
    )
