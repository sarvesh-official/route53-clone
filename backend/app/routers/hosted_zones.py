"""Hosted-zone endpoints.

  GET    /api/hosted-zones             paginated list with search, filter, sort
  POST   /api/hosted-zones             create a zone (auto-creates NS + SOA)
  GET    /api/hosted-zones/{zone_id}   zone detail
  PATCH  /api/hosted-zones/{zone_id}   update zone comment
  DELETE /api/hosted-zones/{zone_id}   delete a zone and its records
"""
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneRead, HostedZoneUpdate, ZoneType
from app.schemas.pagination import Page
from app.services.hosted_zone_service import HostedZoneService

router = APIRouter()

_SORT_ALLOW = {"name", "type", "created_at", "record_count"}


def _resolve_sort(raw: str | None) -> tuple[str, str]:
    if not raw:
        return "created_at", "desc"
    if ":" in raw:
        field, direction = raw.split(":", 1)
    else:
        field, direction = raw, "asc"
    direction = direction.lower()
    if direction not in {"asc", "desc"}:
        direction = "asc"
    field = field.strip()
    if field not in _SORT_ALLOW:
        return "created_at", "desc"
    return field, direction


@router.get(
    "",
    response_model=Page[HostedZoneRead],
    summary="List hosted zones",
)
def list_zones(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 25,
    search: str | None = None,
    type: ZoneType | None = None,
    sort: str | None = None,
) -> Page[HostedZoneRead]:
    field, direction = _resolve_sort(sort)
    service = HostedZoneService(db)
    items, total = service.list_zones(
        user_id=user.id,
        page=page,
        page_size=page_size,
        search=search,
        zone_type=type,
        sort_field=field,
        sort_dir=direction,
    )
    return Page[HostedZoneRead](
        items=[HostedZoneRead.model_validate(z) for z in items],
        page=page,
        page_size=page_size,
        total=total,
    )


@router.post(
    "",
    response_model=HostedZoneRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a hosted zone",
)
def create_zone(
    payload: HostedZoneCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HostedZoneRead:
    service = HostedZoneService(db)
    zone = service.create_zone(
        user_id=user.id,
        name=payload.name,
        zone_type=payload.type,
        comment=payload.comment,
    )
    return HostedZoneRead.model_validate(zone)


@router.get(
    "/{zone_id}",
    response_model=HostedZoneRead,
    summary="Get a hosted zone",
)
def get_zone(
    zone_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HostedZoneRead:
    service = HostedZoneService(db)
    zone = service.get_zone(user_id=user.id, zone_id=zone_id)
    return HostedZoneRead.model_validate(zone)


@router.patch(
    "/{zone_id}",
    response_model=HostedZoneRead,
    summary="Update a hosted zone",
)
def update_zone(
    zone_id: str,
    payload: HostedZoneUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HostedZoneRead:
    service = HostedZoneService(db)
    zone = service.update_zone(
        user_id=user.id, zone_id=zone_id, comment=payload.comment
    )
    return HostedZoneRead.model_validate(zone)


@router.delete(
    "/{zone_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a hosted zone",
)
def delete_zone(
    zone_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    service = HostedZoneService(db)
    service.delete_zone(user_id=user.id, zone_id=zone_id)
