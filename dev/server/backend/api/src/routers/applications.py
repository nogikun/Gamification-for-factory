from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import uuid

# Local imports
from src.schemas.database.application import (
  ApplicationCreate, ApplicationDetail, ApplicationResponse, ApplicationUpdate
)
from src.schemas.database.applicant import Applicant as ApplicantSchema
from src.database import get_db
from src.crud import (
  get_applicants,
  get_applications,
  update_application_status
)

# Routerを作成
router = APIRouter()

# --- 応募関連エンドポイント --- #
@router.get("/applications", response_model=List[ApplicationDetail])
async def get_applications_api(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ApplicationDetail]:
    """API endpoint to get a list of applications."""
    applications = get_applications(db, skip=skip, limit=limit)
    return [ApplicationDetail.model_validate(app) for app in applications]


@router.put("/applications/{application_id}", response_model=ApplicationResponse)
async def update_application_status_api(
    application_id: uuid.UUID,
    application_data: ApplicationUpdate,
    db: Session = Depends(get_db)
) -> ApplicationResponse:
    """API endpoint to update an application's status."""
    updated_application = update_application_status(
        db,
        application_id=application_id,
        data=application_data
    )
    if updated_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationResponse.model_validate(updated_application)

@router.get("/applicants", response_model=List[ApplicantSchema])
async def get_applicants_api(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[ApplicantSchema]:
    """API endpoint to get a list of applicants."""
    db_applicants = get_applicants(db, skip=skip, limit=limit)
    return [ApplicantSchema.model_validate(applicant)
            for applicant in db_applicants]
