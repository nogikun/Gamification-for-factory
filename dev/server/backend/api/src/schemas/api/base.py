"""
Common schemas and base models for FastAPI
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
import uuid


class DateModel(BaseModel):
    """
    日付モデル - 日付を表現するための基本モデル
    """
    target_date: date = Field(..., description="検索対象日")

    class Config:
        from_attributes = True


class BaseResponse(BaseModel):
    """Base response model with common fields"""
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
