"""Reusable pagination and sort schemas."""

from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: list[T]
    page: int
    page_size: int
    total: int

    @property
    def total_pages(self) -> int:
        if self.page_size == 0:
            return 0
        return (self.total + self.page_size - 1) // self.page_size
