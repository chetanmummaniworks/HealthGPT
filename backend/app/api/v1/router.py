"""Central API v1 router.

All version 1 endpoint modules are aggregated here so the main
application only needs to include this single router.
"""

from fastapi import APIRouter

from app.api.v1 import (
    auth,
    chat,
    health,
    predictions,
    reports,
    symptoms,
    healthcare
)

api_router = APIRouter()

api_router.include_router(
    chat.router
)

api_router.include_router(
    health.router
)

api_router.include_router(
    auth.router
)

api_router.include_router(
    predictions.router
)

api_router.include_router(
    symptoms.router
)

api_router.include_router(
    reports.router
)
api_router.include_router(
    healthcare.router
)