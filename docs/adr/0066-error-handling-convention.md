# 0066 - Error Handling Convention

## Status

Accepted

## Context

Raw parser errors are not useful to readers importing books.

## Decision

Every user-facing error must include what failed, why in reading-domain terms, and what to do next. Module boundaries throw `Error`; UI maps unknown failures through a single error helper.

## Consequences

Failures are actionable and less likely to look like app crashes.

## Alternatives Considered

Swallowing failures into generic "failed" messages was rejected.
