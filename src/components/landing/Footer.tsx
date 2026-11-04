import { ArrowRight } from 'lucide-react'
import { Wordmark } from '@/components/Logo'
import { Link } from '@/lib/router'

export function FinalCta() {
  return (
    <section className="hero-bg px-4 py-24 text-center" style={{ color: '#f9faf3' }}>
      <div className="mx-auto max-w-3xl">
        <h2 className="display text-balance text-4xl font-bold sm:text-6xl">Ask something. Pay a few cents. Done.</h2>
        <p className="mx-auto mt-5 max-w-[48ch] text-pretty text-lg" style={{ color: '#cbd5e1' }}>
          Grab test USDC from the Arc Studio sidebar, connect your wallet and try it in under a minute.
        </p>
        <Link
          to="/app"
          className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full px-8 text-sm font-semibold transition-transform hover:scale-[1.03]"
          style={{ background: '#acc6e9', color: '#0d1b2f' }}
        >
          Launch app <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{ background: '#0a1627', color: '#94a3b8' }}>
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-xs sm:flex-row sm:items-center">
        <div style={{ color: '#f9faf3' }}>
          <Wordmark />
        </div>
        <p className="max-w-[60ch] text-pretty">
          PromptPay runs on Arc Testnet with test USDC. Nothing here moves real funds.
        </p>
      </div>
    </footer>
  )
}
