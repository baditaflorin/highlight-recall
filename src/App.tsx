import { BookOpenCheck, HeartHandshake, Moon, RefreshCw, ShieldCheck, Star, Stars, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LibraryPanel } from './features/library/LibraryPanel'
import { useLibrary } from './features/library/useLibrary'
import { RecallForecast } from './features/review/RecallForecast'
import { ReviewQueue } from './features/review/ReviewQueue'
import { SearchPanel } from './features/search/SearchPanel'
import { reviewLoad, scheduleReview } from './domain/spacedRepetition'
import { defaultPreferences, type Preferences } from './domain/preferences'
import type { Highlight, ReviewGrade } from './domain/types'
import { loadPreferences, savePreferences } from './storage/preferences'

const repositoryUrl = __REPOSITORY_URL__
const paypalUrl = 'https://www.paypal.com/paypalme/florinbadita'

function App() {
  const library = useLibrary()
  const [toast, setToast] = useState('')
  const [preferences, setPreferences] = useState<Preferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences
    return loadPreferences()
  })
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const stats = useMemo(() => reviewLoad(library.highlights), [library.highlights])

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 4_000)
  }

  async function handleReview(highlight: Highlight, grade: ReviewGrade) {
    await library.updateHighlight(
      {
        ...highlight,
        updatedAt: new Date().toISOString(),
        review: scheduleReview(highlight.review, grade),
      },
      `Reviewed one highlight as ${grade}`,
    )
    showToast(`Scheduled as ${grade}`)
  }

  function updatePreferences(nextPreferences: Preferences) {
    setPreferences(nextPreferences)
    savePreferences(nextPreferences)
  }

  return (
    <main>
      <section className="app-shell">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <BookOpenCheck />
            </div>
            <div>
              <p className="eyebrow">Local-first Readwise alternative</p>
              <h1>Highlight Recall</h1>
            </div>
          </div>

          <nav aria-label="Project links">
            <a href={repositoryUrl} target="_blank" rel="noreferrer">
              <Star aria-hidden="true" />
              Star on GitHub
            </a>
            <a href={paypalUrl} target="_blank" rel="noreferrer">
              <HeartHandshake aria-hidden="true" />
              Support
            </a>
            <button
              className="icon-button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </nav>
        </header>

        <section className="hero-band" aria-label="Overview">
          <div>
            <p className="eyebrow">No account, no server, no reading trail to leak</p>
            <h2>Your highlights should come back when they matter.</h2>
            <p>
              Import EPUB/PDF notes, search them locally, and let spaced repetition make your
              reading library useful again.
            </p>
          </div>
          <div className="metric-strip" aria-label="Library metrics">
            <div>
              <span>{library.documents.length}</span>
              <p>Documents</p>
            </div>
            <div>
              <span>{library.highlights.length}</span>
              <p>Highlights</p>
            </div>
            <div>
              <span>{stats.due}</span>
              <p>Due today</p>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Privacy guarantees">
          <div>
            <ShieldCheck aria-hidden="true" />
            Browser-only storage
          </div>
          <div>
            <RefreshCw aria-hidden="true" />
            SM-2 style review schedule
          </div>
          <div>
            <Stars aria-hidden="true" />
            Lazy local AI helpers
          </div>
        </section>

        {library.loading ? (
          <section className="panel loading-panel" aria-live="polite">
            Loading local library
          </section>
        ) : (
          <section className="workspace-grid">
            <ReviewQueue
              highlights={library.highlights}
              byDocument={library.byDocument}
              onReview={(highlight, grade) => void handleReview(highlight, grade)}
            />
            <RecallForecast highlights={library.highlights} />
            <LibraryPanel
              documents={library.documents}
              highlights={library.highlights}
              activity={library.activity}
              byDocument={library.byDocument}
              preferences={preferences}
              onImport={(result) => library.importResult(result.document, result.highlights)}
              onHighlightsUpdate={library.updateHighlights}
              onDeleteHighlight={library.removeHighlight}
              onClear={library.clear}
              onActivity={library.logActivity}
              onPreferencesChange={updatePreferences}
              onRestore={library.restore}
            />
            <SearchPanel highlights={library.highlights} byDocument={library.byDocument} />
          </section>
        )}

        <footer>
          <span>Version {__APP_VERSION__}</span>
          <span>Commit {__COMMIT_SHA__}</span>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            https://github.com/baditaflorin/highlight-recall
          </a>
          <a href={paypalUrl} target="_blank" rel="noreferrer">
            https://www.paypal.com/paypalme/florinbadita
          </a>
        </footer>

        {toast ? (
          <div className="toast" role="status">
            {toast}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App
