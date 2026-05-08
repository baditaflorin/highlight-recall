# 0005 - Client Storage

## Status

Accepted

## Context

Highlights and review state must survive browser restarts without a backend.

## Decision

Use IndexedDB through the `idb` library. Store source documents, highlights, embeddings, and lightweight settings in separate object stores.

## Consequences

The app works offline after first load and can store more data than `localStorage`. Users remain responsible for browser profile backups until sync exists.

## Alternatives Considered

OPFS was considered for future large binary caches. `localStorage` was rejected for quota and structured data ergonomics.
