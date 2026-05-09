# 0063 - Half-Baked Feature Triage

## Status

Accepted

## Context

The audit identified controls that worked partially but did not feel complete.

## Decision

Finish semantic index status, AI prompt fallback/copy, multi-file partial import, JSON restore, and destructive clear confirmation. Hide nothing because each control maps to a real shipped claim.

## Consequences

Production UI has no decorative stubs. Optional AI remains best-effort but honest.

## Alternatives Considered

Deleting AI controls was considered, but ADR 0006 and README already position them as optional helpers.
