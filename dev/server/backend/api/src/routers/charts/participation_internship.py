from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import Dict, List

# local imports
from ...schemas.api.charts import (
  ParticipationInternshipsModel,
  ParticipationInternshipModel,
)
from ...database import get_db
from ...models import Participant

# Routerを作成
router = APIRouter()

@router.get("/charts/participation_internship/{user_id}", tags=["charts"])
async def get_participation_internship_by_user(
    user_id: str, 
    db: Session = Depends(get_db)
) -> ParticipationInternshipsModel:
    """
    指定されたユーザーの月別参加数を取得する

    Args:
        user_id (str): 参加者のユーザーID
        db (Session): データベースセッション

    Returns:
        ParticipationInternshipsModel: 月別参加数データ
    """
    
    # 月別の参加数を集計するクエリ
    monthly_counts = db.query(
        extract('month', Participant.created_at).label('month'),
        func.count(Participant.participant_id).label('count')
    ).filter(
        Participant.user_id == user_id
    ).group_by(
        extract('month', Participant.created_at)
    ).order_by('month').all()
    
    # 月名のマッピング
    month_names: Dict[int, str] = {
        1: "1月", 2: "2月", 3: "3月", 4: "4月", 5: "5月", 6: "6月",
        7: "7月", 8: "8月", 9: "9月", 10: "10月", 11: "11月", 12: "12月"
    }
    
    # クエリ結果を辞書に変換（月 -> 件数）
    month_counts_dict = {int(month_num): count for month_num, count in monthly_counts}
    
    # レスポンス用のデータを構築（全12ヶ月分、データがない月は0）
    internships: List[ParticipationInternshipModel] = []
    
    for month in range(1, 13):  # 1月から12月まで
        count = month_counts_dict.get(month, 0)  # データがない月は0
        internships.append(
            ParticipationInternshipModel(
                month=month_names[month],
                internParticipants=count
            )
        )
    
    return ParticipationInternshipsModel(internships=internships)
# Copyright (c) 2025 nogi
# All rights reserved.
