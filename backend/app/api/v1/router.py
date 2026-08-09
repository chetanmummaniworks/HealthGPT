"""Central API v1 router.

All version 1 endpoint modules are aggregated here so the main
application only needs to include this single router.
"""

from fastapi import APIRouter

from app.api.v1 import health

api_router = APIRouter()
api_router.include_router(health.router)
