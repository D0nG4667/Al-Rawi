import time

import psycopg
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.core.config import Settings, get_settings

router = APIRouter()


# Comprehensive Health Endpoint
@router.get("/health", response_class=JSONResponse)
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
    from app.main import redis_client

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
@router.get("/api/v1/health")
async def api_v1_health(settings: Settings = Depends(get_settings)):
    return {"status": "ok", "version": settings.APP_VERSION}
