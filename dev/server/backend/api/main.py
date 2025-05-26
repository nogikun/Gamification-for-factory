import os, sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, List
import base64

# local imports
from src.schema.schema import Event, DateModel, EventIdModel, Applicant
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

@app.post("/demo/get-events")
async def get_events(target_date: DateModel) -> List[Event]:
    """
    デモ用イベント取得エンドポイント - 指定された日付のイベントリストを返します
    """
    event_generator = EventGenerator()
    generate_event_data = event_generator.generate_event_data_list(target_date)
    if not generate_event_data:
        raise HTTPException(status_code=404, detail="Events not found")
    return generate_event_data

@app.post("/demo/get-event")
async def get_event(event_id_model: EventIdModel) -> Event:
    """
	デモ用イベント取得エンドポイント - 指定されたイベントIDのイベント情報を返します
	"""
    # 本来はデータベースからイベント情報を取得する処理が必要
    # ここではサンプルデータを返す
    image_path = "src/demo/images/thumbnail_a.png"  # サンプル画像のパス
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
	# 結果を代入
    event = Event(
        event_id=event_id_model.event_id,
        company_id="company_001",
        event_type="type_001",
		title="Sample Event",
		description="This is a sample event description.",
		start_time="2023-10-01T10:00:00Z",
		end_time="2023-10-01T12:00:00Z",
		location="Tokyo, Japan",
		reward="7,000 円",
		required_qualifications=["qualification_001"],
		max_participants=100,
		created_at="2023-09-01T10:00:00Z",
		updated_at="2023-09-01T10:00:00Z",
		tags=["tag1", "tag2"],
		image= encoded_string  # Base64エンコードされた画像データを設定
    )
    return event

@app.post("/demo/join-event")
async def join_event(applicant: Applicant, event_id_model: EventIdModel) -> Dict[str, str]:
    """
    デモ用イベント参加エンドポイント - 申請者が指定されたイベントに参加する処理を行います
    """
    # 本来はデータベースに申請者情報を保存する処理が必要
    # ここではサンプルの成功メッセージを返す

    # 申請者情報をログに出力（デバッグ用）
    print(f"Applicant: {applicant.json()}")
    print(f"Event ID: {event_id_model.event_id}")

    return {"message": "Successfully joined the event"}
  

# スクリプトとして直接実行された場合、Uvicornサーバーを起動
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3000,
        reload=True  # 開発中はホットリロードを有効にする
    )