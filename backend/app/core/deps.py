"""FastAPI dependency providers.

All auth and database dependencies live here so routes stay thin.
"""
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import UnauthorizedException
from app.core.security import is_expired
from app.models.user import User
from app.models.user_session import UserSession
from app.repositories.session_repository import SessionRepository
from app.repositories.user_repository import UserRepository

# auto_error=False so we can return our own 401 instead of FastAPI's 403.
bearer_scheme = HTTPBearer(auto_error=False)


def _resolve_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> tuple[User, UserSession]:
    if credentials is None:
        raise UnauthorizedException(
            code="TOKEN_MISSING",
            detail="Authorization header is required",
        )

    token = credentials.credentials
    session = SessionRepository(db).get_by_token(token)
    if session is None:
        raise UnauthorizedException(
            code="TOKEN_INVALID",
            detail="Session not found, token may have been revoked via logout",
        )

    if is_expired(session.expires_at):
        # Auto-clean expired sessions rather than leaving stale rows.
        SessionRepository(db).delete(session)
        db.commit()
        raise UnauthorizedException(
            code="TOKEN_EXPIRED",
            detail="Session has expired, please log in again",
        )

    user = UserRepository(db).get_by_id(session.user_id)
    if user is None:
        raise UnauthorizedException(
            code="TOKEN_INVALID",
            detail="The user associated with this token no longer exists",
        )

    return user, session


def get_current_user(
    resolved: tuple[User, UserSession] = Depends(_resolve_token),
) -> User:
    return resolved[0]


def get_current_session(
    resolved: tuple[User, UserSession] = Depends(_resolve_token),
) -> UserSession:
    return resolved[1]
