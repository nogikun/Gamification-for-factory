from fastapi import APIRouter, HTTPException
import os
import json
import base64
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Local imports
from src.schemas.api.base import DateModel
from src.schemas.database.event import Event as EventSchema
from src.classes.db_connector import DBConnector


# Routerを作成
router = APIRouter()

@router.post("/get-events", operation_id="get_events_by_date")
async def get_event(target_date: DateModel) -> List[EventSchema]:
    """
    イベント取得エンドポイント - 指定された日付のイベントリストをデータベースから取得します
    """
    # リクエストデータをログ出力
    print("Received request for /get-events")
    print("Raw target_date object:", target_date)
    print("target_date.target_date:", target_date.target_date)
    print("target_date type:", type(target_date.target_date))
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        database_url = "postgresql://postgres:postgres@postgres:5432/gamification"
    
    db_connector = DBConnector(
        db_url = database_url,  # 環境変数からデータベースURLを取得
        debug = False           # デバッグモードを有効にする
    )

    search_date = target_date.target_date  # DateModelオブジェクトからdateを取得
    try:
        # データベースから指定された日付のイベントを取得
        events = db_connector.select_events_by_date(search_date)
        if not events:
            # イベントが見つからない場合は空のリストを返す
            return []

    except Exception as e:
        print(f"データベースからイベントを取得中にエラーが発生しました: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error") from e

    # イベントデータをPydanticモデルに変換
    event_list = []
    for event in events:
        # tagsをJSON文字列からタグオブジェクト（color, label）のリストに変換
        tags_data = []
        if isinstance(event.tags, str) and event.tags:
            try:
                # JSONから変換を試みる
                parsed_tags = json.loads(event.tags)
                
                if isinstance(parsed_tags, list):
                    for tag in parsed_tags:
                        if isinstance(tag, str):
                            # 文字列タグからcolorとlabelを持つオブジェクトを生成
                            hash_val = sum(ord(c) for c in tag) % 360
                            tags_data.append({"color": f"hsl({hash_val}, 70%, 60%)", "label": tag})
                        elif isinstance(tag, dict) and "label" in tag:
                            # すでにオブジェクトの場合はそのまま追加（colorがなければ生成）
                            if "color" not in tag:
                                hash_val = sum(ord(c) for c in tag["label"]) % 360
                                tag["color"] = f"hsl({hash_val}, 70%, 60%)"
                            tags_data.append(tag)
                else:
                    # 単一の値の場合
                    if isinstance(parsed_tags, str):
                        hash_val = sum(ord(c) for c in parsed_tags) % 360
                        tags_data.append({"color": f"hsl({hash_val}, 70%, 60%)", "label": parsed_tags})
                    elif isinstance(parsed_tags, dict) and "label" in parsed_tags:
                        if "color" not in parsed_tags:
                            hash_val = sum(ord(c) for c in parsed_tags["label"]) % 360
                            parsed_tags["color"] = f"hsl({hash_val}, 70%, 60%)"
                        tags_data.append(parsed_tags)
            except json.JSONDecodeError:
                # JSONでない場合はカンマで分割してリスト化を試みる
                for tag in [t.strip() for t in event.tags.split(',') if t.strip()]:
                    hash_val = sum(ord(c) for c in tag) % 360
                    tags_data.append({"color": f"hsl({hash_val}, 70%, 60%)", "label": tag})
        elif isinstance(event.tags, list):
            # リストの場合は各要素を適切に変換
            for tag in event.tags:
                if isinstance(tag, str):
                    hash_val = sum(ord(c) for c in tag) % 360
                    tags_data.append({"color": f"hsl({hash_val}, 70%, 60%)", "label": tag})
                elif isinstance(tag, dict) and "label" in tag:
                    if "color" not in tag:
                        hash_val = sum(ord(c) for c in tag["label"]) % 360
                        tag["color"] = f"hsl({hash_val}, 70%, 60%)"
                    tags_data.append(tag)
        # tagsに元のデータを保持（デバッグ用）
        tags = tags_data

        # 画像データをBase64エンコードされた文字列に変換
        image_str = None
        if hasattr(event, 'image') and event.image:
            if isinstance(event.image, bytes):
                image_str = base64.b64encode(event.image).decode('utf-8')
            else:
                # すでに文字列の場合はそのまま使用 (またはエラー処理)
                image_str = event.image
        else:
            image_str = None

        # required_qualifications を文字列からリストに変換
        required_qualifications_list = []
        if isinstance(event.required_qualifications, str) and event.required_qualifications:
            # カンマ区切りの文字列をリストに変換
            required_qualifications_list = [q.strip() for q in event.required_qualifications.split(',') if q.strip()]
        elif isinstance(event.required_qualifications, list):
            required_qualifications_list = [str(q) for q in event.required_qualifications]
        elif event.required_qualifications is None:
            required_qualifications_list = []

        # データ型を適切に変換してEventSchemaオブジェクトを作成
        event_data = EventSchema(
            event_id=event.event_id,  # UUIDをそのまま使用
            company_id=event.company_id,  # UUIDをそのまま使用
            event_type=event.event_type,
            title=event.title,
            description=event.description,
            start_date=event.start_date,
            end_date=event.end_date,
            location=event.location,
            reward=event.reward,
            required_qualifications=required_qualifications_list,  # リストとして渡す
            available_spots=event.available_spots,
            created_at=event.created_at,
            updated_at=event.updated_at,
            tags=tags,  # タグオブジェクトの配列をそのまま渡す
            image=image_str # 修正：Base64エンコードされた画像文字列
        )
        event_list.append(event_data)
    return event_list
