from fastapi import APIRouter
import logging
import uuid
import json
from datetime import datetime
from pathlib import Path

# local imports
from src.schemas.api.base import DebugModel
from src.schemas.api.error_report import ErrorReportRequest, ErrorReportResponse

# ロガーの設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ログディレクトリのパス
LOGS_BASE_DIR = Path(__file__).parent.parent.parent.parent / "logs" / "error"

def ensure_log_directory():
    """ログディレクトリが存在することを確認し、必要に応じて作成する"""
    LOGS_BASE_DIR.mkdir(parents=True, exist_ok=True)

def save_error_to_file(error_data: ErrorReportRequest, report_id: str):
    """エラーレポートをファイルに保存する"""
    try:
        ensure_log_directory()
        
        # ファイル名を生成（error-report_YYYY-MM-DD_HH-MM-SS.txt）
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"error-report_{timestamp}.txt"
        filepath = LOGS_BASE_DIR / filename
        
        # ファイルに保存する内容を構造化
        log_content = f"""
============================================
ERROR REPORT
============================================
Report ID: {report_id}
Timestamp: {error_data.timestamp}
Generated: {datetime.now().isoformat()}

USER INFORMATION:
- User ID: {error_data.user_id or "Unknown"}

ERROR DETAILS:
- Message: {error_data.error_message}
- Type: {error_data.error_type or "Unknown"}
- API Endpoint: {error_data.api_endpoint or "Unknown"}
- Request Method: {error_data.request_method or "Unknown"}
- Response Status: {error_data.response_status or "Unknown"}

PAGE INFORMATION:
- Page URL: {error_data.page_url or "Unknown"}
- Browser Info: {error_data.browser_info or "Unknown"}

STACK TRACE:
{error_data.stack_trace or "No stack trace available"}

ADDITIONAL CONTEXT:
{json.dumps(error_data.additional_context, indent=2) if error_data.additional_context else "No additional context"}

============================================
"""
        
        # ファイルに書き込み
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(log_content.strip())
        
        logger.info("Error report saved to file: %s", filepath)
        return str(filepath)
        
    except (IOError, OSError, PermissionError) as e:
        logger.error("Failed to save error report to file: %s", str(e))
        return None

# Routerを作成
router = APIRouter()

@router.get("/debug/error-report")
async def debug_error_report(debug_data: DebugModel):
    """
    デバッグ用エラーレポートエンドポイント - エラーを受取り、ロギング処理を行います
    """
    print(f"DEBUG: Received debug data: {debug_data}")
    return {"debug_data": debug_data.model_dump()}


@router.post("/debug/error-report", response_model=ErrorReportResponse)
async def report_client_error(error_data: ErrorReportRequest):
    """
    クライアントサイドからのエラーレポートを受信し、ログに記録する
    
    Args:
        error_data (ErrorReportRequest): クライアントからのエラー詳細情報
        
    Returns:
        ErrorReportResponse: エラーレポート受信の応答
    """
    try:
        # エラーレポートIDを生成
        report_id = f"report_{uuid.uuid4()}"
        
        # 構造化ログとしてエラー情報を記録
        logger.error(
            "CLIENT_ERROR | Report ID: %s | "
            "User: %s | "
            "Error: %s | "
            "Type: %s | "
            "API: %s | "
            "Method: %s | "
            "Status: %s | "
            "Page: %s | "
            "Timestamp: %s",
            report_id,
            error_data.user_id,
            error_data.error_message,
            error_data.error_type,
            error_data.api_endpoint,
            error_data.request_method,
            error_data.response_status,
            error_data.page_url,
            error_data.timestamp
        )
        
        # 詳細なスタックトレースも別途ログに記録
        if error_data.stack_trace:
            logger.error("STACK_TRACE | Report ID: %s | %s", report_id, error_data.stack_trace)
        
        # 追加コンテキストがある場合は記録
        if error_data.additional_context:
            logger.info("ADDITIONAL_CONTEXT | Report ID: %s | %s", report_id, error_data.additional_context)
        
        # エラーレポートをファイルに保存
        saved_filepath = save_error_to_file(error_data, report_id)
        if saved_filepath:
            logger.info("Error report successfully saved to: %s", saved_filepath)
        else:
            logger.warning("Failed to save error report to file for Report ID: %s", report_id)
        
        return ErrorReportResponse(
            success=True,
            message="Error report received and logged successfully",
            report_id=report_id,
            timestamp=datetime.utcnow()
        )
        
    except (ValueError, TypeError, AttributeError) as e:
        logger.error("Failed to process error report: %s", str(e))
        return ErrorReportResponse(
            success=False,
            message=f"Failed to process error report: {str(e)}",
            report_id="error_processing_failed",
            timestamp=datetime.utcnow()
        )
