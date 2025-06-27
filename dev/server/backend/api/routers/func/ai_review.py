from fastapi import APIRouter
import os, sys

# local imports
from src.classes.db_connector import DBConnector

# Routerを作成
router = APIRouter()

@router.post("/func/ai-review")
async def ai_review(
    reviewee_id: str,  # レビュー対象者のuser_id
) -> dict:
    """
    AIレビューエンドポイント - レビュー用のデータを受け取り、AIによるレビュー結果を返します
    """
    # データベース接続のインスタンスを作成
    db_url = os.getenv("DATABASE_URL")
    db_connector = DBConnector(
      db_url = db_url,
      debug = True  # デバッグモードを有効にする
    )
    # レビュー対象者のデータを取得
    review_data = db_connector.select("reviews", where_clause=f"reviewee_id = '{reviewee_id}'")
    
    print(f"Retrieved review data for user_id {reviewee_id}: {review_data}")

    return review_data.json() if review_data else {"message": "No review data found for the given user_id."}