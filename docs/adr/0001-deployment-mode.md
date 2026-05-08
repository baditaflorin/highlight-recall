# 0001 - Deployment Mode

## Status

Accepted

## Context

The product imports personal reading files and stores review state. The requested default is GitHub Pages first, with a runtime backend only if client-side execution is genuinely insufficient.

## Decision

Use Mode A: Pure GitHub Pages. The app is a static React/Vite PWA served from `main` branch `/docs`. EPUB/PDF parsing, search, embeddings, local LLM prompts, and spaced repetition run in the browser. User data persists in IndexedDB.

## Consequences

No server, database, auth, runtime secrets, Docker, nginx, or Prometheus are required for v1. Cross-device sync and real email delivery are out of scope. Large AI models are lazy-loaded behind explicit user actions.

## Alternatives Considered

Mode B was unnecessary because there is no shared static dataset. Mode C was rejected because v1 has no server-side mutations, auth, or secrets.
