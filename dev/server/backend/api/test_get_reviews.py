#!/usr/bin/env python3
"""
レビュー取得CRUD機能の直接テスト
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.database import get_db
from src.crud import get_reviews

# データベース接続取得
db_session = next(get_db())

try:
    print("=== レビュー取得テスト開始 ===")
    
    # レビュー取得実行
    results = get_reviews(db=db_session, skip=0, limit=10)
    print(f"=== 成功！取得件数: {len(results)} ===")
    
    for i, review in enumerate(results):
        print(f"--- Review {i+1} ---")
        print(f"review_id: {review.get('review_id')}")
        print(f"application_id: {review.get('application_id')}")
        print(f"reviewer_id: {review.get('reviewer_id')}")
        print(f"rating: {review.get('rating')}")
        print(f"comment: {review.get('comment')}")
        print(f"event_title: {review.get('event_title')}")
        print(f"applicant_name: {review.get('applicant_name')}")
    
except Exception as e:
    print(f"=== エラー発生 ===")
    print(f"エラー内容: {e}")
    import traceback
    traceback.print_exc()

finally:
    db_session.close()
