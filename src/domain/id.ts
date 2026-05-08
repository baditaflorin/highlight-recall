export function createId(prefix: string) {
  const cryptoId = globalThis.crypto?.randomUUID?.()
  if (cryptoId) return `${prefix}_${cryptoId}`

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

export async function checksum(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}
