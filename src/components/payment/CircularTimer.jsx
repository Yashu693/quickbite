import { fmtSecs } from '../../utils/helpers';

export function CircularTimer({ progress, countdown, stage, completedIn }) {
  const R = 52, CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - Math.min(1, Math.max(0, progress)));
  const isReady = stage >= 3;
  return (
    <div style={{ position: 'relative', width: 148, height: 148, margin: '0 auto' }}>
      <svg width="148" height="148" viewBox="0 0 148 148">
        <defs>
          <linearGradient id="ctGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FF3D60" />
          </linearGradient>
        </defs>
        <circle cx="74" cy="74" r={R} fill="none" stroke={isReady ? 'rgba(34,197,94,.14)' : 'rgba(255,107,53,.13)'} strokeWidth="7.5" />
        <circle cx="74" cy="74" r={R} fill="none" stroke={isReady ? '#22C55E' : 'url(#ctGrad)'} strokeWidth="7.5"
          strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 74 74)"
          style={{ transition: 'stroke-dashoffset .9s ease,stroke .6s ease' }} />
        {!isReady && progress > 0.02 && progress < 1 && (
          <circle
            cx={74 + R * Math.cos(-Math.PI / 2 + 2 * Math.PI * progress)}
            cy={74 + R * Math.sin(-Math.PI / 2 + 2 * Math.PI * progress)}
            r="5" fill="#FF6B35" opacity=".85" />
        )}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {isReady ? (
          <div className="anim-popIn anim-greenGlow" style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#22C55E,#16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(34,197,94,.5)' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l6 6 10-12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="0" style={{ animation: 'checkDraw .5s ease .1s both' }} />
            </svg>
          </div>
        ) : stage === 2 ? (
          <>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--acc)', fontFamily: "'Sora',sans-serif", letterSpacing: -1.5, lineHeight: 1 }}>{fmtSecs(countdown)}</div>
            <div style={{ fontSize: 9.5, color: 'var(--sub)', fontWeight: 600, letterSpacing: .6, marginTop: 3 }}>REMAINING</div>
          </>
        ) : (
          <div className="anim-pulse" style={{ fontSize: 32 }}>⏳</div>
        )}
      </div>
      {isReady && <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid #22C55E', animation: 'ringOut 1.5s ease infinite', pointerEvents: 'none' }} />}
    </div>
  );
}
