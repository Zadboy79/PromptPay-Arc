import { useQuery } from '@tanstack/react-query'
import { getAbiItem, type Address, type Hex } from 'viem'
import { usePublicClient } from 'wagmi'
import { CHAIN_ID, PROMPTPAY_ADDRESS } from '@/contracts/address'
import { promptPayAbi } from '@/contracts/promptPay'

export const LOOKBACK_BLOCKS = 3000n

export interface PaymentEntry {
  payer: Address
  amount: bigint
  txHash: Hex
  blockNumber: bigint
}

const paidEvent = getAbiItem({ abi: promptPayAbi, name: 'PromptPaid' })

/** Reads recent PromptPaid events from a bounded window behind the chain head. */
export function useRecentPayments() {
  const client = usePublicClient({ chainId: CHAIN_ID })

  return useQuery({
    queryKey: ['recent-payments', PROMPTPAY_ADDRESS],
    enabled: Boolean(client && PROMPTPAY_ADDRESS),
    refetchInterval: 15_000,
    queryFn: async (): Promise<{ entries: PaymentEntry[]; head: bigint }> => {
      if (!client || !PROMPTPAY_ADDRESS) return { entries: [], head: 0n }
      const head = await client.getBlockNumber()
      const fromBlock = head > LOOKBACK_BLOCKS ? head - LOOKBACK_BLOCKS : head
      const logs = await client.getLogs({ address: PROMPTPAY_ADDRESS, event: paidEvent, fromBlock, toBlock: head })
      const entries = logs
        .map((l) => ({
          payer: l.args.payer as Address,
          amount: l.args.amount as bigint,
          txHash: l.transactionHash,
          blockNumber: l.blockNumber,
        }))
        .reverse()
      return { entries, head }
    },
  })
}
