import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'
import { CHAIN_ID, PROMPTPAY_ADDRESS, USDC_ADDRESS } from '@/contracts/address'
import { useRecentPayments, LOOKBACK_BLOCKS } from '@/hooks/useRecentPayments'
import { formatUnitsFixed, formatUsdc, usdcDecimalsFor } from '@/onchain-money'

interface Props {
  price: bigint | undefined
}

export function ProtocolStats({ price }: Props) {
  const collected = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: PROMPTPAY_ADDRESS ? [PROMPTPAY_ADDRESS] : undefined,
    chainId: CHAIN_ID,
    query: { enabled: Boolean(PROMPTPAY_ADDRESS), refetchInterval: 15_000 },
  })
  const recent = useRecentPayments()

  const stats = [
    {
      label: 'USDC collected',
      value: collected.data === undefined ? '...' : formatUnitsFixed(collected.data, usdcDecimalsFor(CHAIN_ID), 2),
    },
    { label: 'Price per prompt', value: price === undefined ? '...' : `${formatUsdc(price)}` },
    {
      label: `Prompts paid (last ${LOOKBACK_BLOCKS.toLocaleString('en-US')} blocks)`,
      value: recent.data ? recent.data.entries.length.toString() : recent.isError ? 'n/a' : '...',
    },
  ]

  return (
    <section className="glass-card rounded-3xl p-5">
      <h2 className="display text-lg font-semibold text-balance">Live contract stats</h2>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="glass-inner rounded-2xl px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase leading-tight tracking-[0.08em]" style={{ color: 'var(--subtle)' }}>
              {s.label}
            </dt>
            <dd className="display mt-1 text-lg font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[11px] text-pretty" style={{ color: 'var(--subtle)' }}>
        All figures in USDC, read directly from Arc Testnet.
      </p>
    </section>
  )
}
