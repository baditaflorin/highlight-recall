# 0004 - Static Data Contract

## Status

Accepted

## Context

Mode A has no shared static dataset. All user data is private and generated from local imports.

## Decision

The only static artifacts are the app bundle, service worker, manifest, and docs. User-created data follows schema version 1 when exported as JSON: `schemaVersion`, `exportedAt`, `documents`, and `highlights`.

## Consequences

There is no `/data` artifact contract in v1. Exported JSON provides a migration anchor for future import/backup features.

## Alternatives Considered

SQLite or Parquet files were rejected because there is no public corpus to precompute.
