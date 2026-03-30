import { fmtDate } from '../../utils/helpers';

export const RecentOrders = ({ orders, go, close }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>📦 Recent Orders</div>
        <button onClick={() => { close(); go('history'); }} className="press" style={{ padding: '6px 12px', borderRadius: 10, background: 'transparent', color: 'var(--acc)', fontWeight: 800, fontSize: 12, border: '1px solid rgba(255,107,53,.3)', cursor: 'pointer' }}>Full History</button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, filter: 'grayscale(1)', opacity: 0.5, marginBottom: 10 }}>🍲</div>
          <div style={{ fontSize: 13, color: 'var(--sub)' }}>You haven't ordered anything yet.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {orders.slice(0, 3).map(order => (
            <div key={order.id} className="glass" style={{ padding: '14px', borderRadius: 16, border: '1px solid var(--bdr)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)' }}>{order.canteen}</div>
                <div style={{ fontSize: 11, color: 'var(--mut)', fontWeight: 600 }}>{fmtDate(new Date(order.date))}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {order.items.slice(0, 4).map((item, j) => (
                  <div key={j} style={{ padding: '4px 8px', borderRadius: 6, background: 'var(--inp)', fontSize: 11, color: 'var(--sub)', fontWeight: 600 }}>{item.qty}x {item.emoji} {item.name.split(' ')[0]}</div>
                ))}
                {order.items.length > 4 && <div style={{ fontSize: 11, color: 'var(--mut)', padding: '4px' }}>+{order.items.length - 4} more</div>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--bdr)', paddingTop: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--acc)', fontFamily: "'Sora',sans-serif" }}>₹{order.total}</div>
                <button onClick={() => { close(); go('home'); }} className="press" style={{ padding: '6px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer' }}>Reorder</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button onClick={close} className="press" style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: 'var(--inp)', color: 'var(--txt)', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Close</button>
    </>
  );
};
