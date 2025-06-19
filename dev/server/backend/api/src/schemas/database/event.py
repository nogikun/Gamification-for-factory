"""
Event-related Pydantic schemas for FastAPI
"""
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, Any, List, Union
from datetime import datetime
import base64
import json
import uuid
from src.models import EventTypeEnum


class TagData(BaseModel):
    """タグデータを表すモデル"""
    color: str
    label: str


class EventBase(BaseModel):
    """Base event model with common fields"""
    company_id: uuid.UUID
    event_type: str  # EventTypeEnumの値を文字列として扱う
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    location: Optional[str] = None
    reward: Optional[str] = None
    required_qualifications: Optional[List[str]] = Field(default_factory=list)  # 変更
    available_spots: Optional[int] = None
    tags: Optional[Union[str, List[TagData]]] = Field(None, description="イベントに関連するタグ (JSON文字列またはTagDataのリスト)")
    image: Optional[str] = Field(None, description="イベントの画像（Base64エンコードされた文字列）")
    
    @field_validator('tags')
    def validate_tags_json(cls, v):
        if v is None: 
            return v
        # リストの場合はそのまま通す
        if isinstance(v, list):
            return v
        # 文字列の場合はJSONバリデーションを行う
        if isinstance(v, str):
            try:
                json.loads(v)
            except json.JSONDecodeError:
                raise ValueError('tags must be a valid JSON string')
        return v


class EventCreate(EventBase):
    """
    イベント作成モデル
    """
    pass


class EventUpdate(BaseModel):
    """
    イベント更新モデル - すべてのフィールドをオプショナルにする
    """
    company_id: Optional[uuid.UUID] = None
    event_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    reward: Optional[str] = None
    required_qualifications: Optional[List[str]] = None
    available_spots: Optional[int] = None
    tags: Optional[Union[str, List[TagData]]] = None
    image: Optional[str] = None

    @field_validator('tags')
    def validate_tags_json(cls, v):
        if v is None: 
            return v
        # リストの場合はそのまま通す
        if isinstance(v, list):
            return v
        # 文字列の場合はJSONバリデーションを行う
        if isinstance(v, str):
            try:
                json.loads(v)
            except json.JSONDecodeError:
                raise ValueError('tags must be a valid JSON string')
        return v


class Event(EventBase):
    """
    イベント応答モデル
    """
    event_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    @model_validator(mode='before')
    @classmethod
    def convert_sqlalchemy_event(cls, data: Any) -> Any:
        if hasattr(data, '_sa_instance_state'):  # SQLAlchemyのモデルインスタンスかチェック
            # event_type を文字列に変換
            if isinstance(data.event_type, EventTypeEnum):
                data.event_type = data.event_type.value
            # image (LargeBinary) をBase64文字列に変換
            if data.image is not None:
                data.image = base64.b64encode(data.image).decode('utf-8')
            else:
                data.image = None  # 明示的にNoneを設定
            # tags (JSON) は既にJSON文字列として扱われる想定なので、DBから取得したまま（Pythonのdict/list）なら文字列化する
            if data.tags is not None and not isinstance(data.tags, str):
                data.tags = json.dumps(data.tags, ensure_ascii=False)
            
            # required_qualifications を文字列からリストに変換
            if isinstance(data.required_qualifications, str):
                # 空文字列の場合は空のリスト、そうでなければカンマで分割
                if data.required_qualifications.strip() == "":
                    data.required_qualifications = []
                else:
                    data.required_qualifications = [q.strip() for q in data.required_qualifications.split(',') if q.strip()]
            elif data.required_qualifications is None: # Noneの場合は空のリストに
                data.required_qualifications = []
            # 既にリストの場合は何もしない

        return data
