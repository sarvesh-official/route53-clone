"""Zone export endpoints.

  GET /api/hosted-zones/{zone_id}/export           export as JSON
  GET /api/hosted-zones/{zone_id}/export?format=bind  export as BIND zone file
"""
from fastapi import APIRouter, Depends, Query
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.common import APIResponse
from app.services.hosted_zone_service import HostedZoneService
from app.services.zone_export_service import ZoneExportService

router = APIRouter()


@router.get(
    "/export",
    summary="Export a hosted zone as JSON or BIND",
)
def export_zone(
    zone_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    format: str = Query(default="json", pattern="^(json|bind)$"),
):
    zone_service = HostedZoneService(db)
    zone = zone_service.get_zone(user_id=user.id, zone_id=zone_id)

    service = ZoneExportService(db)

    if format == "bind":
        content = service.export_bind(zone=zone)
        return PlainTextResponse(
            content=content,
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename={zone.name.rstrip('.')}.zone"},
        )

    data = service.export_json(zone=zone)
    return APIResponse(data=data)
