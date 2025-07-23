"""
Review Notification related Pydantic schemas for FastAPI
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class ReviewNotificationBase(BaseModel):
    """Base review notification model"""
    review_request_id: uuid.UUID  # クエリでrequest_idをreview_request_idにラベル付け
    application_id: uuid.UUID
    reviewee_id: uuid.UUID
    reviewer_id: uuid.UUID
    requested_at: datetime
    request_message: Optional[str] = None
    status: str


class ReviewNotificationDetail(ReviewNotificationBase):
    """Review notification detail model with related information"""
    event_title: Optional[str] = None
    applicant_name: Optional[str] = None
    
    class Config:
        from_attributes = True