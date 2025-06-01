import requests
import json

# テストデータ: 現在の日付でイベントを取得
test_data = {
    "target_date": "2025-06-02"
}

print("Testing /get-events endpoint...")
print(f"Request data: {test_data}")

# POSTリクエストを送信
try:
    response = requests.post(
        "http://localhost:8000/get-events",
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Success! /get-events endpoint is working")
        data = response.json()
        print(f"Number of events returned: {len(data)}")
        
        if data:
            # 最初のイベントのタグ情報を確認
            first_event = data[0]
            print(f"\nFirst event tags: {first_event.get('tags', 'No tags')}")
            print(f"Tags type: {type(first_event.get('tags'))}")
        else:
            print("No events found for the specified date")
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.RequestException as e:
    print(f"❌ Connection error: {e}")
