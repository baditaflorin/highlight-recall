import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Highlight, SourceDocument } from '../../domain/types'
import {
  clearLibrary,
  deleteHighlight as deleteStoredHighlight,
  getDocuments,
  getHighlights,
  saveHighlight,
  saveHighlights,
  saveImport,
} from '../../storage/db'

async function readLibrary() {
  const [nextDocuments, nextHighlights] = await Promise.all([getDocuments(), getHighlights()])

  return {
    nextDocuments: nextDocuments.sort((a, b) => b.importedAt.localeCompare(a.importedAt)),
    nextHighlights: nextHighlights.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  }
}

export function useLibrary() {
  const [documents, setDocuments] = useState<SourceDocument[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { nextDocuments, nextHighlights } = await readLibrary()
    setDocuments(nextDocuments)
    setHighlights(nextHighlights)
    setLoading(false)
  }, [])

  useEffect(() => {
    let mounted = true
    void readLibrary().then(({ nextDocuments, nextHighlights }) => {
      if (!mounted) return
      setDocuments(nextDocuments)
      setHighlights(nextHighlights)
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  const importResult = useCallback(
    async (document: SourceDocument, importedHighlights: Highlight[]) => {
      await saveImport(document, importedHighlights)
      await refresh()
    },
    [refresh],
  )

  const updateHighlight = useCallback(
    async (highlight: Highlight) => {
      await saveHighlight(highlight)
      await refresh()
    },
    [refresh],
  )

  const updateHighlights = useCallback(
    async (nextHighlights: Highlight[]) => {
      await saveHighlights(nextHighlights)
      await refresh()
    },
    [refresh],
  )

  const removeHighlight = useCallback(
    async (id: string) => {
      await deleteStoredHighlight(id)
      await refresh()
    },
    [refresh],
  )

  const clear = useCallback(async () => {
    await clearLibrary()
    await refresh()
  }, [refresh])

  const byDocument = useMemo(() => {
    const map = new Map<string, SourceDocument>()
    documents.forEach((document) => map.set(document.id, document))
    return map
  }, [documents])

  return {
    documents,
    highlights,
    byDocument,
    loading,
    importResult,
    updateHighlight,
    updateHighlights,
    removeHighlight,
    clear,
    refresh,
  }
}
