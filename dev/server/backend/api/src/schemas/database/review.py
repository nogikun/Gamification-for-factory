"""
Review-related Pydantic schemas for FastAPI
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class ReviewBase(BaseModel):
    """Base review model"""
    application_id: uuid.UUID
    reviewer_id: uuid.UUID
    rating: float
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    """Review creation model"""
    pass


class ReviewUpdate(BaseModel):
    """Review update model"""
    rating: Optional[float] = None
    comment: Optional[str] = None


class Review(ReviewBase):
    """Review response model"""
    review_id: int  # ReviewはSerialタイプのまま
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReviewDetail(Review):
    """Review detail model with related information"""
    event_title: Optional[str] = None
    applicant_name: Optional[str] = None
