import os, sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, List
from sqlalchemy import create_engine, Column, Integer, String, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select # 非同期操作のために select をインポート
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

# local imports
from src.schema.schema import Event, DateModel
from src.demo.generator import EventGenerator

# --- データベース設定 ---
# PostgreSQL 接続文字列。必要に応じて 'your_user', 'your_password', 'your_host', 'your_port', 'your_database' を置き換えてください。
# 例: "postgresql+asyncpg://user:password@localhost:5432/mydatabase"
DATABASE_URL = ""



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
    イベント取得エンドポイント - 指定された日付のイベントリストを返します
    """# 非同期エンジンを作成
    engine = create_async_engine(DATABASE_URL, echo=True) # ここが非同期接続の肝です
    # セッションファクトリを作成
    AsyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
    
# スクリプトとして直接実行された場合、Uvicornサーバーを起動
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3000,
        reload=True  # 開発中はホットリロードを有効にする
    )