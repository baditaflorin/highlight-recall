export type RecallPromptInput = {
  highlight: string
  note?: string
}

export function buildRecallPrompt(input: RecallPromptInput) {
  return [
    'Turn this reading highlight into one concise active-recall question.',
    'Keep the answer grounded only in the highlight.',
    '',
    `Highlight: ${input.highlight}`,
    input.note ? `Reader note: ${input.note}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function generateRecallQuestion(input: RecallPromptInput) {
  const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
  const engine = await CreateMLCEngine('Llama-3.2-1B-Instruct-q4f16_1-MLC')
  const completion = await engine.chat.completions.create({
    messages: [{ role: 'user', content: buildRecallPrompt(input) }],
    temperature: 0.2,
  })

  return completion.choices[0]?.message.content?.trim() ?? ''
}
