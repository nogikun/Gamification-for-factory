from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

# Local imports
from src.schemas.database.review import Review as ReviewDetail
from src.schemas.database.applicant import Applicant as ApplicantSchema
from src.schemas.database.review_notification import ReviewNotificationDetail
from src.database import get_db
from src.crud import get_review_notifications

# endpoint imports
from ..applications import get_applicants_api
from ..reviews import get_reviews_api

# API Router with prefix
api_router = APIRouter(prefix="/api")

# --- 応募者関連エンドポイント（プレフィックス付きAPI routes） --- #
@api_router.get("/users", response_model=List[ApplicantSchema])
async def get_api_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ApplicantSchema]:
    """API endpoint to get a list of users with API prefix."""
    return await get_applicants_api(skip=skip, limit=limit, db=db)


# --- レビュー関連エンドポイント（プレフィックス付きAPI routes） --- #
@api_router.get("/reviews", response_model=List[ReviewDetail])
async def get_api_reviews(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ReviewDetail]:
    """API endpoint to get a list of reviews with API prefix."""
    return await get_reviews_api(skip=skip, limit=limit, db=db)


@api_router.get("/review-notification", response_model=List[ReviewNotificationDetail])
async def get_review_notification_api(
    user_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ReviewNotificationDetail]:
    """API endpoint to get review notifications. Each call triggers notification."""
    notifications = get_review_notifications(db=db, user_id=user_id, skip=skip, limit=limit)
    return notifications
