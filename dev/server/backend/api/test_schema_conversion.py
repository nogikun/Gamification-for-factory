#!/usr/bin/env python3
"""
FastAPIスキーマ変換テスト
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.database import get_db
from src.crud import get_reviews
from src.schemas.database.review import ReviewDetail

# データベース接続取得
db_session = next(get_db())

try:
    print("=== FastAPIスキーマ変換テスト開始 ===")
    
    # レビュー取得実行
    reviews = get_reviews(db=db_session, skip=0, limit=10)
    print(f"CRUD取得成功: {len(reviews)} 件")
    
    # スキーマ変換テスト
    converted_reviews = []
    for review_dict in reviews:
        print(f"変換前のデータ: {review_dict}")
        try:
            review_detail = ReviewDetail.model_validate(review_dict)
            converted_reviews.append(review_detail)
            print("スキーマ変換成功")
        except Exception as e:
            print(f"スキーマ変換エラー: {e}")
            print(f"変換失敗データ: {review_dict}")
            raise
    
    print(f"=== 成功！変換済み件数: {len(converted_reviews)} ===")
    
    for review in converted_reviews:
        print(f"review_id: {review.review_id}")
        print(f"application_id: {review.application_id}")
        print(f"rating: {review.rating}")
    
except Exception as e:
    print(f"=== エラー発生 ===")
    print(f"エラー内容: {e}")
    import traceback
    traceback.print_exc()

finally:
    db_session.close()
