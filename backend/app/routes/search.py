from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import SearchRequest, SearchResponse
from app.search.engine import get_search_engine, SearchEngine
import logging

router = APIRouter(prefix="/search", tags=["search"])
logger = logging.getLogger(__name__)


@router.post("", response_model=SearchResponse)
async def search_services(
    request: SearchRequest,
    engine: SearchEngine = Depends(get_search_engine),
):
    """
    Perform semantic search on government services dataset.
    Returns the most relevant services for the given natural language query.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    if len(request.query) > 500:
        raise HTTPException(status_code=400, detail="Query too long (max 500 chars).")

    try:
        results = engine.search(request.query.strip(), top_k=request.top_k or 6)
        return SearchResponse(
            query=request.query,
            results=results,
            total=len(results),
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed. Please try again.")
