# Postmortem

## What Was Built

Highlight Recall v0.1.0 is a static GitHub Pages PWA that imports EPUB/PDF/TXT/Markdown files locally, extracts reviewable highlight candidates, stores them in IndexedDB, schedules reviews with an SM-2-style algorithm, searches with MiniSearch, and offers optional lazy local AI helpers for embeddings and recall prompts.

Live app:

https://baditaflorin.github.io/highlight-recall/

Repository:

https://github.com/baditaflorin/highlight-recall

## Was Mode A Correct?

Yes. Mode A was the correct choice in hindsight. The v1 product needs no accounts, server-side mutations, shared corpus, runtime secrets, or cross-device sync. EPUB/PDF parsing, persistence, search, and review scheduling all work in the browser.

Mode B would only add value if the project later ships a public demo corpus or precomputed model/index artifacts. Mode C would only be justified for sync, email delivery, paid accounts, or server-side OCR.

## What Worked

- GitHub Pages from `main` `/docs` works cleanly with Vite base path `/highlight-recall/`.
- IndexedDB is enough for the highlight library and review state.
- Lazy chunks keep the first-load app under the 200KB gzipped target.
- Plain `.githooks` were simpler than adding a hook manager.
- Playwright smoke coverage catches the core import, review, and search path.

## What Did Not Work

- Exact Tantivy in Mode A was not practical because current npm Tantivy packages are native Node bindings, not browser WASM suitable for GitHub Pages. MiniSearch is the v1 substitute.
- A build artifact cannot embed its own final commit hash. The app now displays the latest non-build source commit so publishing commits stay deterministic.
- Local LLM support is necessarily best-effort because model downloads and WebGPU support vary by browser.

## Surprises

- `@huggingface/transformers` pulls a large WASM runtime even when lazy-loaded.
- The Vite/Rolldown warning for the lazy local LLM chunk is expected because the chunk is intentionally behind a user action.
- GitHub Pages legacy source creation needed an explicit JSON `source` object through `gh api`.

## Tech Debt Accepted

- EPUB parsing handles standard spine XHTML but not exotic EPUB navigation edge cases.
- PDF import extracts text, not annotations embedded by every PDF reader format.
- No JSON re-import yet; export exists as the backup foundation.
- No OCR, cross-device sync, or email delivery.
- Optional AI features need better progress and browser capability detection.

## Next 3 Improvements

1. Add JSON import/restore and duplicate detection by checksum plus text hash.
2. Add true PDF annotation extraction for common highlighter tools.
3. Add notification-based daily review reminders through the PWA service worker.

## Time Spent Vs Estimate

Estimated: 3-5 hours for a credible static v1 scaffold and live Pages deployment.

Actual: roughly one focused implementation session. The largest time sinks were Pages build metadata stability, local hook verification, and keeping heavy AI modules lazy.
