// ═══════════════════════════════════════════════════════════════════════════
//  QB LOGO — Brand logo SVG component
// ═══════════════════════════════════════════════════════════════════════════

export function QBLogo({ size = 40, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
      <defs>
        <linearGradient id="qbg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FF3D60" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#qbg1)" />
      <rect width="48" height="48" rx="14" fill="rgba(255,255,255,.06)" />
      <line x1="18" y1="10" x2="18" y2="22" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <line x1="14" y1="10" x2="14" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <line x1="22" y1="10" x2="22" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <path d="M14 16 Q18 20 22 16" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <path d="M30 10 L30 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <path d="M30 10 Q36 10 36 16 Q36 22 30 22" fill="rgba(255,255,255,.22)" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <text x="24" y="42" textAnchor="middle" fontFamily="'Sora',sans-serif" fontWeight="800" fontSize="9" fill="rgba(255,255,255,.95)" letterSpacing="1.5">QB</text>
    </svg>
  );
}
