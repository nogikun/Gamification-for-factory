from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import uuid

# Local imports
from src.schemas.database.review import Review as ReviewSchema, ReviewCreate
from src.database import get_db
from src.crud import (
    create_review,
    update_review,
    delete_review,
)
from src.utils.review_converter import ReviewConverter

# Routerを作成
router = APIRouter()

# --- レビュー関連エンドポイント --- #
@router.post("/review", response_model=ReviewSchema, status_code=201)
async def create_review_api(
    review_data: ReviewCreate,
    db: Session = Depends(get_db)
) -> ReviewSchema:
    """API endpoint to create a review."""
    try:
        print(f"Received review data: {review_data}")
        created_review = create_review(db=db, review_data=review_data)
        
        # ReviewConverterを使用してレスポンス用のデータを準備
        converter = ReviewConverter(db, enable_cache=True, strict_mode=False)
        application_id = converter.convert_for_response(
            created_review.reviewee_id, 
            created_review.event_id
        )
        
        # レスポンススキーマ用のディクショナリを作成
        response_data = {
            "review_id": created_review.review_id,
            "application_id": application_id,
            "reviewer_id": created_review.reviewer_id,
            "rating": created_review.rating,
            "comment": created_review.comment,
            "created_at": created_review.created_at,
            "updated_at": created_review.updated_at
        }
        
        return ReviewSchema.model_validate(response_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating review: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating review: {str(e)}"
        ) from e

@router.put("/review/{review_id}", response_model=ReviewSchema)
async def update_review_api(
    review_id: uuid.UUID,
    review_data: ReviewCreate,
    db: Session = Depends(get_db)
) -> ReviewSchema:
    """API endpoint to update a review."""
    updated_review = update_review(
        db,
        review_id=review_id,
        review_data=review_data
    )
    if updated_review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # ReviewConverterを使用してレスポンス用のデータを準備
    converter = ReviewConverter(db, enable_cache=True, strict_mode=False)
    application_id = converter.convert_for_response(
        updated_review.reviewee_id, 
        updated_review.event_id
    )
    
    # レスポンススキーマ用のディクショナリを作成
    response_data = {
        "review_id": updated_review.review_id,
        "application_id": application_id,
        "reviewer_id": updated_review.reviewer_id,
        "rating": updated_review.rating,
        "comment": updated_review.comment,
        "created_at": updated_review.created_at,
        "updated_at": updated_review.updated_at
    }
    
    return ReviewSchema.model_validate(response_data)


@router.delete("/review/{review_id}", status_code=204)
async def delete_review_api(
    review_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """API endpoint to delete a review."""
    success = delete_review(db, review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found")
    return