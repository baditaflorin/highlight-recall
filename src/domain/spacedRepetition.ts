import type { Highlight, ReviewGrade, ReviewState } from './types'
import { addDays, nowIso } from './date'

export const initialReviewState = (createdAt = nowIso()): ReviewState => {
  // Add a small jitter (0-3 days) to new highlights so they don't all land on day 1
  const jitter = Math.floor(Math.random() * 4)
  const dueAt = addDays(new Date(createdAt), jitter).toISOString()
  return {
    dueAt,
    intervalDays: jitter,
    ease: 2.5,
    repetitions: 0,
    lapses: 0,
  }
}

export function scheduleReview(state: ReviewState, grade: ReviewGrade, reviewedAt = new Date()) {
  const next = { ...state }
  const oldEase = state.ease

  if (grade === 'again') {
    next.repetitions = 0
    next.intervalDays = 0
    next.ease = Math.max(1.3, oldEase - 0.2)
    next.lapses = state.lapses + 1
  }

  if (grade === 'hard') {
    next.repetitions = state.repetitions + 1
    next.intervalDays = Math.max(1, Math.ceil(Math.max(1, state.intervalDays) * 1.2))
    next.ease = Math.max(1.3, oldEase - 0.15)
  }

  if (grade === 'good') {
    next.repetitions = state.repetitions + 1
    next.intervalDays =
      state.repetitions === 0 ? 1 : Math.ceil(Math.max(1, state.intervalDays) * oldEase)
    next.ease = oldEase
  }

  if (grade === 'easy') {
    next.repetitions = state.repetitions + 1
    next.intervalDays =
      state.repetitions === 0 ? 3 : Math.ceil(Math.max(1, state.intervalDays) * (oldEase + 0.3))
    next.ease = Math.min(3.2, oldEase + 0.15)
  }

  const dueAt = addDays(reviewedAt, next.intervalDays)
  next.dueAt = dueAt.toISOString()
  next.lastReviewedAt = reviewedAt.toISOString()

  return next
}

export function dueHighlights(highlights: Highlight[], at = new Date()) {
  return highlights
    .filter((highlight) => new Date(highlight.review.dueAt).getTime() <= at.getTime())
    .sort((a, b) => new Date(a.review.dueAt).getTime() - new Date(b.review.dueAt).getTime())
}

export function reviewLoad(highlights: Highlight[], at = new Date()) {
  const due = dueHighlights(highlights, at).length
  const learned = highlights.filter((highlight) => highlight.review.repetitions > 0).length
  const lapses = highlights.reduce((total, highlight) => total + highlight.review.lapses, 0)

  return { due, learned, lapses }
}

export function recallForecast(highlights: Highlight[], days = 14, startAt = new Date()) {
  const forecast = []
  for (let i = 0; i <= days; i++) {
    const date = addDays(startAt, i)
    const dueCount = highlights.filter((h) => {
      const due = new Date(h.review.dueAt)
      return (
        due.getFullYear() === date.getFullYear() &&
        due.getMonth() === date.getMonth() &&
        due.getDate() === date.getDate()
      )
    }).length
    forecast.push({ date: date.toISOString(), count: dueCount })
  }
  return forecast
}
