import requests
import uuid
from datetime import datetime, timedelta

BASE_URL = "http://localhost:3000"

# 1. Create a new event so we have a valid event_id
create_event_payload = {
    # use a company ID that exists in the seed data
    "company_id": "12345678-1234-1234-1234-123456789012",
    "event_type": "インターンシップ",
    "title": "Test Event",
    "description": "An event to test applicant join",
    "start_date": datetime.utcnow().isoformat(),
    "end_date": (datetime.utcnow() + timedelta(days=1)).isoformat(),
    "location": "Tokyo",
    "reward": "None",
    "required_qualifications": ["Python"],
    "available_spots": 10,
    "tags": [{"color": "red", "label": "test"}]
}

create_resp = requests.post(f"{BASE_URL}/event", json=create_event_payload, headers={"Content-Type": "application/json"})
create_resp.raise_for_status()
created_event = create_resp.json()

# Extract the valid event_id
event_id = created_event.get("event_id")

# 2. Prepare join-event payload using the valid event_id
join_payload = {
    "applicant": {
        "applicant_id": str(uuid.uuid4()),
        # same valid company ID as used for the event creation
        "company_id": "12345678-1234-1234-1234-123456789012",
        "event_id": event_id,
        "name": "田中太郎",
        "phone_num": "090-1234-5678",
        "email": "tanaka@example.com",
        "birthdate": "1990-01-01",
        "address": "東京都渋谷区"
    },
    "event_id_model": {"event_id": event_id}
}

# Send request to join-event endpoint
response = requests.post(f"{BASE_URL}/join-event", json=join_payload, headers={"Content-Type": "application/json"})
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
