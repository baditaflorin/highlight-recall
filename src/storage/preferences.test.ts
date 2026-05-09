import { afterEach, describe, expect, it } from 'vitest'
import { defaultPreferences } from '../domain/preferences'
import { clearPreferences, loadPreferences, savePreferences } from './preferences'

describe('preferences storage', () => {
  afterEach(() => {
    clearPreferences()
  })

  it('loads safe defaults before a user changes settings', () => {
    expect(loadPreferences()).toEqual(defaultPreferences)
  })

  it('persists user settings across reloads', () => {
    const preferences = { ...defaultPreferences, confirmBeforeClear: false }
    savePreferences(preferences)

    expect(loadPreferences()).toEqual(preferences)
  })

  it('falls back to defaults for incompatible stored settings', () => {
    window.localStorage.setItem('highlight-recall:preferences', '{"schemaVersion":999}')

    expect(loadPreferences()).toEqual(defaultPreferences)
  })
})
