# Privacy

Highlight Recall is local-first.

## Collected Data

No analytics are collected in v1.

## Stored Data

The browser stores:

- Imported document metadata.
- Extracted highlights.
- Review schedule state.
- Optional local embedding vectors.

This data is stored in IndexedDB inside the user's browser profile.

## Network Requests

The app may request static JavaScript/CSS assets from GitHub Pages. Optional AI features may download browser model assets from the package defaults used by `@huggingface/transformers` or `@mlc-ai/web-llm` after the user clicks the relevant AI action.

## Export

The user can export a JSON backup manually. Exports may contain personal reading data and should not be committed to git.
