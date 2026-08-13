"""Generic repository base.

Concrete repositories subclass this and add domain-specific query methods.
"""
from typing import Any, Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    model: type[ModelT]

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, id: str) -> ModelT | None:
        return self.db.execute(
            select(self.model).where(self.model.id == id)  # type: ignore[attr-defined]
        ).scalar_one_or_none()

    def create(self, **kwargs: Any) -> ModelT:
        instance = self.model(**kwargs)
        self.db.add(instance)
        self.db.flush()
        return instance

    def delete(self, instance: ModelT) -> None:
        self.db.delete(instance)
        self.db.flush()
