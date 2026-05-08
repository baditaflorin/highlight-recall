# 0016 - Local Git Hooks

## Status

Accepted

## Context

The prompt forbids GitHub Actions and requires local hooks.

## Decision

Use plain `.githooks` with `make install-hooks`. Pre-commit runs lint, format check, typecheck, and gitleaks. Commit-msg validates Conventional Commits. Pre-push runs test, build, and smoke.

## Consequences

Checks run locally and remain transparent. Contributors must install hooks after clone.

## Alternatives Considered

Lefthook was considered, but plain shell hooks avoid another dependency.
