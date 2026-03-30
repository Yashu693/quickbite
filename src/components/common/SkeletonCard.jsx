export function SkeletonCard() {
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--bdr)' }}>
      <div className="sk" style={{ height: 130 }} />
      <div style={{ padding: '12px 13px', background: 'var(--card)' }}>
        <div className="sk" style={{ height: 12, borderRadius: 6, width: '60%', marginBottom: 8 }} />
        <div className="sk" style={{ height: 9, borderRadius: 5, width: '86%', marginBottom: 14 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="sk" style={{ height: 9, borderRadius: 5, width: '28%' }} />
          <div className="sk" style={{ height: 30, borderRadius: 11, width: 62 }} />
        </div>
      </div>
    </div>
  );
}
