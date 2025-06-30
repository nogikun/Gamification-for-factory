#!/usr/bin/env python3
"""
FastAPIルーターの直接テスト
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import asyncio
from src.database import get_db
from routers.reviews import get_reviews_api

import pytest

@pytest.mark.anyio
async def test_api_function():
    """APIルーター関数を直接テスト"""
    print("=== FastAPIルーター直接テスト開始 ===")
    
    # データベースセッション取得（FastAPIの依存性注入を模擬）
    db_generator = get_db()
    db_session = next(db_generator)
    
    try:
        # APIルーター関数を直接呼び出し
        result = await get_reviews_api(skip=0, limit=10, db=db_session)
        print(f"=== 成功！取得件数: {len(result)} ===")
        
        for i, review in enumerate(result):
            print(f"--- Review {i+1} ---")
            print(f"review_id: {review.review_id}")
            print(f"application_id: {review.application_id}")
            print(f"rating: {review.rating}")
        
    except Exception as e:
        print(f"=== エラー発生 ===")
        print(f"エラー内容: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # セッションを閉じる
        try:
            next(db_generator, None)  # ジェネレーターを終了
        except StopIteration:
            pass

# 非同期関数を実行
if __name__ == "__main__":
    asyncio.run(test_api_function())
