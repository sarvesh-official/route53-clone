"""DNS-record endpoints.

Two routers:
  zone_router  mounted at /api/hosted-zones/{zone_id}/records: list + create
  router       mounted at /api/records: get, update, delete by id

Splitting the prefixes keeps URL shapes Route 53-style: list scoped under the
zone, individual ops addressable directly.
"""
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.exceptions import NotFoundException
from app.models.user import User
from app.schemas.dns_record import (
    CreatableRecordType,
    DnsRecordCreate,
    DnsRecordRead,
    DnsRecordUpdate,
)
from app.schemas.pagination import Page
from app.services.dns_record_service import DnsRecordService
from app.services.hosted_zone_service import HostedZoneService

zone_router = APIRouter()
router = APIRouter()

_SORT_ALLOW = {"name", "type", "ttl", "created_at"}


def _resolve_sort(raw: str | None) -> tuple[str, str]:
    if not raw:
        return "name", "asc"
    if ":" in raw:
        field, direction = raw.split(":", 1)
    else:
        field, direction = raw, "asc"
    direction = direction.lower()
    if direction not in {"asc", "desc"}:
        direction = "asc"
    field = field.strip()
    if field not in _SORT_ALLOW:
        return "name", "asc"
    return field, direction


@zone_router.get(
    "",
    response_model=Page[DnsRecordRead],
    summary="List records in a hosted zone",
)
def list_records(
    zone_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 25,
    search: str | None = None,
    type: CreatableRecordType | None = None,
    sort: str | None = None,
) -> Page[DnsRecordRead]:
    zone_service = HostedZoneService(db)
    zone = zone_service.get_zone(user_id=user.id, zone_id=zone_id)

    field, direction = _resolve_sort(sort)
    service = DnsRecordService(db)
    items, total = service.list_records(
        zone=zone,
        page=page,
        page_size=page_size,
        search=search,
        record_type=type,
        sort_field=field,
        sort_dir=direction,
    )
    return Page[DnsRecordRead](
        items=[DnsRecordRead.model_validate(r) for r in items],
        page=page,
        page_size=page_size,
        total=total,
    )


@zone_router.post(
    "",
    response_model=DnsRecordRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a record in a hosted zone",
)
def create_record(
    zone_id: str,
    payload: DnsRecordCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DnsRecordRead:
    zone_service = HostedZoneService(db)
    zone = zone_service.get_zone(user_id=user.id, zone_id=zone_id)

    service = DnsRecordService(db)
    rec = service.create_record(
        zone=zone,
        name=payload.name,
        record_type=payload.type,
        ttl=payload.ttl,
        value=payload.value,
        routing_policy=payload.routing_policy,
    )
    return DnsRecordRead.model_validate(rec)


def _owned_record(db: Session, user_id: str, record_id: str):
    """Treat a record we don't own as 404 to avoid leaking existence."""
    service = DnsRecordService(db)
    rec = service.get_record(record_id=record_id)
    if rec.zone.created_by != user_id:
        raise NotFoundException(f"Record {record_id} not found")
    return rec


@router.get(
    "/{record_id}",
    response_model=DnsRecordRead,
    summary="Get a record",
)
def get_record(
    record_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DnsRecordRead:
    rec = _owned_record(db, user.id, record_id)
    return DnsRecordRead.model_validate(rec)


@router.patch(
    "/{record_id}",
    response_model=DnsRecordRead,
    summary="Update a record",
)
def update_record(
    record_id: str,
    payload: DnsRecordUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DnsRecordRead:
    _owned_record(db, user.id, record_id)
    service = DnsRecordService(db)
    rec = service.update_record(
        record_id=record_id, ttl=payload.ttl, value=payload.value
    )
    return DnsRecordRead.model_validate(rec)


@router.delete(
    "/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a record",
)
def delete_record(
    record_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    _owned_record(db, user.id, record_id)
    service = DnsRecordService(db)
    service.delete_record(record_id=record_id)
