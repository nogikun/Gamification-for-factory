from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List
import traceback
import logging

# Local imports
from src.schemas.database.review import ReviewDetail, ReviewCreate
from src.database import get_db
from src.crud import get_reviews, create_review
from src.utils.review_converter import ReviewConverter

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

@router.post("/reviews", response_model=ReviewDetail, status_code=201)
async def create_review_api(
    review: ReviewCreate,
    db: Session = Depends(get_db)
) -> ReviewDetail:
    """API endpoint to create a new review."""
    try:
        logger.info(f"Creating review for application_id={review.application_id}")
        db_review = create_review(db=db, review_data=review)
        logger.info(f"Successfully created review with review_id={db_review.review_id}")
        
        # ReviewConverterを初期化
        converter = ReviewConverter(db, enable_cache=True, strict_mode=False)
        
        # application_idを逆変換
        application_id = converter.convert_for_response(db_review.reviewee_id, db_review.event_id)
        
        # ReviewDetailモデルに合うようにデータを整形
        review_data_for_response = {
            "review_id": db_review.review_id,
            "application_id": application_id,
            "reviewer_id": db_review.reviewer_id,
            "rating": db_review.rating,
            "comment": db_review.comment,
            "created_at": db_review.created_at,
            "updated_at": db_review.updated_at,
            "event_title": None,  # 必要に応じて取得
            "applicant_name": None  # 必要に応じて取得
        }
        
        return ReviewDetail.model_validate(review_data_for_response)
    except Exception as e:
        logger.error(f"Error in create_review_api: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=400,
            detail=f"Could not create review: {str(e)}"
        )
