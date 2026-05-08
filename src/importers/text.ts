import { buildImportResult } from '../domain/text'
import { checksum } from '../domain/id'

export async function importText(file: File) {
  const buffer = await file.arrayBuffer()
  const text = await file.text()

  return buildImportResult({
    fileName: file.name,
    kind: 'text',
    checksum: await checksum(buffer),
    sections: [{ text, location: 'Plain text' }],
  })
}
