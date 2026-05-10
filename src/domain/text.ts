import type { DocumentKind, Highlight, SourceDocument } from './types'
import { nowIso } from './date'
import { createId } from './id'
import { initialReviewState } from './spacedRepetition'

const sentenceBreak = /(?<=[.!?])\s+(?=[A-Z0-9"'])/g

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function splitIntoHighlightCandidates(text: string) {
  const normalized = normalizeWhitespace(text)
  const sentences = normalized.split(sentenceBreak)

  return sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) => {
      // "Smarter" filtering to remove junk
      const wordCount = sentence.split(/\s+/).length
      const isTooShort = sentence.length < 90 || wordCount < 18
      const isMetadata = /Page \d+|All rights reserved|Published in/i.test(sentence)

      return !isTooShort && !isMetadata && sentence.length <= 1200
    })
    .slice(0, 400) // Allow more candidates for larger books, but keep it manageable
}

export function titleFromFileName(fileName: string) {
  return (
    fileName
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim() || fileName
  )
}

export function buildImportResult(input: {
  title?: string
  fileName: string
  kind: DocumentKind
  checksum: string
  sections: Array<{ text: string; location?: string }>
}) {
  const importedAt = nowIso()
  const document: SourceDocument = {
    id: createId('doc'),
    title: input.title?.trim() || titleFromFileName(input.fileName),
    fileName: input.fileName,
    kind: input.kind,
    importedAt,
    highlightCount: 0,
    checksum: input.checksum,
  }

  const highlights: Highlight[] = input.sections.flatMap((section, sectionIndex) =>
    splitIntoHighlightCandidates(section.text).map((text, sentenceIndex) => ({
      id: createId('hl'),
      documentId: document.id,
      text,
      location: section.location ?? `Section ${sectionIndex + 1}.${sentenceIndex + 1}`,
      tags: [],
      createdAt: importedAt,
      updatedAt: importedAt,
      review: initialReviewState(importedAt),
    })),
  )

  return {
    document: {
      ...document,
      highlightCount: highlights.length,
    },
    highlights,
  }
}
