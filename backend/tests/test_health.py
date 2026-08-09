"""Tests for the health check endpoint."""

from fastapi.testclient import TestClient


def test_health_check_returns_200(client: TestClient) -> None:
    """GET /api/v1/health returns HTTP 200."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_check_response_body(client: TestClient) -> None:
    """GET /api/v1/health returns the expected JSON body."""
    response = client.get("/api/v1/health")
    assert response.json() == {
        "status": "healthy",
        "service": "healthgpt-api",
    }