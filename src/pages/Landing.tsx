import { useReadContract } from 'wagmi'
import { MotionConfig } from 'framer-motion'
import { Faq } from '@/components/Faq'
import { Hero } from '@/components/landing/Hero'
import { FinalCta, Footer } from '@/components/landing/Footer'
import { Nav } from '@/components/landing/Nav'
import { Pricing } from '@/components/landing/Pricing'
import { StatsStrip } from '@/components/landing/StatsStrip'
import { Steps } from '@/components/landing/Steps'
import { Trust } from '@/components/landing/Trust'
import { CHAIN_ID, PROMPTPAY_ADDRESS } from '@/contracts/address'
import { promptPayAbi } from '@/contracts/promptPay'

export default function Landing() {
  const price = useReadContract({
    address: PROMPTPAY_ADDRESS,
    abi: promptPayAbi,
    functionName: 'pricePerPrompt',
    chainId: CHAIN_ID,
    query: { enabled: Boolean(PROMPTPAY_ADDRESS), refetchInterval: 30_000 },
  }).data

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero price={price} />
        <StatsStrip price={price} />
        <Steps />
        <Pricing price={price} />
        <Trust />
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-24">
          <Faq />
        </section>
        <FinalCta />
      </main>
      <Footer />
    </MotionConfig>
  )
}
