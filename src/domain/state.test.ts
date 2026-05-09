import { describe, expect, it } from 'vitest'
import { buildLibraryState, parseLibraryState, serializeLibraryState } from './state'
import { initialReviewState } from './spacedRepetition'

const document = {
  id: 'doc_a',
  title: 'A Book',
  fileName: 'a-book.txt',
  kind: 'text' as const,
  importedAt: '2026-05-09T10:00:00.000Z',
  highlightCount: 1,
  checksum: 'abc',
}

const highlight = {
  id: 'hl_a',
  documentId: 'doc_a',
  text: 'This is a long enough highlight to be useful as a deterministic round trip fixture.',
  tags: ['test'],
  createdAt: '2026-05-09T10:00:00.000Z',
  updatedAt: '2026-05-09T10:00:00.000Z',
  review: initialReviewState('2026-05-09T10:00:00.000Z'),
}

describe('library state', () => {
  it('round trips exported state through validation', () => {
    const state = buildLibraryState({
      documents: [document],
      highlights: [highlight],
      activity: [],
      version: '0.2.0',
      commit: 'test',
      exportedAt: '2026-05-09T10:00:00.000Z',
    })

    const serialized = serializeLibraryState(state)
    expect(parseLibraryState(serialized)).toEqual(state)
    expect(serializeLibraryState(parseLibraryState(serialized))).toBe(serialized)
  })

  it('rejects incompatible JSON before persistence', () => {
    expect(() => parseLibraryState('{"schemaVersion":999}')).toThrow(/compatible Highlight Recall/)
  })
})
