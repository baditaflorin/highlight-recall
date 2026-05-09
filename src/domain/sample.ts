import { buildImportResult } from './text'

export function createSampleImport() {
  return buildImportResult({
    title: 'Sample Reading Notes',
    fileName: 'sample-reading-notes.txt',
    kind: 'text',
    checksum: 'sample-v1',
    sections: [
      {
        location: 'Sample note',
        text: [
          'A good review system does not ask the reader to remember that a thought exists; it brings the thought back when the reader can use it.',
          'Search is useful when the wording is known, but spaced repetition is useful when the idea would otherwise disappear from attention.',
          'Local-first reading tools should make backup and restore obvious, because private data that cannot move is still fragile.',
        ].join(' '),
      },
    ],
  })
}
