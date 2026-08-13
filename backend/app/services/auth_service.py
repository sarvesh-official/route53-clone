from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import UnauthorizedException
from app.core.security import create_session_token, verify_password
from app.models.user import User
from app.models.user_session import UserSession
from app.repositories.session_repository import SessionRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import AuthResponse, UserMe


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self._users = UserRepository(db)
        self._sessions = SessionRepository(db)

    def login(self, email: str, password: str) -> AuthResponse:
        """Verify credentials and issue a session token.

        Raises UnauthorizedException if the email is not registered or the
        password does not match. On success a new session row is inserted and
        the token is returned with the caller's profile.
        """
        user = self._users.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise UnauthorizedException(
                code="INVALID_CREDENTIALS",
                detail="Incorrect email or password",
            )

        token, session = self._create_session(user)
        self.db.commit()
        self.db.refresh(user)

        return AuthResponse(
            token=token,
            user=UserMe.model_validate(user),
        )

    def logout(self, session: UserSession) -> None:
        """Hard-delete the session row.

        After this call any token that matches this session will be rejected
        by the auth dependency, even if it has not expired.
        """
        self._sessions.delete(session)
        self.db.commit()

    def get_me(self, user: User) -> UserMe:
        return UserMe.model_validate(user)

    def _create_session(self, user: User) -> tuple[str, UserSession]:
        """Insert a session row with a random token and expiry."""
        expires_at = datetime.now(timezone.utc) + timedelta(
            seconds=settings.session_ttl_seconds
        )
        token = create_session_token()
        session = self._sessions.create_session(
            user_id=user.id,
            token=token,
            expires_at=expires_at,
        )
        return token, session
