import { useState, useRef, useEffect } from 'react';
import { QBLogo } from '../common/QBLogo';

export function SwipeToPay({ total, onPay }) {
  const [x, setX] = useState(0);
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState(false);
  const [trackW, setTrackW] = useState(300);
  const ref = useRef(null);
  
  useEffect(() => {
    if (ref.current) setTrackW(ref.current.getBoundingClientRect().width);
  }, []);

  const thumbW = 58;
  const maxX = trackW - thumbW - 8;

  const onMove = e => {
    if (!drag || done) return;
    const cl = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = ref.current.getBoundingClientRect();
    const currentMaxX = rect.width - thumbW - 8;
    const nx = Math.max(0, Math.min(currentMaxX, cl - rect.left - thumbW / 2));
    setX(nx);
    if (nx >= currentMaxX - 10) { 
      setX(currentMaxX); 
      setDone(true); 
      setDrag(false); 
      setTimeout(onPay, 600); 
    }
  };
  const endDrag = () => { if (!done) { setX(0); setDrag(false); } };
  const pct = Math.min(1, Math.max(0, x / (maxX || 1)));

  return (
    <div ref={ref} style={{ background: 'var(--card)', borderRadius: 22, padding: 5, border: '1px solid var(--bdr)', boxShadow: '0 4px 22px var(--shadow)', userSelect: 'none', touchAction: 'none' }}
      onMouseMove={onMove} onMouseUp={endDrag} onMouseLeave={endDrag}
      onTouchMove={onMove} onTouchEnd={endDrag}>
      <div style={{ height: 60, borderRadius: 18, background: done ? 'linear-gradient(135deg,#22C55E,#16A34A)' : `linear-gradient(90deg,rgba(255,107,53,${.12 + pct * .7}),rgba(255,61,96,${.08 + pct * .5}))`, position: 'relative', overflow: 'hidden', transition: done ? 'background .35s' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: trackW > 0 ? `${(x + thumbW / 2) / trackW * 100}%` : '0%', background: 'linear-gradient(90deg,rgba(255,107,53,.22),transparent)', pointerEvents: 'none', transition: (drag || done) ? 'none' : 'width .2s' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: done ? '#fff' : `rgba(${pct > .4 ? '255,255,255' : '180,100,60'},${.45 + pct * .55})`, letterSpacing: .4, zIndex: 1, pointerEvents: 'none', transition: 'color .3s' }}>
          {done ? '✅ Order Placed!' : 'Swipe to Pay  ₹' + total}
        </span>
        <div onMouseDown={() => setDrag(true)} onTouchStart={() => setDrag(true)}
          style={{ position: 'absolute', left: x + 4, top: 4, width: thumbW, height: 52, borderRadius: 15, background: done ? 'rgba(255,255,255,.25)' : 'linear-gradient(135deg,#FF6B35,#FF3D60)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: done ? 'none' : '0 4px 22px rgba(255,107,53,.55)', transition: drag ? 'none' : 'left .2s ease', cursor: 'grab', zIndex: 2 }}>
          {done ? <span style={{ fontSize: 24 }}>✅</span> : <QBLogo size={34} style={{ borderRadius: 9 }} />}
        </div>
      </div>
    </div>
  );
}
