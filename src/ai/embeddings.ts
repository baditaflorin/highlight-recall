import type { Highlight, SearchHit } from '../domain/types'

type FeatureExtractionPipeline = (
  text: string,
  options: { pooling: string; normalize: boolean },
) => Promise<{
  data: Float32Array | number[]
}>

let extractorPromise: Promise<FeatureExtractionPipeline> | undefined

async function getExtractor() {
  extractorPromise ??= import('@huggingface/transformers').then(async ({ pipeline, env }) => {
    env.allowLocalModels = false
    env.useBrowserCache = true
    return (await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    )) as FeatureExtractionPipeline
  })

  return extractorPromise
}

export async function embedText(text: string) {
  const extractor = await getExtractor()
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0
  let normA = 0
  let normB = 0

  for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
    dot += a[index] * b[index]
    normA += a[index] * a[index]
    normB += b[index] * b[index]
  }

  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function findSemanticMatches(
  highlights: Highlight[],
  query: string,
): Promise<SearchHit[]> {
  const queryEmbedding = await embedText(query)

  return highlights
    .filter((highlight) => highlight.embedding?.length)
    .map((highlight) => ({
      highlight,
      score: cosineSimilarity(queryEmbedding, highlight.embedding ?? []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
}

export async function enrichMissingEmbeddings(
  highlights: Highlight[],
  onProgress?: (done: number) => void,
) {
  const enriched: Highlight[] = []

  for (const [index, highlight] of highlights.entries()) {
    if (highlight.embedding?.length) {
      enriched.push(highlight)
    } else {
      enriched.push({
        ...highlight,
        embedding: await embedText(highlight.text),
        updatedAt: new Date().toISOString(),
      })
    }
    onProgress?.(index + 1)
  }

  return enriched
}
