import { useState, useEffect } from 'react';
import { QBLogo } from '../components/common/QBLogo';

export default function SplashScreen({ onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 2000);
    const t2 = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0A0608 0%,#1A0A10 50%,#0E0812 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: out ? 'fadeOut .52s ease forwards' : 'none' }}>
      <div style={{ animation: 'splashLogo .8s cubic-bezier(.34,1.56,.64,1) .15s both', textAlign: 'center' }}>
        <QBLogo size={88} style={{ borderRadius: 28, boxShadow: '0 20px 60px rgba(255,107,53,.5)', marginBottom: 22 }} />
        <div style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg,#FF6B35 0%,#FF3D60 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>QuickBite</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.38)', marginTop: 8, letterSpacing: 3.5, fontWeight: 600, textTransform: 'uppercase' }}>College Canteen · Reimagined</div>
      </div>
      <div style={{ position: 'absolute', bottom: 52, display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => <div key={i} className="anim-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,107,53,.5)', animationDelay: `${i * .22}s` }} />)}
      </div>
    </div>
  );
}
