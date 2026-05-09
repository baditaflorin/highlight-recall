# Phase 3 Plan

Ranked by real-user impact on the audit findings.

| Rank | Catalog item | Work                                                                   | Success test                                                         |
| ---- | ------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1    | 9, 11, 41    | Canonical JSON state export/import round-trip.                         | Unit test restores exported state.                                   |
| 2    | 36, 37       | Zod validation at state import boundary.                               | Invalid state file gives actionable error.                           |
| 3    | 1, 4         | Batch import with per-file partial success.                            | One bad file does not discard good files.                            |
| 4    | 2            | Format detection by extension, MIME, and magic bytes.                  | Extensionless PDF/EPUB/TXT routes correctly.                         |
| 5    | 1            | Drag/drop files into the existing import area.                         | E2E imports dropped text file.                                       |
| 6    | 1, 6         | Clipboard/paste import for text and HTML.                              | E2E imports pasted text.                                             |
| 7    | 7            | Sample/demo loader as a real input.                                    | User can load sample library and review it.                          |
| 8    | 32           | Actionable importer errors.                                            | Unsupported, empty, corrupt, scanned outcomes use what/why/now-what. |
| 9    | 17           | Suggest fix for zero-highlight files.                                  | UI tells user to paste text/OCR scanned PDF.                         |
| 10   | 10           | Copy current review prompt/highlight.                                  | E2E verifies clipboard copy fallback state.                          |
| 11   | 10           | Copy search result text.                                               | Search result has working copy control.                              |
| 12   | 11           | Copy full state JSON.                                                  | Copy button serializes same canonical state.                         |
| 13   | 15, 16       | Finish semantic-index control with clearer progress and status.        | Disabled/existing/running states are explicit.                       |
| 14   | 15, 16       | Finish AI recall prompt with copyable fallback.                        | Failure still yields useful output.                                  |
| 15   | 18           | Confirm destructive clear and record activity.                         | Clear requires confirmation and persists log.                        |
| 16   | 36           | Activity/history model for imports, exports, reviews, deletes, clears. | Activity survives reload.                                            |
| 17   | 39           | IndexedDB migration/version policy.                                    | DB upgrade path has migration function and tests.                    |
| 18   | 20, 23       | Consolidate state serialization, validation, and delivery.             | No export/import schema duplication.                                 |
| 19   | 28           | Remove unused settings helpers and dead `AppMeta`.                     | Dead-code scan stays clean.                                          |
| 20   | 31, 33       | One error/message convention for user-facing failures.                 | Catch sites use mapper.                                              |
| 21   | 42, 45       | README verified checklist and limitations.                             | README matches feature audit.                                        |
| 22   | 43           | Quickstart and smoke path verified.                                    | `make smoke` still passes.                                           |
| 23   | 46, 47       | Stranger test in private-browser style with real text input.           | Top 3 issues fixed or documented.                                    |
| 24   | 24, 25       | Enumerate reachable states in docs.                                    | `docs/phase3/states.md` exists and matches UI states.                |

Deferred with rationale: URL import, folder import, full-library share URLs, CSV export, OCR, and server/API output remain out of scope for Mode A completeness.

## Implementation Status

| Rank | Status | Evidence                                                                               |
| ---- | ------ | -------------------------------------------------------------------------------------- |
| 1    | done   | `src/domain/state.ts`, `src/domain/state.test.ts`, JSON restore in `LibraryPanel`.     |
| 2    | done   | State and preferences imports are zod-validated before use.                            |
| 3    | done   | `handleFiles` summarizes successes and per-file failures.                              |
| 4    | done   | `src/importers/detect.ts` checks extension, MIME, and magic bytes.                     |
| 5    | done   | Import label handles drag/drop through the same pipeline.                              |
| 6    | done   | Clipboard button and HTML paste normalization are wired.                               |
| 7    | done   | Sample loader imports through the normal save path.                                    |
| 8    | done   | `src/domain/errors.ts` maps file failures into what/why/now-what messages.             |
| 9    | done   | Zero-highlight PDF/text outcomes surface next-step guidance.                           |
| 10   | done   | Review card copy control with visible status.                                          |
| 11   | done   | Search result copy control with visible status.                                        |
| 12   | done   | Copy state uses the canonical state serializer.                                        |
| 13   | done   | Semantic index progress shows checked and missing counts.                              |
| 14   | done   | AI prompt fallback stays visible and copyable.                                         |
| 15   | done   | Clear confirmation is default and controlled by a persisted setting.                   |
| 16   | done   | Activity log records imports, restores, exports, copies, reviews, deletes, and clears. |
| 17   | done   | IndexedDB v2 migration creates activity and removes unused settings store.             |
| 18   | done   | State serialization, parsing, and summaries are single-source modules.                 |
| 19   | done   | Unused settings helpers and `AppMeta` were removed.                                    |
| 20   | done   | User-facing import failures use one error mapper.                                      |
| 21   | done   | README includes verified checklist and limitations.                                    |
| 22   | done   | Smoke path expanded to real-user restore/import/review/search/settings flow.           |
| 23   | done   | Stranger test documented in `docs/phase3/stranger-test.md`.                            |
| 24   | done   | Reachable state taxonomy documented in `docs/phase3/states.md`.                        |
