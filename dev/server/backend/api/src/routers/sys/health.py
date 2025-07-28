from fastapi import APIRouter

from typing import Dict

# Routerを作成
router = APIRouter()

@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}
# Copyright (c) 2025 nogi, nogikun
# All rights reserved.
