import urllib.request
import urllib.error
import json

def test_api():
    data = {"target_date": "2024-12-28"}
    json_data = json.dumps(data).encode('utf-8')
    
    req = urllib.request.Request(
        "http://localhost:8000/get-events",
        data=json_data,
        headers={"Content-Type": "application/json"},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"✅ Status: {response.status}")
            result = response.read().decode('utf-8')
            
            if response.status == 200:
                events = json.loads(result)
                print(f"✅ Success! Found {len(events)} events")
                
                if events:
                    first_event = events[0]
                    print(f"✅ First event title: {first_event.get('title', 'N/A')}")
                    print(f"✅ Tags type: {type(first_event.get('tags'))}")
                    print(f"✅ Tags value: {first_event.get('tags')}")
                    print(f"✅ Required qualifications type: {type(first_event.get('required_qualifications'))}")
                    print(f"✅ Required qualifications: {first_event.get('required_qualifications')}")
                
                return True
            else:
                print(f"❌ Unexpected status: {response.status}")
                print(f"Response: {result}")
                return False
                
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code}")
        error_body = e.read().decode('utf-8')
        print(f"Error response: {error_body}")
        return False
    except Exception as e:
        print(f"❌ Error: {type(e).__name__}: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing /get-events API endpoint...")
    test_api()
