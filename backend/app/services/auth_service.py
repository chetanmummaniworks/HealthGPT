"""Authentication business logic."""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.hashing import hash_password, verify_password
from app.auth.jwt import create_access_token
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.schemas.user import UserCreate

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from app.config.settings import get_settings

ALLOWED_LANGUAGES = {
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Bengali",
    "Marathi",
    "Kannada",
    "Malayalam",
    "Gujarati",
}
def register_user(db: Session, data: UserCreate) -> User:
    """Register a new user.

    Raises HTTP 409 if the email is already registered.
    """
    email = data.email.lower()
    existing = db.scalar(select(User).where(User.email == email))
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    if data.preferred_language not in ALLOWED_LANGUAGES:
     raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unsupported language.",
    )
    user = User(
    full_name=data.full_name,
    email=email,
    password_hash=hash_password(data.password),
    preferred_language=data.preferred_language,
)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, data: LoginRequest) -> str:
    """Authenticate a user and return a JWT access token.

    Raises HTTP 401 for invalid credentials.
    Raises HTTP 403 for inactive accounts.
    """
    email = data.email.lower()
    user = db.scalar(select(User).where(User.email == email))

    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    return create_access_token(user.id)
def authenticate_google_user(
    db: Session,
    credential: str,
) -> str:
    """Verify a Google ID token and return a HealthGPT JWT."""

    settings = get_settings()

    try:
        google_user = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.google_client_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential.",
        ) from exc

    # --------------------------------------------------------
    # Get verified Google identity
    # --------------------------------------------------------

    google_id = google_user.get("sub")
    email = google_user.get("email")
    full_name = google_user.get(
        "name",
        "Google User",
    )

    email_verified = google_user.get(
        "email_verified",
        False,
    )

    if not google_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account information is incomplete.",
        )

    if not email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google email address is not verified.",
        )

    email = email.lower()

    # --------------------------------------------------------
    # First: find user by Google ID
    # --------------------------------------------------------

    user = db.scalar(
        select(User).where(
            User.google_id == google_id
        )
    )

    # --------------------------------------------------------
    # If Google ID isn't linked, check email
    # --------------------------------------------------------

    if user is None:

        user = db.scalar(
            select(User).where(
                User.email == email
            )
        )

    # --------------------------------------------------------
    # Existing user
    # --------------------------------------------------------

    if user is not None:

        # Link Google account if this is an existing
        # email/password account.
        if user.google_id is None:

            user.google_id = google_id

            db.commit()
            db.refresh(user)

    # --------------------------------------------------------
    # New Google user
    # --------------------------------------------------------

    else:

        user = User(
            full_name=full_name,
            email=email,

            # Google users don't authenticate with
            # our password system.
            password_hash=hash_password(
                google_id
            ),

            google_id=google_id,

            preferred_language="English",
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    # --------------------------------------------------------
    # Account status
    # --------------------------------------------------------

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    # --------------------------------------------------------
    # Issue our normal HealthGPT JWT
    # --------------------------------------------------------

    return create_access_token(user.id)