"""JWT creation and decoding utilities."""

from datetime import datetime, timedelta, timezone

import jwt

from app.config.settings import get_settings

settings = get_settings()


def create_access_token(user_id: int) -> str:
    """Create a JWT access token for the given user ID."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {
        "sub": str(user_id),
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> int:
    """Decode a JWT and return the user ID.

    Raises jwt.PyJWTError on invalid or expired tokens.
    """
    payload = jwt.decode(
        token,
        settings.secret_key,
        algorithms=[settings.algorithm],
    )
    return int(payload["sub"])