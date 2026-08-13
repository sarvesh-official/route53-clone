"""BIND zone file import endpoint.

  POST /api/hosted-zones/{zone_id}/import  import records from a BIND zone file
"""
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.common import APIResponse
from app.services.hosted_zone_service import HostedZoneService
from app.services.zone_import_service import ZoneImportService

router = APIRouter()


@router.post(
    "/import",
    status_code=status.HTTP_200_OK,
    summary="Import records from a BIND zone file",
)
async def import_zone(
    zone_id: str,
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> APIResponse[dict]:
    zone_service = HostedZoneService(db)
    zone = zone_service.get_zone(user_id=user.id, zone_id=zone_id)

    content = (await request.body()).decode("utf-8")

    service = ZoneImportService(db)
    imported = service.import_bind(zone=zone, content=content)
    return APIResponse(data={
        "imported_count": len(imported),
        "record_ids": [r.id for r in imported],
    })
