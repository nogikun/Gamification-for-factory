from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class DateModel(BaseModel):
    """
    日付モデル - 日付を表現するための基本モデル
    """
    target_date: date = Field(..., description="検索対象日")

class EventIdModel(BaseModel):
    """
    イベントIDモデル - イベントの一意なIDを表現するためのモデル
    """
    event_id: str = Field(..., description="イベントの一意なID")

class Applicant(BaseModel):
    """
    申請者モデル - 申請者の基本情報を定義します
    """
    applicant_id: str = Field(..., description="申請者の一意なID")
    company_id: str = Field(..., description="会社の一意なID")
    event_id: str = Field(..., description="イベントの一意なID")
    name: str = Field(..., description="申請者の名前")
    phone_num: str = Field(..., description="申請者の電話番号")
    email: str = Field(..., description="申請者のメールアドレス")
    birthdate: Optional[date] = Field(None, description="申請者の生年月日")
    address: Optional[str] = Field(None, description="申請者の住所")
    phone: Optional[str] = Field(None, description="申請者の電話番号")
    qualifications: Optional[List[str]] = Field(None, description="申請者の資格リスト")
    applied_at: datetime = Field(default_factory=datetime.now, description="申請日時")

class Event(BaseModel):
    """
    イベントモデル - イベントの基本情報を定義します
    """
    event_id: str = Field(..., description="イベントの一意なID")
    company_id: str = Field(..., description="会社の一意なID")
    event_type: str = Field(..., description="イベントの種類")
    title: str = Field(..., description="イベントのタイトル")
    description: str = Field(..., description="イベントの詳細説明")
    start_time: datetime = Field(..., description="イベントの開始時間")
    end_time: datetime = Field(..., description="イベントの終了時間")
    location: str = Field(..., description="イベントの開催場所")
    reward: Optional[str] = Field(None, description="イベントの報酬")
    required_qualifications: Optional[List[str]] = Field(None, description="イベント参加に必要な資格")
    max_participants: Optional[int] = Field(None, description="イベントの最大参加人数")
    # current_participants: Optional[int] = Field(None, description="現在の参加人数")
    created_at: datetime = Field(default_factory=datetime.now, description="イベントの作成日時")
    updated_at: datetime = Field(default_factory=datetime.now, description="イベントの更新日時")
    tags: Optional[List[str]] = Field(None, description="イベントに関連するタグ")
    image: Optional[str] = Field(None, description="イベントの画像（Base64エンコードされた文字列）")