export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pp-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#85b1ed" />
          <stop offset="0.5" stopColor="#b6a6f2" />
          <stop offset="1" stopColor="#f6c88f" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#122d45" stroke="url(#pp-g)" strokeWidth="1.5" />
      <rect x="8" y="17" width="4" height="7" rx="1.5" fill="url(#pp-g)" />
      <rect x="14" y="12" width="4" height="12" rx="1.5" fill="url(#pp-g)" />
      <rect x="20" y="7" width="4" height="17" rx="1.5" fill="url(#pp-g)" />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="display text-lg font-bold">PromptPay</span>
    </span>
  )
}
