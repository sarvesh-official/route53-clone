from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.ids import generate_zone_id
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.dns_record import DnsRecord
    from app.models.user import User


class HostedZone(Base, TimestampMixin):
    __tablename__ = "hosted_zones"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_zone_id)
    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)
    comment: Mapped[str] = mapped_column(String, default="", nullable=False)
    record_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_by: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="hosted_zones")
    records: Mapped[list["DnsRecord"]] = relationship(
        back_populates="zone", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint("type IN ('PUBLIC', 'PRIVATE')", name="ck_zone_type"),
        UniqueConstraint("created_by", "name", "type", name="uq_user_zone_name_type"),
        Index("idx_zones_name", "name"),
        Index("idx_zones_created_by", "created_by"),
    )
