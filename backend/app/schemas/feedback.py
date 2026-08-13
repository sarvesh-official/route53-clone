"""Pydantic schemas for feedback endpoints."""

from datetime import datetime

from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    email: str | None = Field(default=None, max_length=255)
    role: str | None = Field(default=None, max_length=120)
    rating: int | None = Field(default=None, ge=1, le=5)
    message: str = Field(min_length=1, max_length=5000)


class FeedbackOut(BaseModel):
    id: int
    name: str | None
    email: str | None
    role: str | None
    rating: int | None
    message: str
    created_at: datetime

    model_config = {"from_attributes": True}
