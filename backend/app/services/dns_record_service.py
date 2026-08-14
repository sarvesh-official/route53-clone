from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, NotFoundException
from app.models.dns_record import DnsRecord
from app.models.hosted_zone import HostedZone
from app.repositories.dns_record_repository import DnsRecordRepository
from app.repositories.hosted_zone_repository import HostedZoneRepository
from app.validators.registry import normalize_record_name, validate_ttl, validate_value


class DnsRecordService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self._records = DnsRecordRepository(db)
        self._zones = HostedZoneRepository(db)

    def list_records(
        self,
        *,
        zone: HostedZone,
        page: int,
        page_size: int,
        search: str | None = None,
        record_type: str | None = None,
        sort_field: str = "name",
        sort_dir: str = "asc",
    ) -> tuple[list[DnsRecord], int]:
        items, total = self._records.list_paged(
            zone_id=zone.id,
            page=page,
            page_size=page_size,
            search=search,
            record_type=record_type,
            sort_field=sort_field,
            sort_dir=sort_dir,
        )
        return list(items), total

    def get_record(self, *, record_id: str) -> DnsRecord:
        """Return the record or raise NotFoundException if it does not exist."""
        rec = self._records.get_by_id(record_id)
        if rec is None:
            raise NotFoundException(f"Record {record_id} not found")
        return rec

    def create_record(
        self,
        *,
        zone: HostedZone,
        name: str,
        record_type: str,
        ttl: int,
        value: str,
        routing_policy: str = "SIMPLE",
    ) -> DnsRecord:
        """Validate and create a DNS record within the given zone.

        Raises ConflictException if a record with the same name and type
        already exists in this zone.
        """
        canonical_name = normalize_record_name(name, zone_name=zone.name)
        canonical_value = validate_value(
            record_type, value, name=canonical_name, zone_name=zone.name
        )
        validate_ttl(ttl)

        if self._records.get_by_zone_name_type(
            zone_id=zone.id, name=canonical_name, record_type=record_type
        ):
            raise ConflictException(
                detail=f"A {record_type} record already exists for {canonical_name} in this zone"
            )

        rec = self._records.create(
            hosted_zone_id=zone.id,
            name=canonical_name,
            type=record_type,
            ttl=ttl,
            value=canonical_value,
            routing_policy=routing_policy,
        )
        zone.record_count += 1
        self._zones.update(zone, comment=zone.comment)
        self.db.commit()
        self.db.refresh(rec)
        return rec

    def update_record(
        self,
        *,
        record_id: str,
        ttl: int | None,
        value: str | None,
    ) -> DnsRecord:
        rec = self.get_record(record_id=record_id)
        if ttl is not None:
            validate_ttl(ttl)
        if value is not None:
            value = validate_value(
                rec.type, value, name=rec.name, zone_name=rec.zone.name
            )
        self._records.update(rec, ttl=ttl, value=value)
        self.db.commit()
        self.db.refresh(rec)
        return rec

    def delete_record(self, *, record_id: str) -> None:
        rec = self.get_record(record_id=record_id)
        zone = rec.zone
        self._records.delete(rec)
        zone.record_count = max(0, zone.record_count - 1)
        self._zones.update(zone, comment=zone.comment)
        self.db.commit()
