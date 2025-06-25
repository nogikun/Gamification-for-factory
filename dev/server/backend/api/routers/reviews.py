from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List
import traceback
import logging

# Local imports
from src.schemas.database.review import ReviewDetail
from src.database import get_db
from src.crud import get_reviews

# ログ設定
logger = logging.getLogger(__name__)

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
    try:
        logger.info(f"Getting reviews with skip={skip}, limit={limit}")
        reviews = get_reviews(db, skip=skip, limit=limit)
        logger.info(f"Retrieved {len(reviews)} reviews from database")
        
        # スキーマ変換
        result = []
        for i, review in enumerate(reviews):
            try:
                review_detail = ReviewDetail.model_validate(review)
                result.append(review_detail)
            except Exception as schema_error:
                logger.error(f"Schema conversion error for review {i}: {schema_error}")
                logger.error(f"Review data: {review}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Schema conversion error: {str(schema_error)}"
                )
        
        logger.info(f"Successfully converted {len(result)} reviews")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_reviews_api: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
