# 0065 - Module Boundaries

## Status

Accepted

## Context

The app is small, but `LibraryPanel` had accumulated import, export, embedding, destructive actions, and list rendering.

## Decision

Keep feature components as orchestration only. Domain modules own state contracts, import parsing, scheduling, and error mapping. Storage owns persistence and migration. UI imports domain/storage but domain never imports UI.

## Consequences

The app remains simple while reducing coupling.

## Alternatives Considered

A full application service layer was rejected as too much architecture for this Mode A app.
