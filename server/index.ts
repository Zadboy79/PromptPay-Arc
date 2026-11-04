import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { isHex, type Hex } from 'viem'
import { PROMPT_MAX_CHARS } from '../src/contracts/promptPay'
import { computePromptId } from '../src/lib/promptId'
import { generateAnswer, aiMode } from './ai'
import { AI_MODEL, CHAIN_ID, CONTRACT } from './config'
import { serveStatic } from './static'
import { getAnswer, saveAnswer } from './store'
import { PaymentError, verifyPayment } from './verify'

const PORT = Number(process.env.PORT ?? 3001)
const MAX_BODY_BYTES = 16 * 1024
const inFlight = new Set<string>()

function send(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buf = chunk as Buffer
    size += buf.length
    if (size > MAX_BODY_BYTES) throw new Error('Request body too large')
    chunks.push(buf)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const isHash = (v: unknown): v is Hex => typeof v === 'string' && isHex(v) && v.length === 66

async function handleAsk(req: IncomingMessage, res: ServerResponse) {
  let body: Record<string, unknown>
  try {
    body = (await readJson(req)) as Record<string, unknown>
  } catch {
    return send(res, 400, { error: 'Invalid request body.' })
  }

  const { prompt, salt, txHash } = body
  if (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > PROMPT_MAX_CHARS) {
    return send(res, 400, { error: `Prompt must be 1 to ${PROMPT_MAX_CHARS} characters.` })
  }
  if (!isHash(salt) || !isHash(txHash)) {
    return send(res, 400, { error: 'Missing salt or transaction hash.' })
  }

  const promptId = computePromptId(prompt, salt)

  // A paid prompt is answered once; repeat calls return the stored answer.
  const existing = await getAnswer(promptId)
  if (existing) {
    return send(res, 200, { answer: existing.answer, model: existing.model, payer: existing.payer, cached: true })
  }
  if (inFlight.has(promptId)) return send(res, 409, { error: 'This prompt is already being answered.' })

  inFlight.add(promptId)
  try {
    const { payer } = await verifyPayment(txHash, promptId)
    const reply = await generateAnswer(prompt)
    await saveAnswer(promptId, { txHash, payer, ...reply, answeredAt: Date.now() })
    return send(res, 200, { ...reply, payer, cached: false })
  } catch (err) {
    if (err instanceof PaymentError) return send(res, 402, { error: err.message })
    console.error('ask failed:', err instanceof Error ? err.message : err)
    return send(res, 502, { error: 'The AI could not answer right now. Your payment is safe, so retry.' })
  } finally {
    inFlight.delete(promptId)
  }
}

createServer((req, res) => {
  const rawPath = (req.url ?? '').split('?')[0]
  // In production the app and the API share one origin, so accept the same /api prefix the dev proxy uses.
  const path = rawPath.replace(/^\/api(?=\/|$)/, '') || '/'
  if (req.method === 'GET' && path === '/health') {
    return send(res, 200, {
      ok: true,
      chainId: CHAIN_ID,
      contract: CONTRACT,
      ai: aiMode,
      model: aiMode === 'live' ? AI_MODEL : 'demo',
    })
  }
  if (req.method === 'POST' && path === '/ask') {
    handleAsk(req, res).catch(() => send(res, 500, { error: 'Unexpected server error.' }))
    return
  }
  if (req.method === 'GET' && !rawPath.startsWith('/api')) {
    serveStatic(rawPath, res)
      .then((served) => {
        if (!served) send(res, 404, { error: 'Not found.' })
      })
      .catch(() => send(res, 404, { error: 'Not found.' }))
    return
  }
  send(res, 404, { error: 'Not found.' })
}).listen(PORT, () => console.log(`PromptPay API listening on :${PORT} (ai: ${aiMode})`))
