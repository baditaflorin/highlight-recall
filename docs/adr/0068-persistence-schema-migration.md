# 0068 - Persistence Schema And Migration

## Status

Accepted

## Context

IndexedDB v1 persisted documents/highlights without activity history or import/restore replacement operations.

## Decision

Bump IndexedDB to v2 and add an `activity` store. State imports replace documents/highlights/activity through a single storage operation. Future DB changes must add explicit upgrade branches.

## Consequences

Existing v1 users keep documents/highlights and gain activity history on next load.

## Alternatives Considered

Resetting IndexedDB was rejected because it would lose user data.
