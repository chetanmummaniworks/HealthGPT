"""Authentication business logic."""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.hashing import hash_password, verify_password
from app.auth.jwt import create_access_token
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.schemas.user import UserCreate


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

    user = User(
        full_name=data.full_name,
        email=email,
        password_hash=hash_password(data.password),
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