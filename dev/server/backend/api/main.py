import os, sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, List
import uuid
from datetime import datetime

# local imports
from src.schema.schema import Event, EventCreate, DateModel
from src.demo.generator import EventGenerator

# パスを追加してsrcディレクトリをインポート可能にする
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
if project_root not in sys.path:
    sys.path.append(project_root)

app = FastAPI(
    title="Gamification API",
    description="Gamification for factory API server",
    version="0.1.0"
)

# CORSミドルウェアをアプリケーションに追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンからのアクセスを許可する場合は["*"]とします
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可する場合は["*"]とします
    allow_headers=["*"],  # すべてのヘッダーを許可する場合は["*"]とします
)

# イベントデータを格納するインメモリリスト
fake_events_db: List[Event] = []

@app.get("/")
async def root() -> Dict[str, str]:
    """
    ルートエンドポイント - APIの基本情報を返します
    """
    return {"message": "Gamification for factory API"}

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """
    ヘルスチェックエンドポイント - サービスのヘルス状態を確認します
    """
    return {"status": "healthy"}

# --- イベント関連エンドポイント --- #

@app.post("/event", response_model=Event, status_code=201)
async def create_event_endpoint(event_data: EventCreate) -> Event:
    now = datetime.now()
    new_event = Event(
        **event_data.model_dump(), 
        event_id=str(uuid.uuid4()),
        created_at=now,
        updated_at=now
    )
    fake_events_db.append(new_event)
    return new_event

@app.get("/event", response_model=List[Event])
async def get_events_endpoint() -> List[Event]:
    return fake_events_db

@app.get("/event/{event_id}", response_model=Event)
async def get_event_endpoint(event_id: str) -> Event:
    for event in fake_events_db:
        if event.event_id == event_id:
            return event
    raise HTTPException(status_code=404, detail="Event not found")

@app.put("/event/{event_id}", response_model=Event)
async def update_event_endpoint(event_id: str, event_update_data: EventCreate) -> Event:
    for index, event in enumerate(fake_events_db):
        if event.event_id == event_id:
            updated_data = event_update_data.model_dump(exclude_unset=True)
            updated_event = event.model_copy(update=updated_data)
            updated_event.updated_at = datetime.now()
            updated_event.event_id = event_id # Ensure event_id is not changed by update
            fake_events_db[index] = updated_event
            return updated_event
    raise HTTPException(status_code=404, detail="Event not found")

@app.delete("/event/{event_id}", status_code=204)
async def delete_event_endpoint(event_id: str):
    for index, event in enumerate(fake_events_db):
        if event.event_id == event_id:
            fake_events_db.pop(index)
            return
    raise HTTPException(status_code=404, detail="Event not found")

# --- デモ用エンドポイント (既存) --- #
@app.post("/demo/get-events")
async def get_demo_event(target_date: DateModel) -> List[Event]:
    """
    デモ用イベント取得エンドポイント - 指定された日付のイベントリストを返します
    """
    print(f"Demo event request for date: {target_date.target_date}")
    # EventGenerator が Event モデル (event_id, created_at, updated_atを含む) を返すか確認が必要
    # ここでは、EventCreate に含まれないフィールドをダミーで埋めて返すサンプル
    dummy_event_data = {
        "company_id": "demo_company",
        "event_type": "DEMO",
        "title": f"Demo Event for {target_date.target_date}",
        "description": "This is a demo event.",
        "start_date": datetime.combine(target_date.target_date, datetime.min.time()),
        "end_date": datetime.combine(target_date.target_date, datetime.max.time()),
        "location": "Demo Location",
        "available_spots": 10
    }
    demo_event = Event(
        **dummy_event_data,
        event_id=str(uuid.uuid4()),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    return [demo_event]

# スクリプトとして直接実行された場合、Uvicornサーバーを起動
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )