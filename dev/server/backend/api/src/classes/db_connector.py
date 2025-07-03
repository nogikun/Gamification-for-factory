from sqlalchemy import create_engine, inspect, select, Date
from sqlalchemy import MetaData, text
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base

# 型
import uuid                     # UUID
from datetime import datetime   # 日時

class DBConnector:
    """
    PostgreSQLデータベースにSQLAlchemyを用いて接続するためのクラス
    """
    def __init__(self, db_url: str, debug: bool = False):
        self.db_url = db_url  # PostgreSQLの接続文字列
        
        try:
            self.engine = create_engine(
                self.db_url,    # データベース接続URL
                echo = debug,   # デバッグモードの設定：TrueならSQLの実行ログを出力
                future = True,  # 非同期操作をサポートするための設定
                connect_args={
                    "connect_timeout": 10,  # 接続タイムアウトの設定（秒単位）
                }
            )
        except Exception as e:
            raise Exception(f"データベース接続に失敗しました: {str(e)}")
        
        self.metadata = MetaData()                          # メタデータオブジェクトの作成
        self.base = automap_base(metadata=self.metadata)    # 自動マッピングベースの作成
        self.base.prepare(autoload_with=self.engine)        # データベースからテーブルを自動的にマッピング

    def get_table_names(self):
        """
        データベース内のテーブル名を取得するメソッド
        :return: テーブル名のリスト
        """
        inspector = inspect(self.engine)
        return inspector.get_table_names()

    def get_data_models(self):
        """
        データベース内のデータモデルを取得するメソッド
        :return: データモデルのリスト
        """
        print("【Data models】")
        classes = self.base.classes
        for model in classes:
            print(f"- {model.__name__}")
            for column in model.__table__.columns:
                print(f"  - {column.name} ({column.type})")
        return classes
    
    def select(self, table_name: str, where_clause: str = None):
        """
        指定されたテーブルからデータを選択するメソッド
        :param table_name: テーブル名
        :param where_clause: オプションのWHERE句
        :return: 選択されたデータのリスト
        """
        with Session(self.engine) as session:
            table = self.base.classes[table_name]
            stmt = select(table).where(text(where_clause)) if where_clause else select(table)
            result = session.execute(stmt)
            return result.scalars().all()

    def insert(self, table_name: str, data: dict):
        """
        指定されたテーブルにデータを挿入するメソッド
        :param table_name: テーブル名
        :param data: 挿入するデータの辞書
        """
        with Session(self.engine) as session:
            table = self.base.classes[table_name]
            new_record = table(**data)
            session.add(new_record)
            session.commit()
            return new_record

    def select_events_by_date(self, target_date: Date, table_name: str = "events"):
        """
        指定された日付のイベントを取得するメソッド
        :param table_name: テーブル名
        :param target_date: 対象の日付
        :return: イベントのリスト
        """
        with Session(self.engine) as session:
            table = self.base.classes[table_name]
            stmt = select(table).where(table.start_date.cast(Date) == target_date)
            result = session.execute(stmt)
            return result.scalars().all()

    def insert_event(self, event_data: dict, table_name: str = "events"):
        """
        イベントデータを指定されたテーブルに挿入するメソッド
        :param event_data: イベントデータの辞書
        :param table_name: テーブル名
        """
        with Session(self.engine) as session:
            table = self.base.classes[table_name]
            new_event = table(**event_data)
            session.add(new_event)
            session.commit()
            return new_event

if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv("../../.env")  # .envファイルの読み込み
    
    # データベース接続のテスト
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        db_url = "postgresql://postgres:postgres@postgres:5432/gamification"
    
    db_connector = DBConnector(db_url)

    # テーブルのデータを選択
    events = db_connector.select("events")
    print(events)

    # イベントデータの挿入
    new_event = {
        "company_id": str(uuid.uuid4()),
        "event_type": "説明会",
        "title": "新技術セミナー",
        "description": "最新の技術について学ぶセミナーです。",
        "start_date": datetime.now(),
        "end_date": datetime.now(),
        "location": "東京",
        "reward": "参加賞",
        "required_qualifications": "やる気とガッツがあればどんな人でも参加可能",
        "available_spots": 50,  # 正しいカラム名に修正
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "tags": ["技術", "セミナー"],
        "image": None
    }
    inserted_event = db_connector.insert_event(new_event)
    print(f"Inserted Event: {inserted_event}")
    
    # データモデルの取得
    data_models = db_connector.get_data_models()
    # テーブル名の取得
    table_names = db_connector.get_table_names()
    print(f"Table Names: {table_names}")
    
    from datetime import date
    event_data = db_connector.select_events_by_date(date(2025, 5, 11))
    print(f"【テスト】2025-05-11: {event_data.__len__()}件のイベントが見つかりました。")