# 0062 - Output Pathway Coverage

## Status

Accepted

## Context

JSON export existed but was not restorable. Users need to move or back up their local library.

## Decision

Make JSON state the canonical output. Support download, copy, and import/restore. Add copy controls for individual review/search text. Keep CSV, API, and full-library URL sharing out of scope.

## Consequences

Backup becomes trustworthy. Automation can consume JSON without a server API.

## Alternatives Considered

CSV was deferred because it loses review state and embeddings.
