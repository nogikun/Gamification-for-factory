from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


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
    user_id: str = Field(..., description="User ID to get reviews for")
    custom_prompt: Optional[str] = Field(None, description="Custom prompt for AI analysis")

class AIReview(BaseModel):
    """Model for AI review"""
    comment: str = Field(..., description="Review comment")