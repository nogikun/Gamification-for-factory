# src/db/models.py
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, DateTime, ARRAY

Base = declarative_base()

class EventModel(Base):
    __tablename__ = "events"

    event_id = Column(String, primary_key=True)
    company_id = Column(String)
    event_type = Column(String)
    title = Column(String)
    description = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    location = Column(String)
    reward = Column(String)
    required_qualifications = Column(ARRAY(String))
    max_participants = Column(Integer)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    tags = Column(ARRAY(String))
    image = Column(String)
