#!/usr/bin/env python3
import requests
import json

def test_different_date_formats():
    """異なる日付形式で /get-events エンドポイントをテストします"""
    url = "http://localhost:8000/get-events"
    headers = {"Content-Type": "application/json"}
    
    # 様々な日付形式をテスト
    test_cases = [
        {"target_date": "2025-05-11"},      # 正しい形式（ISO形式）
        {"target_date": "05/11/2025"},      # MM/DD/YYYY形式
        {"target_date": "2025/05/11"},      # YYYY/MM/DD形式
        {"target_date": "05-11-2025"},      # MM-DD-YYYY形式
        {"target_date": "11-05-2025"},      # DD-MM-YYYY形式
        {"target_date": "2025.05.11"},      # ドット区切り
        {"target_date": "May 11, 2025"},    # 英語形式
        {"target_date": "2025年5月11日"},     # 日本語形式
        {"target_date": "20250511"},        # 数字のみ
    ]
    
    for i, data in enumerate(test_cases, 1):
        print(f"\n=== テストケース {i}: {data['target_date']} ===")
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=10)
            
            print(f"ステータスコード: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ 成功: {len(result)} 件のイベントが見つかりました")
            elif response.status_code == 422:
                error_detail = response.json()
                print(f"❌ バリデーションエラー:")
                print(f"  詳細: {error_detail.get('detail', 'Unknown error')}")
                if 'errors' in error_detail:
                    for error in error_detail['errors']:
                        print(f"  - {error.get('msg', '')} (場所: {error.get('loc', '')})")
            else:
                print(f"❌ その他のエラー: {response.status_code}")
                try:
                    print(f"  詳細: {response.json()}")
                except:
                    print(f"  詳細: {response.text}")
                    
        except requests.exceptions.RequestException as e:
            print(f"❌ リクエストエラー: {e}")
        except Exception as e:
            print(f"❌ 予期しないエラー: {e}")

if __name__ == "__main__":
    test_different_date_formats()
