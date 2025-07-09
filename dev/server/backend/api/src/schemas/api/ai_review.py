from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date
import uuid


class Review(BaseModel):
    """Model for reviews"""
    review_id: str
    company_id: str # reviewer's company ID
    event_id: str
    rating: int = Field(..., ge=1, le=5)  # Rating between 1 and 5
    comment: Optional[str] = None
    created_at: date = Field(..., description="Review creation date")
    updated_at: Optional[date] = Field(None, description="Review update date")
    
class ReviewList(BaseModel):
    """Model for a list of reviews"""
    reviews: List[Review] = Field(..., description="List of reviews")
    total_count: int = Field(..., description="Total number of reviews")

class AIReviewRequest(BaseModel):
    """Model for AI review request"""
<<<<<<< HEAD
    user_id: str = Field(..., description="User ID to analyze reviews for")
    custom_prompt: Optional[str] = Field(None, description="Custom prompt for AI analysis")
    
    @validator('user_id')
    def validate_user_id(cls, v):
        """Validate that user_id is a valid UUID format"""
        try:
            uuid.UUID(v)
            return v
        except ValueError:
            raise ValueError(f"Invalid UUID format for user_id: {v}")
=======
    user_id: str = Field(..., description="User ID to get reviews for")
    custom_prompt: Optional[str] = Field(None, description="Custom prompt for AI analysis")
>>>>>>> c1a0b1a338e0e2acebc18e2b01b3b7dd497997d3

class AIReview(BaseModel):
    """Model for AI review response"""
    comment: str = Field(..., description="AI-generated review comment")
    
    class Config:
        schema_extra = {
            "example": {
                "comment": "このユーザーは総合的に高い評価を受けています。特に技術力と協調性において優れた評価を得ており..."
            }
        }

# Alias for better semantic naming
AIReviewResponse = AIReview