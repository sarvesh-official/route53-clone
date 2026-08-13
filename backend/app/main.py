"""Application factory and ASGI entry point.

Run locally:
    cd backend/
    .venv/bin/uvicorn app.main:app --reload --port 8000
"""
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import AppException
from app.routers.auth import router as auth_router


def create_app() -> FastAPI:
    application = FastAPI(
        title="Route 53 Clone API",
        version="1.0.0",
        description="Backend for AWS Route 53 console clone.",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins.split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @application.exception_handler(AppException)
    async def app_exception_handler(
        request: Request, exc: AppException
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, "code": exc.code},
        )

    @application.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={"detail": exc.errors(), "code": "VALIDATION_ERROR"},
        )

    application.include_router(auth_router, prefix="/api/auth")

    @application.get("/api/health", tags=["meta"])
    def health_check() -> dict:
        return {"status": "ok", "version": "1.0.0"}

    return application


app = create_app()
