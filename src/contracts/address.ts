import { isAddress, type Address } from 'viem'
import { arcTestnet } from 'viem/chains'
import { getUsdc } from '@/onchain-facts'

const raw = import.meta.env.VITE_PROMPTPAY_ADDRESS as string | undefined

export const PROMPTPAY_ADDRESS: Address | undefined = raw && isAddress(raw) ? raw : undefined

export const CHAIN_ID = arcTestnet.id

const usdc = getUsdc(CHAIN_ID)
if (!usdc) throw new Error('USDC is not registered for Arc Testnet')
export const USDC_ADDRESS: Address = usdc.address as Address

/** One approval covers this many prompts, so the user does not approve on every question. */
export const APPROVAL_PROMPTS = 20n
