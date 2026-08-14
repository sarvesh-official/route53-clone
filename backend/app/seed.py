"""Database seed script.

Creates a demo user with a couple of hosted zones and DNS records.
Idempotent: if the demo user already exists, the script exits without
duplicating data. Run it with:

    uv run python -m app.seed
"""

from __future__ import annotations

from datetime import timedelta

import bcrypt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.core.ids import generate_record_id, generate_zone_id
from app.models import DnsRecord, HostedZone, User
from app.models.base import Base, utcnow, uuid4_str

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
        routing_policy="SIMPLE",
    )

    # SOA record — start of authority, contains serial + refresh/retry/expire values
    soa_record = DnsRecord(
        id=generate_record_id(),
        hosted_zone_id=zone_id,
        name=name,
        type="SOA",
        ttl=900,
        value="ns-2048.awsdns-64.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400",
        routing_policy="SIMPLE",
    )

    db.add_all([ns_record, soa_record])
    return zone


def _make_extra_records(db: Session, zone_id: str, zone_name: str, days_ago: int = 0) -> None:
    """Add a few user-created records to make the demo look realistic.

    days_ago shifts created_at back so the activity feed shows spread data.
    """
    base = utcnow() - timedelta(days=days_ago)
    records = [
        DnsRecord(
            id=generate_record_id(),
            hosted_zone_id=zone_id,
            name=f"www.{zone_name}",
            type="A",
            ttl=300,
            value="192.0.2.1",
            routing_policy="SIMPLE",
            created_at=base,
        ),
        DnsRecord(
            id=generate_record_id(),
            hosted_zone_id=zone_id,
            name=f"api.{zone_name}",
            type="A",
            ttl=300,
            value="192.0.2.2",
            routing_policy="SIMPLE",
            created_at=base - timedelta(hours=2),
        ),
        DnsRecord(
            id=generate_record_id(),
            hosted_zone_id=zone_id,
            name=f"mail.{zone_name}",
            type="MX",
            ttl=3600,
            value="10 mail.example.com.\n20 mail2.example.com.",
            routing_policy="SIMPLE",
            created_at=base - timedelta(hours=5),
        ),
        DnsRecord(
            id=generate_record_id(),
            hosted_zone_id=zone_id,
            name=zone_name,
            type="TXT",
            ttl=3600,
            value='"v=spf1 include:_spf.example.com ~all"',
            routing_policy="SIMPLE",
            created_at=base - timedelta(hours=8),
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

        # Demo users, each with their own hosted zones
        users = [
            ("demo@example.com", "demo1234", "Demo User"),
            ("alice@example.com", "alice12345", "Alice"),
            ("bob@example.com", "bob12345", "Bob"),
            ("carol@example.com", "carol12345", "Carol"),
        ]

        created_users = []
        for email, password, name in users:
            u = User(
                id=uuid4_str(),
                email=email,
                password_hash=_hash_password(password),
                display_name=name,
            )
            db.add(u)
            db.flush()
            created_users.append((u, email, password, name))

        # Demo user gets two zones with full record sets
        demo_user = created_users[0][0]
        zone1 = _make_zone(db, demo_user.id, "example.com.", "PUBLIC", "Main production zone")
        _make_extra_records(db, zone1.id, "example.com.", days_ago=1)

        zone2 = _make_zone(db, demo_user.id, "staging.example.com.", "PUBLIC", "Staging environment")
        _make_extra_records(db, zone2.id, "staging.example.com.", days_ago=0)

        zone1.record_count = 2 + 4  # NS + SOA + 4 extra
        zone2.record_count = 2 + 4

        # Alice gets a zone
        alice = created_users[1][0]
        zone3 = _make_zone(db, alice.id, "alice.io.", "PUBLIC", "Personal blog")
        _make_extra_records(db, zone3.id, "alice.io.", days_ago=2)
        zone3.record_count = 2 + 4

        # Bob gets a zone
        bob = created_users[2][0]
        zone4 = _make_zone(db, bob.id, "bob.dev.", "PUBLIC", "Portfolio")
        _make_extra_records(db, zone4.id, "bob.dev.", days_ago=3)
        zone4.record_count = 2 + 4

        db.commit()
        print(f"Seed complete. Created {len(created_users)} users with 4 zones and 24 records.")
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
