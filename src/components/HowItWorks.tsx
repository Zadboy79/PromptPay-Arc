import { BrainCircuit, ShieldCheck, Wallet } from 'lucide-react'

const STEPS = [
  {
    icon: Wallet,
    title: 'Pay with USDC',
    body: 'Your wallet sends a small USDC payment to the PromptPay contract on Arc.',
  },
  {
    icon: ShieldCheck,
    title: 'Payment is verified',
    body: 'The server checks the onchain receipt for your exact prompt before doing any work.',
  },
  {
    icon: BrainCircuit,
    title: 'Get your answer',
    body: 'The AI replies right away. A paid prompt is answered once and never charged twice.',
  },
]

export function HowItWorks() {
  return (
    <section className="glass-card rounded-3xl p-5">
      <h2 className="display text-lg font-semibold text-balance">How it works</h2>
      <ol className="mt-4 space-y-4">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="flex gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--surface-muted)', color: 'var(--accent)' }}
            >
              <Icon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                <span className="mr-1.5 tabular-nums" style={{ color: 'var(--subtle)' }}>
                  {i + 1}.
                </span>
                {title}
              </div>
              <p className="mt-0.5 text-xs text-pretty" style={{ color: 'var(--muted)' }}>
                {body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
