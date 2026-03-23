import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.routes import chat, health, search, services
from app.search.engine import get_search_engine

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Path to the static folder (backend/static/)
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize search engine on startup."""
    logger.info("Starting AI Government Service Finder backend...")
    engine = get_search_engine()
    engine.initialize()
    logger.info("Backend ready.")
    yield
    logger.info("Shutting down backend.")


app = FastAPI(
    title="AI Government Service Finder API",
    description="Backend API for discovering and navigating Indian government services using AI.",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — allow the frontend Next.js dev server AND the backend itself (same-origin page)
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept"],
)


# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."},
    )


# Register API routers
app.include_router(health.router)
app.include_router(search.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(services.router, prefix="/api")

# Serve any other static assets (favicon, images, etc.) from backend/static/
if os.path.isdir(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# Root — serve landing.html directly so http://localhost:8000 opens the app
@app.get("/", response_class=FileResponse)
async def root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path, media_type="text/html")
    # Fallback JSON if file is missing
    return JSONResponse({
        "app": "AI Government Service Finder",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "note": "Landing page not found. Place index.html in backend/static/",
    })
