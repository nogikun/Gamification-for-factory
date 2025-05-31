import os, sys
from datetime import date, datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn
import json
from typing import Dict, List
from sqlalchemy import create_engine, Column, Integer, String, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select # 非同期操作のために select をインポート
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

# local imports
from src.schema.fastapi.schema import Event, DateModel
from src.demo.generator import EventGenerator
from src.classes.db_connector import DBConnector  # DBConnectorをインポート

# from sqlalchemy.future import select
# from src.schema.sqlalchemy.models import EventModel  # EventModelをインポート

load_dotenv()  # .envファイルから環境変数を読み込む

# --- データベース設定 ---
# PostgreSQL 接続文字列。必要に応じて 'your_user', 'your_password', 'your_host', 'your_port', 'your_database' を置き換えてください。

# パスを追加してsrcディレクトリをインポート可能にする
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)  # 現在のディレクトリをパスに追加

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
    return {"status": "healthy!"}

@app.post("/demo/get-events")
async def demo_get_event(target_date: DateModel) -> List[Event]:
    """
    デモ用イベント取得エンドポイント - 指定された日付のイベントリストを返します
    """
    event_generator = EventGenerator()
    generate_event_data = event_generator.generate_event_data_list(target_date)
    if not generate_event_data:
        raise HTTPException(status_code=404, detail="Events not found")
    return generate_event_data

@app.post("/get-events")
async def get_event(target_date: DateModel) -> List[Event]:
    """
    イベント取得エンドポイント - 指定された日付のイベントリストをデータベースから取得します
    """
    database_url = os.getenv("DATABASE_URL")
    db_connector = DBConnector(
        db_url = database_url,  # 環境変数からデータベースURLを取得
        debug = False           # デバッグモードを有効にする
    )

    search_date = target_date.date
    try:
        # データベースから指定された日付のイベントを取得
        events = db_connector.select_events_by_date(search_date)
        if not events:
            # イベントが見つからない場合は空のリストを返す
            return []

    except Exception as e:
        print(f"データベースからイベントを取得中にエラーが発生しました: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error") from e

    # イベントデータをPydanticモデルに変換
    event_list = []
    for event in events:
        # tagsをJSON文字列からリストに変換
        if isinstance(event.tags, str) and event.tags:
            try:
                tags = json.loads(event.tags)
            except json.JSONDecodeError:
                # JSONでない場合はカンマで分割してリスト化を試みる
                tags = [t.strip() for t in event.tags.split(',') if t.strip()]
        else:
            tags = event.tags or []

        # データ型を適切に変換してEventオブジェクトを作成
        event_data = Event(
            event_id=str(event.event_id),  # 整数を文字列に変換
            company_id=str(event.company_id),  # UUIDを文字列に変換
            event_type=event.event_type,
            title=event.title,
            description=event.description,
            start_date=event.start_date,
            end_date=event.end_date,
            location=event.location,
            reward=event.reward,
            required_qualifications=event.required_qualifications,
            available_spots=event.available_spots,
            created_at=event.created_at,
            updated_at=event.updated_at,
            tags=tags,  # tagsをリストとして設定
            image=event.image if hasattr(event, 'image') else None # 画像が存在しない場合はNoneを設定
        )
        event_list.append(event_data)

    return event_list

# スクリプトとして直接実行された場合、Uvicornサーバーを起動
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3000,
        reload=True  # 開発中はホットリロードを有効にする
    )
