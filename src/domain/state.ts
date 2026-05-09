import { z } from 'zod'
import { nowIso } from './date'
import { createId } from './id'
import {
  activitySchema,
  highlightSchema,
  sourceDocumentSchema,
  type Activity,
  type Highlight,
  type SourceDocument,
} from './types'

export const stateSchemaVersion = 2

export const libraryStateSchema = z.object({
  schemaVersion: z.literal(stateSchemaVersion),
  app: z.object({
    name: z.literal('highlight-recall'),
    version: z.string(),
    commit: z.string(),
  }),
  exportedAt: z.string(),
  documents: z.array(sourceDocumentSchema),
  highlights: z.array(highlightSchema),
  activity: z.array(activitySchema).default([]),
})

export type LibraryState = z.infer<typeof libraryStateSchema>

export function createActivity(
  type: Activity['type'],
  message: string,
  detail?: string,
  createdAt = nowIso(),
): Activity {
  return {
    id: createId('act'),
    type,
    message,
    detail,
    createdAt,
  }
}

function sortDocuments(documents: SourceDocument[]) {
  return [...documents].sort((a, b) => a.id.localeCompare(b.id))
}

function sortHighlights(highlights: Highlight[]) {
  return [...highlights].sort((a, b) => a.id.localeCompare(b.id))
}

function sortActivity(activity: Activity[]) {
  return [...activity].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  )
}

export function buildLibraryState(input: {
  documents: SourceDocument[]
  highlights: Highlight[]
  activity: Activity[]
  version: string
  commit: string
  exportedAt?: string
}): LibraryState {
  return {
    schemaVersion: stateSchemaVersion,
    app: {
      name: 'highlight-recall',
      version: input.version,
      commit: input.commit,
    },
    exportedAt: input.exportedAt ?? nowIso(),
    documents: sortDocuments(input.documents),
    highlights: sortHighlights(input.highlights),
    activity: sortActivity(input.activity),
  }
}

export function serializeLibraryState(state: LibraryState) {
  return `${JSON.stringify(state, null, 2)}\n`
}

export function parseLibraryState(raw: string): LibraryState {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(
      'This backup is not valid JSON. Choose a Highlight Recall export file, or export again from the original browser.',
    )
  }

  const result = libraryStateSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error(
      'This JSON is not a compatible Highlight Recall state file. Export again from Highlight Recall v0.2.0 or newer.',
    )
  }

  return result.data
}

export function stateSummary(state: Pick<LibraryState, 'documents' | 'highlights' | 'activity'>) {
  return `${state.documents.length} documents, ${state.highlights.length} highlights, ${state.activity.length} activity entries`
}
