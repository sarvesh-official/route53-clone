from collections.abc import Sequence

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.hosted_zone import HostedZone
from app.repositories.base import BaseRepository

SORTABLE: dict[str, object] = {
    "name": HostedZone.name,
    "type": HostedZone.type,
    "created_at": HostedZone.created_at,
    "record_count": HostedZone.record_count,
}


class HostedZoneRepository(BaseRepository[HostedZone]):
    model = HostedZone

    def __init__(self, db: Session) -> None:
        super().__init__(db)

    def list_paged(
        self,
        *,
        user_id: str,
        page: int,
        page_size: int,
        search: str | None = None,
        zone_type: str | None = None,
        sort_field: str = "created_at",
        sort_dir: str = "desc",
    ) -> tuple[Sequence[HostedZone], int]:
        stmt = select(HostedZone).where(HostedZone.created_by == user_id)

        if search:
            like = f"%{search.lower()}%"
            stmt = stmt.where(or_(HostedZone.name.ilike(like), HostedZone.id.ilike(like)))
        if zone_type:
            stmt = stmt.where(HostedZone.type == zone_type)

        total = self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0

        column = SORTABLE.get(sort_field, HostedZone.created_at)
        ordering = column.desc() if sort_dir == "desc" else column.asc()  # type: ignore[attr-defined]
        stmt = stmt.order_by(ordering).offset((page - 1) * page_size).limit(page_size)

        items = self.db.scalars(stmt).all()
        return items, int(total)

    def get_by_id(self, id: str, user_id: str) -> HostedZone | None:
        return self.db.execute(
            select(HostedZone).where(
                HostedZone.id == id, HostedZone.created_by == user_id
            )
        ).scalar_one_or_none()

    def get_by_name_type(
        self, *, user_id: str, name: str, zone_type: str
    ) -> HostedZone | None:
        return self.db.execute(
            select(HostedZone).where(
                HostedZone.created_by == user_id,
                HostedZone.name == name,
                HostedZone.type == zone_type,
            )
        ).scalar_one_or_none()

    def update(self, zone: HostedZone, *, comment: str | None) -> HostedZone:
        zone.comment = comment if comment is not None else ""
        self.db.flush()
        return zone
