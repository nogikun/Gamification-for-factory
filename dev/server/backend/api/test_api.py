#!/usr/bin/env python3
"""
レビューAPI機能テストスクリプト
新しいスキーマ対応の変換処理をテスト
"""
import requests
import json
import uuid
import time

import pytest
from sqlalchemy.orm import Session
from src.database import get_db
from src.crud import create_user
from src.schemas.database.user import UserCreate
from src.models import UserTypeEnum

BASE_URL = "http://localhost:3000"

@pytest.fixture
def db_session():
    """Provides a database session for testing."""
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def reviewer_id(db_session: Session):
    """Provides a test reviewer_id by creating a dummy user."""
    user_data = UserCreate(user_name="Test Reviewer", user_type=UserTypeEnum.APPLICANT)
    user = create_user(db=db_session, user_data=user_data)
    return str(user.user_id)

@pytest.fixture
def application_id():
    """Provides a test application_id."""
    response = requests.get(f"{BASE_URL}/applications")
    if response.status_code == 200 and response.json():
        return response.json()[0].get('application_id')
    pytest.skip("Could not fetch application_id for testing.")


def test_api_status():
    """APIサーバーの状態確認"""
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print(f"✓ API Server Status: {response.status_code}")
        assert response.status_code == 200
    except Exception as e:
        print(f"✗ API Server Error: {e}")
        assert False

def test_get_reviews():
    """レビュー一覧取得API テスト"""
    print("\n=== Testing GET /reviews ===")
    try:
        response = requests.get(f"{BASE_URL}/reviews")
        print(f"Status: {response.status_code}")
        
        assert response.status_code == 200
        data = response.json()
        print(f"Reviews count: {len(data)}")
        if data:
            print("Sample review:")
            sample = data[0]
            print(f"  review_id: {sample.get('review_id')}")
            print(f"  application_id: {sample.get('application_id')}")  # 変換されたID
            print(f"  reviewer_id: {sample.get('reviewer_id')}")
            print(f"  rating: {sample.get('rating')}")
            print(f"  comment: {sample.get('comment')}")
            
    except Exception as e:
        print(f"Error: {e}")
        assert False

def test_get_events():
    """イベント一覧取得 - application_id確認用"""
    print("\n=== Testing GET /events ===")
    try:
        response = requests.post(f"{BASE_URL}/get-events", json={"target_date": "2025-06-29"})
        print(f"Status: {response.status_code}")
        
        assert response.status_code == 200
        data = response.json()
        print(f"Events count: {len(data)}")
        if data:
            print("Sample event:")
            sample = data[0]
            print(f"  event_id: {sample.get('event_id')}")
            print(f"  title: {sample.get('title')}")
            
    except Exception as e:
        print(f"Error: {e}")
        assert False

def test_get_applications():
    """応募一覧取得 - application_id確認用"""
    print("\n=== Testing GET /applications ===")
    try:
        response = requests.get(f"{BASE_URL}/applications")
        print(f"Status: {response.status_code}")
        
        assert response.status_code == 200
        data = response.json()
        print(f"Applications count: {len(data)}")
        if data:
            print("Sample application:")
            sample = data[0]
            print(f"  application_id: {sample.get('application_id')}")
            print(f"  user_id: {sample.get('user_id')}")
            print(f"  event_id: {sample.get('event_id')}")
            
    except Exception as e:
        print(f"Error: {e}")
        assert False


def test_create_review(application_id, reviewer_id):
    """レビュー作成API テスト"""
    print(f"\n=== Testing POST /reviews with application_id: {application_id} ===")
    
    review_data = {
        "application_id": application_id,
        "reviewer_id": reviewer_id,
        "rating": 4.5,
        "comment": "テスト用レビューです。新しいスキーマ対応の変換処理を確認しています。"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/reviews", 
            json=review_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✓ Review created successfully!")
            print(f"  review_id: {data.get('review_id')}")
            assert data.get('review_id') is not None
        else:
            print(f"✗ Failed to create review")
            assert False
            
    except Exception as e:
        print(f"Error: {e}")
        assert False
