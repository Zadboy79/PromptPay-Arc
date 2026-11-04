import { isAddressEqual, parseEventLogs, type Hex } from 'viem'
import { promptPayAbi } from '../src/contracts/promptPay'
import { client, CONTRACT } from './config'

export class PaymentError extends Error {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchReceipt(txHash: Hex) {
  // The RPC can lag a moment behind the wallet, so allow a short wait.
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      return await client.getTransactionReceipt({ hash: txHash })
    } catch {
      await sleep(1500)
    }
  }
  throw new PaymentError('Payment transaction not found yet. Try again in a few seconds.')
}

/** Confirms the transaction emitted PromptPaid for exactly this prompt ID. Returns the payer. */
export async function verifyPayment(txHash: Hex, promptId: Hex): Promise<{ payer: string; amount: bigint }> {
  const receipt = await fetchReceipt(txHash)
  if (receipt.status !== 'success') throw new PaymentError('Payment transaction failed onchain.')

  const events = parseEventLogs({ abi: promptPayAbi, eventName: 'PromptPaid', logs: receipt.logs })
  const match = events.find(
    (e) => isAddressEqual(e.address, CONTRACT) && e.args.promptId.toLowerCase() === promptId.toLowerCase(),
  )
  if (!match) throw new PaymentError('No payment for this prompt was found in that transaction.')
  return { payer: match.args.payer, amount: match.args.amount }
}
