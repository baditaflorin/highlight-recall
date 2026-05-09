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
