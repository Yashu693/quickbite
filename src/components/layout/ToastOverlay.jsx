export function ToastOverlay({ toasts }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 8999, padding: '0 12px', pointerEvents: 'none' }}>
      {toasts.map((t, i) => (
        <div key={t.id} style={{
          marginTop: i === 0 ? 54 : 6,
          background: 'rgba(6,4,10,.97)', backdropFilter: 'blur(32px) saturate(200%)',
          color: '#fff', borderRadius: 20, padding: '12px 15px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08)',
          border: '1px solid rgba(255,107,53,.22)',
          animation: 'toastSlide .42s cubic-bezier(.34,1.56,.64,1) both',
          pointerEvents: 'auto',
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 13, background: 'linear-gradient(135deg,rgba(255,107,53,.2),rgba(255,61,96,.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: .1, fontFamily: "'Sora',sans-serif" }}>{t.title}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.48)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.msg}</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 99, letterSpacing: .5, flexShrink: 0 }}>{t.cta}</div>
        </div>
      ))}
    </div>
  );
}
