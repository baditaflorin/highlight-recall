# 0006 - WASM Modules

## Status

Accepted

## Context

The original product sketch mentioned Tantivy, sentence-transformers, and a local LLM. GitHub Pages cannot set arbitrary COOP/COEP headers, and the first-load budget is under 200KB gzipped.

## Decision

Do not load mandatory WASM on first render. PDF parsing uses `pdfjs-dist` lazily. Sentence-transformer embeddings use `@huggingface/transformers` lazily with browser cache. Local LLM generation uses `@mlc-ai/web-llm` lazily and gracefully falls back to a deterministic recall prompt if WebGPU/model loading is unavailable. Tantivy native bindings are not used in the browser v1; MiniSearch provides client-side lexical search.

## Consequences

The app remains deployable on plain GitHub Pages. AI features may require modern browser capabilities and model downloads. Search is local and fast, but not Tantivy-backed in v1.

## Alternatives Considered

Node Tantivy bindings were rejected because Mode A has no runtime server. A custom WASM search module was rejected as too risky for v1.
