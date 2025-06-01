"""
Main FastAPI application for Gamification API.
"""
import base64
import os
import sys
import json
import uuid
import sqlalchemy
from datetime import datetime, timezone
from typing import Dict, List, Optional

from fastapi import Depends, FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import uvicorn

# local imports
from src.database import Base, get_db, get_engine, reset_reviews_table
from src.schemas.database.applicant import ApplicantCreate, Applicant as ApplicantSchema
from src.schemas.database.event import Event as EventSchema, EventCreate, EventUpdate
from src.schemas.database.review import Review as ReviewSchema, ReviewCreate, ReviewDetail
from src.schemas.api.base import DateModel
from src.demo.generator import EventGenerator
from src.classes.db_connector import DBConnector
from src.models import (
    Applicant as ApplicantModel,
    Application as ApplicationModel,
    ApplicationStatusEnum, Event as EventModel,
    EventTypeEnum, Review as ReviewModel
)
from src.schemas.database.application import (
    ApplicationCreate, ApplicationDetail, ApplicationResponse, ApplicationUpdate
)
# reviewsテーブルをリセット
reset_reviews_table()

# データベーステーブルを作成 (存在しない場合のみ)
Base.metadata.create_all(bind=get_engine())

load_dotenv()  # .envファイルから環境変数を読み込む

# --- データベース設定 ---
# PostgreSQL 接続文字列。必要に応じて 'your_user', 'your_password', 'your_host', 'your_port', 'your_database' を置き換えてください。

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
sys.path.append(current_dir)  # 現在のディレクトリをパスに追加


app = FastAPI(
    title="Gamification API",
    description="Gamification for factory API server",
    version="0.1.0"
)

# API Router with prefix
api_router = APIRouter(prefix="/api")

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> Dict[str, str]:
    """Root endpoint."""
    return {"message": "Gamification for factory API"}


@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


# --- CRUD関数 (リポジトリ層として分離も検討) --- #
def get_event_by_id(db: Session, event_id: uuid.UUID) -> Optional[EventModel]:
    """Get a single event by ID."""
    return db.query(EventModel).filter(EventModel.event_id == event_id).first()


def get_events(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[EventModel]:
    """Get a list of events."""
    return db.query(EventModel).offset(skip).limit(limit).all()


def create_event(db: Session, event_data: EventCreate) -> EventModel:
    """Create a new event."""
    # 最初にcompany_idが有効かどうかチェック
    from sqlalchemy import text
    try:
        # companyテーブルにcompany_idが存在するか確認
        company_exists = db.execute(
            text("SELECT 1 FROM company WHERE user_id = :company_id"),
            {"company_id": event_data.company_id}
        ).fetchone()
        if not company_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Company ID {event_data.company_id} does not exist"
            )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error validating company_id: {e}"
        ) from e
            
    image_binary = None
    if event_data.image:
        try:
            # "data:image/png;base64," のようなプレフィックスを除去
            _, encoded = event_data.image.split(",", 1)
            image_binary = base64.b64decode(encoded)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image format: {e}"
            ) from e

    tags_json = None
    if event_data.tags:
        try:
            # フロントエンドから来るのは既にJSON文字列のはずだが、
            # 念のためオブジェクトなら文字列化
            if isinstance(event_data.tags, str):
                tags_json = json.loads(event_data.tags)
            else:
                tags_json = event_data.tags
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=400,
                detail="Tags must be a valid JSON string"
            ) from e

    # event_type の処理を修正
    event_type_enum = None
    if event_data.event_type:
        try:
            event_type_enum = get_event_type_enum(event_data.event_type)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    db_event = EventModel(
        company_id=event_data.company_id,  # UUIDオブジェクトをそのまま使用
        event_type=event_type_enum,  # 修正されたevent_type処理
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
    
    try:
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        return db_event
    except sqlalchemy.exc.IntegrityError as e:
        db.rollback()
        # 外部キー制約違反など、整合性エラーの場合
        raise HTTPException(
            status_code=400,
            detail=f"Database integrity error: {e}. Make sure company_id is valid."
        ) from e
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create event: {e}"
        ) from e


def update_event(
    db: Session,
    event_id: uuid.UUID,
    event_data: EventUpdate
) -> Optional[EventModel]:
    """Update an existing event."""
    db_event = get_event_by_id(db, event_id)
    if not db_event:
        return None

    update_data = event_data.model_dump(exclude_unset=True)

    if 'image' in update_data and update_data['image']:
        try:
            _, encoded = update_data['image'].split(",", 1)
            update_data['image'] = base64.b64decode(encoded)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image format for update: {e}"
            ) from e
    elif 'image' in update_data and update_data['image'] is None:
        # 明示的に画像を削除する場合
        update_data['image'] = None

    if 'tags' in update_data and update_data['tags']:
        try:
            if isinstance(update_data['tags'], str):
                update_data['tags'] = json.loads(update_data['tags'])
            else:
                update_data['tags'] = update_data['tags']
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=400,
                detail="Tags for update must be a valid JSON string"
            ) from e

    # event_type の処理を修正
    if 'event_type' in update_data and update_data['event_type']:
        try:
            update_data['event_type'] = get_event_type_enum(
                update_data['event_type']
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    for key, value in update_data.items():
        setattr(db_event, key, value)

    # updated_at は手動で更新 (onupdateが効かない場合があるため)
    db_event.updated_at = datetime.now(timezone.utc)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: uuid.UUID) -> Optional[EventModel]:
    """Delete an event."""
    db_event = get_event_by_id(db, event_id)
    if not db_event:
        return None
    db.delete(db_event)
    db.commit()
    return db_event


# 応募一覧を取得する関数
def get_applications(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[Dict]:
    """Get a list of applications with event and applicant details."""
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
        .join(ApplicantModel,
              ApplicationModel.user_id == ApplicantModel.user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    # 結果をディクショナリのリストに変換
    results = []
    for row in query:
        application = row[0]  # ApplicationModelオブジェクト

        # ApplicationDetailモデルに合わせてデータを整形
        status_value = application.status
        if isinstance(application.status, ApplicationStatusEnum):
            status_value = application.status.value

        event_type_value = row.event_type
        if isinstance(row.event_type, EventTypeEnum):
            event_type_value = row.event_type.value

        application_dict = {
            "application_id": application.application_id,
            "event_id": application.event_id,
            "user_id": application.user_id,
            "status": status_value,
            "message": application.message,
            "applied_at": application.applied_at,
            "processed_at": application.processed_at,
            "processed_by": application.processed_by,
            "event_title": row.event_title,
            "event_type": event_type_value,
            "event_start_date": row.event_start_date,
            "event_end_date": row.event_end_date,
            "applicant_name":
                f"{row.applicant_last_name} {row.applicant_first_name}",
            "applicant_email": row.applicant_mail,
            "applicant_phone": row.applicant_phone
        }
        results.append(application_dict)

    return results


# 応募ステータスを更新する関数
def update_application_status(
    db: Session,
    application_id: uuid.UUID,
    data: ApplicationUpdate
) -> Optional[ApplicationModel]:
    """Update the status of an application."""
    application = (
        db.query(ApplicationModel)
        .filter(ApplicationModel.application_id == application_id)
        .first()
    )
    if not application:
        return None

    # ステータスをEnumに変換
    try:
        status_enum = get_application_status_enum(data.status)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    application.status = status_enum
    application.processed_at = datetime.now(timezone.utc)
    application.processed_by = data.processed_by

    db.add(application)
    db.commit()
    db.refresh(application)
    return application


# 応募者を作成する関数
def create_applicant(
    db: Session,
    applicant_data: ApplicantCreate
) -> ApplicantModel:
    """Create a new applicant."""
    # 生年月日の処理
    birth_date = None
    if isinstance(applicant_data.birth_date, str):
        try:
            birth_date = datetime.fromisoformat(
                applicant_data.birth_date.replace('Z', '+00:00')
            )
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail="Invalid birth_date format"
            ) from e
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
def get_applicants(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[ApplicantModel]:
    """Get a list of applicants."""
    return db.query(ApplicantModel).offset(skip).limit(limit).all()


# 応募を作成する関数
def create_application(
    db: Session,
    application_data: ApplicationCreate
) -> ApplicationModel:
    """Create a new application."""
    # ステータスは未対応（PENDING）に設定
    db_application = ApplicationModel(
        event_id=application_data.event_id,
        user_id=application_data.user_id,
        status=ApplicationStatusEnum.PENDING,
        message=application_data.message,
        applied_at=datetime.now(timezone.utc)
    )

    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


# レビューを作成する関数
def create_review(db: Session, review_data: ReviewCreate) -> ReviewModel:
    """Create a new review."""
    # 応募が存在するか確認
    application = (
        db.query(ApplicationModel)
        .filter(ApplicationModel.application_id == review_data.application_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="指定された応募が見つかりません")

    # レビューを作成
    db_review = ReviewModel(
        application_id=review_data.application_id,
        reviewer_id=review_data.reviewer_id,
        rating=review_data.rating,
        comment=review_data.comment
    )

    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


# レビュー一覧を取得する関数
def get_reviews(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[Dict]:
    """Get a list of reviews with application, event, and applicant details."""
    # レビュー、応募情報、イベント情報、応募者情報を結合して取得
    query = (
        db.query(
            ReviewModel,
            ApplicationModel.application_id,
            EventModel.title.label("event_title"),
            ApplicantModel.last_name.label("applicant_last_name"),
            ApplicantModel.first_name.label("applicant_first_name")
        )
        .join(
            ApplicationModel,
            ReviewModel.application_id == ApplicationModel.application_id)
        .join(EventModel, ApplicationModel.event_id == EventModel.event_id)
        .join(
            ApplicantModel,
            ApplicationModel.user_id == ApplicantModel.user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    # 結果をディクショナリのリストに変換
    results = []
    for row in query:
        review = row[0]  # ReviewModelオブジェクト

        # ReviewDetailモデルに合わせてデータを整形
        review_dict = {
            "review_id": review.review_id,
            "application_id": review.application_id,
            "reviewer_id": review.reviewer_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "updated_at": review.updated_at,
            "event_title": row.event_title,
            "applicant_name":
                f"{row.applicant_last_name} {row.applicant_first_name}"
        }
        results.append(review_dict)

    return results


# 応募者を更新する関数
def update_applicant(
    db: Session,
    user_id: uuid.UUID,
    applicant_data: ApplicantCreate
) -> Optional[ApplicantModel]:
    """Update an existing applicant."""
    # 既存のユーザーを取得
    applicant = (
        db.query(ApplicantModel)
        .filter(ApplicantModel.user_id == user_id)
        .first()
    )
    if not applicant:
        return None

    # 更新対象のフィールドを設定
    for key, value in applicant_data.model_dump(exclude_unset=True).items():
        setattr(applicant, key, value)

    # 更新日時を更新
    applicant.updated_at = datetime.now(timezone.utc)

    db.add(applicant)
    db.commit()
    db.refresh(applicant)
    return applicant


# 応募者を削除する関数
def delete_applicant(db: Session, user_id: uuid.UUID) -> bool:
    """Delete an applicant."""
    applicant = (
        db.query(ApplicantModel)
        .filter(ApplicantModel.user_id == user_id)
        .first()
    )
    if not applicant:
        return False

    db.delete(applicant)
    db.commit()
    return True


# 応募を更新する関数
def update_application(
    db: Session,
    application_id: uuid.UUID,
    application_data: ApplicationCreate
) -> Optional[ApplicationModel]:
    """Update an existing application."""
    # 既存の応募を取得
    application = (
        db.query(ApplicationModel)
        .filter(ApplicationModel.application_id == application_id)
        .first()
    )
    if not application:
        return None

    # 更新対象のフィールドを設定
    for key, value in application_data.model_dump(exclude_unset=True).items():
        setattr(application, key, value)

    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def delete_application(db: Session, application_id: uuid.UUID) -> bool:
    """Delete an application."""
    application = (
        db.query(ApplicationModel)
        .filter(ApplicationModel.application_id == application_id)
        .first()
    )
    if not application:
        return False

    db.delete(application)
    db.commit()
    return True


# レビューを更新する関数
def update_review(
    db: Session,
    review_id: uuid.UUID,
    review_data: ReviewCreate
) -> Optional[ReviewModel]:
    """Update an existing review."""
    # 既存のレビューを取得
    review = (
        db.query(ReviewModel)
        .filter(ReviewModel.review_id == review_id)
        .first()
    )
    if not review:
        return None

    # 更新対象のフィールドを設定
    for key, value in review_data.model_dump(exclude_unset=True).items():
        setattr(review, key, value)

    # 更新日時を更新
    review.updated_at = datetime.now(timezone.utc)

    db.add(review)
    db.commit()
    db.refresh(review)
    return review


# レビューを削除する関数
def delete_review(db: Session, review_id: uuid.UUID) -> bool:
    """Delete a review."""
    review = (
        db.query(ReviewModel)
        .filter(ReviewModel.review_id == review_id)
        .first()
    )
    if not review:
        return False

    db.delete(review)
    db.commit()
    return True


# --- イベント関連エンドポイント (DB連携版) --- #
@app.post("/event", response_model=EventSchema, status_code=201)
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


@app.get("/event", response_model=List[EventSchema])
async def get_events_api(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[EventSchema]:
    """API endpoint to get a list of events."""
    db_events = get_events(db, skip=skip, limit=limit)
    return [EventSchema.model_validate(event) for event in db_events]


@app.get("/event/{event_id}", response_model=EventSchema)
async def get_event_api(
    event_id: uuid.UUID,
    db: Session = Depends(get_db)
) -> EventSchema:
    """API endpoint to get a single event by ID."""
    db_event = get_event_by_id(db, event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventSchema.model_validate(db_event)


@app.put("/event/{event_id}", response_model=EventSchema)
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


@app.delete("/event/{event_id}", status_code=204)
async def delete_event_api(event_id: uuid.UUID, db: Session = Depends(get_db)):
    """API endpoint to delete an event."""
    deleted_event = delete_event(db, event_id)
    if deleted_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return  # No content


# --- 応募関連エンドポイント --- #
@app.get("/applications", response_model=List[ApplicationDetail])
async def get_applications_api(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ApplicationDetail]:
    """API endpoint to get a list of applications."""
    applications = get_applications(db, skip=skip, limit=limit)
    return [ApplicationDetail.model_validate(app) for app in applications]


@app.put("/applications/{application_id}", response_model=ApplicationResponse)
async def update_application_status_api(
    application_id: uuid.UUID,
    application_data: ApplicationUpdate,
    db: Session = Depends(get_db)
) -> ApplicationResponse:
    """API endpoint to update an application's status."""
    updated_application = update_application_status(
        db,
        application_id=application_id,
        data=application_data
    )
    if updated_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationResponse.model_validate(updated_application)


# --- 応募者関連エンドポイント --- #
@app.post("/applicant", response_model=ApplicantSchema, status_code=201)
async def create_applicant_api(
    applicant_data: ApplicantCreate,
    db: Session = Depends(get_db)
) -> ApplicantSchema:
    """API endpoint to create an applicant."""
    try:
        print(f"Received applicant data: {applicant_data}")
        created_applicant = create_applicant(
            db=db,
            applicant_data=applicant_data
        )
        return ApplicantSchema.model_validate(created_applicant)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating applicant: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating applicant: {str(e)}"
        ) from e


@app.get("/applicants", response_model=List[ApplicantSchema])
async def get_applicants_api(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ApplicantSchema]:
    """API endpoint to get a list of applicants."""
    db_applicants = get_applicants(db, skip=skip, limit=limit)
    return [ApplicantSchema.model_validate(applicant)
            for applicant in db_applicants]

# プレフィックス付きユーザーAPI routes
@api_router.get("/users", response_model=List[ApplicantSchema])
async def get_api_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ApplicantSchema]:
    """API endpoint to get a list of users with API prefix."""
    return await get_applicants_api(skip=skip, limit=limit, db=db)


@app.post("/application", response_model=ApplicationResponse, status_code=201)
async def create_application_api(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db)
) -> ApplicationResponse:
    """API endpoint to create an application."""
    try:
        print(f"Received application data: {application_data}")
        created_application = create_application(
            db=db,
            application_data=application_data
        )
        return ApplicationResponse.model_validate(created_application)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating application: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating application: {str(e)}"
        ) from e


# --- レビュー関連エンドポイント --- #
@app.post("/review", response_model=ReviewSchema, status_code=201)
async def create_review_api(
    review_data: ReviewCreate,
    db: Session = Depends(get_db)
) -> ReviewSchema:
    """API endpoint to create a review."""
    try:
        print(f"Received review data: {review_data}")
        created_review = create_review(db=db, review_data=review_data)
        return ReviewSchema.model_validate(created_review)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating review: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating review: {str(e)}"
        ) from e


@app.get("/reviews", response_model=List[ReviewDetail])
async def get_reviews_api(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ReviewDetail]:
    """API endpoint to get a list of reviews."""
    reviews = get_reviews(db, skip=skip, limit=limit)
    return [ReviewDetail.model_validate(review) for review in reviews]

# プレフィックス付きAPI routes
@api_router.get("/reviews", response_model=List[ReviewDetail])
async def get_api_reviews(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ReviewDetail]:
    """API endpoint to get a list of reviews with API prefix."""
    return await get_reviews_api(skip=skip, limit=limit, db=db)


@app.put("/applicant/{user_id}", response_model=ApplicantSchema)
async def update_applicant_api(
    user_id: uuid.UUID,
    applicant_data: ApplicantCreate,
    db: Session = Depends(get_db)
) -> ApplicantSchema:
    """API endpoint to update an applicant."""
    updated_applicant = update_applicant(
        db,
        user_id=user_id,
        applicant_data=applicant_data
    )
    if updated_applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return ApplicantSchema.model_validate(updated_applicant)


@app.delete("/applicant/{user_id}", status_code=204)
async def delete_applicant_api(
    user_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """API endpoint to delete an applicant."""
    success = delete_applicant(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return


@app.put("/application/{application_id}", response_model=ApplicationResponse)
async def update_application_api(
    application_id: uuid.UUID,
    application_data: ApplicationCreate,
    db: Session = Depends(get_db)
) -> ApplicationResponse:
    """API endpoint to update an application."""
    updated_application = update_application(
        db,
        application_id=application_id,
        application_data=application_data
    )
    if updated_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationResponse.model_validate(updated_application)


@app.delete("/application/{application_id}", status_code=204)
async def delete_application_api(
    application_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """API endpoint to delete an application."""
    success = delete_application(db, application_id=application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    return


@app.put("/review/{review_id}", response_model=ReviewSchema)
async def update_review_api(
    review_id: uuid.UUID,
    review_data: ReviewCreate,
    db: Session = Depends(get_db)
) -> ReviewSchema:
    """API endpoint to update a review."""
    updated_review = update_review(
        db,
        review_id=review_id,
        review_data=review_data
    )
    if updated_review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return ReviewSchema.model_validate(updated_review)


@app.delete("/review/{review_id}", status_code=204)
async def delete_review_api(
    review_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """API endpoint to delete a review."""
    success = delete_review(db, review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found")
    return


@app.post("/demo/get-events")
async def demo_get_event(target_date: DateModel) -> List[EventSchema]:
    """
    デモ用イベント取得エンドポイント - 指定された日付のイベントリストを返します
    """
    event_generator = EventGenerator()
    generate_event_data = event_generator.generate_event_data_list(target_date)
    if not generate_event_data:
        raise HTTPException(status_code=404, detail="Events not found")
    return generate_event_data

@app.post("/get-events")
async def get_event(target_date: DateModel) -> List[EventSchema]:
    """
    イベント取得エンドポイント - 指定された日付のイベントリストをデータベースから取得します
    """
    database_url = os.getenv("DATABASE_URL")
    db_connector = DBConnector(
        db_url = database_url,  # 環境変数からデータベースURLを取得
        debug = False           # デバッグモードを有効にする
    )

    search_date = target_date.target_date
    try:
        # データベースから指定された日付のイベントを取得
        events = db_connector.select_events_by_date(search_date)
        if not events:
            # イベントが見つからない場合は空のリストを返す
            return []

    except Exception as e:
        print(f"データベースからイベントを取得中にエラーが発生しました: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error") from e

    # イベントデータをPydanticモデルに変換
    event_list = []
    for event in events:
        # tagsをJSON文字列からリストに変換
        if isinstance(event.tags, str) and event.tags:
            try:
                tags = json.loads(event.tags)
            except json.JSONDecodeError:
                # JSONでない場合はカンマで分割してリスト化を試みる
                tags = [t.strip() for t in event.tags.split(',') if t.strip()]
        else:
            tags = event.tags or []

        # データ型を適切に変換してEventSchemaオブジェクトを作成
        event_data = EventSchema(
            event_id=str(event.event_id),  # 整数を文字列に変換
            company_id=str(event.company_id),  # UUIDを文字列に変換
            event_type=event.event_type,
            title=event.title,
            description=event.description,
            start_date=event.start_date,
            end_date=event.end_date,
            location=event.location,
            reward=event.reward,
            required_qualifications=event.required_qualifications,
            available_spots=event.available_spots,
            created_at=event.created_at,
            updated_at=event.updated_at,
            tags=json.dumps(tags) if tags else None,  # リストをJSON文字列に変換
            image=event.image if hasattr(event, 'image') else None # 画像が存在しない場合はNoneを設定
        )
        event_list.append(event_data)

    return event_list


# APIルーターをアプリケーションに追加
app.include_router(api_router)


# スクリプトとして直接実行された場合、Uvicornサーバーを起動
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
