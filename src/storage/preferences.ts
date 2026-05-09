import { defaultPreferences, preferencesSchema, type Preferences } from '../domain/preferences'

const preferencesKey = 'highlight-recall:preferences'

export function loadPreferences(): Preferences {
  const raw = window.localStorage.getItem(preferencesKey)
  if (!raw) return defaultPreferences

  try {
    return preferencesSchema.parse(JSON.parse(raw))
  } catch {
    return defaultPreferences
  }
}

export function savePreferences(preferences: Preferences) {
  window.localStorage.setItem(preferencesKey, JSON.stringify(preferences))
}

export function clearPreferences() {
  window.localStorage.removeItem(preferencesKey)
}
