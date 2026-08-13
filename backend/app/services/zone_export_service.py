"""JSON and BIND zone export service."""

from sqlalchemy.orm import Session

from app.models.dns_record import DnsRecord
from app.models.hosted_zone import HostedZone
from app.repositories.dns_record_repository import DnsRecordRepository
from app.services.zone_export import export_bind, export_json


class ZoneExportService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self._records = DnsRecordRepository(db)

    def export_bind(self, *, zone: HostedZone) -> str:
        records = list(self._records.list_paged(
            zone_id=zone.id, page=1, page_size=10000
        )[0])
        return export_bind(zone, records)

    def export_json(self, *, zone: HostedZone) -> dict:
        records = list(self._records.list_paged(
            zone_id=zone.id, page=1, page_size=10000
        )[0])
        return export_json(zone, records)
