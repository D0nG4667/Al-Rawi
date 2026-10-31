---
trigger: always_on
description: Core AI-native engineering standards, documentation-first workflow, typing discipline, and system architecture boundaries for Al-Rawi.
---

# Al-Rawi — AI-Native Architecture & Engineering Rules

## 1. Documentation-First Protocol (Context7)
- Always query **Context7** (`npx ctx7@latest library <name> "<query>"` followed by `npx ctx7@latest docs <libraryId> "<query>"`) before writing or modifying code that touches external libraries or frameworks (`Next.js`, `React`, `Three.js`, `@react-three/fiber`, `@react-three/drei`, `Tailwind CSS`, `FastAPI`, `LangChain`, `LangGraph`, `SQLAlchemy`, `Pydantic`).
- Never rely on stale training-data APIs when configuring Next.js 16 App Router, React 19 hooks/server actions, Tailwind CSS v4, or LangGraph state graphs.

## 2. Strict Type & Annotation Discipline
- **TypeScript (`frontend/`)**:
  - Annotate all component props, custom hooks, server actions, API payloads, and Zustand store slices with explicit interfaces or type aliases.
  - Never use `any` or `@ts-ignore`. Enforce zero errors via `pnpm --dir frontend run typecheck` (`tsc --noEmit`).
- **Python (`backend/`)**:
  - Annotate every function signature (parameters and return types) and class attribute using Python 3.12 type annotations and Pydantic v2 models (`BaseModel`, `ConfigDict`).
  - Enforce lint and formatting cleanliness via `uv --directory backend run ruff check .` and `uv --directory backend run ruff format --check .`.

## 3. System Topology & Separation of Concerns
- **`frontend/` (Next.js 16 + React 19 + WebGL)**:
  - `src/app/` — App Router entrypoints, bilingual metadata, dynamic Open Graph (`api/og/route.tsx`), and role-gated `/admin` command center.
  - `src/components/canvas/` — Isolated `@react-three/fiber` + `@react-three/drei` 3D layer (`SpatialCanvas.tsx`, `HeritageMonument.tsx`) running behind the DOM (`z-0`).
  - `src/components/explore/` — Modular, canvas-first workspace overlays (`ExploreDashboard.tsx`, `ExploreTopBar.tsx`, `SiteHotspotBar.tsx`, `OracleCommandBar.tsx`, `ArchiveSheet.tsx`, `OracleSheet.tsx`, `ManuscriptMessage.tsx`, `MajlisStudioModal.tsx`).
  - `src/components/ui/` — Heritage motif primitives (`HeritageOrnament.tsx`) and glassmorphic UI components.
- **`backend/` (FastAPI + LangGraph + pgvector + Redis)**:
  - `app/api/v1/` — Versioned REST & SSE streaming endpoints (`chat.py`, `ingest.py`, `graph.py`, `voice.py`, `telemetry.py`).
  - `app/services/` — Multi-agent LangGraph pipeline (`agent_graph.py`), hybrid pgvector retrieval (`rag_pipeline.py`), multimodal OCR ingestion (`ocr_pipeline.py`), and knowledge graph extraction (`graph_extractor.py`).
  - `app/core/` — Configuration (`config.py`), async SQLAlchemy 2.0 engine (`database.py`), RBAC (`security.py`), and structured observability (`logging.py`).

## 4. Primary Heritage Knowledge Sources
Ground all historical, architectural, and cultural narratives in authoritative Saudi heritage dossiers:
1. **UNESCO World Heritage Nominations**: *At-Turaif District in ad-Dir'iyah* and *Al-Hijr Archaeological Site (Madâin Sâlih / Hegra)*, plus *Historic Jeddah, the Gate to Makkah*.
2. **Royal Commission for AlUla (RCU) & Diriyah Gate Development Authority (DGDA)**: *Journey Through Time Masterplan* and mud-brick conservation reports.
3. **King Abdulaziz Foundation for Research and Archives (Darah)**: Primary Arabic/English historical historiography and architectural manuscripts.
