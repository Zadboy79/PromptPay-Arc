import { parseAbi } from 'viem'

/** Human-readable ABI for the PromptPay contract (src/contracts is shared with the backend). */
export const promptPayAbi = parseAbi([
  'function pay(bytes32 promptId, uint256 maxPrice)',
  'function pricePerPrompt() view returns (uint256)',
  'function isPaid(address payer, bytes32 promptId) view returns (bool)',
  'event PromptPaid(address indexed payer, bytes32 indexed promptId, uint256 amount)',
  'error PromptAlreadyPaid(address payer, bytes32 promptId)',
  'error PriceExceedsMax(uint256 currentPrice, uint256 maxPrice)',
  'error InvalidPromptId()',
])

export const PROMPT_MAX_CHARS = 1000
