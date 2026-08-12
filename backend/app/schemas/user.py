"""User Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    """Shared user fields."""

    full_name: str
    email: EmailStr

class UserCreate(UserBase):
    """Request schema for user registration."""

    password: str

    preferred_language: str = "English"

class UserRead(UserBase):
    """Response schema for a user.

    Never includes password or password_hash.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    created_at: datetime
    preferred_language: str
    
class UserPreferencesUpdate(BaseModel):
    """Schema for updating user preferences."""

    preferred_language: str