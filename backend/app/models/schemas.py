from pydantic import BaseModel
from typing import Optional, List


class ServiceModel(BaseModel):
    id: str
    service_name: str
    category: str
    description: str
    url: str
    ministry: str
    documents: List[str]
    processing_time: str
    fee: str
    tags: List[str]
    relevance_score: Optional[float] = None


class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 6


class SearchResponse(BaseModel):
    query: str
    results: List[ServiceModel]
    total: int


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    service_context: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    model: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    ai_connected: bool
    total_services: int
