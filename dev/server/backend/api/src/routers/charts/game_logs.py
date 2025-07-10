from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, List
import json
from datetime import datetime

# local imports
from ...schemas.api.charts import (
    GameLogsModel,
    GameLogItemModel,
    Color,
)
from ...database import get_db
from ...models import GameLog, LogType
# Routerを作成
router = APIRouter()

def parse_log_details_and_create_message(log_type_id: int, details: dict, template_message: str) -> str:
    """
    ログタイプとdetailsからメッセージを生成する
    """
    try:
        if log_type_id == 1:  # クエスト開始
            quest_name = details.get("start_quest", "不明なクエスト")
            return template_message.replace("%quest_name%", quest_name)
        elif log_type_id == 2:  # クエスト達成
            quest_name = details.get("complete_quest", "不明なクエスト")
            return template_message.replace("%quest_name%", quest_name)
        elif log_type_id == 3:  # レベルアップ
            new_level = details.get("new_level", 0)
            return template_message.replace("%new_level%", str(new_level))
        elif log_type_id == 4:  # ボス撃破
            boss_name = details.get("boss_name", "不明なボス")
            return template_message.replace("%boss_name%", boss_name)
        elif log_type_id == 5:  # アイテム獲得
            item_name = details.get("item_name", "不明なアイテム")
            quantity = details.get("quantity", 1)
            return template_message.replace("%item_name%", item_name).replace("%quantity%", str(quantity))
        else:
            return template_message
    except Exception:
        return template_message

def get_icon_and_color_for_log_type(log_type_id: int) -> tuple[str, str]:
    """
    ログタイプに基づいてアイコンと色を返す
    """
    icon_color_map = {
        1: ("campaign", "#ef5350"),      # クエスト開始 - 赤
        2: ("military_tech", "#ff7043"), # クエスト達成 - オレンジ
        3: ("trending_up", "#66bb6a"),   # レベルアップ - 緑
        4: ("security", "#ab47bc"),      # ボス撃破 - 紫
        5: ("diamond", "#29b6f6"),       # アイテム獲得 - 青
    }
    return icon_color_map.get(log_type_id, ("info", "#757575"))

@router.get("/charts/game_logs/{user_id}", tags=["charts"])
async def get_game_logs_by_user(
    user_id: str, 
    db: Session = Depends(get_db)
) -> GameLogsModel:
    """
    指定されたユーザーのゲームログを取得する

    Args:
        user_id (str): ユーザーID
        db (Session): データベースセッション

    Returns:
        GameLogsModel: ゲームログデータ
    """
    
    # game_logsテーブルからuser_idでデータを取得
    game_logs = db.query(GameLog, LogType).join(
        LogType, GameLog.log_type_id == LogType.type_id
    ).filter(
        GameLog.user_id == user_id
    ).order_by(GameLog.created_at.desc()).limit(10).all()
    
    # レスポンス用のデータを構築
    logs: List[GameLogItemModel] = []
    
    for game_log, log_type in game_logs:
        # detailsをパース
        details = game_log.details if isinstance(game_log.details, dict) else {}
        
        # メッセージを生成
        message = parse_log_details_and_create_message(
            game_log.log_type_id, 
            details, 
            log_type.template_message
        )
        
        # アイコンと色を取得
        icon, color = get_icon_and_color_for_log_type(game_log.log_type_id)
        
        # 日付をフォーマット（M/D形式）
        if game_log.created_at:
            try:
                date_str = game_log.created_at.strftime("%-m/%-d")
            except (AttributeError, ValueError):
                date_str = game_log.created_at.strftime("%m/%d")
        else:
            date_str = ""
        
        logs.append(
            GameLogItemModel(
                date=date_str,
                icon=icon,
                color=Color(color),
                text=message
            )
        )
    
    return GameLogsModel(logs=logs)