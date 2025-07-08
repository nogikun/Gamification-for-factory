from fastapi import APIRouter

# local imports
from ...schemas.api.charts import (
  ParticipationInternshipsModel,
  ParticipationInternshipModel,
)

# Routerを作成
router = APIRouter()

@router.get("/charts/participation_internship/{user_id}", tags=["charts"])
async def function_name(user_id) -> ParticipationInternshipsModel:
    """
    エンドポイントの説明

    Returns:
      dict: レスポンスの説明
    """
    
    # ダミーデータの作成
    res = ParticipationInternshipsModel(
        internships=[
            ParticipationInternshipModel(
                month="1月",
                internParticipants=10
            ),  
            ParticipationInternshipModel(
                month="2月",
                internParticipants=20
            ),
            ParticipationInternshipModel(
                month="3月",
                internParticipants=30
            ),
            ParticipationInternshipModel(
                month="4月",
                internParticipants=40
            ),
        ]
    )
    return res