import type { DocumentKind } from '../domain/types'

export type DetectedKind = DocumentKind | 'state'

function extensionKind(fileName: string): DetectedKind | undefined {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.pdf')) return 'pdf'
  if (lower.endsWith('.epub')) return 'epub'
  if (lower.endsWith('.json')) return 'state'
  if (lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.markdown')) return 'text'
}

function mimeKind(type: string): DetectedKind | undefined {
  if (type === 'application/pdf') return 'pdf'
  if (type === 'application/epub+zip') return 'epub'
  if (type === 'application/json') return 'state'
  if (type.startsWith('text/')) return 'text'
}

export async function detectFileKind(file: File): Promise<DetectedKind> {
  const byExtension = extensionKind(file.name)
  const byMime = mimeKind(file.type)
  if (byExtension) return byExtension
  if (byMime) return byMime

  const sample = new Uint8Array(await file.slice(0, 64).arrayBuffer())
  const header = new TextDecoder('latin1').decode(sample)
  const trimmed = header.trimStart()

  if (header.startsWith('%PDF-')) return 'pdf'
  if (sample[0] === 0x50 && sample[1] === 0x4b) return 'epub'
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'state'
  if (
    sample.length === 0 ||
    sample.every((byte) => byte === 9 || byte === 10 || byte === 13 || byte >= 32)
  ) {
    return 'text'
  }

  throw new Error(
    'Unsupported file. Import EPUB, PDF, TXT, Markdown, or a Highlight Recall JSON backup.',
  )
}
