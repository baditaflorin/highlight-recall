# Phase 3 Codebase Audit

## DRY Violations

| Area                         | Before                           | Evidence                                                                               | Decision                                                       |
| ---------------------------- | -------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Import status/error handling | duplicated ad hoc strings        | `LibraryPanel` handles files, embeddings, manual add, export status locally.           | Extract domain result helpers and centralize import summaries. |
| Clipboard/download output    | none yet but likely to duplicate | Export code has only `downloadJson`; future copy/import would duplicate serialization. | Create canonical state module.                                 |
| Date/provenance generation   | scattered                        | Export uses `new Date`, scheduler uses `nowIso`.                                       | Use existing date helper in state export.                      |

## SOLID Violations

| Module             | Issue                                                                                          | Decision                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `LibraryPanel.tsx` | Handles file import, manual capture, embedding, export, destructive clear, and list rendering. | Keep component but move state import/export parsing to domain modules and make handlers small. |
| `storage/db.ts`    | Owns schema and operations without migration/export validation.                                | Add explicit migration/version helpers and canonical replace operation.                        |
| `domain/export.ts` | Browser download side effect mixed with domain export data.                                    | Split canonical state serialization from browser delivery helpers.                             |

## Dead Code

| Item                         | Evidence                               | Decision                                 |
| ---------------------------- | -------------------------------------- | ---------------------------------------- |
| `AppMeta` type               | Exported in `types.ts`, no references. | Delete unless used by state metadata.    |
| `getSetting` / `saveSetting` | No UI settings use.                    | Delete for now; no settings page exists. |

## TODO / FIXME / XXX / HACK

No source TODO/FIXME/XXX/HACK occurrences were found outside generated `docs/assets`.

## Type Safety Holes

| Item                   | Evidence                             | Decision                                            |
| ---------------------- | ------------------------------------ | --------------------------------------------------- |
| Untyped JSON imports   | No JSON import yet.                  | Add zod validation for state files.                 |
| Unsafe state row cast  | `getSetting<T>` casts unknown.       | Remove unused setting helpers.                      |
| AI dynamic import cast | `embeddings.ts` casts pipeline type. | Keep as boundary cast and isolate; document in ADR. |

## Inconsistent Patterns

| Pattern     | Before                                                     | Decision                                    |
| ----------- | ---------------------------------------------------------- | ------------------------------------------- |
| Errors      | Some thrown raw, some swallowed into generic UI status.    | Add user-facing error taxonomy helpers.     |
| Persistence | Writes individual rows; no canonical replace or migration. | Add `replaceLibrary` and schema validation. |
| Output      | Download-only; no copy/import.                             | Consolidate in state module.                |

## Test Coverage Holes

- No test for JSON export/import round-trip.
- No test for format detection.
- No test for batch partial failure.
- No test for clipboard/copy paths.
- Smoke test covers manual add, review, search only.

## After Implementation

| Metric                             | Before | After   | Evidence                                                             |
| ---------------------------------- | ------ | ------- | -------------------------------------------------------------------- | ------------------------------------------ | --- | ------------------------------------ |
| Source TODO/FIXME/XXX/HACK         | 0      | 0       | `rg "TODO                                                            | FIXME                                      | XXX | HACK" src tests` returns no matches. |
| `any` / `@ts-ignore` in source     | 0      | 0       | `rg "\\bany\\b                                                       | @ts-ignore" src tests` returns no matches. |
| Unused `AppMeta` type              | 1      | 0       | Removed while introducing canonical state metadata.                  |
| Unused settings IndexedDB helpers  | 2      | 0       | Removed; real preferences now live in `src/storage/preferences.ts`.  |
| Canonical state modules            | 0      | 1       | `src/domain/state.ts` owns validation, serialization, and summaries. |
| Boundary validation tests          | 0      | 3       | State import, format detection, and preferences storage tests added. |
| Playwright real-user path coverage | 1 path | 5 paths | Restore, clipboard import, review, search, and settings persistence. |

Remaining accepted debt:

- `LibraryPanel.tsx` is still the largest UI module because it owns the import workspace. It now delegates parsing, state validation, export delivery, sample data, errors, and persistence to separate modules; splitting it further would be mostly presentational churn.
- AI dynamic imports still require library boundary casts in `src/ai/embeddings.ts`; ADR 0069 accepts that as a typed boundary around third-party model loading.
