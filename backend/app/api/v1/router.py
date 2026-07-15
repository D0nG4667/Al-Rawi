from fastapi import APIRouter

from app.api.v1.admin import router as admin_router
from app.api.v1.audio import router as audio_router
from app.api.v1.chat import router as chat_router
from app.api.v1.documents import router as docs_router
from app.api.v1.health import router as health_router
from app.api.v1.mindmap import router as mindmap_router
from app.api.v1.podcast import router as podcast_router

api_router = APIRouter()

# Register health check endpoints (at both root and v1 levels)
api_router.include_router(health_router)

# Register ingestion, chat, admin, and mindmap routes with prefix '/api/v1'
api_router.include_router(docs_router, prefix="/api/v1")
api_router.include_router(chat_router, prefix="/api/v1")
api_router.include_router(admin_router, prefix="/api/v1")
api_router.include_router(mindmap_router, prefix="/api/v1")
api_router.include_router(podcast_router, prefix="/api/v1")
api_router.include_router(audio_router, prefix="/api/v1")
