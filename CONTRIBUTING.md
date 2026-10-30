# Contributing to Al-Rawi (الراوي)

Thanks for helping bring Saudi heritage to life. This guide gets you from clone to merged PR.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 22 (see `.node-version`) | `fnm` / `nvm` / Volta read the pin automatically |
| pnpm | 10.23.0 (via Corepack) | `corepack enable` once — the version comes from `packageManager` |
| Python | 3.12 (see `.python-version`) | managed by `uv` |
| uv | latest | <https://docs.astral.sh/uv/> |
| Docker | Desktop / Engine with Compose v2 | local Postgres + pgvector and Redis |
| gitleaks | optional | local secret scanning; CI always runs it |

Prefer zero setup? Open the repo in **GitHub Codespaces** or a **VS Code Dev Container** (`.devcontainer/`) — everything above is pre-installed and services start automatically.

## First-time setup

```bash
corepack enable
pnpm install            # root tooling + installs Lefthook git hooks
pnpm bootstrap          # frontend deps + backend virtualenv (uv sync --all-groups)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
pnpm services:up        # Postgres (pgvector) + Redis, waits until healthy
pnpm dev                # FastAPI on :8000 and Next.js on :3000 together
```

## Everyday commands (run from the repo root)

| Command | What it does |
|---|---|
| `pnpm dev` | Run API and web concurrently with prefixed logs |
| `pnpm dev:api` / `pnpm dev:web` | Run one side only |
| `pnpm check` | Every CI quality gate locally: Biome, tsc, frontend tests, Ruff, pytest |
| `pnpm fix` | Auto-fix formatting, imports and lint issues across both stacks |
| `pnpm services:up` / `services:down` / `services:logs` | Manage local Postgres + Redis |
| `pnpm hooks:validate` | Validate `lefthook.yml` |

## Git hooks (Lefthook)

Hooks install automatically on `pnpm install` and are defined in [`lefthook.yml`](lefthook.yml):

| Hook | Runs | Speed |
|---|---|---|
| `pre-commit` | Biome on staged frontend files, Ruff on staged Python files, gitleaks — in parallel, auto-fixes are restaged | ~1–3 s |
| `commit-msg` | commitlint (Conventional Commits) | ~2 s |
| `pre-push` | `tsc`, frontend tests, pytest — only for the side you changed | varies |

Personal tweaks go in an untracked `lefthook-local.yml`. In an emergency, `LEFTHOOK=0 git commit ...` skips hooks — CI still enforces everything.

## Branches, commits and pull requests

Follow [`docs/architecture/GIT_WORKFLOW.md`](docs/architecture/GIT_WORKFLOW.md):

1. Branch from `main`: `feat/*`, `fix/*`, `chore/*`, `docs/*`.
2. Commit with [Conventional Commits](https://www.conventionalcommits.org): `type(scope): summary`, body lines ≤ 100 chars.
3. Open a PR using the template. The **PR title must be a Conventional Commit** — it becomes the squash-merge commit and the changelog entry.
4. The single required check is **`CI success`**; it aggregates frontend, backend, Docker, PR hygiene and secret-scan jobs (path-filtered, so docs-only PRs are fast).

## Releases

[release-please](https://github.com/googleapis/release-please) watches `main` and maintains a release PR that bumps versions (root, frontend and backend) and updates `CHANGELOG.md` from commit history. Merging that PR tags `vX.Y.Z` and publishes a GitHub Release. The backend image is published to `ghcr.io/<owner>/al-rawi-backend` on every push to `main`.

## Dependency updates

Dependabot opens grouped weekly PRs for npm, uv, GitHub Actions and Docker. Review the changelog, let CI run, and squash-merge.

## Reporting security issues

Do **not** open public issues for vulnerabilities — use GitHub Security Advisories (see the issue template chooser).
