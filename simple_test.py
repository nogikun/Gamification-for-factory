import urllib.request
import json

data = {"target_date": "2024-12-28"}
json_data = json.dumps(data).encode('utf-8')

req = urllib.request.Request(
    "http://localhost:3000/get-events",
    data=json_data,
    headers={"Content-Type": "application/json"},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        result = response.read().decode('utf-8')
        print(f"Response: {result}")
        
        if response.status == 200:
            events = json.loads(result)
            print(f"Number of events: {len(events)}")
            if events:
                first_event = events[0]
                print(f"First event tags: {first_event.get('tags')}")
                print(f"First event required_qualifications: {first_event.get('required_qualifications')}")
except Exception as e:
    print(f"Error: {e}")
