import type { Highlight, SourceDocument } from './types'

export function exportLibrary(documents: SourceDocument[], highlights: Highlight[]) {
  return JSON.stringify(
    {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      documents,
      highlights,
    },
    null,
    2,
  )
}

export function downloadJson(fileName: string, contents: string) {
  const blob = new Blob([contents], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}
