from fastapi import APIRouter

# local imports
from src.schemas.api.base import DebugModel

# Routerを作成
router = APIRouter()

@router.get("/debug/error-report")
async def debug_error_report(debug_data: DebugModel):
    """
    デバッグ用エラーレポートエンドポイント - エラーを受取り、ロギング処理を行います
    """
    print(f"DEBUG: Received debug data: {debug_data}")
    return {"debug_data": debug_data.model_dump()}
