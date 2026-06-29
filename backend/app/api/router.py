from fastapi import APIRouter

from app.api.v1.router import api_router as v1_router

# Central API Router containing all API versions progressively
api_router = APIRouter()

# Mount API V1 routes
api_router.include_router(v1_router)

# Future api versions can be added here seamlessly:
# from app.api.v2.router import api_router as v2_router
# api_router.include_router(v2_router)
