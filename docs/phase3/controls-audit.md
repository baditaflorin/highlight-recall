# Phase 3 Controls Audit

| Control                    | Status before | Handler evidence                    | Problem                                                                                      | Decision                                                   |
| -------------------------- | ------------- | ----------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Star on GitHub             | green         | Anchor to repository.               | Works.                                                                                       | Keep.                                                      |
| Support                    | green         | Anchor to PayPal.                   | Works.                                                                                       | Keep.                                                      |
| Import EPUB/PDF/TXT        | yellow        | File input calls `handleFiles`.     | Batch can abort on first failure; no drag/drop; no JSON restore.                             | Finish.                                                    |
| Add highlight              | yellow        | Saves one manual card.              | Empty text is silently ignored; pasted multi-highlight blocks become one card.               | Finish with parsing and status.                            |
| Build semantic index       | yellow        | Calls embedding model.              | Long task is not cancellable; generic failure message; no skip of existing embeddings count. | Finish with abortable-ish session guard and clearer state. |
| Export JSON                | yellow        | Downloads file.                     | One-way only; timestamp makes byte-identical export impossible.                              | Finish with canonical export and restore.                  |
| Delete highlight           | yellow        | Deletes immediately.                | No undo and no document highlight count reconciliation.                                      | Keep immediate delete, add activity and count recompute.   |
| Clear local library        | yellow        | Clears immediately.                 | Destructive action with no confirmation or export prompt.                                    | Finish with confirmation and clear result.                 |
| AI recall prompt           | yellow        | Calls WebLLM, falls back to prompt. | Model load is huge, not cancellable, no copy output.                                         | Keep but make failure honest and copyable.                 |
| Move to next due highlight | green         | Rotates queue index.                | Works.                                                                                       | Keep.                                                      |
| Review grade buttons       | green         | Schedule update persists.           | Works for current queue.                                                                     | Keep.                                                      |
| Search input               | green         | MiniSearch over local highlights.   | Works.                                                                                       | Keep.                                                      |
| Semantic search icon       | yellow        | Disabled until embeddings exist.    | User gets no explanation when disabled.                                                      | Add title/status.                                          |

Before counts: green 4, yellow 9, red 0.

## After Implementation

| Control                               | Status after | Evidence                                                                                |
| ------------------------------------- | ------------ | --------------------------------------------------------------------------------------- |
| Star on GitHub                        | green        | Anchor remains visible and points to https://github.com/baditaflorin/highlight-recall.  |
| Support                               | green        | Anchor remains visible and points to https://www.paypal.com/paypalme/florinbadita.      |
| Import EPUB/PDF/TXT/JSON              | green        | One picker handles files, backups, batches, and recoverable import errors.              |
| Import zone drag/drop                 | green        | Drop handler uses the same importer as the file picker.                                 |
| Add highlight                         | green        | Empty/too-short input now gives visible status; HTML paste is cleaned first.            |
| Import clipboard                      | green        | Clipboard read imports text and gives permission fallback guidance.                     |
| Load sample                           | green        | Creates real persisted sample highlights.                                               |
| Build semantic index                  | green        | Counts missing embeddings, explains existing/failed states, and avoids silent failure.  |
| Download state                        | green        | Downloads canonical state JSON and records activity.                                    |
| Copy state                            | green        | Copies canonical state JSON and records activity.                                       |
| Delete highlight                      | green        | Deletes persisted row and records activity.                                             |
| Clear local library                   | green        | Confirmation is default; persisted setting can disable it deliberately.                 |
| AI recall prompt                      | green        | Browser model failure falls back to a deterministic prompt that can be copied.          |
| Copy card                             | green        | Current review card/prompt can be copied with visible status.                           |
| Move to next due highlight            | green        | Rotates queue index.                                                                    |
| Review grade buttons                  | green        | Persist schedule updates and record review activity.                                    |
| Search input                          | green        | Searches user highlights locally.                                                       |
| Semantic search icon                  | green        | Disabled state has title/status; lexical search remains usable.                         |
| Copy search result                    | green        | Result text can be copied with visible status.                                          |
| Confirm before clearing local library | green        | Setting persists through reload and directly controls whether clear shows confirmation. |

After counts: green 20, yellow 0, red 0.
