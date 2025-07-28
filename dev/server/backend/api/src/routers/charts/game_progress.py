from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# local imports
from ...schemas.api.charts import GameProgressModel
from ...database import get_db
from ...models import GameProgress

# Routerを作成
router = APIRouter()

@router.get("/charts/game_progress/{user_id}", tags=["charts"])
async def get_game_progress_by_user(
    user_id: str, 
    db: Session = Depends(get_db)
) -> GameProgressModel:
    """
    指定されたユーザーのゲーム進捗を取得する

    Args:
        user_id (str): ユーザーID
        db (Session): データベースセッション

    Returns:
        GameProgressModel: ゲーム進捗データ
    """
    
    # game_progressテーブルからuser_idでデータを取得
    game_progress = db.query(GameProgress).filter(
        GameProgress.user_id == user_id
    ).first()
    
    if game_progress and game_progress.progress_percentage is not None:
        # データベースから取得した進捗率を返す
        progress_value = game_progress.progress_percentage
    else:
        # データが存在しない場合はデフォルト値
        progress_value = 0
    
    return GameProgressModel(value=progress_value)