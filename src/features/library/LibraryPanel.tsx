import { Download, FileUp, Library, Plus, Trash2, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { nowIso } from '../../domain/date'
import { downloadJson, exportLibrary } from '../../domain/export'
import { createId } from '../../domain/id'
import { initialReviewState } from '../../domain/spacedRepetition'
import type { Highlight, ImportResult, SourceDocument } from '../../domain/types'
import { importFile } from '../../importers'
import { enrichMissingEmbeddings } from '../../ai/embeddings'

type Props = {
  documents: SourceDocument[]
  highlights: Highlight[]
  onImport: (result: ImportResult) => Promise<void>
  onHighlightsUpdate: (highlights: Highlight[]) => Promise<void>
  onManualHighlight: (highlight: Highlight) => Promise<void>
  onDeleteHighlight: (id: string) => Promise<void>
  onClear: () => Promise<void>
}

export function LibraryPanel({
  documents,
  highlights,
  onImport,
  onHighlightsUpdate,
  onManualHighlight,
  onDeleteHighlight,
  onClear,
}: Props) {
  const [status, setStatus] = useState('')
  const [manualText, setManualText] = useState('')
  const [manualNote, setManualNote] = useState('')
  const [embeddingProgress, setEmbeddingProgress] = useState('')

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return

    for (const file of [...files]) {
      setStatus(`Importing ${file.name}`)
      const result = await importFile(file)
      await onImport(result)
      setStatus(`Imported ${result.highlights.length} highlights from ${file.name}`)
    }
  }

  async function addManualHighlight() {
    const text = manualText.trim()
    if (!text) return

    const createdAt = nowIso()
    await onManualHighlight({
      id: createId('hl'),
      documentId: 'manual',
      text,
      note: manualNote.trim() || undefined,
      tags: ['manual'],
      createdAt,
      updatedAt: createdAt,
      review: initialReviewState(createdAt),
    })
    setManualText('')
    setManualNote('')
  }

  async function buildEmbeddings() {
    setEmbeddingProgress('Starting semantic model')
    try {
      const enriched = await enrichMissingEmbeddings(highlights, (done) => {
        setEmbeddingProgress(`${done} / ${highlights.length} embedded`)
      })
      await onHighlightsUpdate(enriched)
      setEmbeddingProgress('Semantic index ready')
    } catch {
      setEmbeddingProgress('Semantic model unavailable in this browser; lexical search still works')
    }
  }

  return (
    <section className="panel library-panel" aria-labelledby="library-heading">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Library</p>
          <h2 id="library-heading">Import, keep, and revisit</h2>
        </div>
        <div className="counter-pill">
          <Library aria-hidden="true" />
          {highlights.length}
        </div>
      </header>

      <div className="import-zone">
        <input
          id="file-import"
          type="file"
          multiple
          accept=".epub,.pdf,.txt,.md,application/pdf,application/epub+zip,text/*"
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <label htmlFor="file-import">
          <FileUp aria-hidden="true" />
          Import EPUB, PDF, TXT
        </label>
        <p>{status || 'Files never leave this browser.'}</p>
      </div>

      <div className="manual-form">
        <textarea
          value={manualText}
          onChange={(event) => setManualText(event.target.value)}
          placeholder="Paste a highlight worth revisiting"
          rows={4}
        />
        <input
          value={manualNote}
          onChange={(event) => setManualNote(event.target.value)}
          placeholder="Optional note"
        />
        <button type="button" onClick={addManualHighlight}>
          <Plus aria-hidden="true" />
          Add highlight
        </button>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="secondary-button"
          onClick={buildEmbeddings}
          disabled={highlights.length === 0}
        >
          <WandSparkles aria-hidden="true" />
          Build semantic index
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            downloadJson('highlight-recall-export.json', exportLibrary(documents, highlights))
          }
          disabled={highlights.length === 0}
        >
          <Download aria-hidden="true" />
          Export JSON
        </button>
      </div>
      {embeddingProgress ? <p className="muted">{embeddingProgress}</p> : null}

      <div className="document-list">
        {documents.map((document) => (
          <article key={document.id} className="document-row">
            <div>
              <strong>{document.title}</strong>
              <span>
                {document.kind.toUpperCase()} · {document.highlightCount} highlights
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="recent-list">
        {highlights.slice(0, 6).map((highlight) => (
          <article key={highlight.id} className="highlight-row">
            <p>{highlight.text}</p>
            <button
              type="button"
              className="icon-button"
              aria-label="Delete highlight"
              title="Delete highlight"
              onClick={() => void onDeleteHighlight(highlight.id)}
            >
              <Trash2 aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>

      {highlights.length ? (
        <button type="button" className="danger-button" onClick={onClear}>
          Clear local library
        </button>
      ) : null}
    </section>
  )
}
