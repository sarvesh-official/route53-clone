"""Feedback router — public endpoint for recruiters/reviewers."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.feedback import Feedback
from app.repositories.feedback_repository import FeedbackRepository
from app.schemas.feedback import FeedbackCreate, FeedbackOut

router = APIRouter()


@router.post("", response_model=FeedbackOut, status_code=201)
def submit_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
) -> Feedback:
    repo = FeedbackRepository(db)
    feedback = repo.create(**payload.model_dump())
    db.commit()
    db.refresh(feedback)
    return feedback
