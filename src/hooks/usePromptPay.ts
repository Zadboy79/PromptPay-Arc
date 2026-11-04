import { useCallback, useState } from 'react'
import { erc20Abi, type Hex } from 'viem'
import { useAccount, usePublicClient, useReadContract, useSwitchChain, useWriteContract } from 'wagmi'
import { promptPayAbi } from '@/contracts/promptPay'
import { APPROVAL_PROMPTS, CHAIN_ID, PROMPTPAY_ADDRESS, USDC_ADDRESS } from '@/contracts/address'
import { computePromptId, randomSalt } from '@/lib/promptId'
import { isUserRejection, parseOnchainError } from '@/lib/errors'

export type TurnStatus = 'approving' | 'paying' | 'confirming' | 'answering' | 'answered' | 'error'

export interface Turn {
  id: string
  prompt: string
  salt: Hex
  status: TurnStatus
  txHash?: Hex
  answer?: string
  model?: string
  error?: string
}

interface AskResponse {
  answer?: string
  model?: string
  error?: string
}

export function usePromptPay() {
  const { address, chainId, isConnected } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient({ chainId: CHAIN_ID })
  const [turns, setTurns] = useState<Turn[]>([])

  const enabled = Boolean(address && PROMPTPAY_ADDRESS)

  const price = useReadContract({
    address: PROMPTPAY_ADDRESS,
    abi: promptPayAbi,
    functionName: 'pricePerPrompt',
    chainId: CHAIN_ID,
    query: { enabled: Boolean(PROMPTPAY_ADDRESS), refetchInterval: 30_000 },
  })
  const balance = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: CHAIN_ID,
    query: { enabled, refetchInterval: 10_000 },
  })
  const allowance = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && PROMPTPAY_ADDRESS ? [address, PROMPTPAY_ADDRESS] : undefined,
    chainId: CHAIN_ID,
    query: { enabled, refetchInterval: 10_000 },
  })

  const patch = useCallback((id: string, next: Partial<Turn>) => {
    setTurns((all) => all.map((t) => (t.id === id ? { ...t, ...next } : t)))
  }, [])

  const requestAnswer = useCallback(
    async (turn: Pick<Turn, 'id' | 'prompt' | 'salt' | 'txHash'>) => {
      patch(turn.id, { status: 'answering', error: undefined })
      try {
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ prompt: turn.prompt, salt: turn.salt, txHash: turn.txHash }),
        })
        const json = (await res.json()) as AskResponse
        if (!res.ok || !json.answer) throw new Error(json.error ?? 'No answer returned.')
        patch(turn.id, { status: 'answered', answer: json.answer, model: json.model })
      } catch (err) {
        patch(turn.id, {
          status: 'error',
          error: err instanceof Error ? err.message : 'No answer returned.',
        })
      }
    },
    [patch],
  )

  const ask = useCallback(
    async (prompt: string): Promise<boolean> => {
      if (!address || !PROMPTPAY_ADDRESS || !publicClient || price.data === undefined) return false
      const priceRaw = price.data
      const salt = randomSalt()
      const promptId = computePromptId(prompt, salt)
      const id = promptId
      const needsApproval = (allowance.data ?? 0n) < priceRaw

      setTurns((all) => [...all, { id, prompt, salt, status: needsApproval ? 'approving' : 'paying' }])

      try {
        if (chainId !== CHAIN_ID) await switchChainAsync({ chainId: CHAIN_ID })

        if (needsApproval) {
          const approveHash = await writeContractAsync({
            address: USDC_ADDRESS,
            abi: erc20Abi,
            functionName: 'approve',
            args: [PROMPTPAY_ADDRESS, priceRaw * APPROVAL_PROMPTS],
            chainId: CHAIN_ID,
          })
          const approval = await publicClient.waitForTransactionReceipt({ hash: approveHash })
          if (approval.status !== 'success') throw new Error('reverted')
          await allowance.refetch()
          patch(id, { status: 'paying' })
        }

        const txHash = await writeContractAsync({
          address: PROMPTPAY_ADDRESS,
          abi: promptPayAbi,
          functionName: 'pay',
          args: [promptId, priceRaw],
          chainId: CHAIN_ID,
        })
        patch(id, { status: 'confirming', txHash })
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
        if (receipt.status !== 'success') throw new Error('reverted')
        void balance.refetch()
        void allowance.refetch()

        await requestAnswer({ id, prompt, salt, txHash })
        return true
      } catch (err) {
        if (isUserRejection(err)) {
          setTurns((all) => all.filter((t) => t.id !== id))
          return false
        }
        patch(id, { status: 'error', error: parseOnchainError(err) })
        return false
      }
    },
    [address, allowance, balance, chainId, patch, price.data, publicClient, requestAnswer, switchChainAsync, writeContractAsync],
  )

  const retry = useCallback(
    (id: string) => {
      const turn = turns.find((t) => t.id === id)
      if (turn?.txHash) void requestAnswer(turn)
    },
    [requestAnswer, turns],
  )

  return {
    isConnected,
    wrongChain: isConnected && chainId !== CHAIN_ID,
    switchToArc: async (): Promise<void> => {
      try {
        await switchChainAsync({ chainId: CHAIN_ID })
      } catch {
        // User rejected the switch; the button stays available.
      }
    },
    price: price.data,
    balance: balance.data,
    allowance: allowance.data,
    balanceLoading: balance.isLoading,
    turns,
    ask,
    retry,
  }
}
