"""
Main FastAPI application for Gamification API.
"""
# ---------------------------------------------------------------------
#  Imports
# ---------------------------------------------------------------------
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv

# Routers
from routers.sys import root, health
from routers.debug import error_report
from routers.func import ai_review
from routers import (
    event,
    applicant,
    application,
    applications,
    review,
    reviews,
    get_events,
    join_event,
)
from routers.api import prefix as api_prefix
from routers.demo import (
    get_events as demo_get_events,
    join_event as demo_join_event,
)

load_dotenv()  # .envファイルから環境変数を読み込む

# ---------------------------------------------------------------------
#  Create FastAPI app instance
# ---------------------------------------------------------------------
app = FastAPI(
    title="Gamification API",
    description="Gamification for factory API server",
    version="0.2.0",
)
# ---------------------------------------------------------------------
#  CORSミドルウェアの設定
# ---------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
#  Register routers
# ---------------------------------------------------------------------
app.include_router(root.router)  # /sys/root
app.include_router(health.router)  # /sys/health
app.include_router(error_report.router)  # /debug/error_report
app.include_router(get_events.router)  # /get_events
app.include_router(join_event.router)  # /join_event
app.include_router(ai_review.router)  # /func/ai_review
app.include_router(event.router)  # /event
app.include_router(applicant.router)  # /applicant
app.include_router(application.router)  # /application
app.include_router(applications.router)  # /applications
app.include_router(review.router)  # /review
app.include_router(reviews.router)  # /reviews
app.include_router(get_events.router)  # /get-events
app.include_router(join_event.router)  # /join-event
app.include_router(api_prefix.api_router)  # /api（APIプレフィックス付きルーター）
app.include_router(demo_get_events.router)  # /demo/get-events
app.include_router(demo_join_event.router)  # /demo/join-event


# ---------------------------------------------------------------------
#  Custom Handlers
# ---------------------------------------------------------------------

# カスタム例外ハンドラーを追加
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    import traceback

    print(f"Unhandled exception: {exc}")
    print(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500, content={"detail": f"Internal server error: {str(exc)}"}
    )


# Pydanticバリデーションエラーハンドラーを追加
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("Validation error for request:", request.url)
    try:
        body = await request.body()
        print("Request body:", body.decode("utf-8") if body else "Empty body")
    except Exception as e:
        print("Could not read request body:", str(e))
    print("Validation errors:", exc.errors())
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
            "message": "リクエストの形式が正しくありません。日付は 'YYYY-MM-DD' 形式で送信してください。",
        },
    )


# ---------------------------------------------------------------------
#  Main entry point
# ---------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
