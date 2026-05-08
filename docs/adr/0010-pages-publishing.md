# 0010 - GitHub Pages Publishing

## Status

Accepted

## Context

The live URL is a first-class deliverable from the first public commit.

## Decision

Publish from `main` branch `/docs`. Vite writes built app assets into `docs/` with base path `/highlight-recall/`, hashed assets, and a copied `404.html` SPA fallback. `emptyOutDir` is false so `docs/adr` and human documentation remain tracked.

## Consequences

The build script removes only generated app artifacts before rebuilding. The `docs/` directory is explicitly not gitignored.

## Alternatives Considered

A `gh-pages` branch was rejected because the prompt asks for frequent source commits and simple visibility. Publishing from repo root was rejected to avoid mixing source and build artifacts at top level.
