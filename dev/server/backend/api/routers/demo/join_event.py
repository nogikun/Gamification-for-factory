from fastapi import APIRouter

from typing import Dict

# local imports
from src.schemas.api.join_event import FrontendApplicant, EventIdModel

# Routerを作成
router = APIRouter()

@router.post("/demo/join-event")
async def join_event(applicant: FrontendApplicant, event_id_model: EventIdModel) -> Dict[str, str]:
    """
    デモ用イベント参加エンドポイント - 申請者が指定されたイベントに参加する処理を行います
    """
    # 本来はデータベースに申請者情報を保存する処理が必要
    # ここではサンプルの成功メッセージを返す

    # 申請者情報をログに出力（デバッグ用）
    print(f"Applicant: {applicant.json()}")
    print(f"Event ID: {event_id_model.event_id}")

    return {"message": "Successfully joined the event"}