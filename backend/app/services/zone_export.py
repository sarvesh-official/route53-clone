"""BIND zone file and JSON export formatters."""

from app.models.dns_record import DnsRecord
from app.models.hosted_zone import HostedZone


def export_bind(zone: HostedZone, records: list[DnsRecord]) -> str:
    """Render a hosted zone and its records as a BIND zone file."""
    lines: list[str] = [
        f"; Zone file for {zone.name}",
        f"; Exported from Route 53 Clone",
        f"$ORIGIN {zone.name}",
        "$TTL 300",
        "",
    ]

    # SOA first (BIND convention).
    soa_records = [r for r in records if r.type == "SOA"]
    other_records = [r for r in records if r.type != "SOA"]

    for rec in soa_records + other_records:
        # Multi-line values (NS with multiple servers, TXT with quotes) get
        # split into separate lines for readability but stay one record.
        value = rec.value
        if "\n" in value:
            # Multi-value records: wrap in parentheses.
            parts = value.split("\n")
            joined = "\n    ".join(parts)
            lines.append(f"{rec.name:<30} {rec.ttl:>6}  IN  {rec.type:<5} ( {joined} )")
        else:
            lines.append(f"{rec.name:<30} {rec.ttl:>6}  IN  {rec.type:<5} {value}")

    return "\n".join(lines) + "\n"


def export_json(zone: HostedZone, records: list[DnsRecord]) -> dict:
    """Render a hosted zone and its records as a JSON-serializable dict."""
    return {
        "zone": {
            "id": zone.id,
            "name": zone.name,
            "type": zone.type,
            "comment": zone.comment,
        },
        "records": [
            {
                "id": r.id,
                "name": r.name,
                "type": r.type,
                "ttl": r.ttl,
                "value": r.value,
                "routing_policy": r.routing_policy,
            }
            for r in records
        ],
    }
