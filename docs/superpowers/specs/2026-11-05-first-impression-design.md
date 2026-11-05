# Al-Rawi First Impression — Design Specification

- **Date:** 2026-11-05
- **Status:** Approved (pending written-spec review)
- **Branch:** `feat/first-impression`
- **Scope:** Sub-project 1 of the "buyer-ready" programme: cinematic landing page, Demo Archive mode,
  guided first-run tour, deep links, and an investor-grade README.

---

## 1. Context & Goals

Al-Rawi must impress three audiences equally: Saudi heritage authorities (Ministry of Culture,
Heritage Commission, RCU, DGDA), tourism corporations and operators, and investors. Today `/`
drops visitors straight into the workspace, the Oracle fails with a raw `Error:` string when no
backend or API key is reachable, there is no onboarding, and the README contains stale facts.

**Goals**

1. A fast, cinematic, bilingual landing page that explains the product in under a minute.
2. The Oracle never breaks during a demo: curated, cited answers when the backend is unavailable.
3. First-time visitors understand the workspace through a short guided tour.
4. Shareable deep links into a specific site, persona, and question.
5. A README that reads like a product brief and contains only true statements.

**Non-goals (later sub-projects)**

- Sub-project 2: mobile/touch hardening, WCAG 2.2 AA audit, 3D performance budgets, offline PWA.
- Sub-project 3: compliance (PDPL/NCA), data residency, audit trails.
- Sub-project 4: white-label theming, visitor analytics, SSO, multi-tenant admin.
- Sub-project 5: additional UNESCO sites, narration voices, itineraries.

---

## 2. Routes & Landing Page

### 2.1 Routes

| Route | Content |
|---|---|
| `/[locale]` | New landing page (server component shell + small client islands) |
| `/[locale]/explore` | Existing workspace (`ExploreDashboard` + `SupportButton`), moved unchanged |

Update every internal link, `public/manifest.json` `start_url` (→ `/en/explore`), and give
`/[locale]/explore` its own `generateMetadata`.

### 2.2 Landing sections (`frontend/src/components/landing/`)

| Component | Content |
|---|---|
| `LandingHero.tsx` | Bilingual headline ("Every stone has a narrator" / "لكل حجر راوٍ"), astrolabe emblem, CTAs **Begin the Journey** (→ `/explore`) and **See how it works** (scroll) |
| `SiteTriptych.tsx` | At-Turaif (inscribed 2010), Hegra (2008), Historic Jeddah (2014): coordinates, one-line story, deep link `/explore?site=<id>` |
| `CapabilityScroll.tsx` | Four scroll-revealed steps: Ask → Cited answer → Knowledge graph → Majlis podcast |
| `TrustBand.tsx` | Primary sources (UNESCO, RCU, DGDA, Darah), "every answer cites its source", Arabic-first. **No fabricated partner logos, endorsements, or metrics.** |
| `AudienceCards.tsx` | Heritage authorities · Tourism operators · Visitors & educators |
| `LandingFooter.tsx` | Final CTA, locale + theme switch, license, contact |

### 2.3 Hero visual

Lightweight SVG + CSS composition (animated Najdi band, astrolabe, layered dune silhouettes).
**No WebGL on the landing page**; the 3D experience is reserved for `/explore`.

### 2.4 Motion

`framer-motion` scroll reveals, existing Lenis smooth scroll. All motion disabled under
`prefers-reduced-motion: reduce`.

---

## 3. Demo Archive Mode

### 3.1 Activation

`askOracle` calls `/api/chat` first. Demo mode answers when the request throws (network error),
returns a 5xx, exceeds an **8 s timeout**, or when `NEXT_PUBLIC_DEMO_MODE=always`. A successful
live response always wins. 4xx responses (e.g. invalid key) surface a localized error, not a demo.

### 3.2 Units

| File | Responsibility |
|---|---|
| `src/lib/demo/demoArchive.ts` | Typed bundled corpus `DemoEntry { id, site, persona, locale, prompt, keywords, answer, sources }`; ≥ 4 entries per site × persona × locale (≥ 48 total) |
| `src/lib/demo/matchDemoAnswer.ts` | Pure `(query, site, persona, locale) => DemoEntry`: exact prompt match → keyword overlap (same site preferred) → site overview fallback |
| `src/lib/oracleClient.ts` | `askOracle(payload, options): Promise<OracleResult>`; `OracleResult = { answer, sources, origin: "live" \| "demo" }` |
| `src/components/explore/DemoBadge.tsx` | "Demo Archive · curated answers" pill shown in `OracleSheet` and `ExploreTopBar` whenever the last answer's origin is `demo` |

`ChatMessage` gains an optional `origin?: "live" | "demo"` field.

### 3.3 Citation integrity

Demo sources cite real, verifiable documents only: the UNESCO World Heritage List entries for
At-Turaif (ref. 1329, `https://whc.unesco.org/en/list/1329`), Hegra (ref. 1293,
`https://whc.unesco.org/en/list/1293`), and Historic Jeddah (ref. 1361,
`https://whc.unesco.org/en/list/1361`). `metadata.page` is set **only** when verified against the
source PDF; otherwise citations stay at document/section level. Answer text stays within facts
supported by those listings (inscription year, criteria, architecture, history).

### 3.4 Majlis, audio & upload in demo mode

- Podcast draft falls back to a bundled two-speaker script per site (replacing the current
  two generic fallback lines).
- Audio falls back to the browser `speechSynthesis` API when `/api/audio/stream` is unavailable.
- PDF upload stays enabled, and on failure shows a localized message:
  "Connect the archive backend to ingest your own dossiers."

### 3.5 Encoding fix

`frontend/messages/en.json` (and `ar.json` if affected) contain mojibake (`A�`) where `·` was
intended. Replace with `·`.

---

## 4. Guided First-Run Tour

### 4.1 Steps

| # | Anchor (`data-tour`) | Message |
|---|---|---|
| 1 | `site-teleporter` (ExploreTopBar) | Choose a UNESCO site; the camera flies there |
| 2 | `persona-pill` (ExploreTopBar) | Pick your narrator: Storyteller or Scholar |
| 3 | `starter-chips` (OracleCommandBar) | Ask a question or tap a suggested inquiry |
| 4 | `citation-chip` (ManuscriptMessage) | Every answer is cited; tap to read the source |

All copy lives in a new `Tour` namespace in both `en.json` and `ar.json`.

### 4.2 Units

- `src/hooks/useGuidedTour.ts`: `{ step, isActive, start, next, back, skip }`, persisted in
  `localStorage("al-rawi-tour-v1")`; auto-starts on first visit after the canvas mounts.
- `src/components/onboarding/GuidedTour.tsx`: spotlight cut-out around the anchor's bounding rect,
  heritage tooltip card (Najdi band, step dots, Back/Next/Skip). Built in-house: no tour library.

### 4.3 Behaviour

- Step 3 → 4 is live: tapping a chip asks the Oracle (demo fallback guarantees a citation exists).
- Keyboard: `Enter`/`→` next, `←` back, `Esc` skip; focus trapped in the card; `aria-live` step
  announcements; spotlight transition disabled under reduced motion; RTL via logical properties.
- Missing anchor (e.g. hidden on small screens): the step is skipped, never throws.
- A `?` button in `ExploreTopBar` restarts the tour.

---

## 5. Deep Links

`/[locale]/explore?site=<diriyah|hegra|jeddah>&persona=<STORYTELLER|ACADEMIC>&q=<text>`

- Parsed by a pure `parseExploreParams(searchParams)` in `src/lib/exploreParams.ts` that returns
  only validated values (unknown values ignored, `q` trimmed and capped at 300 characters).
- `site` → `setActiveSite`, `persona` → `setPersona`, `q` → pre-fills the command bar (not
  auto-submitted).

---

## 6. README

Restructure `README.md`:

1. Hero: bilingual title, one-line value statement, badges (CI, license, Node 26, Python 3.12),
   screenshots of the landing page and `/explore` in both themes captured from the running app
   (stored in `docs/assets/`).
2. Why Al-Rawi: problem, solution, audiences.
3. Try it in 60 seconds: `pnpm --dir frontend install && pnpm dev:web` runs everything in Demo
   Archive mode with no keys or backend.
4. Capabilities, architecture (mermaid), trust & citation integrity, roadmap (sub-projects 2–5
   labelled **planned**).
5. Correct stale facts: replace "pnpm self-manages via devEngines" / "pnpm 12" with
   `packageManager: pnpm@10.23.0`; verify test counts and Quick Start commands.

---

## 7. Error Handling Summary

| Surface | Behaviour |
|---|---|
| Oracle | live → demo → localized styled error; raw `Error:` strings never rendered |
| Landing | static/server-rendered content; no runtime data dependencies |
| Tour | missing anchors skipped silently |
| Deep links | invalid params ignored |

---

## 8. Testing & Definition of Done

New/extended Node check scripts in `frontend/src/tests/`, wired into `pnpm test`:

| Check | Verifies |
|---|---|
| `demo-check.js` | ≥ 4 entries per site × persona × locale; every entry has ≥ 1 source with a `whc.unesco.org` URL; matcher returns exact matches and a fallback for unknown queries |
| `landing-check.js` (extended) | Landing components exist; `/explore` route exists; `parseExploreParams` validates input |
| `tour-check.js` | 4 steps; every `data-tour` anchor exists in components; every `Tour.*` key exists in both locales |
| `i18n-check.js` (extended) | Key parity plus rejection of mojibake sequences (`A�`, `Ã`) |

**Done when:**

- `pnpm check:web` passes and `pnpm --dir frontend build` succeeds.
- Manual browser verification of landing, demo answers, tour, deep links, both themes, EN and AR.
- Lighthouse (mobile) on the landing page: Performance ≥ 90, Accessibility ≥ 95.
- Work lands via PR from `feat/first-impression` into `main` with Conventional Commits.
