import { Check } from 'lucide-react'
import { Link } from '@/lib/router'
import { formatUsdc } from '@/onchain-money'

const PERKS = [
  'No sign-up, no email, no card',
  'Pay only for the questions you ask',
  'Failed answers can be retried at no cost',
  'Gas is paid in the same USDC',
]

export function Pricing({ price }: { price: bigint | undefined }) {
  return (
    <section id="pricing" className="scroll-mt-24 px-4 pb-24">
      <div
        className="arc-dark mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:grid-cols-2"
        style={{ background: 'var(--bg-gradient)', color: 'var(--ink)' }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--subtle)' }}>
            Pricing
          </p>
          <h2 className="display mt-2 text-balance text-4xl font-bold sm:text-5xl">One price. No plans.</h2>
          <p className="mt-4 max-w-[48ch] text-pretty" style={{ color: 'var(--muted)' }}>
            The price is set in the contract and read live, so what you see here is exactly what your wallet will be asked to pay.
          </p>
        </div>

        <div className="rounded-3xl p-7" style={{ background: 'var(--surface-strong)', border: '1px solid var(--border)' }}>
          <div className="flex items-baseline gap-2">
            <span className="display text-6xl font-bold tabular-nums">{price === undefined ? '...' : formatUsdc(price)}</span>
            <span className="text-lg font-medium" style={{ color: 'var(--subtle)' }}>
              USDC / prompt
            </span>
          </div>
          <ul className="mt-6 space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--success)' }} />
                <span className="text-pretty">{p}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/app"
            className="mt-7 flex min-h-12 items-center justify-center rounded-2xl text-sm font-semibold transition-transform hover:scale-[1.01]"
            style={{ background: '#acc6e9', color: '#0d1b2f' }}
          >
            Ask your first question
          </Link>
        </div>
      </div>
    </section>
  )
}
