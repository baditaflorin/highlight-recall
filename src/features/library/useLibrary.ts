import { useCallback, useEffect, useMemo, useState } from 'react'
import { createActivity } from '../../domain/state'
import type { Activity, Highlight, SourceDocument } from '../../domain/types'
import {
  clearLibrary,
  deleteHighlight as deleteStoredHighlight,
  getActivity,
  getDocuments,
  getHighlights,
  replaceLibrary as replaceStoredLibrary,
  saveActivity,
  saveHighlight,
  saveHighlights,
  saveImport,
} from '../../storage/db'

async function readLibrary() {
  const [nextDocuments, nextHighlights, nextActivity] = await Promise.all([
    getDocuments(),
    getHighlights(),
    getActivity(),
  ])

  return {
    nextDocuments: nextDocuments.sort((a, b) => b.importedAt.localeCompare(a.importedAt)),
    nextHighlights: nextHighlights.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    nextActivity: nextActivity.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  }
}

export function useLibrary() {
  const [documents, setDocuments] = useState<SourceDocument[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { nextDocuments, nextHighlights, nextActivity } = await readLibrary()
    setDocuments(nextDocuments)
    setHighlights(nextHighlights)
    setActivity(nextActivity)
    setLoading(false)
  }, [])

  useEffect(() => {
    let mounted = true
    void readLibrary().then(({ nextDocuments, nextHighlights, nextActivity }) => {
      if (!mounted) return
      setDocuments(nextDocuments)
      setHighlights(nextHighlights)
      setActivity(nextActivity)
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  const importResult = useCallback(
    async (document: SourceDocument, importedHighlights: Highlight[]) => {
      await saveImport(
        document,
        importedHighlights,
        createActivity(
          'import',
          `Imported ${importedHighlights.length} highlights from ${document.fileName}`,
          document.title,
        ),
      )
      await refresh()
    },
    [refresh],
  )

  const updateHighlight = useCallback(
    async (highlight: Highlight, reviewMessage?: string) => {
      await saveHighlight(
        highlight,
        reviewMessage
          ? createActivity('review', reviewMessage, highlight.text.slice(0, 140))
          : undefined,
      )
      await refresh()
    },
    [refresh],
  )

  const updateHighlights = useCallback(
    async (nextHighlights: Highlight[]) => {
      await saveHighlights(
        nextHighlights,
        createActivity(
          'import',
          `Updated ${nextHighlights.length} highlights`,
          'Semantic index or batch update',
        ),
      )
      await refresh()
    },
    [refresh],
  )

  const removeHighlight = useCallback(
    async (id: string) => {
      const highlight = highlights.find((item) => item.id === id)
      await deleteStoredHighlight(
        id,
        createActivity('delete', 'Deleted one highlight', highlight?.text.slice(0, 140)),
      )
      await refresh()
    },
    [highlights, refresh],
  )

  const clear = useCallback(async () => {
    await clearLibrary(createActivity('clear', 'Cleared local library'))
    await refresh()
  }, [refresh])

  const logActivity = useCallback(
    async (type: Activity['type'], message: string, detail?: string) => {
      await saveActivity(createActivity(type, message, detail))
      await refresh()
    },
    [refresh],
  )

  const restore = useCallback(
    async (input: {
      documents: SourceDocument[]
      highlights: Highlight[]
      activity: Activity[]
      detail: string
    }) => {
      await replaceStoredLibrary({
        documents: input.documents,
        highlights: input.highlights,
        activity: input.activity,
        restoreActivity: createActivity('restore', 'Restored library from backup', input.detail),
      })
      await refresh()
    },
    [refresh],
  )

  const byDocument = useMemo(() => {
    const map = new Map<string, SourceDocument>()
    documents.forEach((document) => map.set(document.id, document))
    return map
  }, [documents])

  return {
    documents,
    highlights,
    activity,
    byDocument,
    loading,
    importResult,
    updateHighlight,
    updateHighlights,
    removeHighlight,
    clear,
    logActivity,
    restore,
    refresh,
  }
}
