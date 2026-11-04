import { useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { ExternalLink } from 'lucide-react'
import { Composer } from '@/components/Composer'
import { HowItWorks } from '@/components/HowItWorks'
import { Wordmark } from '@/components/Logo'
import { ProtocolStats } from '@/components/ProtocolStats'
import { RecentPayments } from '@/components/RecentPayments'
import { Transcript } from '@/components/Transcript'
import { WalletCard } from '@/components/WalletCard'
import { usePromptPay } from '@/hooks/usePromptPay'
import { PROMPTPAY_ADDRESS, CHAIN_ID } from '@/contracts/address'
import { Link } from '@/lib/router'
import { buildAddressExplorerUrl } from '@/onchain-facts'

const EXAMPLES = [
  'Why is USDC useful as a gas token?',
  'Explain how this pay-per-prompt app works.',
  'What makes Arc fees predictable?',
]

interface Health {
  ai: 'live' | 'demo'
  model: string
}

export default function Workspace() {
  const pp = usePromptPay()
  const [draft, setDraft] = useState('')
  const [health, setHealth] = useState<Health | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json() as Promise<Health>)
      .then(setHealth)
      .catch(() => setHealth(null))
  }, [])

  const busy = pp.turns.some((t) => t.status !== 'answered' && t.status !== 'error')

  if (!PROMPTPAY_ADDRESS) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md items-center px-4">
        <p className="glass-card rounded-3xl p-5 text-sm text-pretty">
          The PromptPay contract address is not configured. Set VITE_PROMPTPAY_ADDRESS in .env and restart the dev server.
        </p>
      </main>
    )
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'var(--border)' }}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/" aria-label="Back to home" style={{ color: 'var(--ink)' }}>
            <Wordmark />
          </Link>
          <ConnectKitButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-8">
        <div className="mb-6">
          <h1 className="display text-balance text-3xl font-bold">Workspace</h1>
          <p className="mt-1 text-sm text-pretty" style={{ color: 'var(--muted)' }}>
            Ask a question and pay for it in USDC. The answer appears once your payment confirms.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-4">
            <WalletCard
              isConnected={pp.isConnected}
              balance={pp.balance}
              loading={pp.balanceLoading}
              price={pp.price}
              allowance={pp.allowance}
            />

            {pp.turns.length === 0 ? (
              <section className="glass-card rounded-3xl p-5">
                <h2 className="display text-lg font-semibold text-balance">Start with an example</h2>
                <p className="mt-1 max-w-[60ch] text-sm text-pretty" style={{ color: 'var(--muted)' }}>
                  Pick a prompt or write your own. Each one is a single small USDC payment.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setDraft(ex)}
                      className="min-h-11 rounded-full px-3.5 text-xs font-medium"
                      style={{ background: 'var(--surface-muted)', color: 'var(--ink-2)', border: '1px solid var(--border)' }}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <Transcript turns={pp.turns} price={pp.price} onRetry={pp.retry} />
            )}

            <Composer
              isConnected={pp.isConnected}
              wrongChain={pp.wrongChain}
              busy={busy}
              price={pp.price}
              balance={pp.balance}
              draft={draft}
              onDraft={setDraft}
              onSwitch={pp.switchToArc}
              onSubmit={pp.ask}
            />
          </div>

          <aside className="space-y-4">
            <HowItWorks />
            <ProtocolStats price={pp.price} />
            <RecentPayments />
          </aside>
        </div>

        <footer
          className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px]"
          style={{ color: 'var(--subtle)' }}
        >
          <a
            href={buildAddressExplorerUrl(CHAIN_ID, PROMPTPAY_ADDRESS)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1"
          >
            PromptPay contract <ExternalLink className="size-3" />
          </a>
          <span>{health ? (health.ai === 'live' ? `Model: ${health.model}` : 'Demo model (no AI key set)') : 'API offline'}</span>
        </footer>
      </main>
    </div>
  )
}
