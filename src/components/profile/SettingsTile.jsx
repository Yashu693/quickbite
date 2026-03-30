export const SettingsTile = ({ item, isLast }) => {
  return (
    <div onClick={item.action} className="press" style={{ padding: '13px 16px', borderBottom: isLast ? 'none' : '1px solid var(--bdr)', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: item.iconBg ? item.iconBg : 'var(--inp)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, border: '1px solid var(--bdr)' }}>{item.icon}</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--txt)', flex: 1 }}>{item.label}</div>
      {item.chevron && <div style={{ color: 'var(--mut)', fontSize: 20 }}>›</div>}
      {item.toggle && (
        <div style={{ width: 42, height: 24, borderRadius: 99, background: item.on ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--bdr)', position: 'relative', transition: 'background .3s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 3, left: item.on ? 20 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .28s cubic-bezier(.34,1.56,.64,1)', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }} />
        </div>
      )}
    </div>
  );
};
