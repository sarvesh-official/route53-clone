"""FastAPI application entry point.

Run locally:
    cd backend/
    uv run uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI

app = FastAPI(
    title="Route 53 Clone API",
    description="Mocked AWS Route 53 console backend.",
    version="0.1.0",
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    """Liveness probe used by the frontend and deployment platform."""
    return {"status": "ok"}
