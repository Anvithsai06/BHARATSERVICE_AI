from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.ai.llm_service import get_ai_response, diagnose_lm_studio
import logging

router = APIRouter(prefix="/chat", tags=["chat"])
logger = logging.getLogger(__name__)


@router.post("", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """Chat with the AI assistant powered by LM Studio."""
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    if len(request.message) > 2000:
        raise HTTPException(status_code=400, detail="Message too long (max 2000 chars).")
    try:
        response_text = await get_ai_response(
            message=request.message.strip(),
            history=request.history or [],
            service_context=request.service_context,
        )
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error("Chat route error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Chat service error. Please try again.")


@router.get("/diagnose")
async def diagnose():
    """
    Diagnostic endpoint — visit http://localhost:8000/api/chat/diagnose
    in your browser to see exactly why AI chat is or isn't working.
    """
    return await diagnose_lm_studio()
