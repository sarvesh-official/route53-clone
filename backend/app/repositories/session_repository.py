from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user_session import UserSession
from app.repositories.base import BaseRepository


class SessionRepository(BaseRepository[UserSession]):
    model = UserSession

    def __init__(self, db: Session) -> None:
        super().__init__(db)

    def get_by_token(self, token: str) -> UserSession | None:
        return self.db.execute(
            select(UserSession).where(UserSession.token == token)
        ).scalar_one_or_none()

    def create_session(
        self,
        user_id: str,
        token: str,
        expires_at: datetime,
    ) -> UserSession:
        return self.create(
            user_id=user_id,
            token=token,
            expires_at=expires_at,
        )
