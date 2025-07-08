from fastapi import APIRouter

from typing import Dict

# Routerを作成
router = APIRouter()

@router.get("/")
async def root() -> Dict[str, str]:
    """Root endpoint."""
    return {"message": "Gamification for factory API"}