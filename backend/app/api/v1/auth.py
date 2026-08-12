"""Authentication API endpoints."""

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User

from app.schemas.auth import (
    LoginRequest,
    GoogleLoginRequest,
    TokenResponse,
)

from app.schemas.user import (
    UserCreate,
    UserRead,
    UserPreferencesUpdate,
)

from app.services.auth_service import (
    authenticate_google_user,
    authenticate_user,
    register_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post(
    "/register",
    response_model=UserRead,
    status_code=201,
)
def register(
    data: UserCreate,
    db: Session = Depends(get_db),
) -> User:
    """Register a new user."""

    return register_user(
        db,
        data,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Authenticate a user and return a JWT access token."""

    access_token = authenticate_user(
        db,
        data,
    )

    return TokenResponse(
        access_token=access_token,
    )


@router.post(
    "/google",
    response_model=TokenResponse,
)
def google_login(
    data: GoogleLoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Authenticate a user with Google and return a JWT."""

    access_token = authenticate_google_user(
        db,
        data.credential,
    )

    return TokenResponse(
        access_token=access_token,
    )


@router.get(
    "/me",
    response_model=UserRead,
)
def read_me(
    current_user: User = Depends(
        get_current_user
    ),
) -> User:
    """Return the currently authenticated user."""

    return current_user


@router.patch(
    "/preferences",
    response_model=UserRead,
    status_code=status.HTTP_200_OK,
)
def update_preferences(
    request: UserPreferencesUpdate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
) -> User:
    """Update preferences for the current user."""

    allowed_languages = {
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

    if (
        request.preferred_language
        not in allowed_languages
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported language.",
        )

    current_user.preferred_language = (
        request.preferred_language
    )

    db.commit()

    db.refresh(
        current_user
    )

    return current_user