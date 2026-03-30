import { useState, useEffect } from 'react';
import { db, doc, onSnapshot, setDoc } from '../../firebase';

const NOTIFICATIONS = [
  { id: 'orderUpdates', icon: '📦', label: 'Order Updates', desc: 'Get notified when your food is prepared from canteen.' },
  { id: 'promotions', icon: '🎁', label: 'Promotions & Offers', desc: 'Receive discount codes and special deals.' },
  { id: 'newRestaurants', icon: '🏪', label: 'New Canteens', desc: 'Find out when new vendors join QuickBite.' },
  { id: 'deliveryAlerts', icon: '🏃', label: 'Delivery Alerts', desc: 'Get tracking and delivery updates live.' }
];

export const NotificationSettings = ({ user, close, addToast }) => {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newRestaurants: true,
    deliveryAlerts: true
  });
  const [loading, setLoading] = useState(true);

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    const unsub = onSnapshot(
      doc(db, 'users', user.uid, 'settings', 'notifications'),
      (snap) => {
        if (snap.exists()) {
          setSettings(prev => ({ ...prev, ...snap.data() }));
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Notification settings listener error:', error);
        setLoading(false); // Still show UI with defaults
      }
    );
    return () => unsub();
  }, [user]);

  const toggle = async (id) => {
    const nextVal = !settings[id];
    setSettings(prev => ({ ...prev, [id]: nextVal }));
    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'notifications'), {
        [id]: nextVal
      }, { merge: true });
      toast({ icon: '✅', title: 'Saved', msg: `${NOTIFICATIONS.find(n => n.id === id)?.label} ${nextVal ? 'enabled' : 'disabled'}` });
    } catch (e) {
      // Revert on failure
      setSettings(prev => ({ ...prev, [id]: !nextVal }));
      toast({ icon: '❌', title: 'Error', msg: 'Failed to save setting' });
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading settings... ⏳</div>;

  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 16 }}>🔔 Notification Preferences</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {NOTIFICATIONS.map(n => (
          <div key={n.id} onClick={() => toggle(n.id)} className="press glass" style={{ padding: '14px', borderRadius: 16, border: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--inp)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{n.label}</div>
              <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 2 }}>{n.desc}</div>
            </div>
            <div style={{ width: 42, height: 24, borderRadius: 99, background: settings[n.id] ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--bdr)', position: 'relative', transition: 'background .3s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: settings[n.id] ? 20 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .28s cubic-bezier(.34,1.56,.64,1)', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={close} className="press" style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Done 👍</button>
    </>
  );
};
