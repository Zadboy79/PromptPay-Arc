import { useEffect, useRef } from 'react'
import { ExternalLink, Loader2, RotateCw, Sparkles } from 'lucide-react'
import { buildTxExplorerUrl } from '@/onchain-facts'
import { formatUsdc } from '@/onchain-money'
import { CHAIN_ID } from '@/contracts/address'
import type { Turn } from '@/hooks/usePromptPay'

interface Props {
  turns: Turn[]
  price: bigint | undefined
  onRetry: (id: string) => void
}

const STATUS_COPY: Record<string, string> = {
  approving: 'Approve USDC spending in your wallet. This one-time step covers several prompts.',
  paying: 'Confirm the USDC payment in your wallet.',
  confirming: 'Waiting for the payment to confirm onchain.',
  answering: 'Payment confirmed. Writing your answer.',
}

function TurnView({ turn, price, onRetry }: { turn: Turn; price: bigint | undefined; onRetry: (id: string) => void }) {
  const busy = turn.status in STATUS_COPY
  const txUrl = turn.txHash ? buildTxExplorerUrl(CHAIN_ID, turn.txHash) : undefined

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <p
          className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-white text-pretty"
          style={{ background: 'var(--accent)' }}
        >
          {turn.prompt}
        </p>
      </div>

      <div className="flex justify-start">
        <div className="glass-card max-w-[92%] rounded-2xl rounded-bl-md px-4 py-3">
          {busy && (
            <p className="flex items-start gap-2 text-sm" style={{ color: 'var(--ink-2)' }}>
              <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />
              <span className="text-pretty">{STATUS_COPY[turn.status]}</span>
            </p>
          )}

          {turn.status === 'answered' && (
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-pretty" style={{ color: 'var(--ink)' }}>
              {turn.answer}
            </p>
          )}

          {turn.status === 'error' && (
            <div className="space-y-2">
              <p className="text-sm text-pretty" style={{ color: 'var(--danger)' }}>
                {turn.error}
              </p>
              {turn.txHash && (
                <button
                  onClick={() => onRetry(turn.id)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold"
                  style={{ background: 'var(--surface-muted)', color: 'var(--ink)' }}
                >
                  <RotateCw className="size-3.5" /> Retry answer (no new payment)
                </button>
              )}
            </div>
          )}

          {(txUrl || turn.model) && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: 'var(--subtle)' }}>
              {txUrl && (
                <a
                  href={txUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium"
                  style={{ color: 'var(--accent-hover)' }}
                >
                  {turn.status === 'answered' && price !== undefined ? `Paid ${formatUsdc(price)} USDC` : 'View payment'}
                  <ExternalLink className="size-3" />
                </a>
              )}
              {turn.model && turn.status === 'answered' && (
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="size-3" /> {turn.model === 'demo' ? 'Demo model' : turn.model}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Transcript({ turns, price, onRetry }: Props) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns])

  return (
    <div className="space-y-5">
      {turns.map((t) => (
        <TurnView key={t.id} turn={t} price={price} onRetry={onRetry} />
      ))}
      <div ref={endRef} />
    </div>
  )
}
