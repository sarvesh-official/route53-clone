"""Bulk operation endpoints.

  POST /api/records/bulk-delete   bulk delete records by id
  POST /api/hosted-zones/bulk-delete  bulk delete zones by id
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.bulk import BulkDeleteRecords, BulkDeleteZones, BulkResult
from app.services.bulk_service import BulkService

records_router = APIRouter()
zones_router = APIRouter()


@records_router.post(
    "/bulk-delete",
    response_model=BulkResult,
    status_code=status.HTTP_200_OK,
    summary="Bulk delete records",
)
def bulk_delete_records(
    payload: BulkDeleteRecords,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BulkResult:
    service = BulkService(db)
    deleted, skipped = service.delete_records(
        user_id=user.id, record_ids=payload.record_ids
    )
    return BulkResult(deleted=deleted, skipped=skipped)


@zones_router.post(
    "/bulk-delete",
    response_model=BulkResult,
    status_code=status.HTTP_200_OK,
    summary="Bulk delete hosted zones",
)
def bulk_delete_zones(
    payload: BulkDeleteZones,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BulkResult:
    service = BulkService(db)
    deleted, skipped = service.delete_zones(
        user_id=user.id, zone_ids=payload.zone_ids
    )
    return BulkResult(deleted=deleted, skipped=skipped)
