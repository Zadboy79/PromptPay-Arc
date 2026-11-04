import { Wordmark } from '@/components/Logo'
import { Link, scrollToId } from '@/lib/router'

const LINKS = [
  { id: 'how', label: 'How it works' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'trust', label: 'Trust' },
  { id: 'faq', label: 'FAQ' },
]

export function Nav() {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{ background: 'rgba(13,27,47,0.78)', borderColor: 'rgba(255,255,255,0.1)', color: '#f9faf3' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" aria-label="PromptPay home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="min-h-11 rounded-full px-3.5 text-sm font-medium opacity-75 transition-opacity hover:opacity-100"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <Link
          to="/app"
          className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition-transform hover:scale-[1.03] active:scale-[0.98]"
          style={{ background: '#acc6e9', color: '#0d1b2f' }}
        >
          Launch app
        </Link>
      </div>
    </header>
  )
}
