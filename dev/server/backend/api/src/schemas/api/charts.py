"""
ここでは、`/charts` APIエンドポイントに関連するスキーマを定義する。
"""
from pydantic import BaseModel, Field, validator
from pydantic.color import Color
from typing import Optional, List, Union
from datetime import datetime


class ParticipationInternshipModel(BaseModel):
    """ `/charts/participation_internship` APIのレスポンスモデル """
    month: str = Field(..., description="Month in Japanese (e.g., '1月')")
    internParticipants: int = Field(..., description="Number of intern participants")


class ParticipationInternshipsModel(BaseModel):
    """ `/charts/participation_internships` APIのレスポンスモデル """
    internships: List[ParticipationInternshipModel] = Field(..., description="インターンシップ参加データのリスト")


class GameProgressModel(BaseModel):
    """ `/charts/game_progress` APIのレスポンスモデル """
    value: int = Field(..., ge=0, le=100, description="Game progress value (0-100)")


class GameLogItemModel(BaseModel):
    """ ゲームログの各項目モデル """
    date: str = Field(..., description="Date in M/D format (e.g., '4/3')")
    icon: str = Field(..., description="Icon identifier (e.g., 'campaign', 'military_tech')")
    color: Color = Field(..., description="Color value (supports HEX, RGB, HSL, color names)")
    text: str = Field(..., description="Log message text")
    
    class Config:
        json_encoders = {
            Color: lambda c: c.as_hex()  # JSON出力時はHEX形式で出力
        }


class GameLogsModel(BaseModel):
    """ `/charts/game_logs` APIのレスポンスモデル """
    logs: List[GameLogItemModel] = Field(..., description="Array of game log items")


class CompanyEvaluationModel(BaseModel):
    """ 企業からの評価データモデル """
    id: str = Field(..., description="Unique evaluation identifier")
    companyName: str = Field(..., description="Company name")
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating value (1.0-5.0)")


class CompanyEvaluationsModel(BaseModel):
    """ `/charts/company_evaluations` APIのレスポンスモデル """
    evaluations: List[CompanyEvaluationModel] = Field(..., description="Array of company evaluations")