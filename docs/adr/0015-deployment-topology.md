# 0015 - Deployment Topology

## Status

Accepted

## Context

Mode C deployment topology is not needed. Mode A still needs a clear public boundary.

## Decision

Deploy only GitHub Pages at `https://baditaflorin.github.io/highlight-recall/`. There is no Docker backend, nginx proxy, or runtime database.

## Consequences

Rollback is a git revert of the Pages publishing commit. The app keeps working offline through the service worker after first visit.

## Alternatives Considered

Cloudflare Pages and Netlify were rejected to keep the repository-native GitHub Pages deliverable.
