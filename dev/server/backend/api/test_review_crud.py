#!/usr/bin/env python3
"""
レビューCRUD機能の直接テスト
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from src.database import get_db
from src.schemas.database.review import ReviewCreate
from src.crud import create_review
import uuid

# データベース接続取得
db_session = next(get_db())

# テストデータ
review_data = ReviewCreate(
    application_id=uuid.UUID("13b451ec-7fcd-4b5d-a4d5-5a71498bd539"),
    reviewer_id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
    rating=4.5,
    comment="素晴らしいパフォーマンスでした"
)

try:
    print("=== レビュー作成テスト開始 ===")
    print(f"application_id: {review_data.application_id}")
    print(f"reviewer_id: {review_data.reviewer_id}")
    print(f"rating: {review_data.rating}")
    print(f"comment: {review_data.comment}")
    
    # レビュー作成実行
    result = create_review(db=db_session, review_data=review_data)
    print(f"=== 成功！ ===")
    print(f"review_id: {result.review_id}")
    print(f"reviewee_id: {result.reviewee_id}")
    print(f"event_id: {result.event_id}")
    
except Exception as e:
    print(f"=== エラー発生 ===")
    print(f"エラー内容: {e}")
    import traceback
    traceback.print_exc()

finally:
    db_session.close()
