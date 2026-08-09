"""Health check endpoint for the API."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    """Return the health status of the API."""
    return {
        "status": "healthy",
        "service": "healthgpt-api",
    }