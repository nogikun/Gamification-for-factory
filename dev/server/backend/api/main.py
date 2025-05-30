import os, sys
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, List, Optional
import uuid
from datetime import datetime
import base64
import json

from sqlalchemy.orm import Session
from sqlalchemy import select, join

# local imports
from src.schema.schema import Event as EventSchema, EventCreate, EventUpdate, DateModel, ApplicationResponse, ApplicationUpdate, ApplicationDetail, ApplicationCreate, ApplicantCreate, Applicant as ApplicantSchema # 追加
from src.models import Event as EventModel, EventTypeEnum, Application as ApplicationModel, Applicant as ApplicantModel, ApplicationStatusEnum # ApplicationModelを追加
from src.database import get_db, Base, get_engine # get_engine をインポート
# from src.demo.generator import EventGenerator # デモジェネレータはDB連携に伴い一旦コメントアウト

# データベーステーブルを作成 (存在しない場合のみ)
Base.metadata.create_all(bind=get_engine())

# パスを追加してsrcディレクトリをインポート可能にする
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
if project_root not in sys.path:
    sys.path.append(project_root)

# --- ヘルパー関数 --- #
def get_event_type_enum(value: str) -> EventTypeEnum:
    """日本語の値からEventTypeEnumを取得する"""
    for enum_member in EventTypeEnum:
        if enum_member.value == value:
            return enum_member
    raise ValueError(f"Invalid event_type value: {value}")

def get_application_status_enum(value: str) -> ApplicationStatusEnum:
    """日本語の値からApplicationStatusEnumを取得する"""
    for enum_member in ApplicationStatusEnum:
        if enum_member.value == value:
            return enum_member
    raise ValueError(f"Invalid application_status value: {value}")

app = FastAPI(
    title="Gamification API",
    description="Gamification for factory API server",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 開発用フロントエンド
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Gamification for factory API"}

@app.get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "healthy"}

# --- CRUD関数 (リポジトリ層として分離も検討) --- #

def get_event(db: Session, event_id: int) -> Optional[EventModel]:
    return db.query(EventModel).filter(EventModel.event_id == event_id).first()

def get_events(db: Session, skip: int = 0, limit: int = 100) -> List[EventModel]:
    return db.query(EventModel).offset(skip).limit(limit).all()

def create_event(db: Session, event_data: EventCreate) -> EventModel:
    image_binary = None
    if event_data.image:
        try:
            # "data:image/png;base64," のようなプレフィックスを除去
            header, encoded = event_data.image.split(",", 1)
            image_binary = base64.b64decode(encoded)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")
    
    tags_json = None
    if event_data.tags:
        try:
            # フロントエンドから来るのは既にJSON文字列のはずだが、念のためオブジェクトなら文字列化
            tags_json = json.loads(event_data.tags) if isinstance(event_data.tags, str) else event_data.tags
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Tags must be a valid JSON string")

    # event_type の処理を修正
    event_type_enum = None
    if event_data.event_type:
        try:
            event_type_enum = get_event_type_enum(event_data.event_type)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    db_event = EventModel(
        company_id=event_data.company_id, # UUIDオブジェクトをそのまま使用
        event_type=event_type_enum, # 修正されたevent_type処理
        title=event_data.title,
        description=event_data.description,
        start_date=event_data.start_date,
        end_date=event_data.end_date,
        location=event_data.location,
        reward=event_data.reward,
        required_qualifications=event_data.required_qualifications,
        available_spots=event_data.available_spots,
        image=image_binary,
        tags=tags_json
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: int, event_data: EventUpdate) -> Optional[EventModel]:
    db_event = get_event(db, event_id)
    if not db_event:
        return None

    update_data = event_data.model_dump(exclude_unset=True)

    if 'image' in update_data and update_data['image']:
        try:
            header, encoded = update_data['image'].split(",", 1)
            update_data['image'] = base64.b64decode(encoded)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format for update: {e}")
    elif 'image' in update_data and update_data['image'] is None: # 明示的に画像を削除する場合
         update_data['image'] = None

    if 'tags' in update_data and update_data['tags']:
        try:
            update_data['tags'] = json.loads(update_data['tags']) if isinstance(update_data['tags'], str) else update_data['tags']
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Tags for update must be a valid JSON string")
    
    # event_type の処理を修正
    if 'event_type' in update_data and update_data['event_type']:
        try:
            update_data['event_type'] = get_event_type_enum(update_data['event_type'])
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    for key, value in update_data.items():
        setattr(db_event, key, value)
    
    db_event.updated_at = datetime.utcnow() # updated_at は手動で更新 (onupdateが効かない場合があるため)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int) -> Optional[EventModel]:
    db_event = get_event(db, event_id)
    if not db_event:
        return None
    db.delete(db_event)
    db.commit()
    return db_event

# 応募一覧を取得する関数
def get_applications(db: Session, skip: int = 0, limit: int = 100) -> List[Dict]:
    # イベント情報と応募者情報を含む応募一覧を取得
    query = (
        db.query(
            ApplicationModel,
            EventModel.title.label("event_title"),
            EventModel.event_type.label("event_type"),
            EventModel.start_date.label("event_start_date"),
            EventModel.end_date.label("event_end_date"),
            ApplicantModel.last_name.label("applicant_last_name"),
            ApplicantModel.first_name.label("applicant_first_name"),
            ApplicantModel.mail_address.label("applicant_mail"),
            ApplicantModel.phone_number.label("applicant_phone")
        )
        .join(EventModel, ApplicationModel.event_id == EventModel.event_id)
        .join(ApplicantModel, ApplicationModel.user_id == ApplicantModel.user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    # 結果をディクショナリのリストに変換
    results = []
    for row in query:
        application = row[0]  # ApplicationModelオブジェクト
        
        # ApplicationDetailモデルに合わせてデータを整形
        application_dict = {
            "application_id": application.application_id,
            "event_id": application.event_id,
            "user_id": application.user_id,
            "status": application.status.value if isinstance(application.status, ApplicationStatusEnum) else application.status,
            "message": application.message,
            "applied_at": application.applied_at,
            "processed_at": application.processed_at,
            "processed_by": application.processed_by,
            "event_title": row.event_title,
            "event_type": row.event_type.value if isinstance(row.event_type, EventTypeEnum) else row.event_type,
            "event_start_date": row.event_start_date,
            "event_end_date": row.event_end_date,
            "applicant_name": f"{row.applicant_last_name} {row.applicant_first_name}",
            "applicant_email": row.applicant_mail,
            "applicant_phone": row.applicant_phone
        }
        results.append(application_dict)
    
    return results

# 応募ステータスを更新する関数
def update_application_status(db: Session, application_id: int, data: ApplicationUpdate) -> Optional[ApplicationModel]:
    application = db.query(ApplicationModel).filter(ApplicationModel.application_id == application_id).first()
    if not application:
        return None
    
    # ステータスをEnumに変換
    try:
        status_enum = get_application_status_enum(data.status)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    application.status = status_enum
    application.processed_at = datetime.utcnow()
    application.processed_by = data.processed_by
    
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

# 応募者を作成する関数
def create_applicant(db: Session, applicant_data: ApplicantCreate) -> ApplicantModel:
    # 生年月日の処理
    birth_date = None
    if isinstance(applicant_data.birth_date, str):
        try:
            birth_date = datetime.fromisoformat(applicant_data.birth_date.replace('Z', '+00:00'))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid birth_date format")
    else:
        birth_date = applicant_data.birth_date
        
    # 応募者データを作成
    db_applicant = ApplicantModel(
        user_id=uuid.uuid4(),  # 明示的にUUIDを生成
        last_name=applicant_data.last_name,
        first_name=applicant_data.first_name,
        mail_address=applicant_data.mail_address,
        phone_number=applicant_data.phone_number,
        address=applicant_data.address,
        birth_date=birth_date,
        license=applicant_data.license
    )
    
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    return db_applicant

# 応募者一覧を取得する関数
def get_applicants(db: Session, skip: int = 0, limit: int = 100) -> List[ApplicantModel]:
    return db.query(ApplicantModel).offset(skip).limit(limit).all()

# 応募を作成する関数
def create_application(db: Session, application_data: ApplicationCreate) -> ApplicationModel:
    # ステータスは未対応（PENDING）に設定
    db_application = ApplicationModel(
        event_id=application_data.event_id,
        user_id=application_data.user_id,
        status=ApplicationStatusEnum.PENDING,
        message=application_data.message,
        applied_at=datetime.utcnow()
    )
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

# --- イベント関連エンドポイント (DB連携版) --- #

@app.post("/event", response_model=EventSchema, status_code=201)
async def create_event_api(event_data: EventCreate, db: Session = Depends(get_db)) -> EventSchema:
    try:
        # デバッグ用: 受信データを出力
        print(f"Received event_data: {event_data}")
        print(f"company_id type: {type(event_data.company_id)}, value: {event_data.company_id}")
        print(f"event_type type: {type(event_data.event_type)}, value: {event_data.event_type}")
        
        created_event = create_event(db=db, event_data=event_data)
        return EventSchema.model_validate(created_event) # Pydantic v2
    except HTTPException as e: # バリデーションエラー等をキャッチ
        raise e
    except Exception as e:
        # ここで詳細なエラーロギングを行うと良い
        print(f"Error creating event: {e}")
        raise HTTPException(status_code=500, detail="Error creating event in database")

@app.get("/event", response_model=List[EventSchema])
async def get_events_api(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> List[EventSchema]:
    db_events = get_events(db, skip=skip, limit=limit)
    return [EventSchema.model_validate(event) for event in db_events]

@app.get("/event/{event_id}", response_model=EventSchema)
async def get_event_api(event_id: int, db: Session = Depends(get_db)) -> EventSchema:
    db_event = get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventSchema.model_validate(db_event)

@app.put("/event/{event_id}", response_model=EventSchema)
async def update_event_api(event_id: int, event_data: EventUpdate, db: Session = Depends(get_db)) -> EventSchema:
    updated_event = update_event(db, event_id=event_id, event_data=event_data)
    if updated_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventSchema.model_validate(updated_event)

@app.delete("/event/{event_id}", status_code=204)
async def delete_event_api(event_id: int, db: Session = Depends(get_db)):
    deleted_event = delete_event(db, event_id=event_id)
    if deleted_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return # No content

# --- 応募関連エンドポイント --- #

@app.get("/applications", response_model=List[ApplicationDetail])
async def get_applications_api(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> List[ApplicationDetail]:
    applications = get_applications(db, skip=skip, limit=limit)
    return [ApplicationDetail.model_validate(app) for app in applications]

@app.put("/applications/{application_id}", response_model=ApplicationResponse)
async def update_application_status_api(application_id: int, application_data: ApplicationUpdate, db: Session = Depends(get_db)) -> ApplicationResponse:
    updated_application = update_application_status(db, application_id=application_id, data=application_data)
    if updated_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationResponse.model_validate(updated_application)

# --- 応募者関連エンドポイント --- #

@app.post("/applicant", response_model=ApplicantSchema, status_code=201)
async def create_applicant_api(applicant_data: ApplicantCreate, db: Session = Depends(get_db)) -> ApplicantSchema:
    try:
        print(f"Received applicant data: {applicant_data}")
        created_applicant = create_applicant(db=db, applicant_data=applicant_data)
        return ApplicantSchema.model_validate(created_applicant)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating applicant: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating applicant: {str(e)}")

@app.get("/applicants", response_model=List[ApplicantSchema])
async def get_applicants_api(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> List[ApplicantSchema]:
    db_applicants = get_applicants(db, skip=skip, limit=limit)
    return [ApplicantSchema.model_validate(applicant) for applicant in db_applicants]

@app.post("/application", response_model=ApplicationResponse, status_code=201)
async def create_application_api(application_data: ApplicationCreate, db: Session = Depends(get_db)) -> ApplicationResponse:
    try:
        print(f"Received application data: {application_data}")
        created_application = create_application(db=db, application_data=application_data)
        return ApplicationResponse.model_validate(created_application)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating application: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating application: {str(e)}")

# --- デモ用エンドポイント (既存) --- #
# @app.post("/demo/get-events")
# async def get_demo_event(target_date: DateModel, db: Session = Depends(get_db)) -> List[EventSchema]:
#     print(f"Demo event request for date: {target_date.target_date}")
    # ここでデモデータをDBに投入するか、既存のDBデータを利用するか検討
    # return [] # 一旦空を返す

# スクリプトとして直接実行された場合、Uvicornサーバーを起動
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )