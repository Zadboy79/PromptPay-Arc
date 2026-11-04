import { TokenUSDC } from '@web3icons/react'
import { formatUnitsFixed, formatUsdc, usdcDecimalsFor } from '@/onchain-money'
import { CHAIN_ID } from '@/contracts/address'

interface Props {
  isConnected: boolean
  balance: bigint | undefined
  loading: boolean
  price: bigint | undefined
  allowance: bigint | undefined
}

export function WalletCard({ isConnected, balance, loading, price, allowance }: Props) {
  const decimals = usdcDecimalsFor(CHAIN_ID)
  const promptsLeft = price && price > 0n && allowance !== undefined ? allowance / price : undefined

  return (
    <section className="glass-card overflow-hidden rounded-3xl">
      <div className="spectral-strip h-1" />
      <div className="p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <TokenUSDC variant="branded" size={16} />
          <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
            Your USDC balance
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="display text-4xl font-bold tabular-nums" style={{ color: 'var(--ink)' }}>
            {!isConnected ? '--' : loading || balance === undefined ? '...' : formatUnitsFixed(balance, decimals, 2)}
          </span>
          <span className="text-lg font-medium" style={{ color: 'var(--subtle)' }}>
            USDC
          </span>
        </div>
        <p className="mt-1.5 text-xs" style={{ color: 'var(--muted)' }}>
          {isConnected ? 'Arc Testnet. Gas is paid in the same USDC.' : 'Connect a wallet to ask your first question.'}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="glass-inner rounded-2xl px-3 py-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--subtle)' }}>
              Per prompt
            </div>
            <div className="display mt-0.5 text-lg font-semibold tabular-nums">
              {price === undefined ? '...' : `${formatUsdc(price)} USDC`}
            </div>
          </div>
          <div className="glass-inner rounded-2xl px-3 py-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--subtle)' }}>
              Prompts approved
            </div>
            <div className="display mt-0.5 text-lg font-semibold tabular-nums">
              {!isConnected || promptsLeft === undefined ? '--' : promptsLeft.toString()}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
