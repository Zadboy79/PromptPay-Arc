import { BrainCircuit, ShieldCheck, Wallet } from 'lucide-react'

const STEPS = [
  {
    icon: Wallet,
    title: 'Pay with USDC',
    body: 'Connect a wallet and approve once. Each question is a single USDC payment to the PromptPay contract on Arc.',
  },
  {
    icon: ShieldCheck,
    title: 'We verify the receipt',
    body: 'The server reads the onchain receipt and checks it matches your exact prompt. No payment, no work.',
  },
  {
    icon: BrainCircuit,
    title: 'You get the answer',
    body: 'The AI replies as soon as the payment confirms. If anything fails, retry the answer without paying again.',
  },
]

export function Steps() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--subtle)' }}>
        How it works
      </p>
      <h2 className="display mt-2 max-w-2xl text-balance text-4xl font-bold sm:text-5xl">Three steps. One transaction.</h2>

      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="glass-card relative overflow-hidden rounded-3xl p-6">
            <span
              className="display absolute -right-2 -top-6 select-none text-[120px] font-bold leading-none"
              style={{ color: 'rgba(18,45,69,0.05)' }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="flex size-11 items-center justify-center rounded-2xl" style={{ background: 'var(--accent)', color: '#fff' }}>
              <Icon className="size-5" />
            </div>
            <h3 className="display mt-5 text-xl font-semibold">{title}</h3>
            <p className="mt-2 max-w-[40ch] text-sm text-pretty" style={{ color: 'var(--muted)' }}>
              {body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
