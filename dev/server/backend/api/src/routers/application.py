from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
import uuid

# Local imports
from src.schemas.database.application import (
  ApplicationCreate, ApplicationResponse
)
from src.database import get_db
from src.crud import (
  create_application,
  update_application,
  delete_application
)

# Routerを作成
router = APIRouter()

# --- 応募関連エンドポイント --- #
@router.put("/application/{application_id}", response_model=ApplicationResponse)
async def update_application_api(
    application_id: uuid.UUID,
    application_data: ApplicationCreate,
    db: Session = Depends(get_db)
) -> ApplicationResponse:
    """API endpoint to update an application."""
    updated_application = update_application(
        db,
        application_id=application_id,
        application_data=application_data
    )
    if updated_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationResponse.model_validate(updated_application)


@router.delete("/application/{application_id}", status_code=204)
async def delete_application_api(
    application_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """API endpoint to delete an application."""
    success = delete_application(db, application_id=application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    return

@router.post("/application", response_model=ApplicationResponse, status_code=201)
async def create_application_api(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db)
) -> ApplicationResponse:
    """API endpoint to create an application."""
    try:
        print(f"Received application data: {application_data}")
        created_application = create_application(
            db=db,
            application_data=application_data
        )
        return ApplicationResponse.model_validate(created_application)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating application: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating application: {str(e)}"
        ) from e
