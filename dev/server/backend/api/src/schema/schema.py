from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import base64
import json
import uuid
from ..models import EventTypeEnum, ApplicationStatusEnum, ReviewStatusEnum # ReviewStatusEnumを追加

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
    event_id: uuid.UUID # UUIDに変更
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

# 応募者モデル
class ApplicantBase(BaseModel):
    last_name: str
    first_name: str
    mail_address: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    birth_date: Optional[datetime] = None
    license: Optional[str] = None

class ApplicantCreate(ApplicantBase):
    pass

class ApplicantUpdate(ApplicantBase):
    last_name: Optional[str] = None
    first_name: Optional[str] = None

class Applicant(ApplicantBase):
    user_id: uuid.UUID
    updated_at: datetime

    class Config:
        from_attributes = True

# 応募モデル
class ApplicationBase(BaseModel):
    event_id: uuid.UUID  # UUIDに変更
    user_id: uuid.UUID
    message: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: str
    processed_by: Optional[uuid.UUID] = None

class ApplicationResponse(ApplicationBase):
    application_id: uuid.UUID  # UUIDに変更
    status: str
    applied_at: datetime
    processed_at: Optional[datetime] = None
    processed_by: Optional[uuid.UUID] = None

    class Config:
        from_attributes = True

    @model_validator(mode='before')
    @classmethod
    def convert_sqlalchemy_application(cls, data: Any) -> Any:
        if hasattr(data, '_sa_instance_state'):
            # ステータスを文字列に変換
            if isinstance(data.status, ApplicationStatusEnum):
                data.status = data.status.value
        return data

# 応募者一覧用の拡張モデル（応募情報とイベント情報、応募者情報を含む）
class ApplicationDetail(ApplicationResponse):
    event_title: Optional[str] = None
    event_type: Optional[str] = None
    event_start_date: Optional[datetime] = None
    event_end_date: Optional[datetime] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    applicant_phone: Optional[str] = None

# レビューモデル
class ReviewBase(BaseModel):
    application_id: uuid.UUID  # UUIDに変更
    reviewer_id: uuid.UUID
    rating: float
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[float] = None
    comment: Optional[str] = None

class Review(ReviewBase):
    review_id: int  # このままでOK（ReviewはSerialタイプのまま）
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# レビュー詳細モデル（関連情報を含む）
class ReviewDetail(Review):
    event_title: Optional[str] = None
    applicant_name: Optional[str] = None