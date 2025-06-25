from fastapi import Depends, FastAPI, HTTPException, APIRouter, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

# Local imports
from src.schemas.database.applicant import Applicant as ApplicantSchema, ApplicantCreate
from src.database import get_db
from src.crud import (
    create_applicant,
    update_applicant,
    delete_applicant
)

# Routerを作成
router = APIRouter()

# --- 応募者関連エンドポイント --- #
@router.post("/applicant", response_model=ApplicantSchema, status_code=201)
async def create_applicant_api(
    applicant_data: ApplicantCreate,
    db: Session = Depends(get_db)
) -> ApplicantSchema:
    """API endpoint to create an applicant."""
    try:
        print(f"Received applicant data: {applicant_data}")
        created_applicant = create_applicant(
            db=db,
            applicant_data=applicant_data
        )
        return ApplicantSchema.model_validate(created_applicant)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating applicant: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating applicant: {str(e)}"
        ) from e


@router.put("/applicant/{user_id}", response_model=ApplicantSchema)
async def update_applicant_api(
    user_id: uuid.UUID,
    applicant_data: ApplicantCreate,
    db: Session = Depends(get_db)
) -> ApplicantSchema:
    """API endpoint to update an applicant."""
    updated_applicant = update_applicant(
        db,
        user_id=user_id,
        applicant_data=applicant_data
    )
    if updated_applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return ApplicantSchema.model_validate(updated_applicant)


@router.delete("/applicant/{user_id}", status_code=204)
async def delete_applicant_api(
    user_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """API endpoint to delete an applicant."""
    success = delete_applicant(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return