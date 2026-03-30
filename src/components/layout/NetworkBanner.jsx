import { useState, useEffect } from 'react';

export function NetworkBanner({ online }) {
  const [show, setShow] = useState(!online);
  useEffect(() => {
    if (!online) setShow(true);
    else { const t = setTimeout(() => setShow(false), 2200); return () => clearTimeout(t); }
  }, [online]);
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9000,
      background: online ? 'var(--netOK)' : 'var(--netErr)',
      color: '#fff', fontSize: 11.5, fontWeight: 700, padding: '7px 16px', textAlign: 'center',
      animation: 'netSlide .35s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    }}>
      {online ? '✅ Back online!' : '📡 No internet — changes sync when reconnected'}
    </div>
  );
}
