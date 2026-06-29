from fastapi import APIRouter

from app.api.v1.documents import router as docs_router
from app.api.v1.health import router as health_router

api_router = APIRouter()

# Register health check endpoints (at both root and v1 levels)
api_router.include_router(health_router)

# Register ingestion upload routes with prefix '/api/v1'
api_router.include_router(docs_router, prefix="/api/v1")
