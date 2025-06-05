import sys
import os
from random import randint, choice, sample
from datetime import datetime
import base64
import uuid
import json
from typing import TYPE_CHECKING, List

# Add the API root directory to Python path for imports
if __name__ == "__main__" or True:  # Always add for standalone execution
    api_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    if api_root not in sys.path:
        sys.path.insert(0, api_root)

# Type checking imports
if TYPE_CHECKING:
    from src.schemas.database.event import Event as EventSchema
    from src.schemas.api.base import DateModel
else:
    # Runtime imports with fallbacks
    try:
        from src.schemas.database.event import Event as EventSchema
        from src.schemas.api.base import DateModel
    except ImportError as e:
        print(f"Import error: {e}")
        # Fallback for runtime
        EventSchema = object
        DateModel = object

class EventGenerator:
    def __init__(self):
        self.event_types = ["金属加工", "プラスチック成形", "組立", "検査", "包装"]
        self.event_titles = [
            "金属加工技術セミナー",
            "プラスチック成形ワークショップ",
            "組立ライン改善セミナー",
            "検査技術向上セミナー",
            "包装技術セミナー"
        ]
        self.event_descriptions = [
            "金属加工の最新技術を学ぶセミナーです。",
            "プラスチック成形の基礎を学ぶワークショップです。",
            "組立ラインの効率化について学ぶセミナーです。",
            "検査技術の向上を目指すセミナーです。",
            "包装技術の最新トレンドを学ぶセミナーです。"
        ]
        self.event_locations = [
            "東京都 大田区 〇〇工業", 
            "大阪府 東大阪市 〇〇産業",
            "愛知県 名古屋市 〇〇工業",
            "福岡県 福岡市 〇〇産業",
            "北海道 札幌市 〇〇工業",
        ]
        self.required_qualifications = [
            "金属加工の基礎知識",
            "プラスチック成形の基礎知識",
            "組立ラインの基礎知識",
            "検査技術の基礎知識",
            "包装技術の基礎知識",
            "CADの基礎知識",
            "ガッツ！！",
            "コミュニケーション能力",
            "チームワーク",
            "問題解決能力",
        ]
        self.sample_images = [
            "src/demo/images/thumbnail_a.png",
            "src/demo/images/thumbnail_b.png",
            "src/demo/images/thumbnail_c.png",
        ]

    def image_to_base64(self, image_path: str) -> str:
        """画像ファイルをBase64エンコードされた文字列に変換します。"""
        try:
            with open(image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                return encoded_string
        except FileNotFoundError:
            print(f"Error: {image_path} が見つかりません。")
            return None

    def generate_event_data(self, target_date: "DateModel") -> "EventSchema":
        """
        デモ用のイベントデータを生成します
        """
        
        # target_dateからdatetimeオブジェクトを生成
        event_date = datetime.combine(target_date.target_date, datetime.min.time())
        
        # ランダムな時間（9時〜17時）を設定
        start_hour = randint(9, 16)
        event_start = event_date.replace(hour=start_hour, minute=0, second=0)
        
        # イベント終了時間（開始から1〜3時間後）
        duration_hours = randint(1, 3)
        event_end = event_date.replace(hour=start_hour + duration_hours, minute=0, second=0)
        
        # イベント種別を選択
        event_type_index = randint(0, len(self.event_types) - 1)
        
        # 報酬額（整数）を計算して文字列に変換
        reward_amount = randint(40, 80) * 100  # 4000円から8000円の範囲かつ、100円単位での価格
        reward_str = f"{reward_amount}円"  # 文字列に変換して単位を追加
        
        # タグをJSONストリング形式に変換
        tags_list = sample(self.event_types, k=randint(1, 3))
        tags_json = json.dumps(tags_list, ensure_ascii=False)
        
        event_data = {
            "event_id": str(uuid.uuid4()),
            "company_id": str(uuid.uuid4()),
            "event_type": self.event_types[event_type_index],
            "title": self.event_titles[event_type_index],
            "description": self.event_descriptions[event_type_index],
            "start_date": event_start,
            "end_date": event_end,
            "location": choice(self.event_locations),
            "reward": reward_str,  # 文字列として報酬を設定
            # required_qualifications should be a list, not a comma-separated string
            "required_qualifications": sample(self.required_qualifications, k=randint(1, 3)),
            "available_spots": randint(5, 20),  # 参加可能人数
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "tags": tags_json,
            "image": self.image_to_base64(choice(self.sample_images)),
        }
        return EventSchema(**event_data)

    def generate_event_data_list(self, target_date: "DateModel", num_events: int = None) -> List["EventSchema"]:
        """
        デモ用のイベントデータのリストを生成します
        """
        if num_events is None:
            num_events = randint(5, 10)
        
        event_list = []
        for _ in range(num_events):
            event_data = self.generate_event_data(target_date)
            event_list.append(event_data)
        return event_list