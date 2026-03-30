import { useMemo } from 'react';

export function Confetti({ active }) {
  const pieces = useMemo(() => Array.from({ length: 52 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: ['#FF6B35', '#FF3D60', '#FFB300', '#22C55E', '#3B82F6', '#A855F7', '#F472B6', '#FBBF24'][Math.floor(Math.random() * 8)],
    size: Math.random() * 9 + 5, delay: Math.random() * 2.2, dur: Math.random() * 1.2 + 1.8, isRect: Math.random() > .5,
  })), []);
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 7000, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: -14,
          width: p.size, height: p.size, borderRadius: p.isRect ? '3px' : '50%',
          background: p.color, animation: `confettiFall ${p.dur}s ease ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}
