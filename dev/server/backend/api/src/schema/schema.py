from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class DateModel(BaseModel):
    """
    日付モデル - 日付を表現するための基本モデル
    """
    target_date: date = Field(..., description="検索対象日")

class EventCreate(BaseModel):
    """
    イベント作成・更新モデル
    """
    company_id: str = Field(..., description="会社の一意なID")
    event_type: str = Field(..., description="イベントの種類")
    title: str = Field(..., description="イベントのタイトル")
    description: str = Field(..., description="イベントの詳細説明")
    start_date: datetime = Field(..., description="イベントの開始時間")
    end_date: datetime = Field(..., description="イベントの終了時間")
    location: str = Field(..., description="イベントの開催場所")
    reward: Optional[str] = Field(None, description="イベントの報酬")
    required_qualifications: Optional[str] = Field(None, description="イベント参加に必要な資格 (文字列)")
    available_spots: Optional[int] = Field(None, description="イベントの最大参加人数")
    tags: Optional[str] = Field(None, description="イベントに関連するタグ (JSON文字列)")
    image: Optional[str] = Field(None, description="イベントの画像（Base64エンコードされた文字列）")

class Event(EventCreate):
    """
    イベントモデル (レスポンス用)
    """
    event_id: str = Field(..., description="イベントの一意なID")
    created_at: datetime = Field(default_factory=datetime.now, description="イベントの作成日時")
    updated_at: datetime = Field(default_factory=datetime.now, description="イベントの更新日時")