# 0011 - Logging

## Status

Accepted

## Context

Mode A has no server logs. Production browser console noise should be avoided.

## Decision

Use visible UI status messages and error fallbacks instead of production console logging. Development tooling may still show Vite and browser diagnostics.

## Consequences

Users see import, embedding, and scheduling status in the UI. There is no centralized log stream.

## Alternatives Considered

Remote logging was rejected because it would collect user behavior from a privacy-first app.
