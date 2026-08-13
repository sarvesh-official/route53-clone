"""Database seed script.

Creates a demo user with a couple of hosted zones and DNS records.
Idempotent: if the demo user already exists, the script exits without
duplicating data. Run it with:

    uv run python -m app.seed
"""

from __future__ import annotations

import bcrypt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.core.ids import generate_record_id, generate_zone_id
from app.models import DnsRecord, HostedZone, User
from app.models.base import Base, uuid4_str

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _hash_password(password: str) -> str:
    """Hash a password with bcrypt. Returns a UTF-8 string."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _make_zone(db: Session, user_id: str, name: str, zone_type: str, comment: str) -> HostedZone:
    """Create a hosted zone with auto-generated NS and SOA records.

    Route 53 automatically creates these two records when you create a zone.
    We replicate that behaviour so the records table isn't empty.
    """
    zone_id = generate_zone_id()
    zone = HostedZone(
        id=zone_id,
        name=name,
        type=zone_type,
        comment=comment,
        record_count=2,  # NS + SOA
        created_by=user_id,
    )
    db.add(zone)
    db.flush()  # need zone.id before creating records

    # NS record — lists the nameservers authoritative for this zone
    ns_record = DnsRecord(
        id=generate_record_id(),
        hosted_zone_id=zone_id,
        name=name,
        type="NS",
        ttl=172800,
        value="ns-2048.awsdns-64.com.\nns-2049.awsdns-65.net.\nns-2050.awsdns-66.org.\nns-2051.awsdns-67.co.uk.",
        routing_policy="Simple",
    )

    # SOA record — start of authority, contains serial + refresh/retry/expire values
    soa_record = DnsRecord(
        id=generate_record_id(),
        hosted_zone_id=zone_id,
        name=name,
        type="SOA",
        ttl=900,
        value="ns-2048.awsdns-64.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400",
        routing_policy="Simple",
    )

    db.add_all([ns_record, soa_record])
    return zone


def _make_extra_records(db: Session, zone_id: str, zone_name: str) -> None:
    """Add a few user-created records to make the demo look realistic."""
    records = [
        DnsRecord(
            id=generate_record_id(),
            hosted_zone_id=zone_id,
            name=f"www.{zone_name}",
            type="A",
            ttl=300,
            value="192.0.2.1",
            routing_policy="Simple",
        ),
        DnsRecord(
            id=generate_record_id(),
            hosted_zone_id=zone_id,
            name=f"api.{zone_name}",
            type="A",
            ttl=300,
            value="192.0.2.2",
            routing_policy="Simple",
        ),
        DnsRecord(
            id=generate_record_id(),
            hosted_zone_id=zone_id,
            name=f"mail.{zone_name}",
            type="MX",
            ttl=3600,
            value="10 mail.example.com.\n20 mail2.example.com.",
            routing_policy="Simple",
        ),
        DnsRecord(
            id=generate_record_id(),
            hosted_zone_id=zone_id,
            name=zone_name,
            type="TXT",
            ttl=3600,
            value='"v=spf1 include:_spf.example.com ~all"',
            routing_policy="Simple",
        ),
    ]
    db.add_all(records)


# ---------------------------------------------------------------------------
# Main seed function
# ---------------------------------------------------------------------------


def seed(db: Session | None = None) -> None:
    """Seed the database with demo data. Safe to run multiple times."""
    if db is None:
        db = SessionLocal()

    try:
        # Check if demo user already exists — idempotency check
        existing = db.query(User).filter_by(email=settings.demo_email).first()
        if existing:
            print(f"Demo user already exists ({existing.email}). Skipping seed.")
            return

        # Create demo user
        user = User(
            id=uuid4_str(),
            email=settings.demo_email,
            password_hash=_hash_password(settings.demo_password),
            display_name=settings.demo_name,
        )
        db.add(user)
        db.flush()

        # Create two demo zones with records
        zone1 = _make_zone(db, user.id, "example.com.", "PUBLIC", "Main production zone")
        _make_extra_records(db, zone1.id, "example.com.")

        zone2 = _make_zone(db, user.id, "staging.example.com.", "PUBLIC", "Staging environment")
        _make_extra_records(db, zone2.id, "staging.example.com.")

        # Update record counts
        zone1.record_count = 2 + 4  # NS + SOA + 4 extra
        zone2.record_count = 2 + 4

        db.commit()
        print(f"Seed complete. Created user '{user.email}' with 2 zones and 12 records.")
    except Exception:
        db.rollback()
        raise
    finally:
        if db.is_active:
            db.close()


if __name__ == "__main__":
    # Ensure tables exist before seeding
    Base.metadata.create_all(engine)
    seed()
