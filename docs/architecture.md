# Architecture

## Context

```mermaid
C4Context
  title Highlight Recall context
  Person(reader, "Reader", "Imports local reading files")
  System_Boundary(pages, "GitHub Pages static boundary") {
    System(app, "Highlight Recall", "React PWA served from /highlight-recall/")
  }
  SystemDb(browser, "Browser storage", "IndexedDB and Cache Storage")
  System_Ext(github, "GitHub", "Source and Pages host")
  Rel(reader, app, "Imports, searches, reviews")
  Rel(app, browser, "Persists highlights and review state")
  Rel(github, app, "Serves static assets")
```

## Container

```mermaid
flowchart LR
  Reader["Reader browser"] --> App["React/Vite app on GitHub Pages"]
  App --> Importers["Lazy importers: PDF.js, JSZip EPUB parser"]
  App --> Storage["IndexedDB via idb"]
  App --> Search["MiniSearch lexical index"]
  App --> Review["SM-2 style scheduler"]
  App --> AI["Lazy local AI: sentence-transformers and WebLLM"]
  App --> Cache["Service worker cache"]
```

## Module Boundaries

- `src/features/library` owns import, manual capture, export, and library lists.
- `src/features/review` owns daily review flow.
- `src/features/search` owns search UI.
- `src/domain` owns schemas, scheduling, IDs, text helpers, and exports.
- `src/importers` owns file parsing and candidate highlight extraction.
- `src/storage` owns IndexedDB schema and persistence.
- `src/ai` owns optional lazy embedding and local LLM helpers.

## GitHub Pages Boundary

The public runtime is only:

https://baditaflorin.github.io/highlight-recall/

There is no API origin, auth callback, backend database, or server secret.
