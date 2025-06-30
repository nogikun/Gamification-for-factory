from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

from src.models import UserTypeEnum

class UserBase(BaseModel):
    user_name: str
    user_type: UserTypeEnum

class UserCreate(UserBase):
    pass

class User(UserBase):
    user_id: UUID
    created_at: datetime
    login_time: Optional[datetime] = None
    ai_advice: Optional[str] = None

    class Config:
        from_attributes = True