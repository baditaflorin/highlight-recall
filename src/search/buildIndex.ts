import MiniSearch from 'minisearch'
import type { Highlight, SearchHit } from '../domain/types'

export function buildSearchIndex(highlights: Highlight[]) {
  const index = new MiniSearch<Highlight>({
    fields: ['text', 'note', 'tags'],
    storeFields: ['id'],
    searchOptions: {
      boost: { text: 2, note: 1.3, tags: 1.6 },
      fuzzy: 0.18,
      prefix: true,
    },
  })

  index.addAll(highlights)
  return index
}

export function searchHighlights(highlights: Highlight[], query: string): SearchHit[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const byId = new Map(highlights.map((highlight) => [highlight.id, highlight]))
  return buildSearchIndex(highlights)
    .search(trimmed)
    .slice(0, 20)
    .flatMap((result) => {
      const highlight = byId.get(String(result.id))
      return highlight ? [{ highlight, score: result.score }] : []
    })
}
