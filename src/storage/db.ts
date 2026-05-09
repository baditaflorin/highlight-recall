import { openDB, type DBSchema } from 'idb'
import type { Activity, Highlight, SourceDocument } from '../domain/types'

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
  activity: {
    key: string
    value: Activity
    indexes: {
      'by-created-at': string
    }
  }
}

const dbPromise = openDB<HighlightRecallDB>('highlight-recall', 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const documents = db.createObjectStore('documents', { keyPath: 'id' })
      documents.createIndex('by-imported-at', 'importedAt')

      const highlights = db.createObjectStore('highlights', { keyPath: 'id' })
      highlights.createIndex('by-document', 'documentId')
      highlights.createIndex('by-due-at', 'review.dueAt')
    }

    if (oldVersion < 2) {
      const activity = db.createObjectStore('activity', { keyPath: 'id' })
      activity.createIndex('by-created-at', 'createdAt')
      const rawDb = db as unknown as {
        objectStoreNames: DOMStringList
        deleteObjectStore: (name: string) => void
      }
      if (rawDb.objectStoreNames.contains('settings')) {
        rawDb.deleteObjectStore('settings')
      }
    }
  },
})

export async function getDocuments() {
  return (await dbPromise).getAll('documents')
}

export async function getHighlights() {
  return (await dbPromise).getAll('highlights')
}

export async function getActivity() {
  return (await dbPromise).getAll('activity')
}

export async function saveImport(
  document: SourceDocument,
  highlights: Highlight[],
  activity?: Activity,
) {
  const db = await dbPromise
  const tx = db.transaction(['documents', 'highlights', 'activity'], 'readwrite')
  await tx.objectStore('documents').put(document)
  await Promise.all(highlights.map((highlight) => tx.objectStore('highlights').put(highlight)))
  if (activity) await tx.objectStore('activity').put(activity)
  await tx.done
}

export async function saveHighlight(highlight: Highlight, activity?: Activity) {
  const db = await dbPromise
  const tx = db.transaction(['highlights', 'activity'], 'readwrite')
  await tx.objectStore('highlights').put(highlight)
  if (activity) await tx.objectStore('activity').put(activity)
  await tx.done
}

export async function saveHighlights(highlights: Highlight[], activity?: Activity) {
  const db = await dbPromise
  const tx = db.transaction(['highlights', 'activity'], 'readwrite')
  await Promise.all(highlights.map((highlight) => tx.objectStore('highlights').put(highlight)))
  if (activity) await tx.objectStore('activity').put(activity)
  await tx.done
}

export async function deleteHighlight(id: string, activity?: Activity) {
  const db = await dbPromise
  const tx = db.transaction(['highlights', 'activity'], 'readwrite')
  await tx.objectStore('highlights').delete(id)
  if (activity) await tx.objectStore('activity').put(activity)
  await tx.done
}

export async function clearLibrary(activity?: Activity) {
  const db = await dbPromise
  const tx = db.transaction(['documents', 'highlights', 'activity'], 'readwrite')
  await tx.objectStore('documents').clear()
  await tx.objectStore('highlights').clear()
  await tx.objectStore('activity').clear()
  if (activity) await tx.objectStore('activity').put(activity)
  await tx.done
}

export async function replaceLibrary(input: {
  documents: SourceDocument[]
  highlights: Highlight[]
  activity: Activity[]
  restoreActivity: Activity
}) {
  const db = await dbPromise
  const tx = db.transaction(['documents', 'highlights', 'activity'], 'readwrite')
  await tx.objectStore('documents').clear()
  await tx.objectStore('highlights').clear()
  await tx.objectStore('activity').clear()
  await Promise.all(input.documents.map((document) => tx.objectStore('documents').put(document)))
  await Promise.all(
    input.highlights.map((highlight) => tx.objectStore('highlights').put(highlight)),
  )
  await Promise.all(input.activity.map((activity) => tx.objectStore('activity').put(activity)))
  await tx.objectStore('activity').put(input.restoreActivity)
  await tx.done
}
