from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, climate, feedback, health, recommendations, shelters
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Backend scaffold for Sejong Safeway real-service integration.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix="/api")
    app.include_router(climate.router, prefix="/api/climate", tags=["climate"])
    app.include_router(shelters.router, prefix="/api/shelters", tags=["shelters"])
    app.include_router(recommendations.router, prefix="/api/routes", tags=["recommendations"])
    app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

    return app


app = create_app()
