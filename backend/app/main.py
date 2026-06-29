import time
from contextlib import asynccontextmanager

import psycopg
import redis.asyncio as aioredis
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

from app.core.config import Settings, get_settings

# Redis Connection Pool Placeholder
redis_client = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    global redis_client
    settings = get_settings()

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
    title="Al-Rawi API",
    version="0.1.0",
    description="Saudi Heritage & Tourism AI Oracle API Platform",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root Endpoint: Enterprise Styled landing Page
@app.get("/", response_class=HTMLResponse)
async def root_endpoint(settings: Settings = Depends(get_settings)):
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{settings.APP_NAME}</title>
        <style>
            body {{
                background-color: #0B0C10;
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-h: 80vh;
            }}
            .panel {{
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px border rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 30px;
                max-width: 600px;
                width: 100%;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            }}
            h1 {{
                font-size: 24px;
                margin-top: 0;
                letter-spacing: 1px;
                color: #66FCF1;
            }}
            p {{
                font-size: 14px;
                opacity: 0.8;
                line-height: 1.6;
            }}
            .meta {{
                font-size: 12px;
                opacity: 0.6;
                margin-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 15px;
            }}
            .tag {{
                background: #1F2833;
                color: #66FCF1;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-family: monospace;
            }}
        </style>
    </head>
    <body>
        <div class="panel">
            <h1>{settings.APP_NAME}</h1>
            <p>Welcome to the enterprise API gateway for Al-Rawi. This system coordinates semantic vector searches, GraphRAG spatial mappings, and diacritized speech synthesis.</p>
            <div class="meta">
                <p>Status: <span class="tag">Active</span> &nbsp; Version: <span class="tag">{settings.APP_VERSION}</span></p>
                <p>Environment Prefix: <span class="tag">{settings.API_V1_STR}</span></p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content


# Comprehensive Health Endpoint
@app.get("/health", response_class=JSONResponse)
async def health_check(settings: Settings = Depends(get_settings)):
    status = "healthy"
    db_status = "connected"
    redis_status = "connected"
    db_latency_ms = 0.0
    redis_latency_ms = 0.0

    # 1. Check Neon PostgreSQL connection and latency
    try:
        t_start = time.perf_counter()
        async with await psycopg.AsyncConnection.connect(
            settings.DATABASE_URL, timeout=5.0
        ) as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT 1")
        db_latency_ms = round((time.perf_counter() - t_start) * 1000, 2)
    except Exception as e:
        status = "degraded"
        db_status = f"disconnected: {e}"

    # 2. Check Redis connection and latency
    if redis_client:
        try:
            t_start = time.perf_counter()
            await redis_client.ping()
            redis_latency_ms = round((time.perf_counter() - t_start) * 1000, 2)
        except Exception as e:
            status = "degraded"
            redis_status = f"disconnected: {e}"
    else:
        status = "degraded"
        redis_status = "disconnected"

    return {
        "status": status,
        "database": {"status": db_status, "latency_ms": db_latency_ms},
        "redis": {"status": redis_status, "latency_ms": redis_latency_ms},
        "version": settings.APP_VERSION,
    }


# Mock API V1 root route for checks
@app.get("/api/v1/health")
async def api_v1_health(settings: Settings = Depends(get_settings)):
    return {"status": "ok", "version": settings.APP_VERSION}
