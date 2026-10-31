---
trigger: always_on
description: Enterprise Git workflow, Conventional Commits, Node 26 LTS / Python 3.12 toolchain pinning, lockfile hygiene, and GitHub Actions verification rules.
---

# DevOps, Git Workflow & CI/CD Rules

## 1. Pinned Runtime & Package Manager Toolchain
- **Node.js & pnpm**:
  - Target **Node 26 LTS** (`.node-version` = `26`, `"engines": { "node": ">=26.0.0" }`) and **`pnpm@10.23.0`** (`"packageManager": "pnpm@10.23.0"` in both root `package.json` and `frontend/package.json`).
  - Never add `devEngines.runtime` with `onFail: "download"` to `package.json` (it causes `pnpm` to resolve alpha Node binaries into `pnpm-lock.yaml`).
  - Whenever `package.json` or `frontend/package.json` changes, regenerate lockfiles and verify `pnpm --dir frontend install --frozen-lockfile` exits `0`.
- **Python & uv**:
  - Target **Python 3.12** (`.python-version` = `3.12`) managed exclusively via **`uv`** (`backend/pyproject.toml` + `backend/uv.lock`).
  - Whenever `backend/pyproject.toml` changes, run `uv --directory backend lock` and verify `uv --directory backend sync --all-groups --frozen`.

## 2. GitHub Actions Verification Protocol
- Never guess or hallucinate a GitHub Action tag version in `.github/workflows/*.yml`.
- Before adding or upgrading any `uses: <owner>/<repo>@<ref>`, verify the exact tag exists upstream:
  ```bash
  git ls-remote --tags --refs https://github.com/<owner>/<repo>.git
  ```
  *(Note: some actions only publish floating major tags up to a specific version, e.g. `astral-sh/setup-uv@v7`, or omit `v` prefixes, e.g. `aquasecurity/trivy-action@0.35.0`, or require 3-part SemVer tags, e.g. `actions/dependency-review-action@v5.0.0`.)*
- Validate all workflow edits with `actionlint`:
  ```bash
  docker run --rm -v "${PWD}:/repo" -w /repo rhysd/actionlint -color
  ```

## 3. Trunk-Based Git Workflow & Release Hygiene
- **Conventional Commits**:
  - Every commit message and PR title MUST follow `<type>(<scope>): <subject>` (`feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `security`, `revert`).
  - Keep commit headers **`<= 100` characters** (enforced by `commitlint` and `lefthook` `commit-msg` hook).
- **Branch Lifecycle & Tagging**:
  - Use short-lived feature branches (`feat/*`, `fix/*`, `chore/*`) merged into `main`, and delete merged branches so `git branch -a` stays clean.
  - Use annotated `milestone/<name>` tags for architectural phase checkpoints; let `release-please` (`.github/workflows/release-please.yml`) manage SemVer `vX.Y.Z` release tags and `CHANGELOG.md` on `main`.
