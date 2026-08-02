import JSZip from 'jszip'
import { checksum } from '../domain/id'
import { buildImportResult } from '../domain/text'

type ManifestItem = {
  id: string
  href: string
  mediaType: string
}

function parseXml(xml: string) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const error = doc.querySelector('parsererror')
  if (error) throw new Error(error.textContent ?? 'Unable to parse EPUB XML')
  return doc
}

function dirname(path: string) {
  const index = path.lastIndexOf('/')
  return index === -1 ? '' : path.slice(0, index + 1)
}

function resolvePath(base: string, href: string) {
  if (!base) return href
  return new URL(href, `https://local.invalid/${base}`).pathname.slice(1)
}

// `Element.textContent` concatenates adjacent elements with no separator, so
// "<p>First.</p><p>Second.</p>" reads back as "First.Second." with the
// sentence boundary gone. That silently breaks two things downstream in
// splitIntoHighlightCandidates: the sentence-break regex requires whitespace
// after `.!?`, so merged paragraphs stop splitting into separate highlight
// candidates; and worse, if any block anywhere in the run (e.g. a running
// page-footer paragraph like "Page 12") gets glued onto real prose, the
// "Page \d+" metadata filter discards the *entire* merged blob, silently
// dropping a whole page or chapter's worth of genuine highlights. Insert an
// explicit break after each block-level/line-break tag before parsing so
// normalizeWhitespace has real whitespace to collapse at those boundaries.
const blockBoundaryTags =
  /<\/(p|div|li|h[1-6]|blockquote|section|article|tr|td|th)\s*>|<br\s*\/?\s*>/gi

function textFromHtml(html: string) {
  const withBreaks = html.replace(blockBoundaryTags, (match) => `${match}\n`)
  const doc = new DOMParser().parseFromString(withBreaks, 'text/html')
  doc.querySelectorAll('script, style, nav').forEach((node) => node.remove())
  // Deliberately skip the shared normalizeWhitespace() here: it collapses
  // newlines into a single space, which would erase the paragraph breaks
  // just inserted above before splitIntoHighlightCandidates gets a chance to
  // treat them as hard boundaries. Only trim the outer edges; intra-line
  // whitespace is normalized per-paragraph downstream.
  return (doc.body?.textContent ?? '').trim()
}

export async function importEpub(file: File) {
  const buffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(buffer)
  const containerXml = await zip.file('META-INF/container.xml')?.async('text')
  if (!containerXml) throw new Error('EPUB is missing META-INF/container.xml')

  const container = parseXml(containerXml)
  const opfPath = container.querySelector('rootfile')?.getAttribute('full-path')
  if (!opfPath) throw new Error('EPUB container does not point to a package document')

  const opfXml = await zip.file(opfPath)?.async('text')
  if (!opfXml) throw new Error('EPUB package document is missing')

  const opf = parseXml(opfXml)
  const basePath = dirname(opfPath)
  const title = opf.querySelector('metadata title')?.textContent ?? undefined
  const manifest = new Map<string, ManifestItem>()

  opf.querySelectorAll('manifest item').forEach((item) => {
    const id = item.getAttribute('id')
    const href = item.getAttribute('href')
    const mediaType = item.getAttribute('media-type') ?? ''
    if (id && href) manifest.set(id, { id, href, mediaType })
  })

  const spineIds = [...opf.querySelectorAll('spine itemref')]
    .map((item) => item.getAttribute('idref'))
    .filter((id): id is string => Boolean(id))

  const sections: Array<{ text: string; location: string }> = []

  for (const [index, id] of spineIds.entries()) {
    const item = manifest.get(id)
    if (!item || !/xhtml|html/i.test(item.mediaType)) continue

    const path = resolvePath(basePath, item.href)
    const html = await zip.file(path)?.async('text')
    if (!html) continue

    const text = textFromHtml(html)
    if (text) sections.push({ text, location: `Chapter ${index + 1}` })
  }

  return buildImportResult({
    title,
    fileName: file.name,
    kind: 'epub',
    checksum: await checksum(buffer),
    sections,
  })
}
