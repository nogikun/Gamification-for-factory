"""
Application-related Pydantic schemas for FastAPI
"""
from pydantic import BaseModel, model_validator
from typing import Optional, Any
from datetime import datetime
import uuid
from src.models import ApplicationStatusEnum


class ApplicationBase(BaseModel):
    """Base application model"""
    event_id: uuid.UUID
    user_id: uuid.UUID
    message: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    """Application creation model"""
    pass


class ApplicationUpdate(BaseModel):
    """Application update model"""
    status: str
    processed_by: Optional[uuid.UUID] = None


class ApplicationResponse(ApplicationBase):
    """Application response model"""
    application_id: uuid.UUID
    status: str
    applied_at: datetime
    processed_at: Optional[datetime] = None
    processed_by: Optional[uuid.UUID] = None

    class Config:
        from_attributes = True

    @model_validator(mode='before')
    @classmethod
    def convert_sqlalchemy_application(cls, data: Any) -> Any:
        if hasattr(data, '_sa_instance_state'):
            # ステータスを文字列に変換
            if isinstance(data.status, ApplicationStatusEnum):
                data.status = data.status.value
        return data


class ApplicationDetail(ApplicationResponse):
    """Application detail model with related information"""
    event_title: Optional[str] = None
    event_type: Optional[str] = None
    event_start_date: Optional[datetime] = None
    event_end_date: Optional[datetime] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    applicant_phone: Optional[str] = None
