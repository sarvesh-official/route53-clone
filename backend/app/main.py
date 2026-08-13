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
from app.routers.dns_records import router as dns_records_router
from app.routers.dns_records import zone_router as dns_zone_router
from app.routers.hosted_zones import router as hosted_zones_router


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
        details = [
            {
                "field": ".".join(str(p) for p in err.get("loc", []) if p != "body"),
                "message": err.get("msg", ""),
                "type": err.get("type", ""),
            }
            for err in exc.errors()
        ]
        return JSONResponse(
            status_code=422,
            content={"detail": details, "code": "VALIDATION_ERROR"},
        )

    application.include_router(auth_router, prefix="/api/auth")
    application.include_router(hosted_zones_router, prefix="/api/hosted-zones")
    application.include_router(dns_zone_router, prefix="/api/hosted-zones/{zone_id}/records")
    application.include_router(dns_records_router, prefix="/api/records")

    @application.get("/api/health", tags=["meta"])
    def health_check() -> dict:
        return {"status": "ok", "version": "1.0.0"}

    return application


app = create_app()
