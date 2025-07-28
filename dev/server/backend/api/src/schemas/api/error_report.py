"""
Error report schemas for client-side error logging
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class ErrorReportRequest(BaseModel):
    """
    クライアントサイドからのエラーレポート用リクエストモデル
    """
    error_message: str = Field(..., description="エラーメッセージ")
    error_type: Optional[str] = Field(None, description="エラーの種類 (例: NetworkError, TypeError等)")
    stack_trace: Optional[str] = Field(None, description="エラーのスタックトレース")
    user_id: Optional[str] = Field(None, description="ユーザーID")
    api_endpoint: Optional[str] = Field(None, description="エラーが発生したAPIエンドポイント")
    request_method: Optional[str] = Field(None, description="HTTPメソッド (GET, POST等)")
    response_status: Optional[int] = Field(None, description="APIレスポンスのステータスコード")
    browser_info: Optional[str] = Field(None, description="ブラウザ情報")
    page_url: Optional[str] = Field(None, description="エラーが発生したページのURL")
    additional_context: Optional[Dict[str, Any]] = Field(None, description="追加のコンテキスト情報")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="エラー発生時刻")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "error_message": "Failed to fetch participation data: Network Error",
                "error_type": "NetworkError",
                "stack_trace": "Error: Network Error\\n    at fetchParticipationData...",
                "user_id": "11111111-1111-1111-1111-111111111111",
                "api_endpoint": "http://localhost:3000/charts/participation_internship/11111111-1111-1111-1111-111111111111",
                "request_method": "GET",
                "response_status": 500,
                "browser_info": "Mozilla/5.0...",
                "page_url": "http://localhost:5173/tab3",
                "additional_context": {"component": "Tab3", "function": "fetchParticipationData"},
                "timestamp": "2025-07-10T04:30:00Z"
            }
        }


class ErrorReportResponse(BaseModel):
    """
    エラーレポート送信の応答モデル
    """
    success: bool = Field(..., description="エラーレポートの受信が成功したかどうか")
    message: str = Field(..., description="応答メッセージ")
    report_id: str = Field(..., description="エラーレポートのID")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="処理時刻")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Error report received successfully",
                "report_id": "report_12345678-1234-1234-1234-123456789012",
                "timestamp": "2025-07-10T04:30:00Z"
            }
        }

# Copyright (c) 2025 nogi
# All rights reserved.
