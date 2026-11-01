# Al-Rawi UI/UX Heritage Moat — Design Specification

- **Date:** 2026-10-31
- **Status:** Completed (`milestone/phase-8-ui-ux-moat`)
- **Branch:** Merged into `main`
- **Scope:** Sub-projects 1–4 (Design Foundation, 3D UNESCO Monuments & Hotspots, Canvas-First Explore Workspace, Admin Command Center & OG/PWA Polish)

---

## 1. Executive Summary & Design Philosophy

Al-Rawi (الراوي) is an AI-powered spatial storytelling and RAG research platform for Saudi Arabia's UNESCO World Heritage Sites (*At-Turaif in Ad-Dir'iyah*, *Al-Hijr / Hegra in AlUla*, *Historic Jeddah*).

Previously, the frontend (`ExploreDashboard.tsx`, 944 lines) used generic dark-mode SaaS styling (`#0B0C10`, `Geist` font, permanent left/right sidebars covering 60%+ of the 3D viewport, plain unformatted chat bubbles, and hardcoded colors).

To turn the UI/UX into a defensible product moat, we establish an **Illuminated Najdi & Nabataean Manuscript** aesthetic combined with a **Canvas-First Spatial Architecture**:

1. **Dual Heritage Theme System ("Desert Night Manuscript" & "Sunlit Sandstone")** driven by CSS custom properties (`data-theme="night" | "sandstone"`) and synchronized with the Three.js WebGL atmosphere.
2. **Editorial & Calligraphic Typography** pairing *Reem Kufi* (Arabic display), *Fraunces* (Latin editorial serif), *IBM Plex Sans Arabic* (bilingual UI & long-form reading), and *IBM Plex Mono* (coordinates, citations, and telemetry).
3. **Najdi & Sadu Geometric Motifs** integrated as subtle SVG architectural trims, dividers, and animated reasoning states.
4. **Canvas-First Explore Workspace** decomposing the 944-line `ExploreDashboard.tsx` into modular, strongly typed components (`ExploreTopBar`, `OracleCommandBar`, `ArchiveSheet`, `OracleSheet`, `MajlisStudioModal`) that leave 85%+ of the 3D viewport unobstructed while making RAG citations, progressive manuscript reveals, and audio synthesis feel tactile and museum-grade.

---

## 2. Sub-Project 1: Design Foundation (Tokens, Themes, Typography, Motifs)

### 2.1 Dual Theme Token Architecture

Theme state is controlled via `data-theme="night" | "sandstone"` on `<html>`, initialized from `localStorage("al-rawi-theme")` with fallback to `window.matchMedia("(prefers-color-scheme: light)")`, and mirrored in `useUIStore` so WebGL lighting reacts in real time.

| Semantic Token | Desert Night Manuscript (`night`) | Sunlit Sandstone (`sandstone`) | Purpose |
|---|---|---|---|
| `--bg-canvas` | `#0E1020` (Indigo Obsidian) | `#F4EADB` (Warm Limestone) | Root background & 3D fog color |
| `--bg-surface` | `rgba(18, 21, 38, 0.76)` | `rgba(249, 242, 230, 0.82)` | Primary glassmorphic sheet/HUD fill |
| `--bg-elevated` | `rgba(26, 30, 52, 0.88)` | `rgba(240, 229, 211, 0.92)` | Cards, inputs, citation callouts |
| `--text-primary` | `#F5EFE6` (Warm Parchment) | `#2A1D14` (Deep Umber Ink) | Headings & primary manuscript body |
| `--text-secondary` | `#B8AEA0` (Muted Limestone) | `#5C4938` (Weathered Earth) | Subtitles, metadata, secondary copy |
| `--text-muted` | `#7E7568` (Desert Dust) | `#8A7460` (Carved Stone) | Captions, coordinates, disabled states |
| `--accent-gold` | `#D9A441` (Burnished Astrolabe Gold) | `#A86A1F` (Inscribed Bronze Gold) | Primary interactive accent & focus halo |
| `--accent-terracotta` | `#C8673E` (Hegra Terracotta) | `#B04E28` (Nabataean Red Ochre) | Secondary accent, active badges, voice pulse |
| `--accent-oasis` | `#2E8B6E` (Wadi Palm Emerald) | `#1F6E55` (Oasis Malachite) | Verified RLS/UNESCO provenance indicators |
| `--border-subtle` | `rgba(217, 164, 65, 0.18)` | `rgba(168, 106, 31, 0.22)` | Hairline manuscript borders |
| `--border-strong` | `rgba(217, 164, 65, 0.42)` | `rgba(168, 106, 31, 0.48)` | Active drawer/input borders |

### 2.2 Typography System (`next/font/google`)

Configured in `frontend/src/app/[locale]/layout.tsx` and mapped in `frontend/src/app/globals.css`:
- `--font-display-latin`: `Fraunces` (variable serif, optical size auto) — English display titles and historical section headers.
- `--font-display-arabic`: `Reem_Kufi` (weights 500–700) — Arabic monumental Kufic headers.
- `--font-sans`: `IBM_Plex_Sans_Arabic` (weights 300–700) — unified high-legibility body font for both Arabic and Latin UI.
- `--font-mono`: `IBM_Plex_Mono` (weights 400–600) — GPS coordinates (`tabular-nums`), chunk counts, citation indices `[1]`, and pipeline telemetry.

### 2.3 Heritage SVG Motifs & Ornamentation

Created in `frontend/src/components/ui/HeritageOrnament.tsx`:
- **Najdi Furjat Band (`variant="najdi-band"`)**: Repeating stepped triangular mud-brick frieze pattern used along top/bottom sheet headers.
- **Nabataean Corner Rosette (`variant="corner-rosette"`)**: Subtle geometric corner bracket for manuscript cards and citation callouts.
- **Astrolabe Compass Emblem (`variant="astrolabe"`)**: Precision celestial dial SVG used in the preloader and top HUD brand mark.

---

## 3. Sub-Project 3: Canvas-First Explore Workspace Redesign

### 3.1 Spatial Layout & Viewport Budget

Instead of two permanent sidebars (`w-80` + `w-96`) blocking the 3D scene, the workspace adopts a **Canvas-First HUD** layout:
- **100% Full-Bleed WebGL Canvas** (`Scene.tsx`) occupies `fixed inset-0`.
- **Top Floating HUD (`ExploreTopBar.tsx`)**: Compact glassmorphic bar (`max-w-7xl mx-auto`) with:
  - Brand emblem + title (`Common.title`).
  - **UNESCO Site Teleporter & Geofence Pill**: Interactive selector between *At-Turaif · Diriyah* (`24.7336° N, 46.5728° E`), *Hegra · AlUla* (`26.7917° N, 37.9542° E`), and *Al-Balad · Jeddah* (`21.4858° N, 39.1856° E`), smoothly gliding the 3D camera (`setFocusNode`) and updating contextual prompts.
  - **Persona Segmented Pill**: Toggle between `STORYTELLER` (*Al-Rawi · Oral Chronicler*) and `ACADEMIC` (*Al-Muhaqqiq · Archival Scholar*).
  - **Action Triggers**:
    - **Archive Drawer Toggle** (with badge showing uploaded dossier count).
    - **Oracle Manuscript Drawer Toggle** (with message count badge).
    - **Knowledge Graph Trigger** (`Explore Heritage Map`).
    - **Majlis Studio Trigger** (`Summon the Majlis`).
    - **Theme Switcher** (*Desert Night* / *Sunlit Sandstone*) & **Locale Switcher** (`العربية` / `English`).
- **Bottom Floating Command Bar (`OracleCommandBar.tsx`)**:
  - Anchored at `bottom-6 inset-x-0 mx-auto max-w-2xl`.
  - **Contextual Heritage Starter Chips**: 3 clickable bilingual prompt pills above the input bar that adapt to the active UNESCO site and persona.
  - **Unified Prompt Bar**: Auto-focused via `Cmd/Ctrl+K`, supports text input (`dir="auto"`), `<VoiceInput />`, optional BYOK Gemini API key popover, and keyboard submission (`Enter`).

### 3.2 Slide-Over Sheets (`ArchiveSheet.tsx` & `OracleSheet.tsx`)

- **Archive Sheet (`ArchiveSheet.tsx`)**:
  - Slide-over drawer anchored at `inset-inline-start` (`w-full max-w-md`), dismissible via `Esc` or backdrop/close button.
  - Displays Curated UNESCO Reference Dossiers, Drag-and-Drop PDF Upload (`POST /api/upload`), ingested chunk telemetry badges, and `<DocumentRequestForm />` (`POST /api/request-document`).
- **Oracle Manuscript Sheet (`OracleSheet.tsx`)**:
  - Slide-over drawer anchored at `inset-inline-end` (`w-full max-w-lg`), opening automatically when a question is asked.
  - **Progressive Manuscript Reveal (`ManuscriptMessage.tsx`)**: Renders Oracle responses with a smooth progressive reveal animation (`prefers-reduced-motion` safe), structured paragraph/heading formatting, and clickable inline citation badges (`Source [1]`) that open `<CitationDrawer />`.
  - Integrates `<ThinkingStep />` with Najdi/astrolabe visual polish while the RAG pipeline executes.

### 3.3 Restyled Modals & Overlays (`MindMap.tsx`, `MajlisStudioModal.tsx`, `CitationDrawer.tsx`)

- **`MindMap.tsx`**: Uses theme tokens (`var(--bg-elevated)`, `var(--accent-gold)`, `var(--text-primary)`) for custom ReactFlow nodes, edges, and controls.
- **`MajlisStudioModal.tsx`**: Extracted from `ExploreDashboard.tsx` into a dedicated component for drafting and vocalizing multi-speaker podcasts (`POST /api/podcast/draft` and `POST /api/audio/stream`) with live WebAudio frequency analysis connected to the 3D scene.

### 3.4 Theme-Synchronized 3D Scene (`Scene.tsx`)

- Reads `theme` and `activeHistoricalNode` from `useUIStore`.
- Smoothly adjusts scene background, ambient/directional lighting warmth, and post-processing bloom intensity between `night` (`#0E1020`, warm golden rim light) and `sandstone` (`#F4EADB`, sunlit amber key light).

---

## 4. Accessibility, RTL & Verification Guarantees

1. **Bidi & RTL Parity**: Logical CSS properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `inset-inline-*`, `text-start`) ensure Arabic (`dir="rtl"`) and English (`dir="ltr"`) mirror effortlessly.
2. **Translation Parity**: Every new key in `frontend/messages/en.json` has an exact counterpart in `frontend/messages/ar.json`, verified by `src/tests/i18n-check.js`.
3. **Reduced Motion**: Progressive manuscript reveal and camera transitions respect `prefers-reduced-motion: reduce`.
4. **Automated Verification**: New `frontend/src/tests/ui-moat-check.js` test script added to `pnpm test` verifying dual-theme CSS variables, modular workspace components, and typography configuration alongside all 9 existing test suites.
