# Git Branching & Workflow Guidelines

All development on Al-Rawi must strictly follow the conventional branch and commit naming systems outlined below.

## Branch Naming Conventions
Always develop in isolated feature branches branched from `main`. Use the following naming structures:

- `feat/*` : New features or product capabilities.
- `fix/*` : Bug fixes, security patches, and hotfixes.
- `chore/*` : Setup, dependency updates, tooling configuration, and platform tasks.
- `docs/*` : Documentation updates, plans, and architectural specifications.

## Commit Conventions
- Commits follow [Conventional Commits](https://www.conventionalcommits.org): `type(scope): summary`.
- Allowed types: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style`, `revert`.
- Scopes are kebab-case (e.g. `frontend`, `backend`, `hooks`, `explore`); body lines are at most 100 characters.
- Enforced locally by the Lefthook `commit-msg` hook (commitlint, config in `commitlint.config.mjs`) and in CI via the semantic PR title check.

## Local Quality Gates
- Lefthook (`lefthook.yml`) runs Biome, Ruff and gitleaks on staged files at `pre-commit`, and typecheck/tests at `pre-push`.
- `pnpm check` runs the exact CI gates locally before opening a PR.

## Merge Policy
- Direct commits to `main` are strictly prohibited.
- Code must be merged using GitHub Pull Requests (PRs), preferably squash-merged so the Conventional PR title becomes the commit on `main`.
- PRs require the aggregated **`CI success`** check (frontend, backend, Docker image scan, PR hygiene and secret scan) to pass prior to merging.
- Stacked branches are allowed: base the PR on the parent branch, then retarget to `main` once the parent merges.

## Releases
- `release-please` maintains a release PR on `main`; merging it bumps versions, updates `CHANGELOG.md`, tags `vX.Y.Z` and publishes a GitHub Release.
