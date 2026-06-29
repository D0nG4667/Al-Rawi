from contextlib import asynccontextmanager

import redis.asyncio as aioredis
import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import get_settings
from app.core.logging import setup_logging

# Retrieve application configurations
settings = get_settings()

# Initialize structured logging
setup_logging()

# Initialize Sentry SDK
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

# Redis Connection Pool Placeholder (shared across endpoints)
redis_client = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    global redis_client

    # Initialize Async Redis Connection
    try:
        redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis_client.ping()
    except Exception as e:
        print(f"[-] Redis failed to connect during startup: {e}")

    yield

    # Shutdown logic
    if redis_client:
        await redis_client.close()


app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    lifespan=lifespan,
)

# Mount Static Files Middleware
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root Endpoint: Enterprise Styled landing Page served via FileResponse
@app.get("/")
async def root_endpoint():
    return FileResponse("app/static/index.html")


# Include all assembled API routers (health, ingestion, etc.)
app.include_router(api_router)
