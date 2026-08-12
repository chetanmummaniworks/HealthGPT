"""Location geocoding service using Nominatim."""

import httpx


NOMINATIM_URL = (
    "https://nominatim.openstreetmap.org/search"
)


def search_location(
    query: str,
) -> dict | None:
    """Convert a text location into coordinates."""

    query = query.strip()

    if not query:
        return None

    response = httpx.get(
        NOMINATIM_URL,
        params={
            "q": query,
            "format": "jsonv2",
            "limit": 1,
            "countrycodes": "in",
        },
        headers={
            "User-Agent": (
                "HealthGPT-AI/1.0 "
                "(healthcare project)"
            ),
        },
        timeout=10.0,
    )

    response.raise_for_status()

    results = response.json()

    if not results:
        return None

    result = results[0]

    return {
        "latitude": float(result["lat"]),
        "longitude": float(result["lon"]),
        "display_name": result.get(
            "display_name",
            query,
        ),
    }