from fastapi import APIRouter, HTTPException

from typing import List

# local imports
from src.schemas.api.base import DateModel
from src.schemas.database.event import Event as EventSchema
from src.demo.generator import EventGenerator

# Routerを作成
router = APIRouter()

@router.post("/demo/get_events")
async def demo_get_event(target_date: DateModel) -> List[EventSchema]:
    """
    デモ用イベント取得エンドポイント - 指定された日付のイベントリストを返します
    """
    event_generator = EventGenerator()
    generate_event_data = event_generator.generate_event_data_list(target_date)
    if not generate_event_data:
        raise HTTPException(status_code=404, detail="Events not found")
    return generate_event_data
