"""
Convenience entry point for running the backend server directly.
Usage: python run.py
"""
import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("ENV", "development") == "development"

    print(f"""
╔══════════════════════════════════════════════╗
║   GovSaathi — AI Government Service Finder   ║
║   Backend API Server                         ║
╚══════════════════════════════════════════════╝

  → App:      http://{host}:{port}
  → API Docs: http://{host}:{port}/docs
  → Health:   http://{host}:{port}/health
  → Reload:   {reload}
""")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
    )
