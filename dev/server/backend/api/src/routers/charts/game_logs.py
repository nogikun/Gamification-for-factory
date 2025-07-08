from fastapi import APIRouter

# local imports
from ...schemas.api.charts import (
    GameLogsModel,
    GameLogItemModel,
    Color,
)
# Routerを作成
router = APIRouter()

@router.get("/charts/game_logs/{user_id}", tags=["charts"])
async def function_name(user_id) -> GameLogsModel:
    """
    エンドポイントの説明

    Returns:
      dict: レスポンスの説明
    """
    
    # ダミーデータの作成
    res = GameLogsModel(
        logs=[
            GameLogItemModel(
                date="2023-01-01",
                icon="campaign",
                color=Color("#FF5733"),  # HEX形式の色
                text="Campaign started"
            ),
            GameLogItemModel(
                date="2023-01-02",
                icon="military_tech",
                color=Color("rgb(0, 128, 0)"),  # RGB形式の色
                text="Military technology upgraded"
            ),
            GameLogItemModel(
                date="2023-01-03",
                icon="research",
                color=Color("hsl(240, 100%, 50%)"),  # HSL形式の色
                text="Research completed"
            ),
            GameLogItemModel(
                date="2023-01-04",
                icon="event",
                color=Color("blue"),  # 色名
                text="Event occurred"
            ),
            GameLogItemModel(
                date="2023-01-05",
                icon="achievement",
                color=Color("#FFD700"),  # HEX形式の色
                text="Achievement unlocked"
            ),
            GameLogItemModel(
                date="2023-01-06",
                icon="trade",
                color=Color("rgb(255, 0, 0)"),  # RGB形式の色
                text="Trade deal made"
            ),
            GameLogItemModel(
                date="2023-01-07",
                icon="exploration",
                color=Color("hsl(120, 100%, 50%)"),  # HSL形式の色
                text="Exploration mission launched"
            ),
        ]
    )
    return res.model_dump()