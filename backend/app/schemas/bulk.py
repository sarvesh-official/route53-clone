"""Bulk operation schemas."""

from pydantic import BaseModel, Field


class BulkDeleteRecords(BaseModel):
    record_ids: list[str] = Field(min_length=1, max_length=500)


class BulkDeleteZones(BaseModel):
    zone_ids: list[str] = Field(min_length=1, max_length=100)


class BulkResult(BaseModel):
    deleted: int
    skipped: int
