from sqlalchemy import Column, Integer, String, DateTime, Text, Enum as SAEnum, ForeignKey, JSON, LargeBinary, UUID, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
from datetime import datetime
import enum
import uuid  # Pythonのuuidモジュールをインポート

# 0_init.sql の user_type_enum ENUM に対応
class UserTypeEnum(enum.Enum):
    APPLICANT = "参加者"
    COMPANY = "企業"

# 0_init.sql の event_type ENUM に対応
class EventTypeEnum(enum.Enum):
    INTERNSHIP = "インターンシップ"
    SEMINAR = "説明会"

# 0_init.sql の application_status ENUM に対応
class ApplicationStatusEnum(enum.Enum):
    PENDING = "未対応"
    APPROVED = "承認"
    REJECTED = "否認"

# 0_init.sql の participants_status ENUM に対応
class ParticipantStatusEnum(enum.Enum):
    PENDING = "申請中"
    ACTIVE = "参加中"
    COMPLETED = "終了"

# レビューステータスEnum
class ReviewStatusEnum(enum.Enum):
    REQUESTED = "依頼中"
    COMPLETED = "完了"

class Event(Base):
    __tablename__ = "events"

    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    # company_id = Column(UUID(as_uuid=True), ForeignKey("company.user_id"), nullable=False) # companyテーブルとの連携は後で検討
    company_id = Column(UUID(as_uuid=True), nullable=False) # まずは company_id をUUID型として定義
    event_type = Column(SAEnum(EventTypeEnum, name="event_type"), nullable=False)
    title = Column(String(255), nullable=False)
    image = Column(LargeBinary, nullable=True) # Base64エンコードされた文字列をフロントとやり取りし、DBにはバイナリで保存
    description = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    location = Column(String(255), nullable=True)
    reward = Column(String(100), nullable=True)
    required_qualifications = Column(Text, nullable=True)
    available_spots = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    tags = Column(JSON, nullable=True)

    # company = relationship("Company") # companyテーブルとの連携は後で検討

class Application(Base):
    __tablename__ = "applications"
    
    application_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.event_id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("applicant.user_id"), nullable=False)
    status = Column(SAEnum(ApplicationStatusEnum, name="application_status"), nullable=False, default=ApplicationStatusEnum.PENDING)
    message = Column(Text, nullable=True)
    applied_at = Column(DateTime, server_default=func.now())
    processed_at = Column(DateTime, nullable=True)
    processed_by = Column(UUID(as_uuid=True), nullable=True)
    
    # リレーションシップの追加（警告修正）
    # 明示的なリレーションシップ（シンプルに定義）
    applicant = relationship("Applicant", back_populates="applications")

# TODO: Companyモデルも必要に応じて定義する (company_idのForeignKeyのため)
# class Company(Base):
#     __tablename__ = "company"
#     user_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
#     company_name = Column(String(50), nullable=False)
    # ... 他のカラム ... 

class Applicant(Base):
    __tablename__ = "applicant"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    last_name = Column(String(50), nullable=False)
    first_name = Column(String(50), nullable=False)
    mail_address = Column(Text, nullable=True)
    phone_number = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    birth_date = Column(DateTime, nullable=True)
    license = Column(Text, nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationshipsの追加（明示的で簡潔なリレーションシップ）
    applications = relationship("Application", back_populates="applicant")
    # 参加者コレクションはシンプルに削除（不要または後で必要に応じて再定義）

# レビューリクエストモデル
class ReviewRequest(Base):
    __tablename__ = "review_requests"
    __table_args__ = {"schema": "public"}
    
    review_request_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.application_id"), nullable=False)
    requested_by = Column(UUID(as_uuid=True), nullable=False)
    requested_at = Column(DateTime, server_default=func.now())
    request_message = Column(Text, nullable=True)
    status = Column(SAEnum(ReviewStatusEnum), nullable=False, default=ReviewStatusEnum.REQUESTED)
    
# レビューモデル
class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = {"schema": "public"}
    
    review_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.application_id"), nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Participant(Base):
    __tablename__ = "participants"
    
    participant_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.event_id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    status = Column(SAEnum(ParticipantStatusEnum, name="participants_status"), nullable=False, default=ParticipantStatusEnum.PENDING)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationshipsの追加（明示的で簡潔なリレーションシップ）
    user = relationship("User", back_populates="participants")
    # applicantリレーションシップは削除（不要または後で必要に応じて再定義）

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_type = Column(SAEnum(UserTypeEnum, name="user_type_enum"), nullable=True)
    user_name = Column(String(50), nullable=True)
    created_at = Column(DateTime, nullable=True)
    login_time = Column(DateTime, nullable=True)
    ai_advice = Column(Text, nullable=True)
    
    # Relationshipsの追加（明示的で簡潔なリレーションシップ）
    participants = relationship("Participant", back_populates="user")
    # applicantsリレーションシップは削除（不要または後で必要に応じて再定義）