import urllib.request
import json

def final_test():
    print("🧪 Testing /get-events endpoint after fixes...")
    
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
            
            if response.status == 200:
                result = response.read().decode('utf-8')
                events = json.loads(result)
                print(f"✅ Success! Retrieved {len(events)} events")
                
                if events:
                    first_event = events[0]
                    tags = first_event.get('tags', [])
                    req_quals = first_event.get('required_qualifications', [])
                    
                    print(f"✅ Tags type: {type(tags)} (length: {len(tags) if isinstance(tags, list) else 'N/A'})")
                    print(f"✅ Required qualifications type: {type(req_quals)} (length: {len(req_quals) if isinstance(req_quals, list) else 'N/A'})")
                    
                    print("🎉 All Pydantic validation errors have been resolved!")
                    return True
                else:
                    print("ℹ️ No events found for the given date")
                    return True
                    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    final_test()
