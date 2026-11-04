import { encodeAbiParameters, keccak256, type Hex } from 'viem'

/**
 * A prompt ID binds a payment to one exact prompt text plus a random salt.
 * The browser and the backend compute it the same way, so the backend can
 * check that a PromptPaid event really paid for the prompt it received.
 */
export function computePromptId(prompt: string, salt: Hex): Hex {
  return keccak256(
    encodeAbiParameters([{ type: 'string' }, { type: 'bytes32' }], [prompt, salt]),
  )
}

export function randomSalt(): Hex {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return `0x${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`
}
