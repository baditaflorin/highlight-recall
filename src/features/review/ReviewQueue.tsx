import { Brain, CalendarClock, Check, RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { relativeDueLabel } from '../../domain/date'
import { dueHighlights } from '../../domain/spacedRepetition'
import type { Highlight, ReviewGrade, SourceDocument } from '../../domain/types'
import { buildRecallPrompt, generateRecallQuestion } from '../../ai/localLlm'

type Props = {
  highlights: Highlight[]
  byDocument: Map<string, SourceDocument>
  onReview: (highlight: Highlight, grade: ReviewGrade) => void
}

const gradeLabels: Array<{ grade: ReviewGrade; label: string; title: string }> = [
  { grade: 'again', label: 'Again', title: 'Reset and show again soon' },
  { grade: 'hard', label: 'Hard', title: 'Keep the interval short' },
  { grade: 'good', label: 'Good', title: 'Schedule with the normal interval' },
  { grade: 'easy', label: 'Easy', title: 'Stretch the interval' },
]

export function ReviewQueue({ highlights, byDocument, onReview }: Props) {
  const queue = useMemo(() => dueHighlights(highlights), [highlights])
  const [activeIndex, setActiveIndex] = useState(0)
  const [question, setQuestion] = useState('')
  const [aiState, setAiState] = useState<'idle' | 'prompt' | 'running'>('idle')
  const active = queue[Math.min(activeIndex, Math.max(queue.length - 1, 0))]
  const document = active ? byDocument.get(active.documentId) : undefined

  async function handleGenerateQuestion() {
    if (!active) return
    setAiState('running')
    try {
      setQuestion(await generateRecallQuestion({ highlight: active.text, note: active.note }))
    } catch {
      setQuestion(buildRecallPrompt({ highlight: active.text, note: active.note }))
      setAiState('prompt')
      return
    }
    setAiState('idle')
  }

  if (!active) {
    return (
      <section className="panel review-empty" aria-labelledby="review-heading">
        <div>
          <p className="eyebrow">Daily review</p>
          <h2 id="review-heading">All caught up</h2>
          <p>Import a book or add a highlight, then it will appear here when it is due.</p>
        </div>
        <Check aria-hidden="true" />
      </section>
    )
  }

  return (
    <section className="panel review-panel" aria-labelledby="review-heading">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Daily review</p>
          <h2 id="review-heading">
            {queue.length} due highlight{queue.length === 1 ? '' : 's'}
          </h2>
        </div>
        <div className="counter-pill">
          <CalendarClock aria-hidden="true" />
          {activeIndex + 1} / {queue.length}
        </div>
      </header>

      <article className="review-card">
        <p className="source-line">
          {document?.title ?? 'Manual highlight'} · {active.location ?? 'Saved'}
        </p>
        <blockquote>{active.text}</blockquote>
        {active.note ? <p className="note-line">{active.note}</p> : null}
        <p className="muted">
          {relativeDueLabel(active.review.dueAt)} · interval {active.review.intervalDays}d · ease{' '}
          {active.review.ease.toFixed(2)}
        </p>
      </article>

      {question ? (
        <div className="ai-output" role="status">
          <Brain aria-hidden="true" />
          <p>{question}</p>
        </div>
      ) : null}

      <div className="button-row">
        <button className="secondary-button" type="button" onClick={handleGenerateQuestion}>
          <Sparkles aria-hidden="true" />
          {aiState === 'running'
            ? 'Loading local AI'
            : aiState === 'prompt'
              ? 'Prompt fallback shown'
              : 'AI recall prompt'}
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="Move to next due highlight"
          title="Move to next due highlight"
          onClick={() => setActiveIndex((index) => (index + 1) % queue.length)}
        >
          <RotateCcw aria-hidden="true" />
        </button>
      </div>

      <div className="grade-grid" aria-label="Review grade">
        {gradeLabels.map((item) => (
          <button
            key={item.grade}
            type="button"
            title={item.title}
            onClick={() => {
              onReview(active, item.grade)
              setQuestion('')
              setActiveIndex(0)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  )
}
