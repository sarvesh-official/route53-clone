from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., examples=["demo@example.com"])
    password: str = Field(..., min_length=1, examples=["demo1234"])


class AuthResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: "UserMe"


class UserMe(BaseModel):
    id: str
    email: str
    display_name: str
    created_at: datetime

    model_config = {"from_attributes": True}


AuthResponse.model_rebuild()
