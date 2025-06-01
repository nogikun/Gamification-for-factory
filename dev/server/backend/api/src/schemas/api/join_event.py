"""
Join Event API schemas for frontend compatibility
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class FrontendApplicant(BaseModel):
    """Frontend applicant model matching the structure sent by the app"""
    applicant_id: str
    company_id: str  
    event_id: str
    name: str
    phone_num: str
    email: str
    birthdate: Optional[date] = None
    address: Optional[str] = None
    qualifications: Optional[List[str]] = None
    motivation: Optional[str] = None


class EventIdModel(BaseModel):
    """Event ID model"""
    event_id: str


class JoinEventRequest(BaseModel):
    """Join event request model matching frontend structure"""
    applicant: FrontendApplicant
    event_id_model: EventIdModel
