#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json

def test_api():
    """APIエンドポイントをテストします"""
    url = "http://localhost:8000/demo/get-events"
    headers = {"Content-Type": "application/json"}
    data = {"target_date": "2024-01-15"}
    
    try:
        # JSON データをバイトに変換
        json_data = json.dumps(data).encode('utf-8')
        
        # リクエストを作成
        req = urllib.request.Request(url, data=json_data, headers=headers, method='POST')
        
        # レスポンスを取得
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                response_data = response.read().decode('utf-8')
                events = json.loads(response_data)
                print(f"✅ API is working properly! Generated {len(events)} events")
                if len(events) > 0:
                    print(f"First event title: {events[0].get('title', 'N/A')}")
                    print(f"First event type: {events[0].get('event_type', 'N/A')}")
                    print(f"Events have base64 images: {'image' in events[0] and events[0]['image'] is not None}")
                return True
            else:
                print(f"❌ API error: Status {response.status}")
                print(f"Response: {response.read().decode('utf-8')}")
                return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    test_api()
