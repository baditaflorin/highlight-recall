import { describe, expect, it } from 'vitest'
import { detectFileKind } from './detect'

describe('detectFileKind', () => {
  it('sniffs extensionless PDF files by magic bytes', async () => {
    const file = new File(['%PDF-1.7\n'], 'download', { type: '' })
    await expect(detectFileKind(file)).resolves.toBe('pdf')
  })

  it('sniffs extensionless text files by printable bytes', async () => {
    const file = new File(['A reading highlight copied from somewhere.'], 'notes', { type: '' })
    await expect(detectFileKind(file)).resolves.toBe('text')
  })

  it('detects Highlight Recall JSON backups', async () => {
    const file = new File(['{"schemaVersion":2}'], 'backup', { type: '' })
    await expect(detectFileKind(file)).resolves.toBe('state')
  })
})
