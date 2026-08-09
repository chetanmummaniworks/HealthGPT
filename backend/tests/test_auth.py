"""Tests for the authentication endpoints."""

from fastapi.testclient import TestClient

REGISTER_URL = "/api/v1/auth/register"
LOGIN_URL = "/api/v1/auth/login"
ME_URL = "/api/v1/auth/me"

VALID_USER = {
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123",
}


def register_user(client: TestClient, data: dict | None = None) -> dict:
    """Helper to register a user and return the response JSON."""
    payload = data or VALID_USER
    response = client.post(REGISTER_URL, json=payload)
    return response


def login_user(client: TestClient, email: str, password: str) -> dict:
    """Helper to login and return the response JSON."""
    response = client.post(LOGIN_URL, json={"email": email, "password": password})
    return response


# --- Registration ---


def test_register_success(client: TestClient) -> None:
    """POST /auth/register creates a user and returns safe info."""
    response = register_user(client)
    assert response.status_code == 201
    body = response.json()
    assert body["full_name"] == "Test User"
    assert body["email"] == "test@example.com"
    assert body["is_active"] is True
    assert "id" in body
    assert "created_at" in body
    # Never expose password or password_hash
    assert "password" not in body
    assert "password_hash" not in body


def test_register_duplicate_email(client: TestClient) -> None:
    """POST /auth/register with an existing email returns 409."""
    register_user(client)
    response = register_user(client)
    assert response.status_code == 409


def test_register_invalid_data(client: TestClient) -> None:
    """POST /auth/register with invalid data returns 422."""
    # Invalid email
    response = client.post(
        REGISTER_URL,
        json={"full_name": "Test", "email": "not-an-email", "password": "TestPassword123"},
    )
    assert response.status_code == 422

    # Missing fields
    response = client.post(REGISTER_URL, json={"full_name": "Test"})
    assert response.status_code == 422


def test_register_normalizes_email(client: TestClient) -> None:
    """POST /auth/register normalizes email to lowercase."""
    response = register_user(client, {**VALID_USER, "email": "Test@Example.COM"})
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"


# --- Login ---


def test_login_success(client: TestClient) -> None:
    """POST /auth/login returns a JWT access token."""
    register_user(client)
    response = login_user(client, VALID_USER["email"], VALID_USER["password"])
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient) -> None:
    """POST /auth/login with wrong password returns 401."""
    register_user(client)
    response = login_user(client, VALID_USER["email"], "WrongPassword123")
    assert response.status_code == 401


def test_login_unknown_email(client: TestClient) -> None:
    """POST /auth/login with unknown email returns 401."""
    response = login_user(client, "nobody@example.com", "TestPassword123")
    assert response.status_code == 401


# --- Protected endpoint ---


def test_me_without_token(client: TestClient) -> None:
    """GET /auth/me without a token returns 401."""
    response = client.get(ME_URL)
    assert response.status_code == 401


def test_me_with_valid_token(client: TestClient) -> None:
    """GET /auth/me with a valid token returns the user."""
    register_user(client)
    login_response = login_user(client, VALID_USER["email"], VALID_USER["password"])
    token = login_response.json()["access_token"]

    response = client.get(ME_URL, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "test@example.com"
    assert body["full_name"] == "Test User"
    assert "password" not in body
    assert "password_hash" not in body


def test_me_with_invalid_token(client: TestClient) -> None:
    """GET /auth/me with an invalid token returns 401."""
    response = client.get(ME_URL, headers={"Authorization": "Bearer invalid-token"})
    assert response.status_code == 401


def test_me_with_expired_token(client: TestClient) -> None:
    """GET /auth/me with an expired token returns 401."""
    import jwt as pyjwt
    from app.config.settings import get_settings

    settings = get_settings()
    # Create a token that expired 1 hour ago
    from datetime import datetime, timedelta, timezone

    expired_payload = {
        "sub": "1",
        "exp": datetime.now(timezone.utc) - timedelta(hours=1),
    }
    expired_token = pyjwt.encode(expired_payload, settings.secret_key, algorithm=settings.algorithm)

    response = client.get(ME_URL, headers={"Authorization": f"Bearer {expired_token}"})
    assert response.status_code == 401