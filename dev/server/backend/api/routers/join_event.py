from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Dict
import uuid

# Local imports
from src.schemas.api.join_event import JoinEventRequest
from src.schemas.database.applicant import ApplicantCreate
from src.schemas.database.application import ApplicationCreate
from src.database import get_db
from src.crud import create_applicant, create_application


# Routerを作成
router = APIRouter()


# --- イベント参加エンドポイント --- #
@router.post("/join-event")
async def join_event_api(
    request: JoinEventRequest,
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """
    イベント参加エンドポイント - 申請者が指定されたイベントに参加する処理を行います
    """
    import traceback
    print(f"DEBUG: Received request: {request}")
    print(f"DEBUG: Request type: {type(request)}")
    
    try:
        # フロントエンドのデータ構造をApplicantCreateに変換
        frontend_applicant = request.applicant
        print(f"DEBUG: Frontend applicant: {frontend_applicant}")
        
        # 名前を姓名に分割（簡単な実装）
        name_parts = frontend_applicant.name.split(" ", 1)
        last_name = name_parts[0] if len(name_parts) > 0 else ""
        first_name = name_parts[1] if len(name_parts) > 1 else ""
        
        print(f"DEBUG: Split name - last: {last_name}, first: {first_name}")
    except Exception as e:
        print(f"DEBUG: Error in initial processing: {e}")
        print(f"DEBUG: Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Initial processing error: {str(e)}")
    
    # フロントエンドのデータ構造をApplicantCreateに変換
    frontend_applicant = request.applicant
    
    # 名前を姓名に分割（簡単な実装）
    name_parts = frontend_applicant.name.split(" ", 1)
    last_name = name_parts[0] if len(name_parts) > 0 else ""
    first_name = name_parts[1] if len(name_parts) > 1 else ""
    
    # ApplicantCreateオブジェクトを作成
    applicant_data = ApplicantCreate(
        last_name=last_name,
        first_name=first_name,
        mail_address=frontend_applicant.email,
        phone_number=frontend_applicant.phone_num,
        address=frontend_applicant.address,
        birth_date=frontend_applicant.birthdate,
        license=", ".join(frontend_applicant.qualifications) if frontend_applicant.qualifications else None
    )
    
    # 応募者をデータベースに保存
    try:
        created_applicant = create_applicant(db=db, applicant_data=applicant_data)
        print(f"Created applicant: {created_applicant}")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating applicant: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating applicant: {str(e)}"
        ) from e

    # 応募を作成
    application_data = ApplicationCreate(
        event_id=uuid.UUID(request.event_id_model.event_id),
        user_id=created_applicant.user_id,  # 作成した応募者のIDを使用
        message=frontend_applicant.motivation or "参加申請"  # motivationがあればそれを使用、なければデフォルト
    )
    try:
        created_application = create_application(db=db, application_data=application_data)
        print(f"Created application: {created_application}")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating application: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating application: {str(e)}"
        ) from e
    return {"message": "Successfully joined the event"}
