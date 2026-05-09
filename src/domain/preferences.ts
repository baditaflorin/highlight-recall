import { z } from 'zod'

export const preferencesSchemaVersion = 1

export const preferencesSchema = z.object({
  schemaVersion: z.literal(preferencesSchemaVersion),
  confirmBeforeClear: z.boolean(),
})

export type Preferences = z.infer<typeof preferencesSchema>

export const defaultPreferences: Preferences = {
  schemaVersion: preferencesSchemaVersion,
  confirmBeforeClear: true,
}
