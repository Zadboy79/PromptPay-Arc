import { ExternalLink } from 'lucide-react'
import { useRecentPayments, LOOKBACK_BLOCKS } from '@/hooks/useRecentPayments'
import { buildTxExplorerUrl } from '@/onchain-facts'
import { formatUsdc } from '@/onchain-money'
import { CHAIN_ID } from '@/contracts/address'

const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`

export function RecentPayments() {
  const { data, isLoading, isError } = useRecentPayments()
  const entries = data?.entries.slice(0, 6) ?? []

  return (
    <section className="glass-card rounded-3xl p-5">
      <h2 className="display text-lg font-semibold text-balance">Recent payments</h2>
      <p className="mt-0.5 text-[11px]" style={{ color: 'var(--subtle)' }}>
        Last {LOOKBACK_BLOCKS.toLocaleString('en-US')} blocks on Arc Testnet
      </p>

      <ul className="mt-3 space-y-1.5">
        {isLoading && <li className="text-xs" style={{ color: 'var(--muted)' }}>Loading payments...</li>}
        {isError && <li className="text-xs" style={{ color: 'var(--danger)' }}>Could not load payments. Retrying shortly.</li>}
        {!isLoading && !isError && entries.length === 0 && (
          <li className="text-xs text-pretty" style={{ color: 'var(--muted)' }}>
            No payments in this window yet. Yours will show up here.
          </li>
        )}
        {entries.map((e) => (
          <li key={`${e.txHash}-${e.payer}`}>
            <a
              href={buildTxExplorerUrl(CHAIN_ID, e.txHash)}
              target="_blank"
              rel="noreferrer"
              className="glass-inner flex min-h-11 items-center justify-between rounded-xl px-3 text-xs"
            >
              <span className="mono">{short(e.payer)}</span>
              <span className="flex items-center gap-1.5 font-semibold tabular-nums">
                {formatUsdc(e.amount)} USDC <ExternalLink className="size-3" style={{ color: 'var(--subtle)' }} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
