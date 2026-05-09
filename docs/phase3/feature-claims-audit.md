# Phase 3 Feature Claims Audit

| Claim location | Claim                                                                                | Status before | Evidence                                                                          | Decision                       |
| -------------- | ------------------------------------------------------------------------------------ | ------------- | --------------------------------------------------------------------------------- | ------------------------------ |
| README         | Imports EPUB, PDF, TXT, Markdown files in browser.                                   | partial       | File picker supports those extensions, but batch/error/zero-text cases are weak.  | Keep and harden.               |
| README         | Stores source documents, highlights, review state, optional embeddings in IndexedDB. | shipped       | `storage/db.ts` persists documents/highlights; embeddings live on highlight rows. | Keep.                          |
| README         | Resurfaces due highlights with SM-2-style scheduler.                                 | shipped       | Review queue uses scheduler and persists grades.                                  | Keep.                          |
| README         | Searches highlights locally with MiniSearch and optional embeddings.                 | partial       | MiniSearch works; embedding path has weak UX and no robust status.                | Keep and clarify.              |
| README         | Shows version and commit on live app.                                                | shipped       | Footer renders version and source commit.                                         | Keep.                          |
| README         | Local-first Readwise-style app.                                                      | partial       | Core is local-first, but backup restore was missing.                              | Keep after JSON import.        |
| Privacy doc    | User can export JSON backup manually.                                                | partial       | Export exists but restore missing.                                                | Update to state file contract. |
| ADR 0006       | Local LLM gracefully falls back to deterministic recall prompt.                      | shipped       | Catch path shows prompt.                                                          | Keep, add copy.                |
| ADR 0013       | At least one Playwright happy path.                                                  | shipped       | `tests/e2e/app.spec.ts`.                                                          | Keep and broaden.              |

Mismatches before: 4 partial, 0 false, 5 shipped.
