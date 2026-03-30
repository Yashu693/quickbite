import { useState, useEffect } from 'react';
import { db, collectionGroup, query, orderBy, onSnapshot, updateDoc, doc } from '../firebase.js';

export default function AdminDashboardView({ go }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collectionGroup(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map(docSnap => {
        const userId = docSnap.ref.parent.parent?.id || 'unknown';
        return { id: docSnap.id, userId, ...docSnap.data() };
      });
      setOrders(liveOrders);
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (userId, orderId, currentStatus) => {
    const stages = ['pending', 'preparing', 'ready', 'delivered'];
    const currentIndex = stages.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === stages.length - 1) return;
    const nextStatus = stages[currentIndex + 1];
    try {
      await updateDoc(doc(db, 'users', userId, 'orders', orderId), { status: nextStatus });
    } catch (e) { alert("Error updating status. Ensure you are an Admin."); }
  };

  const statusColor = (s) => ({ 'pending': '#fbbf24', 'preparing': '#3b82f6', 'ready': '#22c55e', 'delivered': '#9ca3af' }[s] || '#000');

  return (
    <div className="hs" style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass)', padding: '20px', borderBottom: '1px solid var(--bdr)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 15 }}>
        <button onClick={() => go('profile')} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--txt)' }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Canteen Orders</div>
      </div>
      <div style={{ padding: 20, paddingBottom: 100 }}>
        {loading ? <div style={{ textAlign: 'center', padding: '40px', color: 'var(--mut)' }}>Loading Live Orders...</div> :
          orders.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: 'var(--mut)' }}>No active orders found.</div> :
          orders.map(o => (
            <div key={o.id} className="anim-fadeUp" style={{ background: 'var(--card)', borderRadius: 16, border: '1px solid var(--bdr)', padding: 16, marginBottom: 14, boxShadow: '0 4px 14px var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--txt)' }}>#{o.id.slice(-6).toUpperCase()}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: statusColor(o.status), padding: '4px 8px', borderRadius: 8, textTransform: 'uppercase' }}>{o.status}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 10 }}>📍 {o.college} · 👤 {o.userId}</div>
              <div style={{ borderTop: '1px solid var(--bdr)', borderBottom: '1px solid var(--bdr)', padding: '8px 0', margin: '8px 0', fontSize: 13, color: 'var(--txt)' }}>
                {o.items?.map((it, i) => <div key={i} style={{ marginBottom: 4 }}>• {it.qty}x {it.name} (₹{it.price})</div>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--acc)' }}>Total: ₹{o.totalPrice}</span>
                {o.status !== 'delivered' && (
                  <button onClick={() => handleUpdateStatus(o.userId, o.id, o.status)} className="press" style={{ background: '#111827', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>Next Stage →</button>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
