import { openDB, type DBSchema } from 'idb'
import type { Highlight, SourceDocument } from '../domain/types'

type Settings = {
  key: string
  value: unknown
}

interface HighlightRecallDB extends DBSchema {
  documents: {
    key: string
    value: SourceDocument
    indexes: {
      'by-imported-at': string
    }
  }
  highlights: {
    key: string
    value: Highlight
    indexes: {
      'by-document': string
      'by-due-at': string
    }
  }
  settings: {
    key: string
    value: Settings
  }
}

const dbPromise = openDB<HighlightRecallDB>('highlight-recall', 1, {
  upgrade(db) {
    const documents = db.createObjectStore('documents', { keyPath: 'id' })
    documents.createIndex('by-imported-at', 'importedAt')

    const highlights = db.createObjectStore('highlights', { keyPath: 'id' })
    highlights.createIndex('by-document', 'documentId')
    highlights.createIndex('by-due-at', 'review.dueAt')

    db.createObjectStore('settings', { keyPath: 'key' })
  },
})

export async function getDocuments() {
  return (await dbPromise).getAll('documents')
}

export async function getHighlights() {
  return (await dbPromise).getAll('highlights')
}

export async function saveImport(document: SourceDocument, highlights: Highlight[]) {
  const db = await dbPromise
  const tx = db.transaction(['documents', 'highlights'], 'readwrite')
  await tx.objectStore('documents').put(document)
  await Promise.all(highlights.map((highlight) => tx.objectStore('highlights').put(highlight)))
  await tx.done
}

export async function saveHighlight(highlight: Highlight) {
  await (await dbPromise).put('highlights', highlight)
}

export async function saveHighlights(highlights: Highlight[]) {
  const db = await dbPromise
  const tx = db.transaction('highlights', 'readwrite')
  await Promise.all(highlights.map((highlight) => tx.store.put(highlight)))
  await tx.done
}

export async function deleteHighlight(id: string) {
  await (await dbPromise).delete('highlights', id)
}

export async function clearLibrary() {
  const db = await dbPromise
  const tx = db.transaction(['documents', 'highlights'], 'readwrite')
  await tx.objectStore('documents').clear()
  await tx.objectStore('highlights').clear()
  await tx.done
}

export async function getSetting<T>(key: string, fallback: T) {
  const row = await (await dbPromise).get('settings', key)
  return (row?.value as T | undefined) ?? fallback
}

export async function saveSetting<T>(key: string, value: T) {
  await (await dbPromise).put('settings', { key, value })
}
