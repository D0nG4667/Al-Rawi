# Al-Rawi Backend Services

Welcome to the backend architecture for **Al-Rawi**, a conversational oracle and exploration system celebrating the rich historical and architectural legacy of Saudi Arabia's heritage sites.

This backend is built on **FastAPI** and orchestrates high-performance semantic retrieval (RAG) over UNESCO dossiers, historical chronicles, and archaeological guides.

---

## 1. System Architecture & Data Flow

Al-Rawi implements a resilient Retrieval-Augmented Generation (RAG) pipeline optimized for sub-100ms response times, tenant-isolated vector queries, and advanced prompt safety.

```mermaid
graph TD
    A[Client Query] --> B[AI Safety & Guardrails]
    B -- Valid --> C[PGVector Semantic Cache]
    B -- Injection/Off-Topic --> Deflect[Language-Matched Deflection]
    
    C -- Hit < 0.08 Cosine Dist --> ReturnCache[Return Cached Response]
    C -- Miss --> D[Tenant-Isolated Vector Retrieval]
    
    D --> E[Context Summarization & Compression]
    E --> F[Gemini 2.5 Flash Primary LLM]
    F -- Success --> SetCache[Write Cache]
    F -- Fail/Rate Limit --> FallbackLLM[LLM Failover/Fallback]
    
    SetCache --> Return[Client Response]
    FallbackLLM --> Return
```

### Hybrid Vector Search & Retrieval
- **Ingestion:** Documents are parsed, split into character chunks, and embedded using Google's multilingual embeddings. Metadata (sites, dynasties, chronology) is stored as a JSONB payload.
- **Tenant Isolation:** Active tenant collections are dynamically isolated based on the SHA-256 hash of their API keys, enforcing strict row-level security (RLS) policies.
- **Semantic Cache:** Hitting the cache uses a cosine distance threshold of $\le 0.08$ on past queries, matching semantically equivalent questions without invoking downstream LLMs.

---

## 2. Design Patterns Implemented

The Python codebase adheres to clean SOLID principles by utilizing the following design patterns:

### Strategy Pattern (LLM Invocations)
- **Implementation:** Abstracted LLM execution strategy classes. If the primary Google Gemini model experiences API limits, the execution dynamically falls back to alternate models (e.g. OpenAI/Groq) or a high-resilience baseline responder without breaking runtime execution.

### Repository Pattern (Database Access)
- **Implementation:** Data retrieval and storage operations (like RLS collections, pgvector embeddings, and heatmap analytics) are segregated from API route handlers, allowing swapping of databases (e.g. Neon PostgreSQL to local Postgres) without modifying business logic.

### Chain of Responsibility (API Guardrails)
- **Implementation:** Prompts run through a multi-stage validation chain: first checking regex-based injection rules, followed by bilingual classification, before hitting the main vector search layer.

---

## 3. Environment Setup & Configuration

This project manages dependencies using Astral's [uv](https://github.com/astral-sh/uv) tool.

### Environment Variables (.env)
Create a `.env` file under the `/backend` directory containing the following keys:

```env
# Google Gemini API Credentials
GOOGLE_API_KEY=AIzaSy...

# Neon Serverless PostgreSQL DSN (must support pgvector)
DATABASE_URL=postgresql://user:pass@region.neon.tech/neondb?sslmode=require

# Upstash Serverless Redis DSN for Semantic Cache & Rate Limiter
REDIS_URL=rediss://default:token@profound-wildcat.upstash.io:6379

# Sentry Monitoring & Telemetry DSN
SENTRY_DSN=https://sentry.io/...

# LangSmith Monitoring (Optional)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_pt...
LANGCHAIN_PROJECT=al-rawi-backend
```

---

## 4. Development & Verification Commands

### Initializing Environment & Installing Dependencies
Run the following commands under `/backend` to install packages and sync environments:
```bash
uv venv
uv sync
```

### Starting the FastAPI Server
To launch the API locally on port `8000`:
```bash
uv run uvicorn app.main:app --reload
```

### Running the Test Suite
The backend contains 37 automated unit and integration tests checking health check status, guardrails, caches, RLS, and admin endpoints:
```bash
uv run pytest tests/
```

### Running Style Formatter & Linter (Ruff)
Ruff is configured to maintain strict PEP-8 compliance:
```bash
uv run ruff check . --fix
uv run ruff format .
```

---

## 5. Licensing & Attribution

Copyright &copy; 2026 Gabriel Okundaye - Al-Rawi Team.

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license. 

- You are free to share, copy, and redistribute the material in any medium or format.
- You are free to adapt, remix, transform, and build upon the material.
- You must give appropriate credit to **Gabriel Okundaye - Al-Rawi Team**, provide a link to the license, and indicate if changes were made.
- You may not use the material for commercial purposes.

For full details, please refer to the root [LICENSE](../LICENSE) file.
