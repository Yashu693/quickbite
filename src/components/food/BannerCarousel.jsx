import { useState, useEffect, useRef } from 'react';
import { BANNERS } from '../../data/constants';

export function BannerCarousel({ onToast }) {
  const [idx, setIdx] = useState(0);
  const touchXRef = useRef(null);
  const timerRef = useRef(null);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 4500);
  };
  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, []);

  const next = () => { setIdx(i => (i + 1) % BANNERS.length); resetTimer(); };
  const prev = () => { setIdx(i => (i - 1 + BANNERS.length) % BANNERS.length); resetTimer(); };

  const onTouchStart = e => { touchXRef.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchXRef.current;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    touchXRef.current = null;
  };

  const b = BANNERS[idx];
  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 14, boxShadow: '0 8px 28px rgba(255,107,53,.22)', cursor: 'pointer', userSelect: 'none' }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      onClick={() => onToast({ icon: '🏷️', title: 'Coupon copied!', msg: `Use "${b.code}" at checkout`, cta: 'GOT IT' })}>
      {/* ── Slide ── */}
      <div style={{ background: b.bg, padding: '14px 16px 16px', minHeight: 82, position: 'relative', overflow: 'hidden', transition: 'background .7s ease' }}>
        <div style={{ position: 'absolute', right: -18, top: -18, fontSize: 88, opacity: .1, transform: 'rotate(-16deg)', pointerEvents: 'none' }}>{b.e}</div>
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(14px)', borderRadius: 12, padding: '7px 12px', border: '1px solid rgba(255,255,255,.28)' }}>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 800, letterSpacing: .5, textAlign: 'center' }}>{b.cta}</div>
        </div>
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.18)', borderRadius: 99, padding: '2px 9px', fontSize: 9.5, color: '#fff', fontWeight: 800, letterSpacing: .4, marginBottom: 4 }}>{b.code}</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: -.5, lineHeight: 1.15, marginBottom: 3, fontFamily: "'Sora',sans-serif" }}>{b.title}</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.84)', fontWeight: 500 }}>{b.sub}</div>
      </div>
      {/* ── Dots ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 5, padding: '6px 0', background: 'rgba(0,0,0,.14)' }}>
        {BANNERS.map((_, i) => (
          <div key={i}
            onClick={e => { e.stopPropagation(); setIdx(i); resetTimer(); }}
            style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 99, background: i === idx ? '#fff' : 'rgba(255,255,255,.32)', transition: 'all .32s ease', cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );
}
