# 0017 - Dependency Policy

## Status

Accepted

## Context

The app handles personal reading data locally and should avoid fragile custom implementations.

## Decision

Use production-ready libraries for framework, storage, parsing, search, tests, and optional AI. Keep heavy libraries lazy-loaded. Run `npm audit` and gitleaks locally.

## Consequences

The app ships faster with fewer bespoke parsing/search mistakes. Bundle size is managed through dynamic imports.

## Alternatives Considered

Hand-written PDF/EPUB parsing and custom search ranking were rejected.
