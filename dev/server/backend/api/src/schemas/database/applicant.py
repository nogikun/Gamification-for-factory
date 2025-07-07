"""
Applicant-related Pydantic schemas for FastAPI
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class ApplicantBase(BaseModel):
    """Base applicant model"""
    last_name: str
    first_name: str
    mail_address: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    birth_date: Optional[datetime] = Field(None, alias="birthdate")
    license: Optional[str] = None
    
    class Config:
        validate_by_name = True


class ApplicantCreate(ApplicantBase):
    """Applicant creation model"""
    pass


class ApplicantUpdate(BaseModel):
    """Applicant update model"""
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    mail_address: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    birth_date: Optional[datetime] = None
    license: Optional[str] = None


class Applicant(ApplicantBase):
    """Applicant response model"""
    user_id: uuid.UUID
    updated_at: datetime

    class Config:
        from_attributes = True
