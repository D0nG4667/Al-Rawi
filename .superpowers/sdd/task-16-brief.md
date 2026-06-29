# Task 16 Brief: Initialize Python Backend Workspace (Enterprise Lifespan & Settings)

We need to implement the core FastAPI application setup including Pydantic settings loading, CORS configuration, database/Redis lifespan initializations, and robust `/health` and `/` endpoints.

## TDD Plan

### Automated Test Cases
1. **Health Check Endpoint**: An integration test requesting `GET /health` and asserting status code 200, containing detailed JSON (status="ok", database="connected", redis="connected").
2. **Root Endpoint**: An integration test requesting `GET /` and asserting status code 200, returning a comprehensive JSON with service metadata.
3. **Settings Validation**: A test verifying that `get_settings()` correctly reads environment variables and returns a valid Pydantic Settings schema.

---

## Tasks & Proposed Changes

### Python API Server Core

#### [NEW] [config.py](../../backend/app/core/config.py)
Configures `Settings` class inheriting from `BaseSettings` validating required environment credentials.

#### [NEW] [main.py](../../backend/app/main.py)
Mounts the main FastAPI application with lifespan context, CORS middlewares, and route declarations.

#### [NEW] [test_health.py](../../backend/tests/test_health.py)
Unit and integration tests verifying health checks and root endpoints.

---

## Verification Plan
- Execute the test suite inside the backend virtual environment:
  ```bash
  cd backend; uv run pytest tests/
  ```
- Run Ruff checks and formatting validations.
