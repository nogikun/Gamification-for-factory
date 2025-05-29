import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む (存在する場合)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@postgres:5432/gamification")

# エンジンとセッションを遅延初期化
engine = None
SessionLocal = None

def get_engine():
    global engine
    if engine is None:
        engine = create_engine(DATABASE_URL)
    return engine

def get_session_local():
    global SessionLocal
    if SessionLocal is None:
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return SessionLocal

Base = declarative_base()

# DBセッションを取得するための依存関数
def get_db():
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 