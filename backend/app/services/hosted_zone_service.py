from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, NotFoundException
from app.models.hosted_zone import HostedZone
from app.repositories.hosted_zone_repository import HostedZoneRepository
from app.services.zone_bootstrap import create_default_records


class HostedZoneService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self._zones = HostedZoneRepository(db)

    def list_zones(
        self,
        *,
        user_id: str,
        page: int,
        page_size: int,
        search: str | None = None,
        zone_type: str | None = None,
        sort_field: str = "created_at",
        sort_dir: str = "desc",
    ) -> tuple[list[HostedZone], int]:
        items, total = self._zones.list_paged(
            user_id=user_id,
            page=page,
            page_size=page_size,
            search=search,
            zone_type=zone_type,
            sort_field=sort_field,
            sort_dir=sort_dir,
        )
        return list(items), total

    def get_zone(self, *, user_id: str, zone_id: str) -> HostedZone:
        """Return the zone or raise NotFoundException if it does not exist."""
        zone = self._zones.get_by_id(zone_id, user_id=user_id)
        if zone is None:
            raise NotFoundException(f"Hosted zone {zone_id} not found")
        return zone

    def create_zone(
        self,
        *,
        user_id: str,
        name: str,
        zone_type: str,
        comment: str | None,
    ) -> HostedZone:
        """Create a zone and auto-insert apex NS and SOA records.

        Raises ConflictException if the user already owns a zone with the same
        name and type.
        """
        existing = self._zones.get_by_name_type(
            user_id=user_id, name=name, zone_type=zone_type
        )
        if existing is not None:
            raise ConflictException(
                detail=f"You already own a {zone_type.lower()} zone named {name}"
            )

        zone = self._zones.create(
            created_by=user_id,
            name=name,
            type=zone_type,
            comment=comment or "",
            record_count=0,
        )
        create_default_records(self.db, zone)
        self.db.commit()
        self.db.refresh(zone)
        return zone

    def update_zone(
        self, *, user_id: str, zone_id: str, comment: str | None
    ) -> HostedZone:
        zone = self.get_zone(user_id=user_id, zone_id=zone_id)
        self._zones.update(zone, comment=comment)
        self.db.commit()
        self.db.refresh(zone)
        return zone

    def delete_zone(self, *, user_id: str, zone_id: str) -> None:
        zone = self.get_zone(user_id=user_id, zone_id=zone_id)
        self._zones.delete(zone)
        self.db.commit()
