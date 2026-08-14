"""SQLAlchemy models.

Importing this package registers all models on the declarative Base,
which Alembic needs to autogenerate migrations.
"""

from app.models.base import Base, TimestampMixin
from app.models.dns_record import DnsRecord
from app.models.feedback import Feedback
from app.models.hosted_zone import HostedZone
from app.models.user import User
from app.models.user_session import UserSession

__all__ = ["Base", "DnsRecord", "Feedback", "HostedZone", "TimestampMixin", "User", "UserSession"]
