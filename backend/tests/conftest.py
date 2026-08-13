"""Shared test fixtures."""

import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.database import get_db
from app.main import app
from app.models.base import Base


@pytest.fixture()
def client() -> TestClient:
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"
    os.environ["DEMO_EMAIL"] = "demo@example.com"
    os.environ["DEMO_PASSWORD"] = "demo1234"

    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

    from app.core.security import hash_password
    from app.models.user import User

    with TestSession() as db:
        db.add(User(
            email="demo@example.com",
            password_hash=hash_password("demo1234"),
            display_name="Demo User",
        ))
        db.commit()

    def override_get_db() -> Session:
        session = TestSession()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db

    yield TestClient(app)

    app.dependency_overrides.clear()
    os.close(db_fd)
    os.unlink(db_path)
