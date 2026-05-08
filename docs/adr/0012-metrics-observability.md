# 0012 - Metrics And Observability

## Status

Accepted

## Context

The default for Mode A/B is no analytics unless strongly justified.

## Decision

Ship no analytics in v1. Observability is local only: the UI shows library counts, due count, and current build version/commit.

## Consequences

No PII or reading behavior leaves the browser. Product usage cannot be measured centrally.

## Alternatives Considered

Plausible and beacon analytics were rejected because v1 success can be verified with local tests and user feedback.
