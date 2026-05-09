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
