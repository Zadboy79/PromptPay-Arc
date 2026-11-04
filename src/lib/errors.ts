export function isUserRejection(error: unknown): boolean {
  const e = error as { code?: number; message?: string; cause?: { code?: number } } | null
  const msg = (e?.message ?? '').toLowerCase()
  return e?.code === 4001 || e?.cause?.code === 4001 || msg.includes('user rejected') || msg.includes('user denied')
}

export function parseOnchainError(error: unknown): string {
  const msg = ((error as { shortMessage?: string; message?: string } | null)?.shortMessage ??
    (error as { message?: string } | null)?.message ??
    '').toLowerCase()
  if (msg.includes('insufficient funds') || msg.includes('exceeds balance') || msg.includes('transfer amount exceeds')) {
    return 'Not enough USDC. Use Get test USDC in the sidebar, then try again.'
  }
  if (msg.includes('priceexceedsmax')) return 'The price changed. Refresh and try again.'
  if (msg.includes('reverted')) return 'The payment transaction failed. Please try again.'
  if (msg.includes('network') || msg.includes('timeout') || msg.includes('fetch')) {
    return 'Network issue. Check your connection and retry.'
  }
  return 'Something went wrong. Please try again.'
}
