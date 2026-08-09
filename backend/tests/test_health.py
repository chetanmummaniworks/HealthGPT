"""Tests for the health check endpoint."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check_returns_200() -> None:
    """GET /api/v1/health returns HTTP 200."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_check_response_body() -> None:
    """GET /api/v1/health returns the expected JSON body."""
    response = client.get("/api/v1/health")
    assert response.json() == {
        "status": "healthy",
        "service": "healthgpt-api",
    }