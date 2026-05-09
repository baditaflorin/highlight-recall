export type UserMessage = {
  title: string
  body: string
  nextStep: string
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function importErrorMessage(error: unknown, fileName = 'this file'): UserMessage {
  const message = errorText(error)

  if (/unsupported/i.test(message)) {
    return {
      title: `Could not import ${fileName}`,
      body: 'Highlight Recall can read EPUB, PDF, TXT, Markdown, and its own JSON backup files.',
      nextStep: 'Choose a supported file or paste the highlight text directly.',
    }
  }

  if (/zip|epub|container|package|opf|crc|corrupt/i.test(message)) {
    return {
      title: `Could not read ${fileName} as an EPUB`,
      body: 'The book file looks incomplete or uses an EPUB structure this browser parser could not read.',
      nextStep: 'Try exporting the EPUB again, or paste the important passages as text.',
    }
  }

  if (/pdf|Invalid PDF|Missing PDF|password/i.test(message)) {
    return {
      title: `Could not read ${fileName} as a PDF`,
      body: 'The PDF may be encrypted, scanned as images, or structurally damaged.',
      nextStep: 'If it is scanned, run OCR first or paste copied text from the document.',
    }
  }

  if (/valid JSON|compatible Highlight Recall/i.test(message)) {
    return {
      title: `Could not restore ${fileName}`,
      body: message,
      nextStep: 'Choose a JSON backup exported by Highlight Recall v0.2.0 or newer.',
    }
  }

  return {
    title: `Could not import ${fileName}`,
    body: message || 'The browser could not read this input.',
    nextStep: 'Try another copy of the file, or paste the highlight text manually.',
  }
}

export function zeroHighlightMessage(fileName: string, kind: string): UserMessage {
  return {
    title: `No reviewable highlights found in ${fileName}`,
    body:
      kind === 'pdf'
        ? 'The PDF imported, but no selectable text was found. This usually means the document is scanned images or annotations were not embedded as text.'
        : 'The file imported, but the text did not contain passages long enough to become review cards.',
    nextStep:
      kind === 'pdf'
        ? 'Run OCR or paste copied passages into the manual highlight box.'
        : 'Paste the exact passages you want to review, one sentence or paragraph at a time.',
  }
}
