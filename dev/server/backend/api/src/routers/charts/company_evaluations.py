from fastapi import APIRouter

# local imports
from ...schemas.api.charts import (
    CompanyEvaluationsModel,
    CompanyEvaluationModel,
)

# Routerを作成
router = APIRouter()

@router.get("/charts/company_evaluations/{user_id}", tags=["charts"])
async def function_name(user_id) -> CompanyEvaluationsModel:
    """
    エンドポイントの説明

    Returns:
      dict: レスポンスの説明
    """
    
    # ダミーデータの作成
    res = CompanyEvaluationsModel(
        evaluations=[
            CompanyEvaluationModel(
                id="1",
                companyName="株式会社A",
                rating=4.5
            ),
            CompanyEvaluationModel(
                id="2",
                companyName="株式会社B",
                rating=3.8
            ),
            CompanyEvaluationModel(
                id="3",
                companyName="株式会社C",
                rating=4.0
            ),
        ]
    )
    return res