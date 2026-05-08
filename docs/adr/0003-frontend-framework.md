# 0003 - Frontend Framework

## Status

Accepted

## Context

The UI is the main product surface and needs fast iteration, TypeScript strictness, and GitHub Pages-friendly builds.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, lucide-react, zod, idb, MiniSearch, Vitest, and Playwright.

## Consequences

The app builds quickly into static assets. React keeps feature components easy to reason about. Vite handles hashed assets and base-path publishing.

## Alternatives Considered

Svelte and Solid were reasonable, but React has wider library coverage for PDF parsing, PWA examples, and testing.
