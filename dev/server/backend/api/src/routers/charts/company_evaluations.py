from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List

# local imports
from ...schemas.api.charts import (
    CompanyEvaluationsModel,
    CompanyEvaluationModel,
)
from ...database import get_db
from ...models import Review

# Routerを作成
router = APIRouter()

@router.get("/charts/company_evaluations/{user_id}", tags=["charts"])
async def get_company_evaluations_by_user(
    user_id: str, 
    db: Session = Depends(get_db)
) -> CompanyEvaluationsModel:
    """
    指定されたユーザーに対する企業からの評価を取得する

    Args:
        user_id (str): ユーザーID（reviewee_id）
        db (Session): データベースセッション

    Returns:
        CompanyEvaluationsModel: 企業評価データ
    """
    
    # reviewsテーブルからreviewee_idでデータを取得し、企業名も取得
    # companyテーブルとusersテーブルをJOINして企業名を取得
    query = text("""
        SELECT 
            r.review_id::text as id,
            COALESCE(c.company_name, u.user_name, 'Unknown Company') as company_name,
            r.rating
        FROM reviews r
        LEFT JOIN users u ON r.reviewer_id = u.user_id
        LEFT JOIN company c ON r.reviewer_id = c.user_id
        WHERE r.reviewee_id = :user_id
        ORDER BY r.created_at DESC
    """)
    
    result = db.execute(query, {"user_id": user_id}).fetchall()
    
    # レスポンス用のデータを構築
    evaluations: List[CompanyEvaluationModel] = []
    
    for row in result:
        evaluations.append(
            CompanyEvaluationModel(
                id=row.id,
                companyName=row.company_name,
                rating=float(row.rating)
            )
        )
    
    return CompanyEvaluationsModel(evaluations=evaluations)
# Copyright (c) 2025 nogi
# All rights reserved.
