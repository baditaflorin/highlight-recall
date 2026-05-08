# 0013 - Testing Strategy

## Status

Accepted

## Context

The app needs fast local checks because there are no GitHub Actions.

## Decision

Use Vitest for domain/unit tests, Playwright for one happy-path smoke test, and Makefile targets for `test`, `build`, `lint`, and `smoke`.

## Consequences

The highest-risk logic, spaced repetition and text extraction, has unit coverage. Browser import/review/search has smoke coverage.

## Alternatives Considered

Full PDF/EPUB fixture e2e tests were deferred because they are slower and brittle for v1.
