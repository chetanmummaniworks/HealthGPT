"""Authentication Pydantic schemas."""

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Request schema for user login."""

    email: EmailStr
    password: str
class GoogleLoginRequest(BaseModel):
    """Request containing a Google Identity Services ID token."""

    credential: str

class TokenResponse(BaseModel):
    """Response schema containing a JWT access token."""

    access_token: str
    token_type: str = "bearer"