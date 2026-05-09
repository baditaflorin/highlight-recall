# Phase 3 Findings

## Top 5 Usability Gaps

1. JSON export is one-way, so users cannot restore backups or move browsers.
2. File import has no per-file error recovery; a bad file can stop a batch without a useful summary.
3. Drag/drop and clipboard import are absent even though they are natural ways to bring reading excerpts into a browser app.
4. Zero-highlight imports are not explained in reading-domain terms, especially scanned PDFs.
5. Destructive clear/delete actions are immediate and leave no activity trail.

## Top 5 Half-Baked Features

1. Semantic index: finish with clearer progress, existing-embedding counts, and disabled-state explanation.
2. AI recall prompt: finish with copy output and honest fallback language.
3. Export JSON: finish as canonical state backup with re-import.
4. Multi-file import: finish with partial-success summaries.
5. Clear library: finish with confirmation and activity entry.

## Top 5 Codebase Pain Points

1. State export is not canonical and mixes timestamps with user data.
2. Importer errors are not mapped to actionable user messages.
3. `LibraryPanel` owns too many responsibilities.
4. No persistence migration policy exists for IndexedDB rows.
5. No activity/history model exists to make destructive operations inspectable.

## Top 5 Documentation/Reality Mismatches

1. "JSON backup" exists as export but not restore.
2. "Imports EPUB/PDF" is true only for text-bearing, structurally typical files.
3. "Optional embeddings" works but lacks user-readable browser capability guidance.
4. "Local-first" is true, but portability was incomplete without state import.
5. Tests claim happy path only; README did not mention limitations.

## Fully Usable Means

- A stranger can import their own notes by file picker, drag/drop, paste, clipboard, or state restore.
- Every import either produces highlights or explains why it could not in reading-domain terms.
- A user can export a state file and import it in another browser with the same library restored.
- Review/search/output controls all work on user data, not only the smoke-test manual card.
- The README describes exactly what is shipped and what is limited.

## Phase 3 Success Metrics

- Input audit green or documented-out-of-scope for every row.
- Output audit green or documented-out-of-scope for every row.
- Export/import round-trip test passes deterministically.
- No source TODO/FIXME/XXX/HACK.
- No `any` or `@ts-ignore` in source.
- Smoke test covers import, review, search, copy, and state restore.
- GitHub Pages publishes `v0.2.0` with version/commit visible.

## Out Of Scope

- Cross-device sync.
- Server backend or email delivery.
- OCR for scanned PDFs.
- CSV export.
- Shareable full-library URLs.
- Folder import.
- Visual polish, dark mode, command palette, animations, or redesign.
