#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json

def test_get_events_api():
    """修正された /get-events APIエンドポイントをテストします"""
    url = "http://localhost:3000/get-events"
    headers = {"Content-Type": "application/json"}
    data = {"target_date": "2024-12-28"}
    
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
                print(f"✅ /get-events API is working! Found {len(events)} events")
                
                if len(events) > 0:
                    first_event = events[0]
                    print(f"\nFirst event details:")
                    print(f"Title: {first_event.get('title', 'N/A')}")
                    print(f"Event ID: {first_event.get('event_id', 'N/A')}")
                    print(f"Tags type: {type(first_event.get('tags', 'N/A'))}")
                    print(f"Tags value: {first_event.get('tags', 'N/A')}")
                    print(f"Required qualifications type: {type(first_event.get('required_qualifications', 'N/A'))}")
                    print(f"Required qualifications value: {first_event.get('required_qualifications', 'N/A')}")
                    
                    # タグが正しく処理されているかチェック
                    tags = first_event.get('tags')
                    if tags is not None:
                        if isinstance(tags, list):
                            print(f"✅ Tags are correctly returned as a list with {len(tags)} items")
                            if tags and isinstance(tags[0], dict):
                                print(f"✅ Tag objects have structure: {list(tags[0].keys())}")
                        else:
                            print(f"⚠️ Tags are returned as: {type(tags)}")
                    
                    # required_qualifications が正しく処理されているかチェック
                    req_quals = first_event.get('required_qualifications')
                    if req_quals is not None:
                        if isinstance(req_quals, list):
                            print(f"✅ Required qualifications are correctly returned as a list with {len(req_quals)} items")
                        else:
                            print(f"⚠️ Required qualifications are returned as: {type(req_quals)}")
                            
                else:
                    print("No events found for the given date")
                    
                return True
            else:
                print(f"❌ API error: Status {response.status}")
                response_text = response.read().decode('utf-8')
                print(f"Response: {response_text}")
                return False
                
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code}")
        error_body = e.read().decode('utf-8')
        print(f"Error response: {error_body}")
        return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    test_get_events_api()
