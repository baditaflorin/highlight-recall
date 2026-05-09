import { Copy, Search, WandSparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { copyText } from '../../domain/export'
import { findSemanticMatches } from '../../ai/embeddings'
import { searchHighlights } from '../../search/buildIndex'
import type { Highlight, SearchHit, SourceDocument } from '../../domain/types'

type Props = {
  highlights: Highlight[]
  byDocument: Map<string, SourceDocument>
}

export function SearchPanel({ highlights, byDocument }: Props) {
  const [query, setQuery] = useState('')
  const [semanticState, setSemanticState] = useState<'idle' | 'running' | 'unavailable'>('idle')
  const [semanticHits, setSemanticHits] = useState<SearchHit[]>([])
  const [copyStatus, setCopyStatus] = useState('')
  const lexicalHits = useMemo(() => searchHighlights(highlights, query), [highlights, query])
  const hits = semanticHits.length ? semanticHits : lexicalHits

  async function runSemanticSearch() {
    if (!query.trim()) return
    setSemanticState('running')
    try {
      setSemanticHits(await findSemanticMatches(highlights, query))
      setSemanticState('idle')
    } catch {
      setSemanticHits([])
      setSemanticState('unavailable')
    }
  }

  async function copyHighlight(text: string) {
    try {
      await copyText(text)
      setCopyStatus('Copied result')
    } catch {
      setCopyStatus('Clipboard unavailable')
    }
  }

  return (
    <section className="panel search-panel" aria-labelledby="search-heading">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Search</p>
          <h2 id="search-heading">Find the line you almost remember</h2>
        </div>
      </header>

      <div className="search-box">
        <Search aria-hidden="true" />
        <input
          type="search"
          placeholder="Search highlights, notes, and tags"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSemanticHits([])
            setSemanticState('idle')
          }}
        />
        <button
          type="button"
          className="icon-button"
          aria-label="Run semantic search"
          title="Run semantic search"
          onClick={runSemanticSearch}
          disabled={!query.trim() || highlights.every((highlight) => !highlight.embedding)}
        >
          <WandSparkles aria-hidden="true" />
        </button>
      </div>

      {semanticState === 'unavailable' ? (
        <p className="muted">
          Semantic search needs the browser AI model cache. Lexical search is still ready.
        </p>
      ) : null}

      {copyStatus ? <p className="muted">{copyStatus}</p> : null}

      <div className="search-results" aria-live="polite">
        {query && hits.length === 0 ? <p className="muted">No matching highlights yet.</p> : null}
        {hits.map(({ highlight, score }) => {
          const document = byDocument.get(highlight.documentId)
          return (
            <article key={highlight.id} className="result-card">
              <p className="source-line">
                {document?.title ?? 'Manual highlight'} · score {score.toFixed(2)}
              </p>
              <p>{highlight.text}</p>
              <button
                className="secondary-button compact-button"
                type="button"
                onClick={() => void copyHighlight(highlight.text)}
              >
                <Copy aria-hidden="true" />
                Copy
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
