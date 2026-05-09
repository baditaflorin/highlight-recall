# 0061 - Input Pathway Coverage

## Status

Accepted

## Context

Users bring highlights through files, drag/drop, pasted text, copied HTML, and backups. v1 only handled file picker and one manual text box.

## Decision

Route file picker, drag/drop, clipboard text/HTML, manual paste, sample load, and JSON state restore through shared import/state functions. URL and folder import remain out of scope.

## Consequences

Input behavior is more predictable and easier to test. Unsupported paths are explained instead of silently absent.

## Alternatives Considered

Adding URL fetching was rejected because CORS would make it unreliable in GitHub Pages without a backend.
