# 0067 - State Management Convention

## Status

Accepted

## Context

The app has local component state plus IndexedDB-backed library state.

## Decision

Use `useLibrary` as the only persistence-facing React hook. Feature components may hold transient UI state but must call hook actions for durable changes.

## Consequences

Reload behavior stays coherent and easier to test.

## Alternatives Considered

Adding a global state library was rejected as unnecessary.
