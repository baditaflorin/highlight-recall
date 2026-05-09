# Phase 3 Postmortem

Date: 2026-05-09

Version: v0.2.0

Repository: https://github.com/baditaflorin/highlight-recall

Live site: https://baditaflorin.github.io/highlight-recall/

## Audit Grids

| Audit          | Before                           | After                             |
| -------------- | -------------------------------- | --------------------------------- |
| Inputs         | 2 green, 5 yellow, 1 red, 7 gray | 12 green, 0 yellow, 0 red, 3 gray |
| Outputs        | 0 green, 2 yellow, 1 red, 6 gray | 6 green, 0 yellow, 0 red, 3 gray  |
| Controls       | 4 green, 9 yellow, 0 red         | 20 green, 0 yellow, 0 red         |
| Feature claims | 5 shipped, 4 partial, 0 false    | 9 shipped, 0 partial, 0 false     |

Gray after rows are explicitly out of scope for Mode A: URL import, folder import, full-library share URLs, CSV export, server/API output, OCR, and deep-link state sharing.

## Half-Baked Feature Triage

| Feature                | Outcome   | Rationale                                                                             |
| ---------------------- | --------- | ------------------------------------------------------------------------------------- |
| JSON export            | finished  | Became a versioned canonical state file with matching restore path.                   |
| Multi-file import      | finished  | Batch now survives per-file failure and reports partial success.                      |
| Clipboard/manual paste | finished  | Clipboard import and cleaned HTML paste are natural browser input paths.              |
| Semantic index control | finished  | Progress and unavailable states are now explicit.                                     |
| AI recall prompt       | finished  | Fallback prompt remains copyable when local model loading fails.                      |
| Clear library          | finished  | Confirmation is default, controlled by a persisted setting, and activity is recorded. |
| URL import             | not built | Arbitrary web fetch is unreliable in static GitHub Pages because of CORS.             |
| OCR                    | not built | OCR would add large models and a different performance/privacy contract.              |

## Codebase Health

| Metric                      | Before                     | After                                                                 |
| --------------------------- | -------------------------- | --------------------------------------------------------------------- |
| Source TODO/FIXME/XXX/HACK  | 0                          | 0                                                                     |
| Source `any` / `@ts-ignore` | 0                          | 0                                                                     |
| Dead exported types/helpers | 3                          | 0                                                                     |
| Canonical state module      | none                       | `src/domain/state.ts`                                                 |
| Real-user smoke paths       | manual add, review, search | restore, clipboard import, review, copy, search, settings persistence |
| Unit test files             | 4                          | 5                                                                     |
| Unit tests                  | 10                         | 13                                                                    |

Remaining accepted debt: `LibraryPanel.tsx` still owns a broad import workspace. It delegates parsing, validation, output, errors, sample data, persistence, and preferences now; splitting the remaining JSX would be mostly presentational and less valuable than the Phase 3 user-path fixes.

## Stranger Test

The private-browser stranger pass exposed three high-impact blockers:

1. Restoring an exported library was impossible.
2. Clipboard import was absent even though it is the most natural browser workflow.
3. Clear-library was immediate and risky.

All three were fixed. The test is documented in `docs/phase3/stranger-test.md`, and the top path is now covered by Playwright.

## Documentation/Reality Mismatches Fixed

- README now says state restore is shipped and lists the actual input paths.
- README now has a verified checklist tied to tests.
- README limitations explicitly call out scanned PDFs, URL import, share URLs, folder import, CSV, and sync.
- Privacy doc now describes state files, activity history, preferences, and clipboard permission behavior.
- Phase 3 audits now include before/after counts instead of only initial findings.

## Verification

- `npm run lint`: passed.
- `npm run fmt:check`: passed.
- `npm run typecheck`: passed.
- `npm run test`: passed, 5 files and 13 tests.
- `make build`: passed and verified Pages artifacts.
- `make smoke`: passed, 1 Playwright test covering restore, clipboard import, review, copy, search, and settings persistence.

Build warnings remain for large lazy AI/PDF chunks. The initial app chunk is still below the 200KB gzipped budget; the large local LLM, embedding, and PDF parser chunks are behind user actions or import paths.

## What Surprised Me

- The original export being one-way made the local-first promise feel much weaker than expected.
- A tiny activity log made destructive operations easier to trust without adding a new workflow.
- The best usability win was not a new feature; it was allowing users to start from their own state file or clipboard text immediately.
- Playwright caught an ambiguous search assertion because the same text intentionally appears in review, library, and search panes.

## Still-Open Phase 4 Candidates

1. OCR path for scanned PDFs, probably lazy WASM/model-backed and clearly cancellable.
2. Better document highlight-count reconciliation after deleting individual highlights.
3. More granular import preview before committing a large batch.
4. Exported Markdown or CSV summaries for people who want to move highlights into notes tools.
5. A smaller AI loading strategy or model choice UI if local LLM use becomes common.

## Honest Take

Could a stranger now use Highlight Recall for their own real work, end-to-end, with zero help? Yes, if their data is selectable text, EPUB, text PDF, TXT/Markdown, clipboard text, or a Highlight Recall state file. They can import, review, search, copy, export, restore, clear safely, and understand common failures.

It is still not enough for scanned PDFs, cross-device sync, or bulk library automation. Those are real limits, but they are now named limits instead of confusing dead ends.
