# 0009 - Configuration And Secrets

## Status

Accepted

## Context

The frontend must not contain secrets, and Mode A should avoid runtime configuration.

## Decision

Use no secrets and no runtime env vars. Build metadata is limited to version, short commit, and public repository URL. `.env.example` documents that Mode A has no server secrets.

## Consequences

The app can be forked and published without secret setup. Any future secret-requiring feature must move to an offline generator or a justified Mode C backend.

## Alternatives Considered

BYO-key AI was rejected for v1 because local AI is preferred.
