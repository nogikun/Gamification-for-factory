from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import base64
import json
import uuid
from ..models import EventTypeEnum # 修正: ..models (親ディレクトリのmodels)

class DateModel(BaseModel):
    """
    日付モデル - 日付を表現するための基本モデル
    """
    target_date: date = Field(..., description="検索対象日")

class EventBase(BaseModel):
    company_id: uuid.UUID # UUIDオブジェクトを受け入れるように変更
    event_type: str # EventTypeEnumの値を文字列として扱う
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    location: Optional[str] = None
    reward: Optional[str] = None
    required_qualifications: Optional[str] = None
    available_spots: Optional[int] = None
    tags: Optional[str] = Field(None, description="イベントに関連するタグ (JSON文字列)")
    image: Optional[str] = Field(None, description="イベントの画像（Base64エンコードされた文字列）")

    @field_validator('tags')
    def validate_tags_json(cls, v):
        if v is None: return v
        try:
            json.loads(v)
        except json.JSONDecodeError:
            raise ValueError('tags must be a valid JSON string')
        return v

class EventCreate(EventBase):
    """
    イベント作成・更新モデル
    """
    pass

class EventUpdate(EventBase):
    # 更新時は一部のフィールドのみ許可する場合など、別途定義も可能
    # 今回はEventBaseと同じとする
    company_id: Optional[uuid.UUID] = None # UUID型に変更
    event_type: Optional[str] = None
    title: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    # 他のフィールドも同様にOptionalにするか検討

class Event(EventBase):
    event_id: int # DBの event_id (Integer) に対応
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # SQLAlchemyモデルからの変換を許可

    @model_validator(mode='before')
    @classmethod
    def convert_sqlalchemy_event(cls, data: Any) -> Any:
        if hasattr(data, '_sa_instance_state'): # SQLAlchemyのモデルインスタンスかチェック
            # event_type を文字列に変換
            if isinstance(data.event_type, EventTypeEnum):
                data.event_type = data.event_type.value
            # image (LargeBinary) をBase64文字列に変換
            if data.image is not None:
                data.image = base64.b64encode(data.image).decode('utf-8')
            else:
                data.image = None # 明示的にNoneを設定
            # tags (JSON) は既にJSON文字列として扱われる想定なので、DBから取得したまま（Pythonのdict/list）なら文字列化する
            if data.tags is not None and not isinstance(data.tags, str):
                 data.tags = json.dumps(data.tags, ensure_ascii=False)

        return data