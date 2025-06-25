from typing import List, Optional, Dict
import uuid
import base64
import json
from datetime import datetime, timezone
import sqlalchemy.exc
from fastapi import HTTPException
from sqlalchemy.orm import Session

# local imports
from src.schemas.database.applicant import ApplicantCreate
from src.schemas.database.event import EventCreate, EventUpdate
from src.schemas.database.review import ReviewCreate
from src.models import (
  Applicant as ApplicantModel,
  Application as ApplicationModel,
  ApplicationStatusEnum, Event as EventModel,
  EventTypeEnum, Review as ReviewModel,
  User as UserModel, UserTypeEnum
)
from src.schemas.database.application import (
  ApplicationCreate, ApplicationUpdate
)


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

# --- CRUD関数 (リポジトリ層として分離も検討) --- #
def get_event_by_id(db: Session, event_id: uuid.UUID) -> Optional[EventModel]:
    """Get a single event by ID."""
    return db.query(EventModel).filter(EventModel.event_id == event_id).first()


def get_events_func( # エンドポイントと名称が被るので関数名を変更（_funcを付ける）
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
                tags_json = [tag.model_dump() for tag in event_data.tags]
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

    # 新しいユーザーIDを生成
    new_user_id = uuid.uuid4()
    
    # まず users テーブルにユーザーを作成
    db_user = UserModel(
        user_id=new_user_id,
        user_type=UserTypeEnum.APPLICANT,
        user_name=f"{applicant_data.last_name} {applicant_data.first_name}",
        created_at=datetime.now(),
        login_time=None,
        ai_advice=None
    )
    
    db.add(db_user)
    db.flush()  # ユーザーを先にフラッシュしてIDを確定

    # 応募者データを作成
    db_applicant = ApplicantModel(
        user_id=new_user_id,  # 作成したユーザーのIDを使用
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