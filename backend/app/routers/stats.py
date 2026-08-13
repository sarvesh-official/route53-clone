"""Dashboard stats endpoints.

  GET /api/stats           aggregate counts for dashboard tiles
  GET /api/stats/activity  daily record creation counts for chart
"""
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.stats import ActivityRead, DailyBucketRead, UserStatsRead
from app.services import activity_service, stats_service

router = APIRouter()


@router.get(
    "",
    response_model=UserStatsRead,
    summary="Get dashboard stats for the current user",
)
def get_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserStatsRead:
    stats = stats_service.for_user(db, user_id=user.id)
    return UserStatsRead(
        total_zones=stats.total_zones,
        public_zones=stats.public_zones,
        private_zones=stats.private_zones,
        total_records=stats.total_records,
    )


@router.get(
    "/activity",
    response_model=ActivityRead,
    summary="Get daily record creation activity for the chart",
)
def get_activity(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    days: Annotated[int, Query(ge=1, le=90)] = 7,
) -> ActivityRead:
    buckets = activity_service.records_created_last_n_days(
        db, user_id=user.id, days=days
    )
    return ActivityRead(
        buckets=[
            DailyBucketRead(day=b.day, records_created=b.records_created)
            for b in buckets
        ]
    )
