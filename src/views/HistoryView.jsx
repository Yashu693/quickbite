import { fmtDate } from '../utils/helpers';
import { BottomNav } from '../components/layout/BottomNav';
import { motion } from 'framer-motion';

export default function HistoryView({ orders, go, addToast, setCart, cartCount = 0, onViewTracking }) {


  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const reorder = order => {
    const nc = {};
    order.items.forEach(i => { nc[i.id] = (nc[i.id] || 0) + i.qty; });
    setCart(nc);
    addToast({ icon: '🛒', title: 'Items back in cart!', msg: `${order.items.length} item${order.items.length !== 1 ? 's' : ''} added`, cta: 'VIEW' });
    go('cart');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>
      <div className="glass-hdr" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '38px 16px 14px' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 2 }}>Order History 📋</div>
        <div style={{ fontSize: 12, color: 'var(--sub)' }}>{orders.length} orders · ₹{totalSpent} total spent</div>
      </div>
      <div className="hs" style={{ position: 'absolute', top: 88, bottom: 0, left: 0, right: 0, width: '100%', boxSizing: 'border-box', overflowY: 'auto', padding: '14px 16px 120px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>📭</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--sub)', marginBottom: 8, fontFamily: "'Sora',sans-serif" }}>No orders yet</div>
            <div style={{ fontSize: 13, color: 'var(--mut)', marginBottom: 26 }}>Your order history appears here after your first order!</div>
            <button onClick={() => go('home')} className="press" style={{ padding: '13px 32px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 13.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 22px rgba(255,107,53,.42)' }}>Order Now →</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[[orders.length, 'Orders', '📋'], [`₹${Math.round(totalSpent / Math.max(orders.length, 1))}`, 'Avg Order', '📊'], [orders.filter(o => o.status === 'Delivered').length, 'Delivered', '✅']].map(([v, l, e]) => (
                <div key={l} className="glass" style={{ flex: 1, borderRadius: 16, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>{e}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--acc)', fontFamily: "'Sora',sans-serif" }}>{v}</div>
                  <div style={{ fontSize: 9, color: 'var(--mut)', fontWeight: 600, letterSpacing: .4, textTransform: 'uppercase', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            {orders.map((order, idx) => (
              <motion.div key={order.id} className="lift glass"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: idx * 0.06, ease: [0.25, 1, 0.5, 1] }}
                style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 12 }}
              >
                <div style={{ background: 'linear-gradient(135deg,rgba(255,107,53,.08),rgba(255,61,96,.05))', padding: '12px 16px', borderBottom: '1px solid var(--bdr)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                      {order.id} {order.fulfillment === 'delivery' && <span style={{ background: 'rgba(77,158,255,.15)', color: 'var(--blue)', padding: '2px 6px', borderRadius: 6, fontSize: 10 }}>🛵 Delivery</span>}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--sub)', marginTop: 2 }}>{fmtDate(order.date)} · {order.fulfillment === 'delivery' ? `Delivery to ${order.room || 'Room'}` : `Pickup at ${order.college}`}</div>
                  </div>
                  <div style={{ background: 'rgba(34,197,94,.1)', color: 'var(--grn)', fontSize: 10.5, fontWeight: 700, padding: '4px 11px', borderRadius: 99, border: '1px solid rgba(34,197,94,.2)' }}>✓ {order.status}</div>
                </div>
                <div style={{ padding: '13px 16px' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < order.items.length - 1 ? 9 : 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: item.g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>{item.name}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--mut)' }}>×{item.qty} · ₹{item.price * item.qty}</div>
                      </div>
                    </div>
                  ))}
                  <div className="glass" style={{ borderRadius: 12, padding: '9px 13px', margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--sub)' }}>
                      {order.dk > 0 && <span style={{ color: 'var(--grn)', fontWeight: 700 }}>Saved ₹{order.dk} · </span>}
                      Token {order.token}
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--acc)', fontFamily: "'Sora',sans-serif" }}>₹{order.total}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 9 }}>
                    <button onClick={() => onViewTracking?.(order)} className="press glass" style={{ flex: 1, padding: '10px', borderRadius: 13, border: '1px solid var(--bdr)', background: 'transparent', color: 'var(--sub)', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>🎯 Track</button>
                    <button onClick={() => reorder(order)} className="press" style={{ flex: 1, padding: '10px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,53,.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>🔄 Reorder</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}
        <div style={{ height: 8 }} />
      </div>
      <BottomNav view="history" go={go} cartCount={cartCount} />
    </div>
  );
}
