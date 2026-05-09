# 0064 - DRY Consolidation Map

## Status

Accepted

## Context

State export, future state import, download, copy, and validation would duplicate schema logic if implemented separately.

## Decision

Create one canonical state module for serialization, validation, sample data, and metadata. Keep browser delivery helpers small and separate.

## Consequences

Round-trip tests exercise the same code used by UI import/export.

## Alternatives Considered

Keeping JSON in the UI component was rejected because it makes migrations and tests fragile.
