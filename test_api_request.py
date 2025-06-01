import requests
import json

# テストデータ
test_data = {
    "applicant": {
        "applicant_id": "test123",
        "company_id": "comp123",
        "event_id": "event123",
        "name": "田中太郎",
        "phone_num": "090-1234-5678",
        "email": "tanaka@example.com",
        "birthdate": "1990-01-01",
        "address": "東京都渋谷区"
    },
    "event_id_model": {
        "event_id": "event123"
    }
}

# POSTリクエストを送信
response = requests.post(
    "http://localhost:8000/join-event",
    json=test_data,
    headers={"Content-Type": "application/json"}
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
