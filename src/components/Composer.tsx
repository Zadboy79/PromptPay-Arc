import { useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { Loader2, SendHorizonal } from 'lucide-react'
import { PROMPT_MAX_CHARS } from '@/contracts/promptPay'
import { formatUsdc } from '@/onchain-money'

interface Props {
  isConnected: boolean
  wrongChain: boolean
  busy: boolean
  price: bigint | undefined
  balance: bigint | undefined
  draft: string
  onDraft: (value: string) => void
  onSwitch: () => Promise<void>
  onSubmit: (prompt: string) => Promise<boolean>
}

const ctaClass =
  'flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100'

export function Composer({ isConnected, wrongChain, busy, price, balance, draft, onDraft, onSwitch, onSubmit }: Props) {
  const [switching, setSwitching] = useState(false)
  const prompt = draft.trim()
  const insufficient = price !== undefined && balance !== undefined && balance < price
  const priceLabel = price === undefined ? '...' : `${formatUsdc(price)} USDC`

  async function submit() {
    if (!prompt || busy) return
    const sent = await onSubmit(prompt)
    if (sent) onDraft('')
  }

  return (
    <section className="glass-card rounded-3xl p-3">
      <div className="glass-inner rounded-2xl p-3">
        <textarea
          value={draft}
          onChange={(e) => onDraft(e.target.value.slice(0, PROMPT_MAX_CHARS))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void submit()
          }}
          rows={3}
          placeholder="Ask anything. Each prompt costs one small USDC payment."
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-400"
          style={{ color: 'var(--ink)' }}
          disabled={busy}
          aria-label="Your prompt"
        />
        <div className="mt-1 text-right text-[11px] tabular-nums" style={{ color: 'var(--subtle)' }}>
          {draft.length}/{PROMPT_MAX_CHARS}
        </div>
      </div>

      <div className="mt-3">
        {!isConnected ? (
          <ConnectKitButton.Custom>
            {({ show }) => (
              <button onClick={show} className={ctaClass} style={{ background: 'var(--accent)' }}>
                Connect wallet
              </button>
            )}
          </ConnectKitButton.Custom>
        ) : wrongChain ? (
          <button
            disabled={switching}
            onClick={() => {
              setSwitching(true)
              onSwitch()
                .catch(() => undefined)
                .then(() => setSwitching(false))
                .catch(() => undefined)
            }}
            className={ctaClass}
            style={{ background: 'var(--accent)' }}
          >
            Switch to Arc Testnet
          </button>
        ) : (
          <button
            disabled={!prompt || busy || price === undefined || insufficient}
            onClick={() => void submit()}
            className={ctaClass}
            style={{ background: 'var(--accent)' }}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Working on your prompt
              </>
            ) : (
              <>
                <SendHorizonal className="size-4" /> Pay {priceLabel} and ask
              </>
            )}
          </button>
        )}
        {isConnected && !wrongChain && insufficient && (
          <p className="mt-2 text-center text-xs text-pretty" style={{ color: 'var(--danger)' }}>
            Not enough USDC. Use Get test USDC in the sidebar to top up.
          </p>
        )}
      </div>
    </section>
  )
}
