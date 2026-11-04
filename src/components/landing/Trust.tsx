import { ExternalLink, FileCheck2, Fingerprint, Repeat2 } from 'lucide-react'
import { CHAIN_ID, PROMPTPAY_ADDRESS } from '@/contracts/address'
import { buildAddressExplorerUrl } from '@/onchain-facts'

export function Trust() {
  const contractUrl = PROMPTPAY_ADDRESS ? buildAddressExplorerUrl(CHAIN_ID, PROMPTPAY_ADDRESS) : undefined
  const cards = [
    {
      icon: FileCheck2,
      title: 'Receipts you can check',
      body: 'Every payment is an onchain event tied to your wallet and your exact prompt. Anyone can look it up on the explorer.',
    },
    {
      icon: Repeat2,
      title: 'Answered once, never charged twice',
      body: 'A paid prompt has a unique ID. Repeating the request returns the same answer instead of taking a second payment.',
    },
    {
      icon: Fingerprint,
      title: 'Payment bound to you',
      body: 'Prompt IDs are scoped to the paying wallet, so nobody can use up or front-run your payment.',
    },
  ]

  return (
    <section id="trust" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24">
      <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--subtle)' }}>
        Trust
      </p>
      <h2 className="display mt-2 max-w-2xl text-balance text-4xl font-bold sm:text-5xl">Built so the money is the proof.</h2>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, body }) => (
          <article key={title} className="glass-card rounded-3xl p-6">
            <Icon className="size-6" style={{ color: 'var(--accent-hover)' }} />
            <h3 className="display mt-4 text-lg font-semibold text-balance">{title}</h3>
            <p className="mt-2 text-sm text-pretty" style={{ color: 'var(--muted)' }}>
              {body}
            </p>
          </article>
        ))}
      </div>

      {contractUrl && (
        <a
          href={contractUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
          style={{ color: 'var(--accent-hover)' }}
        >
          Inspect the PromptPay contract <ExternalLink className="size-3.5" />
        </a>
      )}
    </section>
  )
}
