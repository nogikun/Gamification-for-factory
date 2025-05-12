import os, sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, List

# local imports
from src.schema.schema import Event, DateModel
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
async def get_event(target_date: DateModel) -> List[Event]:
    """
    デモ用イベント取得エンドポイント - 指定された日付のイベントリストを返します
    """
    event_generator = EventGenerator()
    generate_event_data = event_generator.generate_event_data_list(target_date)
    if not generate_event_data:
        raise HTTPException(status_code=404, detail="Events not found")
    return generate_event_data

# スクリプトとして直接実行された場合、Uvicornサーバーを起動
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3000,
        reload=True  # 開発中はホットリロードを有効にする
    )