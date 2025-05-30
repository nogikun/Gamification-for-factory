import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む (存在する場合)
load_dotenv()

# DATABASE_URLが設定されている場合はそれを優先
if os.getenv("DATABASE_URL"):
    DATABASE_URL = os.getenv("DATABASE_URL")
else:
    # 環境変数からDB設定を取得 (なければデフォルト値を使用)
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
    DB_HOST = os.getenv("DB_HOST", "postgres")  # デフォルトをpostgresに変更
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "gamification")

    # SQLAlchemyのDB URL
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

print(f"Connecting to database: {DATABASE_URL}")

# データベースエンジンの作成
engine = create_engine(DATABASE_URL)

# セッションの作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ベースクラスの作成
Base = declarative_base()

# 依存性注入用の関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# エンジンを取得する関数（外部から呼び出し可能）
def get_engine():
    return engine

# テーブルをリセットする関数
def reset_reviews_table():
    from sqlalchemy import text
    with engine.connect() as conn:
        # reviewsテーブルが存在すれば削除
        conn.execute(text("DROP TABLE IF EXISTS public.reviews CASCADE"))
        # 新しい構造で再作成はmodels.pyで行われる
        conn.commit() 