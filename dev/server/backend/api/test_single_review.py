#!/usr/bin/env python3
"""
単一のレビューデータでのAPIテスト
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.database import get_db
from src.crud import get_reviews
from src.schemas.database.review import ReviewDetail

print("=== 単一レビューCRUD＋APIスキーマテスト ===")

# データベース接続取得
db_session = next(get_db())

try:
    # 1件だけのレビューを取得
    reviews = get_reviews(db=db_session, skip=0, limit=1)
    print(f"CRUD成功: {len(reviews)} 件取得")
    
    if len(reviews) > 0:
        single_review = reviews[0]
        print(f"取得したレビューデータ:")
        for key, value in single_review.items():
            print(f"  {key}: {value} ({type(value)})")
        
        # スキーマ変換テスト
        try:
            review_detail = ReviewDetail.model_validate(single_review)
            print(f"\nスキーマ変換成功:")
            print(f"  review_id: {review_detail.review_id}")
            print(f"  application_id: {review_detail.application_id}")
            print(f"  reviewer_id: {review_detail.reviewer_id}")
            print(f"  rating: {review_detail.rating}")
            print(f"  comment: {review_detail.comment}")
            print(f"  event_title: {review_detail.event_title}")
            print(f"  applicant_name: {review_detail.applicant_name}")
            
            # JSON変換テスト
            json_data = review_detail.model_dump()
            print(f"\nJSON変換成功: {len(json_data)} フィールド")
            
        except Exception as schema_error:
            print(f"スキーマ変換エラー: {schema_error}")
            import traceback
            traceback.print_exc()
    else:
        print("レビューデータが見つかりません")

except Exception as e:
    print(f"エラー発生: {e}")
    import traceback
    traceback.print_exc()

finally:
    db_session.close()
    print("\n=== テスト完了 ===")
