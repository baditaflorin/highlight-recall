export function downloadJson(fileName: string, contents: string) {
  const blob = new Blob([contents], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function copyText(contents: string) {
  if (!navigator.clipboard?.writeText) {
    throw new Error(
      'Clipboard writing is not available in this browser. Use the download button instead.',
    )
  }

  await navigator.clipboard.writeText(contents)
}
