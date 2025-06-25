#!/usr/bin/env python3
"""
修正されたレビューAPI作成エンドポイントのテスト

urllib を使用してHTTPリクエストを送信し、
application_idからreviewee_id/event_idへの変換とレスポンスでの逆変換を確認する。
"""
import urllib.request
import urllib.parse
import json
from datetime import datetime

API_BASE_URL = "http://localhost:3000"

def test_review_creation_with_conversion():
    """レビュー作成 + コンバーター機能のテスト"""
    print("=== レビュー作成API + コンバーター テスト ===")
    
    # テスト用のデータ（データベースにある実際のIDs）
    test_review_data = {
        "application_id": "a0000001-0001-0001-0001-000000000001",  # テストデータのapplication_id
        "reviewer_id": "c0000001-0000-0000-0000-000000000001",     # テストデータのreviewer_id
        "rating": 4.5,
        "comment": "API修正後のテストレビューです。コンバーター機能が正常に動作することを確認しています。"
    }
    
    print(f"送信データ: {json.dumps(test_review_data, indent=2, ensure_ascii=False)}")
    
    try:
        # リクエストデータをJSONエンコード
        json_data = json.dumps(test_review_data).encode('utf-8')
        
        # HTTPリクエストを作成
        req = urllib.request.Request(
            f"{API_BASE_URL}/review",
            data=json_data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        # リクエスト送信
        with urllib.request.urlopen(req, timeout=30) as response:
            status_code = response.getcode()
            response_data = json.loads(response.read().decode('utf-8'))
            
            print(f"レスポンスステータス: {status_code}")
            
            if status_code == 201:
                print("✅ レビュー作成成功!")
                print(f"レスポンスデータ: {json.dumps(response_data, indent=2, ensure_ascii=False)}")
                
                # 重要な確認ポイント
                checks = [
                    ("review_id exists", "review_id" in response_data),
                    ("application_id exists", "application_id" in response_data), 
                    ("application_id matches input", response_data.get("application_id") == test_review_data["application_id"]),
                    ("reviewer_id matches", response_data.get("reviewer_id") == test_review_data["reviewer_id"]),
                    ("rating matches", response_data.get("rating") == test_review_data["rating"]),
                    ("comment matches", response_data.get("comment") == test_review_data["comment"]),
                    ("created_at exists", "created_at" in response_data),
                    ("updated_at exists", "updated_at" in response_data)
                ]
                
                print("\n=== 確認結果 ===")
                for check_name, result in checks:
                    status = "✅" if result else "❌"
                    print(f"{status} {check_name}")
                
                # 全てのチェックが通ったかどうか
                all_passed = all(result for _, result in checks)
                print("\n=== 総合結果 ===")
                if all_passed:
                    print("✅ 全てのテストが成功! コンバーター機能が正常に動作しています。")
                else:
                    print("❌ 一部のテストが失敗しました。")
                    
                return response_data
                
            else:
                print(f"❌ レビュー作成失敗: {status_code}")
                return None
                
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP エラー: {e.code}")
        error_response = e.read().decode('utf-8')
        print(f"エラー内容: {error_response}")
        return None
    except Exception as e:
        print(f"❌ リクエストエラー: {e}")
        return None

def test_review_list_api():
    """レビュー一覧取得のテスト（確認用）"""
    print("\n=== レビュー一覧取得テスト ===")
    
    try:
        req = urllib.request.Request(f"{API_BASE_URL}/reviews")
        
        with urllib.request.urlopen(req, timeout=30) as response:
            status_code = response.getcode()
            reviews_data = json.loads(response.read().decode('utf-8'))
            
            print(f"レスポンスステータス: {status_code}")
            
            if status_code == 200:
                print(f"✅ レビュー一覧取得成功! 件数: {len(reviews_data)}")
                
                # 最新のレビューを表示（作成したレビューが含まれているか確認）
                if reviews_data:
                    latest_review = reviews_data[0]  # 最新順で返されると仮定
                    print(f"最新レビュー: {json.dumps(latest_review, indent=2, ensure_ascii=False)}")
                
                return reviews_data
            else:
                print(f"❌ レビュー一覧取得失敗: {status_code}")
                return None
                
    except Exception as e:
        print(f"❌ レビュー一覧取得エラー: {e}")
        return None

if __name__ == "__main__":
    print("修正されたレビューAPI テスト開始")
    print(f"テスト時刻: {datetime.now()}")
    print(f"API URL: {API_BASE_URL}")
    print("=" * 50)
    
    # レビュー作成テスト
    created_review = test_review_creation_with_conversion()
    
    # レビュー一覧取得テスト（確認用）
    reviews_list = test_review_list_api()
    
    print("\n" + "=" * 50)
    print("テスト完了")
