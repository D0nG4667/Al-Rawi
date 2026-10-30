# Multi-stage production Dockerfile for Al-Rawi FastAPI Backend

# Stage 1: Dependency builder using official astral-sh/uv image
FROM ghcr.io/astral-sh/uv:latest AS uv-installer

FROM python:3.12-slim AS builder

WORKDIR /app

# Copy uv binary from installer image
COPY --from=uv-installer /uv /uvx /bin/

# Environment configurations for uv
ENV UV_SYSTEM_PYTHON=1 \
    UV_COMPILE_BYTECODE=1

# Copy dependency specifications
COPY pyproject.toml ./
# If uv.lock exists it will be copied, otherwise uv sync resolves
COPY uv.lock* ./

# Install production dependencies from pyproject.toml
RUN uv pip install --system .

# Stage 2: Final lightweight runtime container
FROM python:3.12-slim AS runner

WORKDIR /app

# Install system dependencies if required (curl for healthchecks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed site-packages and binaries from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application source code
COPY app ./app
COPY pyproject.toml ./

# Expose port 8000 for FastAPI Uvicorn server
EXPOSE 8000

# Default environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=8000

# Container entrypoint script supporting both Uvicorn API server and ARQ worker
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
