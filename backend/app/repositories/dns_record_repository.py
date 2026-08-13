from collections.abc import Sequence

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.dns_record import DnsRecord
from app.repositories.base import BaseRepository

SORTABLE: dict[str, object] = {
    "name": DnsRecord.name,
    "type": DnsRecord.type,
    "ttl": DnsRecord.ttl,
    "created_at": DnsRecord.created_at,
}


class DnsRecordRepository(BaseRepository[DnsRecord]):
    model = DnsRecord

    def __init__(self, db: Session) -> None:
        super().__init__(db)

    def list_paged(
        self,
        *,
        zone_id: str,
        page: int,
        page_size: int,
        search: str | None = None,
        record_type: str | None = None,
        sort_field: str = "name",
        sort_dir: str = "asc",
    ) -> tuple[Sequence[DnsRecord], int]:
        stmt = select(DnsRecord).where(DnsRecord.hosted_zone_id == zone_id)

        if search:
            like = f"%{search.lower()}%"
            stmt = stmt.where(or_(DnsRecord.name.ilike(like), DnsRecord.value.ilike(like)))
        if record_type:
            stmt = stmt.where(DnsRecord.type == record_type)

        total = self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0

        column = SORTABLE.get(sort_field, DnsRecord.name)
        ordering = column.desc() if sort_dir == "desc" else column.asc()  # type: ignore[attr-defined]
        stmt = stmt.order_by(ordering, DnsRecord.type.asc()).offset((page - 1) * page_size).limit(page_size)

        items = self.db.scalars(stmt).all()
        return items, int(total)

    def get_by_id(self, id: str) -> DnsRecord | None:
        return self.db.execute(
            select(DnsRecord).where(DnsRecord.id == id)
        ).scalar_one_or_none()

    def get_by_zone_name_type(
        self, *, zone_id: str, name: str, record_type: str
    ) -> DnsRecord | None:
        return self.db.execute(
            select(DnsRecord).where(
                DnsRecord.hosted_zone_id == zone_id,
                DnsRecord.name == name,
                DnsRecord.type == record_type,
            )
        ).scalar_one_or_none()

    def update(self, rec: DnsRecord, *, ttl: int | None, value: str | None) -> DnsRecord:
        if ttl is not None:
            rec.ttl = ttl
        if value is not None:
            rec.value = value
        self.db.flush()
        return rec
