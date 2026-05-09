# Phase 3 Stranger Test

Test style: private-browser pass using real notes text from the Phase 2 fixture set plus a versioned state file generated from the app schema. No dev tools, no fixture shortcuts except the prepared backup file.

## Cold Path

1. Open https://baditaflorin.github.io/highlight-recall/ equivalent local preview.
2. Try to understand how to bring data in without reading docs.
3. Restore a state file exported from another browser.
4. Search for a remembered phrase.
5. Clear the library and start again from clipboard text.
6. Review one card, copy it, search it, and change one setting.

## Findings

| Finding                                                                               | Severity | Response                                                                                           |
| ------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| Export was discoverable, but restore was not possible in v0.1.0.                      | high     | Added JSON state import through the normal file picker with validation and visible restore status. |
| Clipboard was a natural first move, but v0.1.0 required focusing the manual textarea. | high     | Added explicit Import clipboard control plus HTML paste cleanup.                                   |
| Clearing a local library felt risky because v0.1.0 deleted immediately.               | high     | Added confirmation by default and a persisted setting for users who deliberately opt out.          |
| Search results were useful but hard to move into notes.                               | medium   | Added copy controls on review cards and search results.                                            |
| A scanned PDF can still produce no highlights.                                        | medium   | Kept OCR out of scope, but now explains the scanned-PDF case and suggests OCR or manual paste.     |

## Top 3 Fixes Shipped

1. Versioned state restore.
2. Explicit clipboard import and cleaned HTML paste.
3. Clear confirmation plus persisted setting.

## Result

A stranger can now complete the local reading workflow end to end: import or restore, review, copy output, search, export, and recover from common input failures without asking for help. The remaining hard stop is scanned PDF/OCR, which is explicitly out of scope for the static Mode A app.
