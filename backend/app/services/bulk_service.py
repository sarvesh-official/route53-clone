"""Bulk operations for records and zones."""

from sqlalchemy.orm import Session

from app.models.dns_record import DnsRecord
from app.models.hosted_zone import HostedZone
from app.repositories.dns_record_repository import DnsRecordRepository
from app.repositories.hosted_zone_repository import HostedZoneRepository


class BulkService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self._records = DnsRecordRepository(db)
        self._zones = HostedZoneRepository(db)

    def delete_records(
        self, *, user_id: str, record_ids: list[str]
    ) -> tuple[int, int]:
        """Delete records owned by the user. Returns (deleted, skipped).

        Records not owned by the user or not found are skipped silently.
        """
        deleted = 0
        skipped = 0

        for rid in record_ids:
            rec = self._records.get_by_id(rid)
            if rec is None or rec.zone.created_by != user_id:
                skipped += 1
                continue
            zone = rec.zone
            self._records.delete(rec)
            zone.record_count = max(0, zone.record_count - 1)
            deleted += 1

        self.db.commit()
        return deleted, skipped

    def delete_zones(
        self, *, user_id: str, zone_ids: list[str]
    ) -> tuple[int, int]:
        """Delete zones owned by the user. Returns (deleted, skipped).

        Zones not owned by the user or not found are skipped silently.
        """
        deleted = 0
        skipped = 0

        for zid in zone_ids:
            zone = self._zones.get_by_id(zid, user_id=user_id)
            if zone is None:
                skipped += 1
                continue
            self._zones.delete(zone)
            deleted += 1

        self.db.commit()
        return deleted, skipped
