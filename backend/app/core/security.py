from datetime import UTC, datetime

import bcrypt

from app.core.ids import generate_session_token


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_session_token() -> str:
    return generate_session_token()


def is_expired(expires_at: datetime) -> bool:
    """Naive-aware safe comparison: assume naive timestamps are UTC."""
    now = datetime.now(UTC)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    return expires_at <= now
