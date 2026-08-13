"""Repository for feedback submissions."""

from sqlalchemy.orm import Session

from app.models.feedback import Feedback
from app.repositories.base import BaseRepository


class FeedbackRepository(BaseRepository[Feedback]):
    model = Feedback

    def __init__(self, db: Session) -> None:
        super().__init__(db)
