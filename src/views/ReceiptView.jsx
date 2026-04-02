import { useState } from 'react';
import { PREP_FEE } from '../data/constants';
import { fmtDate } from '../utils/helpers';
import { QBLogo } from '../components/common/QBLogo';


export default function ReceiptView({ order, onDone }) {


  const [copied, setCopied] = useState(false);
  const shareText = `QuickBite Receipt\nOrder: ${order?.id}\nTotal: ₹${order?.total}\nToken: ${order?.token}`;
  const copy = () => { navigator.clipboard?.writeText(shareText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div className="glass-hdr no-print" style={{ padding: '38px 16px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <button onClick={onDone} className="press" style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--glass)', border: '1px solid var(--glassB)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, backdropFilter: 'blur(12px)' }}>‹</button>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Receipt 🧾</div>
        </div>
      </div>
      <div className="hs" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div className="print-card anim-slideLeft" style={{ background: 'var(--card)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--bdr)', boxShadow: '0 8px 40px var(--shadow)' }}>
          <div style={{ background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', padding: '22px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: .08, fontSize: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍔</div>
            <QBLogo size={48} style={{ marginBottom: 10, borderRadius: 16, boxShadow: '0 6px 20px rgba(0,0,0,.25)' }} />
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: "'Sora',sans-serif", letterSpacing: -1 }}>QuickBite</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.75)', marginTop: 4 }}>{order?.canteen || 'Campus Canteen'}</div>
          </div>
          <div style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div><div style={{ fontSize: 10, color: 'var(--mut)', fontWeight: 600, textTransform: 'uppercase' }}>Order ID</div><div style={{ fontSize: 16, fontWeight: 900, color: 'var(--acc)', fontFamily: "'Sora',sans-serif" }}>{order?.id || 'QB-0000'}</div></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 10, color: 'var(--mut)', fontWeight: 600, textTransform: 'uppercase' }}>Token</div><div style={{ fontSize: 16, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>{order?.token || 'QB42'}</div></div>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--mut)', marginBottom: 14 }}>{fmtDate(order?.date)}</div>
            {order?.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 10, borderBottom: i < order.items.length - 1 ? '1px solid var(--bdr)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: item.g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{item.emoji}</div>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>{item.name}</div><div style={{ fontSize: 10.5, color: 'var(--mut)' }}>₹{item.price} × {item.qty}</div></div>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--txt)' }}>₹{item.price * item.qty}</div>
              </div>
            ))}
            <div style={{ borderTop: '2px dashed var(--bdr)', paddingTop: 14, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontSize: 12, color: 'var(--sub)' }}>Item Total</span><span style={{ fontSize: 12, color: 'var(--txt)', fontWeight: 600 }}>₹{order?.sub || 0}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontSize: 12, color: 'var(--sub)' }}>Service Fee</span><span style={{ fontSize: 12, color: 'var(--txt)', fontWeight: 600 }}>₹{order?.fee || PREP_FEE}</span></div>
              {order?.dk > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontSize: 12, color: 'var(--grn)' }}>Discount</span><span style={{ fontSize: 12, color: 'var(--grn)', fontWeight: 700 }}>−₹{order.dk}</span></div>}
              <div style={{ borderTop: '2px solid var(--bdr)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Total Paid</span>
                <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{order?.total || 0}</span>
              </div>
            </div>
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--mut)', marginBottom: 4 }}>Payment: {order?.payMethod || 'Online'}</div>
              <div style={{ fontSize: 11, color: 'var(--grn)', fontWeight: 600 }}>✅ Payment Successful</div>
              <div style={{ marginTop: 14, fontSize: 12, color: 'var(--mut)', fontStyle: 'italic' }}>"Cooked with love ❤️ — QuickBite Team"</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, marginBottom: 26 }} className="no-print">
          <button onClick={copy} className="press glass" style={{ flex: 1, padding: '14px', borderRadius: 16, border: '1px solid var(--bdr)', color: copied ? 'var(--grn)' : 'var(--sub)', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>{copied ? '✅ Copied!' : '📋 Copy Receipt'}</button>
          <button onClick={() => window.print()} className="press" style={{ flex: 1, padding: '14px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 22px rgba(255,107,53,.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>🖨️ Print</button>
        </div>
      </div>
    </div>
  );
}
