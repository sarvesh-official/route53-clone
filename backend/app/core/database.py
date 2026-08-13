"""SQLAlchemy engine and session factory.

SQLite is the required database for this assignment. We use SQLAlchemy 2.x
with the modern typed session pattern. The engine is created with
`check_same_thread=False` so FastAPI's thread pool can share the connection.
"""

from __future__ import annotations

from collections.abc import Generator
from typing import Any

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
    echo=False,
)

# SQLite has foreign keys disabled by default. Enable them on every connection
# so cascade deletes and ownership checks work correctly.
@event.listens_for(engine, "connect")
def _enable_sqlite_fk(dbapi_connection: Any, _connection_record: Any) -> None:
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
