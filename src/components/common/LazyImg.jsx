import { memo, useState } from 'react';

export const LazyImg = memo(function LazyImg({ item, h = 132 }) {
  const [s, setS] = useState('loading');
  return (
    <div style={{ position: 'relative', height: h, overflow: 'hidden', borderRadius: 'inherit' }}>
      {s === 'loading' && <div className="sk" style={{ position: 'absolute', inset: 0 }} />}
      {s === 'error' ? (
        <div style={{ position: 'absolute', inset: 0, background: item.g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(h * 0.42) }}>{item.emoji}</div>
      ) : (
        <img src={item.img} alt={item.name} loading="lazy" decoding="async"
          onLoad={() => setS('loaded')} onError={() => setS('error')}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: s === 'loaded' ? 1 : 0, transition: 'opacity .42s ease' }} />
      )}
    </div>
  );
});
