import type { ImportResult } from '../domain/types'

export async function importFile(file: File): Promise<ImportResult> {
  const lower = file.name.toLowerCase()

  if (lower.endsWith('.pdf') || file.type === 'application/pdf') {
    return (await import('./pdf')).importPdf(file)
  }

  if (lower.endsWith('.epub') || file.type === 'application/epub+zip') {
    return (await import('./epub')).importEpub(file)
  }

  if (lower.endsWith('.txt') || lower.endsWith('.md') || file.type.startsWith('text/')) {
    return (await import('./text')).importText(file)
  }

  throw new Error('Unsupported file. Import EPUB, PDF, TXT, or Markdown.')
}
