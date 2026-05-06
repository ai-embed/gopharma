# Branching Strategy (Frontend)

## Flow
- `feature/*` -> `dev` -> `test` -> `main`

## Rules
- All work starts from `dev` and is delivered via PR from `feature/*`.
- `dev` is the integration branch for new work.
- `test` is the release-candidate branch.
- `main` is production-ready.
- Direct pushes to `test` and `main` are blocked; only PRs from the previous stage.

## Naming
- `feature/*` for feature work.
- `fix/*` for bug fixes.
- `chore/*` for tooling/doc updates.
