import { describe, expect, it } from 'vitest'
import { buildImportResult, splitIntoHighlightCandidates, titleFromFileName } from './text'

describe('text extraction helpers', () => {
  it('splits prose into reviewable highlight candidates', () => {
    const candidates = splitIntoHighlightCandidates(
      'Short. This sentence on its own is much too short to be a highlight. ' +
        'This sentence is long enough to clear the eighteen word and ninety character minimums so it can become a useful review card for a future reader. ' +
        'Another useful sentence, padded out with enough extra clauses and context, gives a future reader plenty of material to stand on its own as a highlight.',
    )

    expect(candidates).toHaveLength(2)
    expect(candidates[0]).toContain('useful review card')
  })

  it('creates deterministic import shapes around generated IDs', () => {
    const result = buildImportResult({
      fileName: 'deep-work.epub',
      kind: 'epub',
      checksum: 'abc123',
      sections: [
        {
          location: 'Chapter 1',
          text: 'This sentence is substantial and long enough, once padded out with extra clauses, to clear the review heuristics and become a highlight candidate inside the review queue.',
        },
      ],
    })

    expect(result.document.title).toBe('deep work')
    expect(result.document.highlightCount).toBe(1)
    expect(result.highlights[0].location).toBe('Chapter 1')
  })

  it('derives readable titles from file names', () => {
    expect(titleFromFileName('the-mind_illuminated.pdf')).toBe('the mind illuminated')
  })
})
