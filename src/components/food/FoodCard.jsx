import { memo, useState } from 'react';
import { LazyImg } from '../common/LazyImg';
import { motion, AnimatePresence } from 'framer-motion';
export const FoodCard = memo(function FoodCard({ item, qty, onAdd, onInc, onDec }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="glass"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
        transform: hov ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: hov ? '0 20px 48px rgba(255,107,53,.28),0 4px 16px rgba(0,0,0,.12)' : '0 2px 12px var(--shadow)',
        transition: 'transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s ease',
        willChange: 'transform',
      }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <LazyImg item={item} h={128} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 55%,rgba(0,0,0,.42) 100%)', pointerEvents: 'none' }} />
        {item.tag && <div style={{ position: 'absolute', top: 9, left: 9, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(10px)', color: '#ea580c', fontSize: 9.5, fontWeight: 800, padding: '3px 9px', borderRadius: 99 }}>{item.tag}</div>}
        <div style={{ position: 'absolute', top: 9, right: 9, background: 'rgba(0,0,0,.52)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99 }}>⭐{item.rating}</div>
        <div style={{ position: 'absolute', bottom: 7, left: 9, display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 13, height: 13, borderRadius: 3, border: '2px solid #22c55e', background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.92)' }}>VEG</span>
        </div>
      </div>
      <div style={{ padding: '11px 12px', background: 'var(--card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', lineHeight: 1.25, flex: 1, paddingRight: 6, fontFamily: "'Sora',sans-serif" }}>{item.name}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--acc)', flexShrink: 0 }}>₹{item.price}</div>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--mut)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--sub)', background: 'var(--inp)', borderRadius: 7, padding: '3px 7px', border: '1px solid var(--bdr)' }}>🕐{item.time}m</span>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--sub)', background: 'var(--inp)', borderRadius: 7, padding: '3px 7px', border: '1px solid var(--bdr)' }}>🔥{item.cal}</span>
        </div>
        
        <AnimatePresence mode="wait">
        {qty === 0 ? (
          <motion.button key="add" onClick={onAdd} className="press btn-ripple"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ width: '100%', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', border: 'none', borderRadius: 14, padding: '10px 0', fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,107,53,.35)', letterSpacing: .5 }}
          >+ ADD</motion.button>
        ) : (
          <motion.div key="stepper"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 14px rgba(255,107,53,.35)' }}
          >
            <button onClick={onDec} className="press" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', height: 40, fontSize: 22, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <motion.span
              key={qty}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              style={{ color: '#fff', fontWeight: 900, fontSize: 14, minWidth: 24, textAlign: 'center' }}
            >{qty}</motion.span>
            <button onClick={onInc} className="press" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', height: 40, fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
});
