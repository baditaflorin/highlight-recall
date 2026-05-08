import { describe, expect, it } from 'vitest'
import { initialReviewState, scheduleReview } from './spacedRepetition'

describe('spaced repetition scheduler', () => {
  it('graduates a new highlight with a good review', () => {
    const now = new Date('2026-05-08T08:00:00.000Z')
    const next = scheduleReview(initialReviewState(now.toISOString()), 'good', now)

    expect(next.repetitions).toBe(1)
    expect(next.intervalDays).toBe(1)
    expect(next.dueAt).toBe('2026-05-09T08:00:00.000Z')
  })

  it('resets repetitions and counts lapses when reviewed again', () => {
    const now = new Date('2026-05-08T08:00:00.000Z')
    const next = scheduleReview(
      {
        dueAt: now.toISOString(),
        intervalDays: 8,
        ease: 2.5,
        repetitions: 3,
        lapses: 0,
      },
      'again',
      now,
    )

    expect(next.repetitions).toBe(0)
    expect(next.intervalDays).toBe(0)
    expect(next.lapses).toBe(1)
    expect(next.ease).toBeLessThan(2.5)
  })
})
