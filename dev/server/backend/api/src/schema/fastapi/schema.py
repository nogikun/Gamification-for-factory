from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

# リクエスト用: 日付指定
class DateModel(BaseModel):
    date: date

# レスポンス用: イベント
class Event(BaseModel):
    event_id: str
    company_id: str
    event_type: str
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    location: str
    reward: str
    required_qualifications: str
    available_spots: int
    created_at: datetime
    updated_at: datetime
    tags: List[str]
    image: Optional[str]

    model_config = {
        "from_attributes": True  # これで ORM モード有効（Pydantic v2用）
    }