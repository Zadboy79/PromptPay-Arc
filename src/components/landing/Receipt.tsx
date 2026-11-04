import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { formatUsdc } from '@/onchain-money'

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

/** Illustrative receipt. Only the price is live; the prompt text is a sample. */
export function Receipt({ price }: { price: bigint | undefined }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 1.5 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
      className="relative w-full max-w-sm"
    >
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{ background: '#f9faf3', color: '#122d45', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.55)' }}
      >
        <div className="spectral-strip h-1.5" />

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.3 }}
          className="mono space-y-4 p-6 text-xs"
        >
          <motion.div variants={rowVariants} className="flex items-center justify-between">
            <span className="font-medium uppercase tracking-[0.1em]" style={{ color: '#6b6580' }}>
              Sample receipt
            </span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#e8eef6' }}>
              Arc Testnet
            </span>
          </motion.div>

          <motion.div variants={rowVariants}>
            <div className="uppercase tracking-[0.1em]" style={{ color: '#8a849c' }}>
              Prompt
            </div>
            <p className="mt-1 text-sm leading-snug">Explain why USDC works as a gas token.</p>
          </motion.div>

          <div className="relative -mx-6 my-1 border-t border-dashed" style={{ borderColor: 'rgba(18,45,69,0.25)' }}>
            <span className="absolute -left-2 -top-2 size-4 rounded-full" style={{ background: '#0d1b2f' }} />
            <span className="absolute -right-2 -top-2 size-4 rounded-full" style={{ background: '#0d1b2f' }} />
          </div>

          <motion.div variants={rowVariants} className="flex items-end justify-between">
            <div className="uppercase tracking-[0.1em]" style={{ color: '#8a849c' }}>
              Price
            </div>
            <div className="display text-3xl font-bold tabular-nums">
              {price === undefined ? '...' : formatUsdc(price)}
              <span className="ml-1 text-sm font-medium" style={{ color: '#8a849c' }}>
                USDC
              </span>
            </div>
          </motion.div>

          <motion.div variants={rowVariants} className="flex items-center justify-between">
            <span className="uppercase tracking-[0.1em]" style={{ color: '#8a849c' }}>
              Status
            </span>
            <span className="flex items-center gap-1.5 font-medium" style={{ color: '#1a8047' }}>
              <CheckCircle2 className="size-4" /> Verified onchain
            </span>
          </motion.div>

          <motion.div variants={rowVariants} className="rounded-2xl p-3 text-[11px] leading-relaxed" style={{ background: '#eef1f6' }}>
            Answer unlocked. One payment, one answer, no second charge.
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
