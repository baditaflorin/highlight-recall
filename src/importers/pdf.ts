import { buildImportResult } from '../domain/text'
import { checksum } from '../domain/id'

export async function importPdf(file: File) {
  const [{ getDocument, GlobalWorkerOptions }, workerUrl] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.mjs?url'),
  ])

  GlobalWorkerOptions.workerSrc = workerUrl.default

  const buffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise
  const sections: Array<{ text: string; location: string }> = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim()

    if (text) {
      sections.push({ text, location: `Page ${pageNumber}` })
    }
  }

  return buildImportResult({
    fileName: file.name,
    kind: 'pdf',
    checksum: await checksum(buffer),
    sections,
  })
}
