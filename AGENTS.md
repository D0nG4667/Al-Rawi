# Architecture System Blueprint
- **Framework**: Next.js 16 (App Router with Turbopack), React 19, Tailwind CSS v4, Biome v2 (`Node 26 LTS`, `pnpm@10.23.0`).
- **Design System & Heritage Moat**: Dual-theme *Illuminated Manuscript & Astrolabe* token system (`desert-night` `#0E1020` & `sunlit-sandstone` `#F4EADB`), `Fraunces` + `Reem Kufi` + `IBM Plex Sans Arabic` + `IBM Plex Mono` typography, and Najdi/Astrolabe SVG geometry.
- **WebGL Layer**: Isolated `@react-three/fiber` and `@react-three/drei` spatial canvas (`SpatialCanvas.tsx`, `HeritageMonument.tsx`) rendering procedural UNESCO silhouettes (*Diriyah*, *Hegra*, *Historic Jeddah*), rotating brass astrolabe gimbals, and interactive camera waypoints (`SiteHotspotBar.tsx`).
- **UI Animation**: `framer-motion` for glassmorphic sheets and progressive manuscript reveals, `gsap` + `@studio-freight/lenis` for smooth scroll-bound 3D transformations.
- **Core API**: FastAPI (`Python 3.12`, `uv`) running a multi-agent `LangGraph` + `LangChain` pipeline backed by Gemini 2.5 Flash, hybrid `pgvector` retrieval (`PostgreSQL 18`), and `Redis 8` semantic caching.

# Workspace Agent Rules (`.agents/rules/`)
Specialized AI-native engineering rules are organized with progressive disclosure in `.agents/rules/`:
- [`.agents/rules/00-architecture-and-ai-engineering.md`](.agents/rules/00-architecture-and-ai-engineering.md) (`always_on`): Context7 documentation-first protocol, strict TypeScript/Python typing, and monorepo boundaries.
- [`.agents/rules/10-frontend-heritage-ui-moat.md`](.agents/rules/10-frontend-heritage-ui-moat.md) (`globs: ["frontend/**"]`): Dual-theme tokens, bilingual `en`/`ar` RTL parity, canvas-first 3D monument architecture, and Biome v2 standards.
- [`.agents/rules/20-backend-rag-and-langgraph.md`](.agents/rules/20-backend-rag-and-langgraph.md) (`globs: ["backend/**"]`): Async SQLAlchemy 2.0 + `pgvector`, grounded LangGraph citations, SSRF/RBAC security, and fast mocked `pytest` execution.
- [`.agents/rules/30-devops-ci-and-git-workflow.md`](.agents/rules/30-devops-ci-and-git-workflow.md) (`always_on`): Node 26 LTS / Python 3.12 toolchain lockfile hygiene, verified GitHub Actions tag pinning, Trunk-Based Development, and Conventional Commits (`<= 100` chars).

# Base Data Source
1. **Al-Rawi (Heritage & Tourism)**
You need rich, historical, and architectural documents that give the AI a lot of narrative depth to work with.

- **UNESCO World Heritage Nominations**: This is the goldmine. Countries must submit massive, 300+ page dossiers to UNESCO to get sites approved. They are packed with maps, history, and raw data.
  - Search terms: `site:unesco.org "Al-Hijr Archaeological Site" filetype:pdf` or `site:unesco.org "At-Turaif District in ad-Dir'iyah" filetype:pdf`
- **Royal Commission for AlUla (RCU) & DGDA**: Both authorities publish massive Masterplan and Sustainability reports.
  - Where to look: The "Publications" or "Media" sections of the RCU and Diriyah Gate websites. Look for the *"Journey Through Time Masterplan"* PDF.
- **King Abdulaziz Foundation for Research and Archives (Darah)**: They often publish English/Arabic historical journals and research papers on the unification of Saudi Arabia.
