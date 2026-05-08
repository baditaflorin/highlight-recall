# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

This ADR is mandatory for Mode B, but the project is Mode A.

## Decision

There is no offline data-generation pipeline in v1. `make data` is intentionally a no-op that explains local browser import.

## Consequences

No generated public data artifacts are committed or released.

## Alternatives Considered

Precomputing a demo corpus was rejected because it would distract from the local-first import flow.
