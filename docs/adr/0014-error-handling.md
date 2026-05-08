# 0014 - Error Handling

## Status

Accepted

## Context

Importers and AI modules can fail due malformed files, browser model support, or storage limits.

## Decision

Surface recoverable errors in the UI as status text or fallback output. Domain functions return values or throw typed `Error` objects at module boundaries. Never panic or hide failures.

## Consequences

Users keep a working lexical/offline app even when optional AI features fail.

## Alternatives Considered

Global crash-only handling was rejected because import and AI failures should not take down review/search.
