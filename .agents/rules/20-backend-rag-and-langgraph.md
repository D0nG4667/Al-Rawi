---
trigger: glob
globs: "backend/**"
description: Backend FastAPI, LangGraph multi-agent orchestration, pgvector hybrid RAG, security, and pytest performance standards.
---

# Backend Rules — FastAPI, LangGraph & Hybrid RAG (`backend/`)

## 1. Async-First Database & I/O Discipline
- Use async SQLAlchemy 2.0 (`AsyncSession`, `async_sessionmaker`) with `asyncpg` and `pgvector` (`app/core/database.py`).
- Never block the FastAPI event loop inside `async def` endpoints or services. Offload CPU-bound PDF/OCR work (`PyMuPDF` / `pytesseract`) or synchronous SDK calls appropriately.
- Maintain connection pool health (`pool_pre_ping=True`) and support both PostgreSQL (`pgvector`) in production/CI and SQLite (`aiosqlite`) in isolated unit tests.

## 2. LangGraph Multi-Agent & RAG Pipeline Invariants
- **Grounded Citations**: Every response from the RAG pipeline (`app/services/rag_pipeline.py`) and LangGraph orchestrator (`app/services/agent_graph.py`) must preserve source metadata (`source`, `page`, `score`) so the frontend can render interactive manuscript folio citations.
- **Persona Fidelity**: Keep system prompts and persona routing (`scholar`, `storyteller`, `architect`, `economist`) historically rigorous and aligned with UNESCO, RCU, DGDA, and Darah primary sources.
- **Graceful Degradation Without Credentials**:
  - When `GOOGLE_API_KEY` or `REDIS_URL` is unset (such as in local unit tests or fork PRs), services MUST fail fast or fall back cleanly without triggering multi-minute exponential backoff retry loops.

## 3. Security & Access Control
- **Admin RBAC**: All mutating ingestion and telemetry management endpoints (`/api/v1/ingest/*`, admin operations) must enforce `Depends(verify_admin)` (`app/core/security.py`).
- **SSRF Protection**: Any URL ingestion path must validate scheme (`http` / `https` only) and reject loopback, link-local, RFC1918 private networks, and cloud metadata IPs before fetching.
- **Structured Logging**: Use `get_logger(__name__)` (`app/core/logging.py`) instead of bare `print()` statements.

## 4. Testing & Lint Verification (`uv` + `Ruff` + `pytest`)
- Mock external LLM, embedding, and network calls in `backend/tests/` (`FakeEmbeddings`, `AsyncMock`, `monkeypatch`) so the entire backend test suite completes in under 2 minutes with zero external network dependencies.
- Before completing any backend change, run:
  ```bash
  pnpm check:api
  ```
  which executes `ruff check .`, `ruff format --check .`, and `pytest -q`.
