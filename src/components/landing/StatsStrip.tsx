import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'
import { CHAIN_ID, PROMPTPAY_ADDRESS, USDC_ADDRESS } from '@/contracts/address'
import { LOOKBACK_BLOCKS, useRecentPayments } from '@/hooks/useRecentPayments'
import { formatUnitsFixed, formatUsdc, usdcDecimalsFor } from '@/onchain-money'

export function StatsStrip({ price }: { price: bigint | undefined }) {
  const collected = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: PROMPTPAY_ADDRESS ? [PROMPTPAY_ADDRESS] : undefined,
    chainId: CHAIN_ID,
    query: { enabled: Boolean(PROMPTPAY_ADDRESS), refetchInterval: 20_000 },
  })
  const recent = useRecentPayments()

  const items = [
    { label: 'Price per prompt', value: price === undefined ? '...' : `${formatUsdc(price)} USDC` },
    {
      label: 'USDC collected',
      value: collected.data === undefined ? '...' : formatUnitsFixed(collected.data, usdcDecimalsFor(CHAIN_ID), 2),
    },
    {
      label: `Prompts paid, last ${LOOKBACK_BLOCKS.toLocaleString('en-US')} blocks`,
      value: recent.data ? recent.data.entries.length.toString() : recent.isError ? 'n/a' : '...',
    },
    { label: 'Gas token', value: 'USDC' },
  ]

  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-4">
      <dl className="glass-card grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-4" style={{ background: 'var(--border)' }}>
        {items.map((i) => (
          <div key={i.label} className="px-5 py-5" style={{ background: 'var(--surface-strong)' }}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--subtle)' }}>
              {i.label}
            </dt>
            <dd className="display mt-1.5 text-2xl font-bold tabular-nums">{i.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
