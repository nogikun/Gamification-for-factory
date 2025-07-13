from fastapi import Depends, FastAPI, HTTPException, APIRouter, Request

from typing import List, Optional
import base64
import json
import uuid
from src.database import get_db
from sqlalchemy.orm import Session
from src.schemas.database.event import Event as EventSchema, EventCreate, EventUpdate

from src.crud import (
    get_events_func,
    create_event,
    update_event,
    delete_event,
    get_event_by_id
)

# Routerを作成
router = APIRouter()

# --- イベント関連エンドポイント (DB連携版) --- #
@router.get("/event", response_model=List[EventSchema])
async def get_events_api(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[EventSchema]:
    """API endpoint to get a list of events."""
    db_events = get_events_func(db, skip=skip, limit=limit)
    return [EventSchema.model_validate(event) for event in db_events]


@router.post("/event", response_model=EventSchema, status_code=201)
async def create_event_api(
    event_data: EventCreate,
    db: Session = Depends(get_db)
) -> EventSchema:
    """API endpoint to create an event."""
    try:
        # デバッグ用: 受信データを出力
        print(f"Received event_data: {event_data}")
        print(
            f"company_id type: {type(event_data.company_id)}, "
            f"value: {event_data.company_id}")
        print(
            f"event_type type: {type(event_data.event_type)}, "
            f"value: {event_data.event_type}")

        created_event = create_event(db=db, event_data=event_data)
        return EventSchema.model_validate(created_event)  # Pydantic v2
    except HTTPException as e:  # バリデーションエラー等をキャッチ
        raise e
    except Exception as e:
        # ここで詳細なエラーロギングを行うと良い
        print(f"Error creating event: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error creating event in database"
        ) from e

@router.put("/event/{event_id}", response_model=EventSchema)
async def update_event_api(
    event_id: uuid.UUID,
    event_data: EventUpdate,
    db: Session = Depends(get_db)
) -> EventSchema:
    """API endpoint to update an event."""
    updated_event = update_event(db, event_id, event_data)
    if updated_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventSchema.model_validate(updated_event)


@router.delete("/event/{event_id}", status_code=204)
async def delete_event_api(event_id: uuid.UUID, db: Session = Depends(get_db)):
    """API endpoint to delete an event."""
    deleted_event = delete_event(db, event_id)
    if deleted_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return  # No content


@router.get("/event/{event_id}", response_model=EventSchema)
async def get_event_api(
    event_id: uuid.UUID,
    db: Session = Depends(get_db)
) -> EventSchema:
    db_event = get_event_by_id(db, event_id) # get_event_by_id はこのファイルの上部で定義されている想定
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    # --- データ変換処理 ---
    # tags: get_events と同様に、DBから取得した値をリストに変換後、JSON文字列にする
    tags_list: List[str] = []
    if isinstance(db_event.tags, str) and db_event.tags:
        try:
            # DBにJSON文字列として保存されている場合
            parsed_json_tags = json.loads(db_event.tags)
            if isinstance(parsed_json_tags, list):
                tags_list = [str(tag) for tag in parsed_json_tags]
            else: # JSONだがリストではない場合、単一要素のリストとして扱う
                tags_list = [str(parsed_json_tags)]
        except json.JSONDecodeError:
            # JSONでなければカンマ区切り文字列と仮定
            tags_list = [t.strip() for t in db_event.tags.split(',') if t.strip()]
    elif isinstance(db_event.tags, list): # DBがPythonリストを返す場合
        tags_list = [str(t) for t in db_event.tags]
    
    tags_for_schema = json.dumps(tags_list) if tags_list else None

    # image: バイト列ならBase64エンコード、文字列ならそのまま
    image_str: Optional[str] = None
    if hasattr(db_event, 'image') and db_event.image:
        if isinstance(db_event.image, bytes):
            image_str = base64.b64encode(db_event.image).decode('utf-8')
        elif isinstance(db_event.image, str):
            image_str = db_event.image

    # event_type: Enumの場合は .value を使用
    event_type_value = db_event.event_type
    if hasattr(db_event.event_type, 'value'):
        event_type_value = db_event.event_type.value

    # required_qualifications: EventSchemaがリストを期待する場合、文字列からリストに変換
    # get_eventsでは特に変換していないため、EventSchemaの定義に依存。
    # ここではフロントエンドの期待に合わせてリストに変換することを試みる。
    # EventSchema.required_qualifications が List[str] であると仮定。
    required_qualifications_list: List[str] = []
    if isinstance(db_event.required_qualifications, str):
        required_qualifications_list = [q.strip() for q in db_event.required_qualifications.split(',') if q.strip()]
    elif isinstance(db_event.required_qualifications, list):
        required_qualifications_list = [str(q) for q in db_event.required_qualifications]
    elif db_event.required_qualifications is None:
        required_qualifications_list = []


    # EventSchema に渡すペイロードを作成
    event_payload = {
        "event_id": db_event.event_id,
        "company_id": db_event.company_id,
        "event_type": event_type_value,
        "title": db_event.title,
        "description": db_event.description,
        "start_date": db_event.start_date,
        "end_date": db_event.end_date,
        "location": db_event.location,
        "reward": db_event.reward,
        "required_qualifications": required_qualifications_list, # リストとして渡す
        "available_spots": db_event.available_spots,
        "created_at": db_event.created_at,
        "updated_at": db_event.updated_at,
        "tags": tags_for_schema, # JSON文字列として渡す (get_eventsに合わせる)
        "image": image_str,
    }

    try:
        # Pydanticモデルのバリデーションとインスタンス化
        return EventSchema.model_validate(event_payload)
    except Exception as e:
        # エラーログを出力してデバッグしやすくする
        print(f"Error during EventSchema validation for event_id {event_id}: {str(e)}")
        print(f"Payload provided for validation: {event_payload}")
        raise HTTPException(status_code=500, detail=f"Internal server error during event data processing: {str(e)}")