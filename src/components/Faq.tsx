import { ChevronDown } from 'lucide-react'

const ITEMS = [
  {
    q: 'Why do I approve USDC first?',
    a: 'The contract can only pull USDC you have allowed. One approval covers 20 prompts, so you are not asked again on every question.',
  },
  {
    q: 'What if the answer fails after I paid?',
    a: 'Your payment is already recorded onchain. Press Retry answer and the server answers that same prompt without a second charge.',
  },
  {
    q: 'Do I need a second token for gas?',
    a: 'No. On Arc, gas is paid in USDC, so one balance covers both prompts and network fees.',
  },
  {
    q: 'Is this real money?',
    a: 'No. This runs on Arc Testnet with test USDC. Use Get test USDC in the sidebar to top up.',
  },
]

export function Faq() {
  return (
    <section className="glass-card rounded-3xl p-5">
      <h2 className="display text-lg font-semibold text-balance">Frequently asked questions</h2>
      <div className="mt-3 divide-y" style={{ borderColor: 'var(--border)' }}>
        {ITEMS.map((item) => (
          <details key={item.q} className="group py-1">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
              {item.q}
              <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" style={{ color: 'var(--subtle)' }} />
            </summary>
            <p className="pb-3 text-sm text-pretty" style={{ color: 'var(--muted)' }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
