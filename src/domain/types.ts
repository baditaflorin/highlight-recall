import { z } from 'zod'

export const documentKindSchema = z.enum(['epub', 'pdf', 'text'])
export type DocumentKind = z.infer<typeof documentKindSchema>

export const reviewGradeSchema = z.enum(['again', 'hard', 'good', 'easy'])
export type ReviewGrade = z.infer<typeof reviewGradeSchema>

export const sourceDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  fileName: z.string(),
  kind: documentKindSchema,
  importedAt: z.string(),
  highlightCount: z.number().int().nonnegative(),
  checksum: z.string(),
})
export type SourceDocument = z.infer<typeof sourceDocumentSchema>

export const reviewStateSchema = z.object({
  dueAt: z.string(),
  intervalDays: z.number().nonnegative(),
  ease: z.number().positive(),
  repetitions: z.number().int().nonnegative(),
  lapses: z.number().int().nonnegative(),
  lastReviewedAt: z.string().optional(),
})
export type ReviewState = z.infer<typeof reviewStateSchema>

export const highlightSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  text: z.string(),
  note: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  review: reviewStateSchema,
  embedding: z.array(z.number()).optional(),
})
export type Highlight = z.infer<typeof highlightSchema>

export const activitySchema = z.object({
  id: z.string(),
  type: z.enum(['import', 'restore', 'export', 'review', 'delete', 'clear', 'copy', 'sample']),
  message: z.string(),
  createdAt: z.string(),
  detail: z.string().optional(),
})
export type Activity = z.infer<typeof activitySchema>

export type ImportResult = {
  document: SourceDocument
  highlights: Highlight[]
}

export type SearchHit = {
  highlight: Highlight
  score: number
}
