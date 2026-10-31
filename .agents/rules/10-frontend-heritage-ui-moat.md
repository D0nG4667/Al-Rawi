---
trigger: glob
globs:
  - "frontend/**"
description: Frontend UI/UX Heritage Moat design tokens, dual-theme rules, 3D WebGL spatial canvas architecture, bilingual RTL parity, and Biome v2 standards.
---

# Frontend Rules — Heritage Moat UI/UX & 3D WebGL (`frontend/`)

## 1. Aesthetic Direction: "Illuminated Manuscript & Astrolabe"
- **Zero Generic AI SaaS Patterns**: Never introduce generic `slate-900` backgrounds, neon purple/blue SaaS gradients, or cluttered 4-column dashboards.
- **Dual Heritage Theme System**:
  - Always use the semantic CSS variables defined in `frontend/src/app/globals.css` and controlled by `ThemeProvider.tsx` (`data-theme="desert-night"` default `#0E1020` and `data-theme="sunlit-sandstone"` `#F4EADB`):
    - Surfaces & Text: `--bg-obsidian`, `--bg-vellum`, `--fg-parchment`, `--fg-sand`, `--fg-muted`
    - Heritage Pigments: `--accent-gold` (`#D4AF37`), `--accent-terracotta` (`#C86D51`), `--accent-lapis` (`#2A5C8A`), `--accent-emerald` (`#1E6B52`)
    - Borders & Hairlines: `--border-hairline` (`1px` astrolabe brass hairlines)
  - Use the established surface classes (`.heritage-panel`, `.heritage-panel-Elevated`, `.heritage-chip`, `.folio-citation`, `.najdi-border-top`) so both themes adapt automatically.

## 2. Typography & Bilingual (`en` / `ar`) Parity
- **Font Variables**:
  - Display / Historical Headings: `font-display` (`--font-display`: `Fraunces` for Latin, `Reem Kufi` for Arabic)
  - Body Copy: `font-sans` (`--font-sans`: `IBM Plex Sans Arabic`)
  - Coordinates, Latencies & Citations: `font-mono` (`--font-mono`: `IBM Plex Mono`)
- **Strict Translation Parity**:
  - Every key added to `frontend/messages/en.json` MUST be added to `frontend/messages/ar.json` in the same commit.
  - `src/tests/i18n-check.js` enforces exact key-count parity between `en.json` and `ar.json`.
  - Support RTL layout seamlessly using logical CSS properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`).

## 3. Canvas-First Spatial Architecture & 3D Monuments
- Keep at least **70% of the `/explore` viewport unobstructed** so the `@react-three/fiber` stage (`SpatialCanvas.tsx` + `HeritageMonument.tsx`) remains the hero visual experience.
- Maintain modular component boundaries (`< 300` lines per file):
  - `HeritageMonument.tsx`: Procedural UNESCO site silhouettes (*Diriyah*, *Hegra*, *Jeddah*), rotating brass astrolabe gimbal rings, and desert dust particle field.
  - `SiteHotspotBar.tsx`: Interactive 3D camera waypoint selector driving smooth camera transitions.
  - `ArchiveSheet.tsx` & `OracleSheet.tsx`: Collapsible left/right glassmorphic drawers.
  - `ManuscriptMessage.tsx`: Progressive word-cadence reveal and clickable `[Folio N]` citation chips.
  - `MajlisStudioModal.tsx`: Dedicated modal for multi-agent debate and `@xyflow/react` knowledge graph exploration.

## 4. Code Quality & Verification Suite (`Biome v2` + `tsc` + Node Checks)
- Biome formatting rules (`frontend/biome.json`): **tabs** for indentation, **double quotes** for strings, organized imports, and strict accessibility rules (always include explicit `type="button"` or `type="submit"` on `<button>`, use `<output>` instead of `role="status"` divs, and avoid array-index React keys).
- Before completing any frontend change, run:
  ```bash
  pnpm check:web
  ```
  which executes `biome ci .`, `tsc --noEmit`, and all 10 verification suites in `frontend/src/tests/*.js`.
