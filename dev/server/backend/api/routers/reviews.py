from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List

# Local imports
from src.schemas.database.review import ReviewDetail
from src.database import get_db
from src.crud import get_reviews

# Routerを作成
router = APIRouter()

# --- レビュー関連エンドポイント --- #
@router.get("/reviews", response_model=List[ReviewDetail])
async def get_reviews_api(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ReviewDetail]:
    """API endpoint to get a list of reviews."""
    reviews = get_reviews(db, skip=skip, limit=limit)
    return [ReviewDetail.model_validate(review) for review in reviews]
