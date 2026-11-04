import { ArrowRight } from 'lucide-react'
import { Receipt } from '@/components/landing/Receipt'
import { Link, scrollToId } from '@/lib/router'

export function Hero({ price }: { price: bigint | undefined }) {
  return (
    <section className="hero-bg relative overflow-hidden" style={{ color: '#f9faf3' }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pb-32 lg:pt-24">
        <div>
          <p
            className="mono mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em]"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: '#cbd5e1' }}
          >
            <span className="size-1.5 rounded-full" style={{ background: '#8dd89f' }} />
            Live on Arc Testnet
          </p>

          <h1 className="display text-balance text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
            AI you pay for
            <br />
            <span className="hero-gradient-text">by the question.</span>
          </h1>

          <p className="mt-6 max-w-[52ch] text-pretty text-lg" style={{ color: '#cbd5e1' }}>
            PromptPay turns every prompt into a single USDC payment on Arc. No accounts, no cards, no monthly plan. Pay a few
            cents, get your answer, and keep the receipt onchain.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/app"
              className="inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: '#acc6e9', color: '#0d1b2f' }}
            >
              Launch app <ArrowRight className="size-4" />
            </Link>
            <button
              onClick={() => scrollToId('how')}
              className="inline-flex min-h-12 items-center rounded-full px-6 text-sm font-semibold"
              style={{ border: '1px solid rgba(255,255,255,0.25)', color: '#f9faf3' }}
            >
              See how it works
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Receipt price={price} />
        </div>
      </div>
    </section>
  )
}
