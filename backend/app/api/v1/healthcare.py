"""Healthcare discovery API endpoints."""

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from app.services.geocoding_service import (
    search_location,
)

from app.auth.dependencies import get_current_user
from app.services.healthcare_service import (
    find_nearby_healthcare,
)


router = APIRouter(
    prefix="/healthcare",
    tags=["Healthcare"],
)
@router.get(
    "/search-location",
    status_code=status.HTTP_200_OK,
)
def search_healthcare_location(
    query: str,
    current_user=Depends(
        get_current_user
    ),
):
    """Search a text location and return coordinates."""

    query = query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Location query cannot be empty.",
        )

    if len(query) > 200:
        raise HTTPException(
            status_code=400,
            detail="Location query is too long.",
        )

    try:

        result = search_location(query)

    except Exception as exc:

        print(
            f"Location search failed: {exc}"
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Location search is temporarily "
                "unavailable."
            ),
        ) from exc

    if result is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Location could not be found."
            ),
        )

    return result


@router.get(
    "/nearby",
    status_code=status.HTTP_200_OK,
)
def nearby_healthcare(
    latitude: float,
    longitude: float,
    radius: int = 3000,
    current_user=Depends(
        get_current_user
    ),
):
    """Find healthcare facilities near a location."""

    if not (
        -90 <= latitude <= 90
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid latitude.",
        )

    if not (
        -180 <= longitude <= 180
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid longitude.",
        )

    if not (
        500 <= radius <= 10000
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Radius must be between "
                "500 and 10000 meters."
            ),
        )

    try:

        results = find_nearby_healthcare(
            latitude=latitude,
            longitude=longitude,
            radius=radius,
        )

        return {
            "results": results,
            "count": len(results),
        }

    except Exception as exc:

        print(
            f"Healthcare search failed: {exc}"
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Nearby healthcare search is "
                "temporarily unavailable."
            ),
        ) from exc