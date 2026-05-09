import { buildImportResult } from '../domain/text'
import { checksum } from '../domain/id'

export function importTextContent(input: { text: string; fileName: string; title?: string }) {
  return buildImportResult({
    title: input.title,
    fileName: input.fileName,
    kind: 'text',
    checksum: `text-${input.text.length}`,
    sections: [{ text: input.text, location: 'Pasted text' }],
  })
}

export async function importText(file: File) {
  const buffer = await file.arrayBuffer()
  const text = decodeText(buffer)

  return buildImportResult({
    fileName: file.name,
    kind: 'text',
    checksum: await checksum(buffer),
    sections: [{ text, location: 'Plain text' }],
  })
}

export function decodeText(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  const withoutBom =
    bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? bytes.slice(3) : bytes

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(withoutBom).replace(/\u00a0/g, ' ')
  } catch {
    return new TextDecoder('windows-1252').decode(withoutBom).replace(/\u00a0/g, ' ')
  }
}
