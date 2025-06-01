#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json

def test_database_api():
    """実際のデータベースAPIエンドポイントをテストします"""
    url = "http://localhost:3000/get-events"
    headers = {"Content-Type": "application/json"}
    data = {"target_date": "2025-05-11"}  # データベースにサンプルデータがある日付
    
    print(f"Testing URL: {url}")
    print(f"Request data: {data}")
    
    try:
        # JSON データをバイトに変換
        json_data = json.dumps(data).encode('utf-8')
        
        # リクエストを作成
        req = urllib.request.Request(url, data=json_data, headers=headers, method='POST')
        
        print("Sending request...")
        
        # レスポンスを取得
        with urllib.request.urlopen(req) as response:
            print(f"Response status: {response.status}")
            if response.status == 200:
                response_data = response.read().decode('utf-8')
                print(f"Response received: {len(response_data)} characters")
                
                try:
                    events = json.loads(response_data)
                    print(f"✅ Database API is working properly! Found {len(events)} events")
                    if len(events) > 0:
                        print(f"First event title: {events[0].get('title', 'N/A')}")
                        print(f"First event type: {events[0].get('event_type', 'N/A')}")
                        print(f"First event start_date: {events[0].get('start_date', 'N/A')}")
                    else:
                        print("No events found for the specified date")
                except json.JSONDecodeError as je:
                    print(f"❌ JSON decode error: {je}")
                    print(f"Response data: {response_data[:500]}...")  # 最初の500文字のみ表示
                return True
            else:
                print(f"❌ API error: Status {response.status}")
                error_data = response.read().decode('utf-8')
                print(f"Error response: {error_data}")
                return False
    except urllib.error.HTTPError as he:
        print(f"❌ HTTP error: {he.code} - {he.reason}")
        error_data = he.read().decode('utf-8')
        print(f"Error response: {error_data}")
        return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_database_api()
