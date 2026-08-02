import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { importEpub } from './epub'

const FIRST_PARAGRAPH =
  'Deep work is the ability to focus without distraction on a cognitively demanding task, and it is becoming increasingly rare while also increasingly valuable in our economy.'
const SECOND_PARAGRAPH =
  'To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction, a skill fewer and fewer people can execute well.'

function epubFile(name: string, buf: ArrayBuffer, type = 'application/epub+zip'): File {
  return new File([buf], name, { type })
}

async function buildEpub(bodyHtml: string, title = 'Deep Work Sample') {
  const zip = new JSZip()
  zip.file('mimetype', 'application/epub+zip')
  zip.file(
    'META-INF/container.xml',
    '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
  )
  zip.file(
    'OEBPS/content.opf',
    `<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="2.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${title}</dc:title></metadata><manifest><item id="ch1" href="ch1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="ch1"/></spine></package>`,
  )
  zip.file(
    'OEBPS/ch1.xhtml',
    `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><body>${bodyHtml}</body></html>`,
  )
  const buf = await zip.generateAsync({ type: 'arraybuffer' })
  return epubFile('sample.epub', buf)
}

describe('importEpub', () => {
  it('extracts every genuine paragraph as a separate highlight candidate, even when a running page-footer sits between them', async () => {
    // Regression test: Element.textContent concatenates adjacent block
    // elements with no separator, so "<p>A</p><p>B</p>" used to read back as
    // "A B" with no sentence break — and if a short "Page N" footer paragraph
    // landed between two real paragraphs, the whole merged run was discarded
    // by the metadata filter, silently dropping an entire chapter/page of
    // real highlights.
    const file = await buildEpub(
      `<p>${FIRST_PARAGRAPH}</p><p>Page 12</p><p>${SECOND_PARAGRAPH}</p>`,
    )

    const result = await importEpub(file)

    expect(result.document.title).toBe('Deep Work Sample')
    expect(result.highlights).toHaveLength(2)
    expect(result.highlights[0].text).toBe(FIRST_PARAGRAPH)
    expect(result.highlights[1].text).toBe(SECOND_PARAGRAPH)
    expect(result.highlights.some((h) => h.text.includes('Page 12'))).toBe(false)
  })

  it('still splits paragraphs correctly when a <br> separates lines instead of block tags', async () => {
    const file = await buildEpub(`<div>${FIRST_PARAGRAPH}<br/>${SECOND_PARAGRAPH}</div>`)

    const result = await importEpub(file)

    expect(result.highlights).toHaveLength(2)
  })

  it('rejects a non-zip file with a clear error instead of crashing', async () => {
    const file = epubFile('broken.epub', new TextEncoder().encode('not a real zip file').buffer)
    await expect(importEpub(file)).rejects.toThrow()
  })

  it('rejects a zip file missing META-INF/container.xml with a descriptive error', async () => {
    const zip = new JSZip()
    zip.file('hello.txt', 'not an epub')
    const buf = await zip.generateAsync({ type: 'arraybuffer' })
    const file = epubFile('bad.epub', buf)

    await expect(importEpub(file)).rejects.toThrow(/container\.xml/i)
  })

  it('rejects an EPUB whose package document is missing', async () => {
    const zip = new JSZip()
    zip.file(
      'META-INF/container.xml',
      '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
    )
    const buf = await zip.generateAsync({ type: 'arraybuffer' })
    const file = epubFile('missing-opf.epub', buf)

    await expect(importEpub(file)).rejects.toThrow(/package document/i)
  })
})
