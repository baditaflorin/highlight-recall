import {
  ClipboardPaste,
  Copy,
  Download,
  FileUp,
  Library,
  Plus,
  Trash2,
  WandSparkles,
} from 'lucide-react'
import { useMemo, useState, type ClipboardEvent } from 'react'
import { importErrorMessage, zeroHighlightMessage } from '../../domain/errors'
import { copyText, downloadJson } from '../../domain/export'
import { createSampleImport } from '../../domain/sample'
import {
  buildLibraryState,
  parseLibraryState,
  serializeLibraryState,
  stateSummary,
} from '../../domain/state'
import type { Activity, Highlight, ImportResult, SourceDocument } from '../../domain/types'
import { detectFileKind } from '../../importers/detect'
import { importFile } from '../../importers'
import { enrichMissingEmbeddings } from '../../ai/embeddings'
import { importTextContent } from '../../importers/text'
import type { Preferences } from '../../domain/preferences'

type Props = {
  documents: SourceDocument[]
  highlights: Highlight[]
  activity: Activity[]
  preferences: Preferences
  onImport: (result: ImportResult) => Promise<void>
  onHighlightsUpdate: (highlights: Highlight[]) => Promise<void>
  onDeleteHighlight: (id: string) => Promise<void>
  onClear: () => Promise<void>
  onActivity: (type: Activity['type'], message: string, detail?: string) => Promise<void>
  onPreferencesChange: (preferences: Preferences) => void
  onRestore: (state: {
    documents: SourceDocument[]
    highlights: Highlight[]
    activity: Activity[]
    detail: string
  }) => Promise<void>
  byDocument: Map<string, SourceDocument>
}

type StagedImport = {
  document: SourceDocument
  highlights: Highlight[]
}

export function LibraryPanel({
  documents,
  highlights,
  activity,
  preferences,
  onImport,
  onHighlightsUpdate,
  onDeleteHighlight,
  onClear,
  onActivity,
  onPreferencesChange,
  onRestore,
  byDocument,
}: Props) {
  const [status, setStatus] = useState('')
  const [manualText, setManualText] = useState('')
  const [manualNote, setManualNote] = useState('')
  const [embeddingProgress, setEmbeddingProgress] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [staged, setStaged] = useState<StagedImport | null>(null)
  const stateJson = useMemo(
    () =>
      serializeLibraryState(
        buildLibraryState({
          documents,
          highlights,
          activity,
          version: __APP_VERSION__,
          commit: __COMMIT_SHA__,
        }),
      ),
    [activity, documents, highlights],
  )

  async function restoreStateFile(file: File) {
    const state = parseLibraryState(await file.text())
    const summary = stateSummary(state)
    await onRestore({
      documents: state.documents,
      highlights: state.highlights,
      activity: state.activity,
      detail: `${file.name}: ${summary}`,
    })
    setStatus(`Restored ${summary} from ${file.name}`)
    return summary
  }

  async function handleFiles(files: Iterable<File> | null) {
    const batch = files ? [...files] : []
    if (!batch.length) return

    let imported = 0
    const restoreSummaries: string[] = []
    const failures: string[] = []

    for (const file of batch) {
      try {
        setStatus(`Importing ${file.name}`)
        const kind = await detectFileKind(file)

        if (kind === 'state') {
          restoreSummaries.push(await restoreStateFile(file))
          continue
        }

        const result = await importFile(file)
        if (result.highlights.length === 0) {
          const message = zeroHighlightMessage(file.name, result.document.kind)
          failures.push(`${message.title}. ${message.nextStep}`)
          continue
        }
        setStaged(result)
        return // Stop batch processing to allow staging
      } catch (error) {
        const message = importErrorMessage(error, file.name)
        failures.push(`${message.title}. ${message.nextStep}`)
      }
    }

    const summary = [
      imported ? `${imported} highlights imported` : '',
      restoreSummaries.length === 1
        ? `Restored ${restoreSummaries[0]}`
        : restoreSummaries.length
          ? `${restoreSummaries.length} backups restored`
          : '',
      failures.length
        ? `${failures.length} issue${failures.length === 1 ? '' : 's'}: ${failures.join(' ')}`
        : '',
    ]
      .filter(Boolean)
      .join(' · ')
    setStatus(summary || 'Nothing imported')
  }

  async function addManualHighlight() {
    const text = manualText.trim()
    if (!text) {
      setStatus('Paste at least one sentence or paragraph to add a highlight.')
      return
    }

    const result = importTextContent({
      text,
      fileName: 'manual-paste.txt',
      title: 'Manual paste',
    })
    const note = manualNote.trim()
    const withNote = {
      ...result,
      highlights: result.highlights.map((highlight) => ({
        ...highlight,
        note: note || undefined,
        tags: [...highlight.tags, 'manual'],
      })),
    }

    if (withNote.highlights.length === 0) {
      setStatus('That text was too short for a review card. Paste a full sentence or paragraph.')
      return
    }

    await onImport(withNote)
    setStatus(
      `Added ${withNote.highlights.length} manual highlight${withNote.highlights.length === 1 ? '' : 's'}`,
    )
    setManualText('')
    setManualNote('')
  }

  async function buildEmbeddings() {
    const missing = highlights.filter((highlight) => !highlight.embedding?.length).length
    if (missing === 0) {
      setEmbeddingProgress('Semantic index already covers every highlight')
      return
    }

    setEmbeddingProgress('Starting semantic model')
    try {
      const enriched = await enrichMissingEmbeddings(highlights, (done) => {
        setEmbeddingProgress(
          `${done} / ${highlights.length} checked · ${missing} needed embeddings`,
        )
      })
      await onHighlightsUpdate(enriched)
      setEmbeddingProgress('Semantic index ready')
    } catch {
      setEmbeddingProgress('Semantic model unavailable in this browser; lexical search still works')
    }
  }

  async function importClipboard() {
    try {
      const clipboardItems = await navigator.clipboard.readText()
      const text = clipboardItems.trim()
      if (!text) {
        setStatus('Clipboard is empty. Copy a passage first, then try again.')
        return
      }
      const result = importTextContent({
        text,
        fileName: 'clipboard.txt',
        title: 'Clipboard import',
      })
      if (result.highlights.length === 0) {
        setStatus(
          'Clipboard text was too short for a review card. Copy a full sentence or paragraph.',
        )
        return
      }
      await onImport(result)
      setStatus(`Imported ${result.highlights.length} highlights from clipboard`)
    } catch {
      setStatus('Clipboard permission was blocked. Paste the text into the manual box instead.')
    }
  }

  function handleManualPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const html = event.clipboardData.getData('text/html')
    if (!html) return

    const doc = new DOMParser().parseFromString(html, 'text/html')
    doc.querySelectorAll('script, style, nav').forEach((node) => node.remove())
    const text = doc.body.textContent?.replace(/\s+/g, ' ').trim()
    if (!text) return

    event.preventDefault()
    setManualText(text)
    setStatus('Cleaned pasted HTML into readable text')
  }

  async function copyState() {
    try {
      await copyText(stateJson)
      await onActivity(
        'copy',
        'Copied state JSON to clipboard',
        stateSummary({ documents, highlights, activity }),
      )
      setStatus('Copied state JSON to clipboard')
    } catch (error) {
      const message = importErrorMessage(error, 'clipboard')
      setStatus(`${message.body} ${message.nextStep}`)
    }
  }

  async function downloadState() {
    downloadJson('highlight-recall-state.json', stateJson)
    await onActivity(
      'export',
      'Downloaded state JSON',
      stateSummary({ documents, highlights, activity }),
    )
    setStatus('Downloaded state JSON')
  }

  async function loadSample() {
    const sample = createSampleImport()
    await onImport(sample)
    setStatus(`Loaded ${sample.highlights.length} sample highlights`)
  }

  async function clearWithConfirmation() {
    if (
      preferences.confirmBeforeClear &&
      !window.confirm(
        'Clear every local document, highlight, embedding, and activity entry in this browser?',
      )
    ) {
      return
    }

    await onClear()
    setStatus('Local library cleared')
  }

  return (
    <section className="panel library-panel" aria-labelledby="library-heading">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Collection</p>
          <h2 id="library-heading">Library & Import</h2>
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
          accept=".epub,.pdf,.txt,.md,.json,application/pdf,application/epub+zip,application/json,text/*"
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <label
          htmlFor="file-import"
          className={isDragging ? 'is-dragging' : ''}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            void handleFiles(event.dataTransfer.files)
          }}
        >
          <FileUp aria-hidden="true" />
          Import EPUB, PDF, TXT, backup
        </label>
        <p>{status || 'Files never leave this browser.'}</p>
      </div>

      {staged && (
        <div className="staged-preview">
          <header className="panel-header">
            <div>
              <p className="eyebrow">Review before import</p>
              <h3>{staged.highlights.length} potential highlights from {staged.document.fileName}</h3>
            </div>
            <div className="button-row">
              <button className="secondary-button" onClick={() => setStaged(null)}>Cancel</button>
              <button 
                className="primary-button" 
                onClick={async () => {
                  await onImport(staged)
                  setStaged(null)
                  setStatus(`Imported ${staged.highlights.length} highlights`)
                }}
              >
                Confirm Import
              </button>
            </div>
          </header>
          <div className="staged-list">
            {staged.highlights.map((h, i) => (
              <div key={i} className="staged-row">
                <p>{h.text}</p>
                <button 
                  className="icon-button" 
                  onClick={() => {
                    setStaged({
                      ...staged,
                      highlights: staged.highlights.filter((_, idx) => idx !== i)
                    })
                  }}
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="manual-form">
        <textarea
          value={manualText}
          onChange={(event) => setManualText(event.target.value)}
          onPaste={handleManualPaste}
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
        <button type="button" className="secondary-button" onClick={() => void importClipboard()}>
          <ClipboardPaste aria-hidden="true" />
          Import clipboard
        </button>
        <button type="button" className="secondary-button" onClick={() => void loadSample()}>
          <Plus aria-hidden="true" />
          Load sample
        </button>
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
          onClick={() => void downloadState()}
          disabled={highlights.length === 0}
        >
          <Download aria-hidden="true" />
          Download state
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => void copyState()}
          disabled={highlights.length === 0}
        >
          <Copy aria-hidden="true" />
          Copy state
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
        {highlights.slice(0, 10).map((highlight) => {
          const document = byDocument.get(highlight.documentId)
          return (
            <article key={highlight.id} className="highlight-row">
              <div className="highlight-content">
                <p className="source-line">{document?.title ?? 'Manual'}</p>
                <p>{highlight.text}</p>
              </div>
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
          )
        })}
      </div>

      {highlights.length ? (
        <button
          type="button"
          className="danger-button"
          onClick={() => void clearWithConfirmation()}
        >
          Clear local library
        </button>
      ) : null}

      {activity.length ? (
        <div className="activity-list" aria-label="Recent activity">
          {activity.slice(0, 5).map((item) => (
            <p key={item.id}>
              <strong>{item.message}</strong>
              {item.detail ? <span>{item.detail}</span> : null}
            </p>
          ))}
        </div>
      ) : null}

      <section className="settings-panel" aria-labelledby="settings-heading">
        <h3 id="settings-heading">Settings</h3>
        <label>
          <input
            type="checkbox"
            checked={preferences.confirmBeforeClear}
            onChange={(event) =>
              onPreferencesChange({
                ...preferences,
                confirmBeforeClear: event.target.checked,
              })
            }
          />
          Confirm before clearing the local library
        </label>
      </section>
    </section>
  )
}
