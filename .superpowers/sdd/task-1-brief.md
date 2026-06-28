### Task 1: Git Branching & Conventional Commit Standards

**Files:**
- Create/Modify: `frontend/package.json`
- Create: `frontend/commitlint.config.js`
- Create: `frontend/.husky/commit-msg`

**Interfaces:**
- Produces: Git hooks that physically reject any commit message that does not strictly adhere to the Conventional Commits v1.0.0 specification.

- [ ] **Step 1: Define Branching Standards**
*(Agent instruction: Document the Git Branching workflow in `docs/architecture/GIT_WORKFLOW.md`. Specify standard branches: `feat/*` for features, `fix/*` for bugfixes, `chore/*` for configuration/deps, `docs/*` for documentation. All phases must be developed in isolated feature branches and merged via GitHub Pull Requests.)*

- [ ] **Step 2: Install Commitlint & Configure Hook**
```bash
cd frontend && pnpm add -D @commitlint/config-conventional @commitlint/cli
```
*(Agent instruction: Create `frontend/commitlint.config.js` exporting `['@commitlint/config-conventional']`. Create a Husky commit message hook in `frontend/.husky/commit-msg` containing `pnpm commitlint --edit "${1}"` to reject non-conforming commit messages locally. Configure git hooks path to frontend/.husky: `git config core.hooksPath frontend/.husky`.)*

- [ ] **Step 3: Commit**
```bash
git checkout -b feat/phase-2-sdlc
git add frontend/package.json frontend/commitlint.config.js frontend/.husky/commit-msg
git commit -m "chore: setup commitlint and conventional commit validation in frontend"
```
