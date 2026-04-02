import { useState } from 'react';
import { Confetti } from '../components/feedback/Confetti';
import { usePreventExit, useConfirmExit } from '../hooks';
import { motion } from 'framer-motion';

export default function PaymentView({ orderData, college, onSuccess, onBack }) {
  const [state, setState] = useState('methods');
  const [method, setMethod] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [failReason, setFail] = useState('');
  const { total } = orderData;
  
  usePreventExit('/cart');
  useConfirmExit('Are you sure? Your payment will be cancelled.');

  const METHODS = [
    { 
      id: 'upi', 
      label: 'UPI (GPay, PhonePe, Paytm)', 
      icon: (
        <div style={{ background: '#fff', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ width: 20, objectFit: 'contain' }} />
        </div>
      ), 
      sub: 'Most popular · Instant' 
    },
    { id: 'card', label: 'Credit / Debit Card', icon: '💳', sub: 'Visa, Mastercard, RuPay' },
    { id: 'nb', label: 'Net Banking', icon: '🏦', sub: 'All major banks' },
  ];
  const FAIL_REASONS = ['Payment declined by bank', 'UPI timeout. Please retry.', 'Network error. Please try again.'];

  const pay = m => {
    setMethod(m); setState('processing');
    setTimeout(() => {
      if (Math.random() > .12) { setState('success'); setConfetti(true); setTimeout(onSuccess, 2800); }
      else { setState('failed'); setFail(FAIL_REASONS[Math.floor(Math.random() * FAIL_REASONS.length)]); }
    }, 2400);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Confetti active={confetti} />
      <div className="glass-hdr" style={{ padding: '38px 16px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          {state === 'methods' && <button onClick={onBack} className="press" style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--glass)', border: '1px solid var(--glassB)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, backdropFilter: 'blur(12px)' }}>‹</button>}
          <div>
            <div style={{ fontSize: 9.5, color: 'var(--acc)', fontWeight: 700, letterSpacing: .5, marginBottom: 1 }}>📍 {college?.canteen || 'Campus Canteen'}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>
              {state === 'methods' ? 'Payment 💳' : state === 'processing' ? 'Processing...' : state === 'success' ? 'Payment Done! 🎉' : 'Payment Failed 😟'}
            </div>
          </div>
        </div>
      </div>
      <div className="hs" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {state === 'methods' && (
          <>
            <div className="anim-fadeIn glass" style={{ borderRadius: 18, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔒</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt)' }}>100% Secure · 256-bit SSL</div>
                <div style={{ fontSize: 10.5, color: 'var(--mut)', marginTop: 1 }}>PCI DSS Compliant · Your data is safe</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--acc)', fontFamily: "'Sora',sans-serif" }}>₹{total}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sub)', letterSpacing: .8, textTransform: 'uppercase', marginBottom: 12 }}>Select Method</div>
            {METHODS.map((m, idx) => (
              <motion.div key={m.id} onClick={() => pay(m.id)} className="press lift glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.08, ease: [0.25, 1, 0.5, 1] }}
                whileTap={{ scale: 0.97 }}
                style={{ borderRadius: 18, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--inp)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, border: '1px solid var(--bdr)' }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{m.label}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--mut)', marginTop: 2 }}>{m.sub}</div>
                </div>
                <div style={{ color: 'var(--mut)', fontSize: 22 }}>›</div>
              </motion.div>
            ))}
          </>
        )}
        {state === 'processing' && (
          <div className="anim-fadeIn" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(255,107,53,.12),rgba(255,61,96,.08))', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="anim-spin" style={{ width: 48, height: 48, border: '3.5px solid rgba(255,107,53,.2)', borderTopColor: '#FF6B35', borderRadius: '50%' }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 8 }}>Verifying Payment</div>
            <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 28 }}>Connecting to {METHODS.find(m => m.id === method)?.label || 'bank'}...</div>
            <div style={{ height: 5, borderRadius: 99, background: 'var(--bdr)', overflow: 'hidden', maxWidth: 260, margin: '0 auto' }}>
              <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#FF6B35,#FF3D60)', animation: 'progressFill 2.4s ease forwards' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 12 }}>Don't press back or close the app</div>
          </div>
        )}
        {state === 'success' && (
          <div className="anim-fadeIn" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="anim-popIn anim-greenGlow" style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#22C55E,#16A34A)', margin: '0 auto 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 36px rgba(34,197,94,.45)' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20l9 9 15-16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="0" style={{ animation: 'checkDraw .55s ease .1s both' }} /></svg>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 8 }}>Payment Successful! 🎉</div>
            <div style={{ fontSize: 14, color: 'var(--sub)', marginBottom: 4 }}>₹{total} paid via {METHODS.find(m => m.id === method)?.label}</div>
            <div style={{ fontSize: 12, color: 'var(--mut)' }}>Sending your order to the canteen...</div>
          </div>
        )}
        {state === 'failed' && (
          <div className="anim-fadeIn" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="anim-popIn" style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg,#EF4444,#DC2626)', margin: '0 auto 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(239,68,68,.4)' }}>
              <span style={{ fontSize: 38, color: '#fff' }}>✕</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 8 }}>Payment Failed</div>
            <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 6 }}>{failReason}</div>
            <div className="glass" style={{ borderRadius: 16, padding: '12px 16px', marginBottom: 22, textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mut)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .7 }}>What to do?</div>
              {['Check your internet connection', 'Ensure sufficient balance', 'Try a different payment method'].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ color: 'var(--acc)', fontWeight: 700, marginTop: 1 }}>•</span>
                  <span style={{ fontSize: 12, color: 'var(--sub)' }}>{t}</span>
                </div>
              ))}
            </div>
            <motion.button onClick={() => setState('methods')} className="press btn-ripple"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{ width: '100%', padding: '15px', borderRadius: 17, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 28px rgba(255,107,53,.42)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>🔄 Retry Payment</motion.button>
            <motion.button onClick={onBack} className="press"
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{ width: '100%', padding: '14px', borderRadius: 17, border: '1px solid var(--bdr)', background: 'transparent', color: 'var(--sub)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Back to Cart</motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
