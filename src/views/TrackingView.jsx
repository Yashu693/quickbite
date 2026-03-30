import { useState, useEffect, useMemo } from 'react';
import { fmtSecs } from '../utils/helpers';
import { CircularTimer } from '../components/payment/CircularTimer';
import { usePreventExit, useConfirmExit } from '../hooks';

export default function TrackingView({ order, onDone, onViewReceipt, addToast }) {
  const maxPrepSecs = useMemo(() => {
    if (!order?.items || order.items.length === 0) return 64;
    return Math.max(...order.items.map(i => i.time || 5)) * 9;
  }, [order]);

  const passedSecs = useMemo(() => {
    if (!order?.date) return 0;
    return Math.floor((Date.now() - new Date(order.date).getTime()) / 1000);
  }, [order]);

  usePreventExit('/home');
  useConfirmExit('Are you sure? Your order tracking progress will be lost.');

  const [stage, setStage] = useState(passedSecs >= (maxPrepSecs + 3) ? 3 : passedSecs > 3 ? 2 : passedSecs > 1 ? 1 : 0);
  const [countdown, setCd] = useState(Math.max(0, maxPrepSecs - Math.max(0, passedSecs - 3)));
  const [elapsed, setEl] = useState(passedSecs);
  const [notified, setNotif] = useState(passedSecs >= (maxPrepSecs + 3));
  const [completedIn, setDoneIn] = useState(passedSecs >= (maxPrepSecs + 3) ? maxPrepSecs + 3 : null);

  useEffect(() => {
    if (stage >= 3) return;
    
    // Calculate precise stages based on real time
    const interval = setInterval(() => {
      const currentPassed = Math.floor((Date.now() - new Date(order.date).getTime()) / 1000);
      setEl(currentPassed);
      
      if (currentPassed > 1 && currentPassed <= 3) setStage(1);
      else if (currentPassed > 3 && stage < 3) setStage(2);

      if (currentPassed > 3) {
        const remaining = Math.max(0, maxPrepSecs - (currentPassed - 3));
        setCd(remaining);
        
        if (remaining <= 0 && stage < 3) {
          setStage(3);
          setDoneIn(currentPassed);
          if (!notified) {
            setNotif(true);
            addToast?.({ icon: '🎯', title: 'Order Ready!', msg: `${order?.token || ''}—Counter B · Pick it up!`, cta: 'COLLECT' });
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [order.date, maxPrepSecs, stage, notified, addToast, order?.token]);

  const pct = stage < 2 ? 0 : stage >= 3 ? 1 : (maxPrepSecs - countdown) / maxPrepSecs;
  const estMins = order?.items ? Math.max(...order.items.map(i => i.time || 5)) : 5;
  const stages = [
    { icon: '📋', label: 'Order Received', detail: 'Canteen has your order!', time: 'Just now', done: true },
    { icon: '✅', label: 'Payment Confirmed', detail: `₹${order?.total || 0} — ${order?.payMethod || 'paid successfully'}`, time: '', done: stage >= 1 },
    { icon: '👨‍🍳', label: "Chef is Cooking", detail: '"Almost there... don\'t get hungry 😄"', time: stage === 2 ? fmtSecs(elapsed) : '', done: stage >= 3, active: stage === 2 },
    { icon: '🎯', label: 'Ready for Pickup', detail: `Counter B · ${order?.token || 'QB42'}`, time: completedIn ? `Done in ${fmtSecs(completedIn)}` : '', done: stage >= 3 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div className="glass-hdr" style={{ padding: '38px 16px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9.5, color: 'var(--acc)', fontWeight: 700, letterSpacing: .5, marginBottom: 2 }}>📍 {order?.canteen || 'Campus Canteen'}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Live Tracking 📍</div>
          </div>
          <div className="glass" style={{ borderRadius: 13, padding: '6px 13px' }}>
            <div style={{ fontSize: 9, color: 'var(--mut)', fontWeight: 600, letterSpacing: .4 }}>ORDER</div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--acc)' }}>{order?.id || 'QB-0000'}</div>
          </div>
        </div>
      </div>
      <div className="hs" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div className="anim-scaleIn glass" style={{ borderRadius: 26, padding: '22px 20px', marginBottom: 14, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: stage >= 3 ? 'rgba(34,197,94,.06)' : 'rgba(255,107,53,.05)', transition: 'background .7s' }} />
          <CircularTimer progress={pct} countdown={countdown} stage={stage} completedIn={completedIn} />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: stage >= 3 ? 'var(--grn)' : 'var(--txt)', fontFamily: "'Sora',sans-serif", transition: 'color .5s', marginBottom: 4 }}>
              {stage === 0 ? 'Order Received! 📋' : stage === 1 ? 'Payment Confirmed ✅' : stage === 2 ? 'Cooking with love ❤️' : 'Order Ready! 🎉'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--sub)' }}>
              {stage === 2 ? `Est. ~${estMins} min · Prep started` : stage >= 3 ? `Collected at Counter B · Token ${order?.token || ''}` : ''}
            </div>
          </div>
          {stage >= 3 && completedIn && (
            <div className="anim-popIn" style={{ marginTop: 14, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 14, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--grn)' }}>✅ Completed in {fmtSecs(completedIn)}</div>
              <div style={{ fontSize: 10.5, color: 'var(--mut)', marginTop: 2 }}>Show token {order?.token || ''} at Counter B</div>
            </div>
          )}
          {stage === 2 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 10.5, color: 'var(--sub)', fontWeight: 600 }}>Preparation</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--acc)' }}>{Math.round(pct * 100)}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: 'var(--bdr)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#FF6B35,#FF3D60)', width: `${pct * 100}%`, transition: 'width .9s ease' }} />
              </div>
            </div>
          )}
        </div>
        <div className="glass" style={{ borderRadius: 22, padding: '16px', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', marginBottom: 16, fontFamily: "'Sora',sans-serif" }}>⏱️ Order Timeline</div>
          {stages.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < stages.length - 1 ? 18 : 0, position: 'relative' }}>
              {i < stages.length - 1 && <div style={{ position: 'absolute', left: 17, top: 38, width: 2, height: 20, background: stages[i + 1].done || stages[i + 1].active ? 'linear-gradient(to bottom,#FF6B35,rgba(255,107,53,.2))' : 'var(--bdr)', transition: 'background .5s', borderRadius: 99 }} />}
              <div style={{ width: 35, height: 35, borderRadius: '50%', background: s.done ? 'linear-gradient(135deg,#22C55E,#16A34A)' : s.active ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--inp)', border: `2px solid ${s.done ? '#22C55E' : s.active ? '#FF6B35' : 'var(--bdr)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, transition: 'all .4s', boxShadow: s.active ? '0 4px 16px rgba(255,107,53,.42)' : s.done ? '0 4px 16px rgba(34,197,94,.3)' : 'none' }}>
                {s.done ? '✓' : s.icon}
              </div>
              <div style={{ paddingTop: 6, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.done || s.active ? 'var(--txt)' : 'var(--mut)', transition: 'color .4s', fontFamily: "'Sora',sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 1 }}>{s.detail}</div>
                {s.time && <div style={{ fontSize: 10, color: 'var(--acc)', fontWeight: 700, marginTop: 2 }}>{s.time}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="glass" style={{ borderRadius: 20, padding: '14px 16px', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', marginBottom: 12, fontFamily: "'Sora',sans-serif" }}>🍱 Your Order</div>
          {order?.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < order.items.length - 1 ? 10 : 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: item.g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>{item.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--mut)' }}>Qty {item.qty} · ₹{item.price * item.qty}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--bdr)', paddingTop: 10, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--sub)' }}>Total Paid</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--acc)' }}>₹{order?.total || 0}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button onClick={onViewReceipt} className="press glass" style={{ flex: 1, padding: '14px', borderRadius: 16, border: '1px solid var(--bdr)', color: 'var(--sub)', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>🧾 View Receipt</button>
          <button onClick={onDone} className="press" style={{ flex: 2, padding: '14px', borderRadius: 16, border: 'none', background: stage >= 3 ? 'linear-gradient(135deg,#22C55E,#16A34A)' : 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 13.5, fontWeight: 800, cursor: 'pointer', boxShadow: stage >= 3 ? '0 8px 28px rgba(34,197,94,.4)' : '0 6px 24px rgba(255,107,53,.38)', transition: 'all .5s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {stage >= 3 ? '🏠 Go Home' : '← Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
}
