from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

# 環境変数の読み込み
load_dotenv()

# データベース接続情報
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "gamification")

# SQLAlchemyエンジンの作成
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

def migrate_reviews_table():
    """
    reviewsテーブルの構造を変更するマイグレーション
    - review_request_idカラムを削除
    - application_idカラムを追加
    """
    with engine.connect() as conn:
        # トランザクションの開始
        with conn.begin():
            # まず一時テーブルを作成して既存のデータを保存
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS public.reviews_temp (
                review_id SERIAL PRIMARY KEY,
                reviewer_id UUID NOT NULL,
                rating FLOAT NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """))
            
            # 既存データを一時テーブルにコピー
            conn.execute(text("""
            INSERT INTO public.reviews_temp (review_id, reviewer_id, rating, comment, created_at, updated_at)
            SELECT review_id, reviewer_id, rating, comment, created_at, updated_at
            FROM public.reviews
            """))
            
            # 既存のテーブルを削除
            conn.execute(text("DROP TABLE IF EXISTS public.reviews"))
            
            # 新しい構造でテーブルを再作成
            conn.execute(text("""
            CREATE TABLE public.reviews (
                review_id SERIAL PRIMARY KEY,
                application_id INTEGER REFERENCES applications(application_id),
                reviewer_id UUID NOT NULL,
                rating FLOAT NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """))
            
            # 一時テーブルからデータを復元（application_idはNULLになる）
            conn.execute(text("""
            INSERT INTO public.reviews (review_id, reviewer_id, rating, comment, created_at, updated_at)
            SELECT review_id, reviewer_id, rating, comment, created_at, updated_at
            FROM public.reviews_temp
            """))
            
            # 一時テーブルの削除
            conn.execute(text("DROP TABLE public.reviews_temp"))
            
            print("reviewsテーブルの構造が正常に変更されました。")

if __name__ == "__main__":
    try:
        migrate_reviews_table()
        print("マイグレーションが正常に完了しました。")
    except Exception as e:
        print(f"マイグレーション中にエラーが発生しました: {e}") 