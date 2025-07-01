#!/usr/bin/env python3
"""
データベース状況確認とレビューAPI変換機能テストスクリプト
"""
from src.database import SessionLocal
from src.models import Review, Application, Event, User
from src.utils.review_converter import ReviewConverter
from sqlalchemy import text
import uuid

def check_database_schema():
    """データベースのスキーマを確認"""
    db = SessionLocal()
    try:
        print('=== Reviews Table Schema ===')
        result = db.execute(text("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'reviews' ORDER BY ordinal_position"))
        for row in result:
            print(f'{row[0]}: {row[1]} (nullable: {row[2]})')
        
        print('\n=== Current Data Counts ===')
        review_count = db.query(Review).count()
        print(f'Total reviews: {review_count}')
        
        app_count = db.query(Application).count()
        print(f'Total applications: {app_count}')
        
        event_count = db.query(Event).count()
        print(f'Total events: {event_count}')
        
        user_count = db.query(User).count()
        print(f'Total users: {user_count}')
        
    finally:
        db.close()

def test_review_converter():
    """レビューコンバーターの動作テスト"""
    db = SessionLocal()
    try:
        print('\n=== Testing ReviewConverter ===')
        converter = ReviewConverter(db, enable_cache=True, strict_mode=False)
        
        # 最初のアプリケーションを取得
        application = db.query(Application).first()
        if application:
            print(f'Testing with application_id: {application.application_id}')
            print(f'Application details: user_id={application.user_id}, event_id={application.event_id}')
            
            try:
                # 順変換テスト
                reviewee_id, event_id = converter.convert_for_create(application.application_id)
                print(f'Converted to: reviewee_id={reviewee_id}, event_id={event_id}')
                
                # 逆変換テスト
                converted_back = converter.convert_for_response(reviewee_id, event_id)
                print(f'Converted back to: application_id={converted_back}')
                
                # 整合性チェック
                is_consistent = converter.validate_conversion_integrity(application.application_id)
                print(f'Conversion integrity: {is_consistent}')
                
            except Exception as e:
                print(f'Conversion test failed: {e}')
        else:
            print('No applications found in database')
            
    finally:
        db.close()

if __name__ == "__main__":
    check_database_schema()
    test_review_converter()
