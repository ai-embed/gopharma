# Branch Protection (Frontend)

## `main`
- Require PRs.
- Require status checks: `lint`, `test`, `test:integration`, `build`.
- Require linear history.
- Restrict force pushes.

## `test`
- Require PRs from `dev`.
- Require status checks: `lint`, `test`, `test:integration`, `build`.
- Restrict force pushes.

## `dev`
- Require PRs from `feature/*`.
- Require status checks: `lint`, `test`, `test:integration`.
