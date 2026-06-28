# Git Branching & Workflow Guidelines

All development on Al-Rawi must strictly follow the conventional branch and commit naming systems outlined below.

## Branch Naming Conventions
Always develop in isolated feature branches branched from `main`. Use the following naming structures:

- `feat/*` : New features or product capabilities.
- `fix/*` : Bug fixes, security patches, and hotfixes.
- `chore/*` : Setup, dependency updates, tooling configuration, and platform tasks.
- `docs/*` : Documentation updates, plans, and architectural specifications.

## Merge Policy
- Direct commits to `main` are strictly prohibited.
- Code must be merged using GitHub Pull Requests (PRs).
- PRs require successful execution of all CI/CD checks (linting, tests, database migrations, RAGAS evaluations) prior to merging.
