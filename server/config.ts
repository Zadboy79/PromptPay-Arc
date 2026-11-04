import { createPublicClient, http, isAddress, type Address } from 'viem'
import { requireChain } from '../src/onchain-facts'

export const CHAIN_ID = 5042002
export const COMPASS_CHAIN = 'Arc_Testnet'

const contractEnv = process.env.VITE_PROMPTPAY_ADDRESS
if (!contractEnv || !isAddress(contractEnv)) {
  throw new Error('VITE_PROMPTPAY_ADDRESS is missing or invalid in .env')
}
export const CONTRACT: Address = contractEnv

const proxyChains = (process.env.RPC_PROXY_CHAINS || '').split(',')
const proxied =
  process.env.RPC_PROXY_BASE_URL && proxyChains.includes(COMPASS_CHAIN)
    ? `${process.env.RPC_PROXY_BASE_URL}/api/rpc/${COMPASS_CHAIN}?_rpc_token=${process.env.RPC_PROXY_TOKEN}`
    : undefined

export const RPC_URL = proxied ?? requireChain(CHAIN_ID).rpcUrls[0]

export const client = createPublicClient({ transport: http(RPC_URL) })

export const AI_API_KEY = process.env.AI_API_KEY
export const AI_BASE_URL = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '')
export const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini'
