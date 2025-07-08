from fastapi import APIRouter

# local imports
from ...schemas.api.charts import GameProgressModel

# Routerを作成
router = APIRouter()

@router.get("/charts/game_progress/{user_id}", tags=["charts"])
async def function_name(user_id) -> GameProgressModel:
    """
    エンドポイントの説明

    Returns:
      dict: レスポンスの説明
    """
    
    # ダミーデータの作成
    res = GameProgressModel(value=75)  # 例として75%の進捗を返す
    return res