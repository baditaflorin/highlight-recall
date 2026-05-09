# 0070 - Documentation Reality Alignment

## Status

Accepted

## Context

README and docs must not describe idealized behavior.

## Decision

Maintain README as a verified checklist with limitations. Claims without tests or clear manual verification are removed or softened.

## Consequences

Users see fewer surprises. Future changes must update docs in the same commit as behavior changes.

## Alternatives Considered

Leaving limitations only in ADRs was rejected because README is the first user-facing document.
