#!/usr/bin/env python3
"""
レビュー通知システムのテストデータ作成スクリプト
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid
from datetime import datetime

# モデルをインポート
from src.models import (
    ReviewRequest, 
    ReviewStatusEnum, 
    Application, 
    Event, 
    Applicant,
    EventTypeEnum,
    ApplicationStatusEnum
)
from src.database import get_db

# データベース接続設定
DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/gamification"

def create_test_data():
    """テストデータを作成する"""
    try:
        # データベース接続
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        print("Creating test data for review notifications...")
        
        # 1. テスト用の申請者を作成
        test_applicant = Applicant(
            user_id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
            last_name="テスト",
            first_name="太郎",
            mail_address="test@example.com",
            phone_number="090-1234-5678"
        )
        
        # 既存チェック
        existing_applicant = db.query(Applicant).filter(
            Applicant.user_id == test_applicant.user_id
        ).first()
        
        if not existing_applicant:
            db.add(test_applicant)
            print(f"Created test applicant: {test_applicant.user_id}")
        else:
            print(f"Test applicant already exists: {existing_applicant.user_id}")
        
        # 2. テスト用のイベントを作成
        test_event = Event(
            event_id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
            company_id=uuid.UUID("44444444-4444-4444-4444-444444444444"),
            event_type=EventTypeEnum.INTERNSHIP,
            title="テスト用インターンシップ",
            description="レビュー通知システムのテスト用イベント",
            start_date=datetime(2025, 8, 1, 9, 0),
            end_date=datetime(2025, 8, 5, 17, 0),
            location="テスト会場",
            reward="実務経験"
        )
        
        existing_event = db.query(Event).filter(
            Event.event_id == test_event.event_id
        ).first()
        
        if not existing_event:
            db.add(test_event)
            print(f"Created test event: {test_event.event_id}")
        else:
            print(f"Test event already exists: {existing_event.event_id}")
        
        # 3. テスト用の応募を作成（APPROVEDステータスで通知対象とする）
        test_application = Application(
            application_id=uuid.UUID("55555555-5555-5555-5555-555555555555"),
            event_id=test_event.event_id,
            user_id=test_applicant.user_id,
            status=ApplicationStatusEnum.APPROVED,  # 承認済みステータス（通知対象）
            message="テスト用の応募です（承認済み）"
        )
        
        existing_application = db.query(Application).filter(
            Application.application_id == test_application.application_id
        ).first()
        
        if not existing_application:
            db.add(test_application)
            print(f"Created test application: {test_application.application_id}")
        else:
            print(f"Test application already exists: {existing_application.application_id}")
        
        # 4. テスト用のレビューリクエストを作成
        test_review_request = ReviewRequest(
            request_id=uuid.UUID("66666666-6666-6666-6666-666666666666"),
            application_id=test_application.application_id,
            requested_by=uuid.UUID("11111111-1111-1111-1111-111111111111"),  # APIテストで使用するユーザーID
            requested_at=datetime.now(),
            request_message="テスト用レビューリクエストです。よろしくお願いします。",
            status=ReviewStatusEnum.REQUESTED
        )
        
        existing_review_request = db.query(ReviewRequest).filter(
            ReviewRequest.request_id == test_review_request.request_id
        ).first()
        
        if not existing_review_request:
            db.add(test_review_request)
            print(f"Created test review request: {test_review_request.request_id}")
        else:
            print(f"Test review request already exists: {existing_review_request.request_id}")
        
        # データベースにコミット
        db.commit()
        print("✅ Test data creation completed successfully!")
        
        # 作成されたデータの確認
        print("\n📊 Created test data summary:")
        print(f"  - Applicant ID: {test_applicant.user_id}")
        print(f"  - Event ID: {test_event.event_id}")
        print(f"  - Application ID: {test_application.application_id}")
        print(f"  - Review Request ID: {test_review_request.request_id}")
        print(f"  - Requested by: {test_review_request.requested_by}")
        print(f"  - Status: {test_review_request.status.value}")
        
    except Exception as e:
        print(f"❌ Error creating test data: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

def check_existing_data():
    """既存のデータをチェック"""
    try:
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        print("📋 Checking existing data...")
        
        # Review Requests
        review_requests = db.query(ReviewRequest).all()
        print(f"  - Total review requests: {len(review_requests)}")
        
        requested_count = db.query(ReviewRequest).filter(
            ReviewRequest.status == ReviewStatusEnum.REQUESTED
        ).count()
        print(f"  - REQUESTED status: {requested_count}")
        
        # Applications
        applications = db.query(Application).count()
        print(f"  - Total applications: {applications}")
        
        # Events  
        events = db.query(Event).count()
        print(f"  - Total events: {events}")
        
        # Applicants
        applicants = db.query(Applicant).count()
        print(f"  - Total applicants: {applicants}")
        
        # 詳細なレビューリクエスト情報
        if review_requests:
            print("\n📝 Review Request Details:")
            for req in review_requests:
                print(f"  - ID: {req.request_id}")
                print(f"    Application ID: {req.application_id}")
                print(f"    Requested by: {req.requested_by}")
                print(f"    Status: {req.status}")
                print(f"    Message: {req.request_message}")
                print()
        
    except Exception as e:
        print(f"❌ Error checking data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Manage test data for review notifications")
    parser.add_argument("--check", action="store_true", help="Check existing data")
    parser.add_argument("--create", action="store_true", help="Create test data")
    
    args = parser.parse_args()
    
    if args.check:
        check_existing_data()
    elif args.create:
        create_test_data()
    else:
        print("Usage:")
        print("  python create_test_data.py --check   # Check existing data")  
        print("  python create_test_data.py --create  # Create test data")