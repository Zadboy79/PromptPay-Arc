import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export interface StoredAnswer {
  txHash: string
  payer: string
  answer: string
  model: string
  answeredAt: number
}

const DIR = fileURLToPath(new URL('./data/', import.meta.url))
const FILE = `${DIR}answers.json`

let cache: Record<string, StoredAnswer> | undefined
let writeChain: Promise<void> = Promise.resolve()

async function load(): Promise<Record<string, StoredAnswer>> {
  if (cache) return cache
  try {
    cache = JSON.parse(await readFile(FILE, 'utf8')) as Record<string, StoredAnswer>
  } catch {
    cache = {}
  }
  return cache
}

export async function getAnswer(promptId: string): Promise<StoredAnswer | undefined> {
  return (await load())[promptId]
}

export async function saveAnswer(promptId: string, value: StoredAnswer): Promise<void> {
  const all = await load()
  all[promptId] = value
  const snapshot = JSON.stringify(all)
  writeChain = writeChain.then(async () => {
    await mkdir(DIR, { recursive: true })
    await writeFile(FILE, snapshot)
  })
  await writeChain
}
