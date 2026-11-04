import { AI_API_KEY, AI_BASE_URL, AI_MODEL } from './config'

export interface AiReply {
  answer: string
  model: string
}

export const aiMode = AI_API_KEY ? 'live' : 'demo'

const SYSTEM_PROMPT =
  'You are a concise, helpful assistant inside a pay-per-prompt app on Arc, Circle\'s USDC-native blockchain. ' +
  'Answer clearly in under 250 words. Use plain text.'

async function askModel(prompt: string): Promise<AiReply> {
  const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${AI_API_KEY}` },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 600,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(45_000),
  })
  if (!res.ok) throw new Error(`AI provider returned ${res.status}`)
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const answer = json.choices?.[0]?.message?.content?.trim()
  if (!answer) throw new Error('AI provider returned an empty answer')
  return { answer, model: AI_MODEL }
}

const TOPICS: { match: RegExp; reply: string }[] = [
  {
    match: /\b(gas|fee|fees)\b/i,
    reply:
      'On Arc, gas is paid in USDC, so fees are predictable and users never need a second token. The same USDC balance covers both your prompts and your gas.',
  },
  {
    match: /\b(arc)\b/i,
    reply:
      'Arc is Circle\'s EVM-compatible blockchain where USDC is the native gas token, with stable fees and sub-second finality.',
  },
  {
    match: /\b(usdc|stablecoin)\b/i,
    reply:
      'USDC is a dollar-backed stablecoin issued by Circle. On Arc it is both the gas asset and a standard 6-decimal ERC-20.',
  },
  {
    match: /\b(pay|payment|price|cost)\b/i,
    reply:
      'Each prompt is paid with a single onchain USDC transaction to the PromptPay contract. The backend only answers after it sees that payment confirmed.',
  },
]

/** Local fallback so the paid flow works end to end before a model key is added. */
function demoReply(prompt: string): AiReply {
  const topic = TOPICS.find((t) => t.match.test(prompt))
  const body = topic
    ? topic.reply
    : 'I received your paid prompt, but no language model is connected yet, so I can only answer a few questions about Arc, USDC, gas and payments.'
  return {
    answer: `${body}\n\n(Demo mode: set AI_API_KEY on the server to get real model answers.)`,
    model: 'demo',
  }
}

export async function generateAnswer(prompt: string): Promise<AiReply> {
  return AI_API_KEY ? askModel(prompt) : demoReply(prompt)
}
