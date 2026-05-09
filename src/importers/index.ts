import type { ImportResult } from '../domain/types'
import { detectFileKind } from './detect'

export async function importFile(file: File): Promise<ImportResult> {
  const kind = await detectFileKind(file)

  if (kind === 'pdf') {
    return (await import('./pdf')).importPdf(file)
  }

  if (kind === 'epub') {
    return (await import('./epub')).importEpub(file)
  }

  if (kind === 'text') {
    return (await import('./text')).importText(file)
  }

  throw new Error('State backup files are restored through the backup importer.')
}
