from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.ids import generate_record_id
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.hosted_zone import HostedZone


class DnsRecord(Base, TimestampMixin):
    __tablename__ = "dns_records"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_record_id)
    hosted_zone_id: Mapped[str] = mapped_column(
        ForeignKey("hosted_zones.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)
    ttl: Mapped[int] = mapped_column(Integer, nullable=False, default=300)
    value: Mapped[str] = mapped_column(String, nullable=False)
    routing_policy: Mapped[str] = mapped_column(String, default="SIMPLE", nullable=False)

    zone: Mapped["HostedZone"] = relationship(back_populates="records")

    __table_args__ = (
        Index("idx_records_zone", "hosted_zone_id"),
        Index("idx_records_name", "name"),
        Index("idx_records_type", "type"),
    )
