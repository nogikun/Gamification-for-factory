#!/usr/bin/env python3
"""
レビューAPI機能テストスクリプト
新しいスキーマ対応の変換処理をテスト
"""
import requests
import json
import uuid
import time

BASE_URL = "http://localhost:3000"

def test_api_status():
    """APIサーバーの状態確認"""
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print(f"✓ API Server Status: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ API Server Error: {e}")
        return False

def test_get_reviews():
    """レビュー一覧取得API テスト"""
    print("\n=== Testing GET /reviews ===")
    try:
        response = requests.get(f"{BASE_URL}/reviews")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
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
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

def test_get_events():
    """イベント一覧取得 - application_id確認用"""
    print("\n=== Testing GET /events ===")
    try:
        response = requests.post(f"{BASE_URL}/get_events")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Events count: {len(data)}")
            if data:
                print("Sample event:")
                sample = data[0]
                print(f"  event_id: {sample.get('event_id')}")
                print(f"  title: {sample.get('title')}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

def test_get_applications():
    """応募一覧取得 - application_id確認用"""
    print("\n=== Testing GET /applications ===")
    try:
        response = requests.get(f"{BASE_URL}/applications")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Applications count: {len(data)}")
            if data:
                print("Sample application:")
                sample = data[0]
                print(f"  application_id: {sample.get('application_id')}")
                print(f"  user_id: {sample.get('user_id')}")
                print(f"  event_id: {sample.get('event_id')}")
                return sample.get('application_id')  # テスト用に返す
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")
    return None

def test_create_review(application_id, reviewer_id=None):
    """レビュー作成API テスト"""
    print(f"\n=== Testing POST /reviews with application_id: {application_id} ===")
    
    if not reviewer_id:
        # ダミーのreviewer_id生成
        reviewer_id = str(uuid.uuid4())
    
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
        
        if response.status_code == 201:
            data = response.json()
            print("✓ Review created successfully!")
            print(f"  review_id: {data.get('review_id')}")
            return data.get('review_id')
        else:
            print(f"✗ Failed to create review")
            
    except Exception as e:
        print(f"Error: {e}")
    return None

def main():
    """メインテスト実行"""
    print("=== Review API Test Suite ===")
    print(f"Testing API at: {BASE_URL}")
    
    # 1. APIサーバー状態確認
    if not test_api_status():
        print("API server is not running!")
        return
    
    # 2. 既存データ確認
    test_get_reviews()
    test_get_events()
    
    # 3. アプリケーション取得（テスト用ID取得）
    app_id = test_get_applications()
    
    # 4. レビュー作成テスト（もしアプリケーションIDが取得できた場合）
    if app_id:
        review_id = test_create_review(app_id)
        
        # 5. 作成後の一覧確認
        if review_id:
            print("\n=== Verifying created review ===")
            test_get_reviews()
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    main()
