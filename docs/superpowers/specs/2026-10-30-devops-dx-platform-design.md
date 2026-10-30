# DevOps & Developer Experience Platform — Design Spec

- **Date:** 2026-10-30
- **Status:** Approved (brainstorming session)
- **Branch:** `chore/devops-dx-platform` (stacked on `fix/phase-6-integration-review`)

## 1. Problem

| Area | Current state | Pain |
|---|---|---|
| Git hooks | Husky in `frontend/.husky` (`core.hooksPath=frontend/.husky`) + lint-staged | `pnpm lint` / `pnpm format` run on the whole project per commit (~60s); Husky lives inside one package of a monorepo |
| Toolchain | No Node / pnpm / Python pins | "Works on my machine" drift between contributors and CI |
| Line endings | No `.gitattributes` | CRLF-only diffs constantly show files as modified on Windows |
| Local services | Backend expects Postgres+pgvector and Redis on localhost | No reproducible way to run them |
| CI | `ci.yml` and `deploy.yml` overlap | No path filtering, no run cancellation, no uv cache, no Docker build, no security scanning |
| Release / deps | None | No changelog, no tags, no automated dependency updates, no PR template / CODEOWNERS |

## 2. Goals & Non-Goals

**Goals**
- Sub-5-second pre-commit hooks that only touch staged files, auto-fix, and restage.
- Identical quality gates locally (`pnpm check`) and in CI.
- One-command local stack (`pnpm services:up` + `pnpm dev`).
- Fast, path-aware, secure CI with a single required status check.
- Automated changelog/releases and dependency updates from existing Conventional Commits.

**Non-Goals**
- No pnpm-workspace / Turborepo restructure (lockfile stays in `frontend/`).
- No `mise` / `just` (avoid extra global installs on Windows).
- No change to deploy targets: Vercel (frontend) and Render (backend) keep deploying via their Git integrations; CI is the gate.

## 3. Design

### Unit 1 — Lefthook (replaces Husky + lint-staged)

Root `lefthook.yml`:

| Hook | Command | Scope | Notes |
|---|---|---|---|
| `pre-commit` (parallel) | `pnpm exec biome check --write --no-errors-on-unmatched {staged_files}` | `root: frontend/`, glob `*.{js,jsx,ts,tsx,json,jsonc,css}` | `stage_fixed: true` |
| | `uv run ruff check --fix {staged_files}` then `uv run ruff format {staged_files}` | `root: backend/`, glob `*.py` | `stage_fixed: true` |
| | `gitleaks protect --staged` | repo | skipped with a hint if gitleaks is not installed |
| `commit-msg` | `pnpm exec commitlint --edit {1}` | root | config moves to root `commitlint.config.mjs` |
| `pre-push` (parallel) | `pnpm exec tsc --noEmit`, `pnpm test` | `root: frontend/` | only when frontend files are in the pushed range |
| | `uv run pytest -q` | `root: backend/` | only when backend files are in the pushed range |

Installation: root `package.json` (private, no workspace) with devDependencies `lefthook`, `@commitlint/cli`, `@commitlint/config-conventional`, `concurrently`. One-time migration: `lefthook install --reset-hooks-path`, then remove `frontend/.husky`, `frontend/.lintstagedrc`, `frontend/commitlint.config.js`, and the `husky` / `lint-staged` / commitlint devDependencies + `prepare` script from `frontend/package.json`. A `lefthook-local.yml` is gitignored for personal overrides.

### Unit 2 — Reproducible toolchain & editor

- `.node-version` → `22`; `.python-version` → `3.12`; `"packageManager": "pnpm@10.23.0"` in both `package.json` files (Corepack).
- `.editorconfig` (UTF-8, LF, final newline, tabs for TS/JSON per Biome, 4 spaces for Python).
- `.gitattributes`: `* text=auto eol=lf`, binary rules for `*.glb *.png *.jpg *.ico *.pdf`, plus one `git add --renormalize .` commit.
- `.vscode/extensions.json` (Biome, Ruff, Python, Tailwind CSS, EditorConfig, Docker, GitHub Actions) and shared `.vscode/settings.json`; `.gitignore` un-ignores exactly these two files.

### Unit 3 — One-command local stack

- `docker-compose.yml`: `db` = `pgvector/pgvector:pg16` (port 5432, healthcheck `pg_isready`, volume `pgdata`, db `neondb`), `redis` = `redis:7-alpine` (port 6379, healthcheck `redis-cli ping`).
- Root scripts:
  - `dev` → `concurrently -n api,web` running `uv run --project backend uvicorn app.main:app --reload` and `pnpm --dir frontend dev`
  - `services:up` / `services:down` → `docker compose up -d --wait` / `docker compose down`
  - `check` → frontend `biome ci` + `tsc` + `test`, backend `ruff check` + `ruff format --check` + `pytest`
  - `bootstrap` → `pnpm --dir frontend install && uv sync --project backend --all-groups` (not named `setup`, which is a built-in pnpm command)
- `.devcontainer/devcontainer.json`: Python 3.12 image + Node 22 feature + Docker-in-Docker, `postCreateCommand: pnpm install && pnpm bootstrap`.

### Unit 4 — Consolidated CI (`.github/workflows/ci.yml`)

- Triggers: `pull_request`, `push` to `main`, `workflow_dispatch`.
- `concurrency: ci-${{ github.ref }}` with `cancel-in-progress: true`.
- Top-level `permissions: contents: read`.
- Jobs:
  1. `changes` — `dorny/paths-filter@v3` → outputs `frontend`, `backend`.
  2. `frontend` (if frontend) — Corepack pnpm, `setup-node@v4` with pnpm cache, `biome ci .`, `tsc --noEmit`, `pnpm test`, `pnpm build`.
  3. `backend` (if backend) — `astral-sh/setup-uv@v5` with `enable-cache: true`, `uv sync --all-groups`, `ruff check`, `ruff format --check`, `pytest --cov=app --cov-report=xml` (adds `pytest-cov` to dev group), upload coverage artifact.
  4. `docker` (if backend) — `docker/setup-buildx-action`, `docker/build-push-action` with `cache-from/to: type=gha`; push to `ghcr.io/<owner>/al-rawi-backend` only on `main` (`packages: write` scoped to the job); Trivy scan (`aquasecurity/trivy-action`) failing on CRITICAL.
  5. `pr-hygiene` (PR only) — `amannn/action-semantic-pull-request@v5`, `actions/dependency-review-action@v4`.
  6. `secrets` — `gitleaks/gitleaks-action@v2`.
  7. `ci-success` — `if: always()`, fails if any needed job failed/cancelled; the single required check for branch protection.
- `deploy.yml` is deleted (superseded).

### Unit 5 — Security & supply chain

- `codeql.yml`: languages `javascript-typescript`, `python`; on PR, push to `main`, weekly cron; `security-events: write` only.
- Least-privilege `permissions:` per workflow/job; major-version-pinned actions kept current by Dependabot.

### Unit 6 — Release & maintenance automation

- `release-please.yml` + `release-please-config.json` + `.release-please-manifest.json` (simple release type, monorepo root, version `1.0.0`) → `CHANGELOG.md`, tags, GitHub Releases.
- `.github/dependabot.yml`: weekly, grouped minor/patch updates for `npm` (`/frontend`, `/`), `uv` (`/backend`), `github-actions` (`/`), `docker` (`/backend`); Conventional Commit prefixes (`chore(deps)`, `ci(deps)`).
- `preview-db.yml`: the Neon PR-branch job extracted from the old `ci.yml`, guarded on `NEON_API_KEY` presence, with branch cleanup on PR close.

### Unit 7 — Repo hygiene & docs

- `.github/pull_request_template.md` (summary, type, checklist mirroring `pnpm check`), issue forms (`bug_report.yml`, `feature_request.yml`, `config.yml`), `.github/CODEOWNERS`.
- `CONTRIBUTING.md`: prerequisites, `pnpm bootstrap`, `pnpm services:up`, `pnpm dev`, hooks, commit/PR/release flow.
- Update `docs/architecture/GIT_WORKFLOW.md`, root `README.md` (quality gates + DX section), `.superpowers/sdd/progress.md`.

## 4. Error Handling & Edge Cases

- Missing `gitleaks` locally → hook prints install hint and skips instead of blocking (CI still enforces).
- Missing `uv` or Docker locally → affected hooks/scripts fail with a clear message; frontend-only contributors are unaffected because Python hooks only run when `backend/**/*.py` is staged.
- Emergency bypass: `LEFTHOOK=0 git commit ...` (documented); CI remains authoritative.
- `.gitattributes` renormalization is isolated in its own commit so blame noise is contained.

## 5. Verification

- `lefthook validate` passes; a test commit triggers biome/ruff/commitlint and an invalid message is rejected.
- `pnpm check` passes locally (frontend biome/tsc/9 tests, backend ruff + 41 pytest).
- Workflow YAML validated with `actionlint` (via `npx`/docker if available, otherwise careful review).
- `docker compose config` validates the compose file.

## 6. Commit Plan (Conventional Commits)

1. `docs(devops): add DevOps and DX platform design spec`
2. `chore(hooks): replace husky and lint-staged with lefthook`
3. `chore(dx): pin toolchain versions and add editor config`
4. `chore(git): normalize line endings via .gitattributes`
5. `chore(dx): add docker compose services and root dev scripts`
6. `chore(dx): add dev container configuration`
7. `ci: consolidate pipelines with path filters, caching and docker build`
8. `ci(security): add CodeQL, gitleaks and dependency review`
9. `ci(release): add release-please and dependabot`
10. `docs(devops): add contributing guide, templates and codeowners`
