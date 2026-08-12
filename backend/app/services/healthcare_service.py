"""Nearby healthcare search using OpenStreetMap."""

import math

import httpx


OVERPASS_URLS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
]


def calculate_distance(
    latitude1: float,
    longitude1: float,
    latitude2: float,
    longitude2: float,
) -> float:
    """Calculate distance between two coordinates in km."""

    earth_radius_km = 6371.0

    lat1 = math.radians(latitude1)
    lat2 = math.radians(latitude2)

    delta_lat = math.radians(
        latitude2 - latitude1
    )

    delta_lon = math.radians(
        longitude2 - longitude1
    )

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(delta_lon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a),
    )

    return earth_radius_km * c


def _build_query(
    latitude: float,
    longitude: float,
    radius: int,
) -> str:
    """Build a small Overpass healthcare query."""

    return f"""
    [out:json][timeout:10];

    (
      nwr["amenity"="hospital"]
        (around:{radius},{latitude},{longitude});

      nwr["amenity"="clinic"]
        (around:{radius},{latitude},{longitude});

      nwr["amenity"="doctors"]
        (around:{radius},{latitude},{longitude});
    );

    out center tags;
    """


def _parse_results(
    data: dict,
    latitude: float,
    longitude: float,
) -> list[dict]:
    """Convert Overpass results into application data."""

    results = []

    for element in data.get(
        "elements",
        [],
    ):

        tags = element.get(
            "tags",
            {},
        )

        if "lat" in element:

            result_lat = element["lat"]
            result_lon = element["lon"]

        elif "center" in element:

            result_lat = element[
                "center"
            ]["lat"]

            result_lon = element[
                "center"
            ]["lon"]

        else:
            continue

        distance = calculate_distance(
            latitude,
            longitude,
            result_lat,
            result_lon,
        )

        results.append(
            {
                "name": tags.get(
                    "name",
                    "Unnamed healthcare facility",
                ),
                "type": tags.get(
                    "amenity",
                    "healthcare",
                ),
                "latitude": result_lat,
                "longitude": result_lon,
                "distance_km": round(
                    distance,
                    2,
                ),
                "address": (
                    tags.get("addr:full")
                    or tags.get("addr:street")
                ),
                "phone": tags.get(
                    "phone"
                ),
                "website": tags.get(
                    "website"
                ),
            }
        )

    results.sort(
        key=lambda item: item[
            "distance_km"
        ]
    )

    return results[:20]


def find_nearby_healthcare(
    latitude: float,
    longitude: float,
    radius: int = 3000,
) -> list[dict]:
    """Find nearby healthcare facilities.

    Uses multiple public Overpass instances so that
    temporary server overload does not immediately
    break healthcare search.
    """

    query = _build_query(
        latitude,
        longitude,
        radius,
    )

    last_error = None

    for url in OVERPASS_URLS:

        try:

            response = httpx.post(
                url,
                data=query,
                headers={
                    "User-Agent": (
                        "HealthGPT-AI/1.0 "
                        "(healthcare project)"
                    )
                },
                timeout=15.0,
            )

            response.raise_for_status()

            data = response.json()

            return _parse_results(
                data,
                latitude,
                longitude,
            )

        except (
            httpx.HTTPError,
            ValueError,
        ) as exc:

            last_error = exc

            print(
                f"Overpass request failed "
                f"for {url}: {exc}"
            )

            continue

    raise RuntimeError(
        "Nearby healthcare search is "
        "temporarily unavailable."
    ) from last_error