"""BIND zone file import service."""

from sqlalchemy.orm import Session

from app.core.exceptions import ValidationFailedException
from app.models.dns_record import DnsRecord
from app.models.hosted_zone import HostedZone
from app.repositories.dns_record_repository import DnsRecordRepository
from app.services.bind_parser import parse_bind_zone
from app.validators.registry import normalize_record_name, validate_ttl, validate_value


class ZoneImportService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self._records = DnsRecordRepository(db)

    def import_bind(
        self,
        *,
        zone: HostedZone,
        content: str,
    ) -> list[DnsRecord]:
        """Parse and import records from a BIND zone file into the zone.

        Skips SOA records (managed by the zone bootstrap). Skips records that
        already exist with the same name and type. Validates each record
        through the same validators used by the create endpoint.
        """
        parsed = parse_bind_zone(content, zone_name=zone.name)
        imported: list[DnsRecord] = []

        for entry in parsed:
            rtype = str(entry["type"])
            if rtype == "SOA":
                continue

            try:
                canonical_name = normalize_record_name(
                    str(entry["name"]), zone_name=zone.name
                )
                canonical_value = validate_value(
                    rtype, str(entry["value"]), name=canonical_name, zone_name=zone.name
                )
                validate_ttl(int(entry["ttl"]))
            except ValidationFailedException:
                # Skip invalid records rather than failing the whole import.
                continue

            existing = self._records.get_by_zone_name_type(
                zone_id=zone.id, name=canonical_name, record_type=str(rtype)
            )
            if existing is not None:
                continue

            rec = self._records.create(
                hosted_zone_id=zone.id,
                name=canonical_name,
                type=rtype,
                ttl=entry["ttl"],
                value=canonical_value,
                routing_policy="SIMPLE",
            )
            zone.record_count += 1
            imported.append(rec)

        self.db.commit()
        return imported
