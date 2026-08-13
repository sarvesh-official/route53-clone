"""Bootstrap the apex NS and SOA records Route 53 auto-creates with every zone.

Bypasses the record validation layer because these values are server-controlled
and already canonical. The writes participate in the zone-creation transaction
so a partial failure rolls everything back.
"""

from sqlalchemy.orm import Session

from app.core.ids import generate_record_id
from app.models.dns_record import DnsRecord
from app.models.hosted_zone import HostedZone

_DEFAULT_NS = (
    "ns-1.awsdns-clone.com.\n"
    "ns-2.awsdns-clone.net.\n"
    "ns-3.awsdns-clone.org.\n"
    "ns-4.awsdns-clone.co.uk."
)
_DEFAULT_SOA = (
    "ns-1.awsdns-clone.com. awsdns-hostmaster.amazon.com. "
    "1 7200 900 1209600 86400"
)


def create_default_records(db: Session, zone: HostedZone) -> int:
    """Insert apex NS and SOA. Returns the number of records inserted."""
    db.add(DnsRecord(
        id=generate_record_id(),
        hosted_zone_id=zone.id,
        name=zone.name,
        type="NS",
        ttl=172800,
        value=_DEFAULT_NS,
    ))
    db.add(DnsRecord(
        id=generate_record_id(),
        hosted_zone_id=zone.id,
        name=zone.name,
        type="SOA",
        ttl=900,
        value=_DEFAULT_SOA,
    ))
    zone.record_count = (zone.record_count or 0) + 2
    return 2
