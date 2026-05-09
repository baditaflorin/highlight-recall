# Phase 3 State Taxonomy

## App Shell

| State                    | Trigger                                         | User-visible behavior                                                                      | Exit                                       |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Loading local library    | App starts and reads IndexedDB/localStorage.    | Loading panel announces local library loading.                                             | Storage read resolves.                     |
| Ready empty              | No documents/highlights exist.                  | Review panel says all caught up; import controls are active; export controls are disabled. | Import, restore, sample, paste, clipboard. |
| Ready with highlights    | Library has at least one highlight.             | Review, library, search, output, settings, and activity controls are active.               | Review, search, export, delete, clear.     |
| Ready with activity only | Library was cleared but clear activity remains. | Import controls stay active and recent activity explains the clear.                        | Import, restore, sample, paste, clipboard. |

## Import Pipeline

| State                    | Trigger                                 | User-visible behavior                                                        | Exit                                                      |
| ------------------------ | --------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| Importing file           | User picks or drops one or more files.  | Status names the file currently being imported.                              | Success, partial success, or recoverable failure summary. |
| Batch partial success    | Some files import and some fail.        | Status reports imported highlight count plus each issue.                     | User can retry failed files or continue with successes.   |
| Zero-highlight import    | Parser extracts no reviewable passages. | Status explains scanned PDF or too-short text and suggests OCR/manual paste. | Paste text, choose another file, or continue.             |
| Restore state            | User imports Highlight Recall JSON.     | Documents, highlights, and activity are replaced after validation.           | Ready with restored highlights.                           |
| Recoverable import error | Unsupported/corrupt/incompatible file.  | Status gives what failed, likely why, and next step.                         | Pick another file, paste text, or restore a valid backup. |

## Review And Search

| State                | Trigger                           | User-visible behavior                                         | Exit                                                |
| -------------------- | --------------------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| Due review           | At least one highlight is due.    | Current card, copy control, AI prompt control, grade buttons. | Grade card or move to next due highlight.           |
| Review caught up     | No highlights are due.            | All-caught-up message.                                        | Import due highlight or wait until future due date. |
| AI loading           | User asks for recall prompt.      | Button says local AI is loading.                              | Model response or deterministic fallback.           |
| AI fallback          | Model cannot run in browser.      | Deterministic prompt is shown and copyable.                   | Continue review.                                    |
| Lexical search ready | User types a search query.        | MiniSearch results appear immediately.                        | Clear query, copy result, or run semantic search.   |
| Semantic unavailable | Embeddings/model path cannot run. | Status says lexical search is still ready.                    | Use lexical search or build embeddings later.       |

## Output, Settings, And Destructive Actions

| State               | Trigger                                              | User-visible behavior                                     | Exit                               |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| Copy output success | User copies card, result, or state.                  | Copy button/status confirms the operation.                | Continue work.                     |
| Copy output failure | Browser blocks clipboard.                            | Status says clipboard unavailable and leaves data intact. | Use download or manual selection.  |
| Download state      | User downloads state JSON.                           | File is emitted and activity records export.              | Continue work or import elsewhere. |
| Clear confirmation  | User clicks clear with confirmation setting enabled. | Native confirmation asks before deletion.                 | Cancel or confirm clear.           |
| Clear immediate     | User disables confirmation setting.                  | Clear executes directly and records activity.             | Import or restore.                 |
| Settings changed    | User toggles confirm-before-clear.                   | Setting persists to localStorage.                         | Reload or continue; value remains. |

Every state has an actionable exit. There are no intended production states where a user must reload to recover.
