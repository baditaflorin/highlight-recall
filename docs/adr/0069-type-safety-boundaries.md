# 0069 - Type Safety At Boundaries

## Status

Accepted

## Context

External data enters through files, clipboard, and JSON state restore.

## Decision

Validate state JSON with zod before persistence. Keep unavoidable third-party AI casts isolated in `src/ai` as boundary code. Do not use `any` or `@ts-ignore`.

## Consequences

Broken backups fail before corrupting IndexedDB.

## Alternatives Considered

Trusting exported JSON was rejected because users can edit files or import stale versions.
