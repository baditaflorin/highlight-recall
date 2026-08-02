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

  it('never schedules a "hard" first review further out than "good" or "easy", regardless of import jitter', () => {
    const now = new Date('2026-05-08T08:00:00.000Z')

    // initialReviewState() spreads brand-new highlights across a random
    // 0-14 day jitter purely to avoid a review pile-up; it is not a signal
    // about recall difficulty. Every jitter value should produce the same
    // "hard" first-review interval, and that interval must never exceed
    // what "good" or "easy" would schedule for the identical highlight.
    for (let jitter = 0; jitter <= 14; jitter += 1) {
      const fresh = { dueAt: now.toISOString(), intervalDays: jitter, ease: 2.5, repetitions: 0, lapses: 0 }

      const hard = scheduleReview(fresh, 'hard', now)
      const good = scheduleReview(fresh, 'good', now)
      const easy = scheduleReview(fresh, 'easy', now)

      expect(hard.intervalDays).toBe(1)
      expect(hard.intervalDays).toBeLessThanOrEqual(good.intervalDays)
      expect(hard.intervalDays).toBeLessThanOrEqual(easy.intervalDays)
    }
  })

  it('still scales "hard" off the real previous interval on later reviews', () => {
    const now = new Date('2026-05-08T08:00:00.000Z')
    const reviewed = {
      dueAt: now.toISOString(),
      intervalDays: 8,
      ease: 2.5,
      repetitions: 2,
      lapses: 0,
    }

    const next = scheduleReview(reviewed, 'hard', now)

    expect(next.intervalDays).toBe(10) // ceil(8 * 1.2)
    expect(next.repetitions).toBe(3)
  })
})
