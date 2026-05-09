# Privacy

Highlight Recall is local-first.

## Collected Data

No analytics are collected in v1.

## Stored Data

The browser stores:

- Imported document metadata.
- Extracted highlights.
- Review schedule state.
- Activity history for imports, restores, exports, copies, reviews, deletes, and clears.
- Local preferences such as whether clear-library confirmation is required.
- Optional local embedding vectors.

Library data is stored in IndexedDB inside the user's browser profile. Preferences are stored in localStorage.

## Network Requests

The app may request static JavaScript/CSS assets from GitHub Pages. Optional AI features may download browser model assets from the package defaults used by `@huggingface/transformers` or `@mlc-ai/web-llm` after the user clicks the relevant AI action.

## Export And Restore

The user can export a versioned JSON state file manually and import that file in another browser. State files may contain personal reading data, notes, tags, activity history, and optional embeddings. Do not commit exported state files to git unless they are intentionally scrubbed fixtures.

Clipboard import and copy features use the browser clipboard permission model. If permission is blocked, the app keeps the user's data intact and asks the user to paste manually instead.
