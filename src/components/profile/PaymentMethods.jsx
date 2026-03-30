import { useState, useEffect } from 'react';
import { db, doc, collection, addDoc, deleteDoc, onSnapshot, setDoc, serverTimestamp } from '../../firebase';

export const PaymentMethods = ({ user, close, addToast }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState('Card');
  const [newCard, setNewCard] = useState('');
  const [newUPI, setNewUPI] = useState('');
  const [saving, setSaving] = useState(false);

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    const unsub = onSnapshot(
      collection(db, 'users', user.uid, 'paymentMethods'),
      (snap) => {
        const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCards(arr);
        setLoading(false);
      },
      (error) => {
        console.warn('Payment methods listener error:', error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const addMethod = async () => {
    if (saving) return;
    if (newType === 'Card' && newCard.length < 4) return;
    if (newType === 'UPI' && !newUPI.includes('@')) return;

    setSaving(true);
    try {
      const data = newType === 'Card'
        ? { type: 'Card', last4: newCard.slice(-4), isDefault: cards.length === 0, createdAt: serverTimestamp() }
        : { type: 'UPI', address: newUPI, isDefault: cards.length === 0, createdAt: serverTimestamp() };

      await addDoc(collection(db, 'users', user.uid, 'paymentMethods'), data);
      setIsAdding(false);
      setNewCard('');
      setNewUPI('');
      toast({ icon: '💳', title: 'Added', msg: 'Payment method linked securely' });
    } catch (e) {
      console.error('Add payment error:', e);
      toast({ icon: '❌', title: 'Error', msg: 'Failed to add payment method' });
    } finally {
      setSaving(false);
    }
  };

  const setDef = async (id) => {
    try {
      for (let c of cards) {
        await setDoc(doc(db, 'users', user.uid, 'paymentMethods', c.id), { isDefault: c.id === id }, { merge: true });
      }
      toast({ icon: '⭐', title: 'Updated', msg: 'Default payment method changed' });
    } catch (e) {
      toast({ icon: '❌', title: 'Error', msg: 'Failed to update default' });
    }
  };

  const remove = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'paymentMethods', id));
      toast({ icon: '🗑️', title: 'Removed', msg: 'Payment method unlinked' });
    } catch (e) {
      toast({ icon: '❌', title: 'Error', msg: 'Failed to remove payment method' });
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading payment methods... ⏳</div>;

  if (isAdding) return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setIsAdding(false)} className="press" style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid var(--bdr)', background: 'var(--inp)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Add Payment Method</div>
      </div>

      {/* Type Selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['Card', 'UPI'].map(t => (
          <div key={t} onClick={() => setNewType(t)} className="press" style={{
            flex: 1, padding: '12px', borderRadius: 14, textAlign: 'center', cursor: 'pointer', fontWeight: 700, fontSize: 13,
            background: newType === t ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--inp)',
            color: newType === t ? '#fff' : 'var(--txt)',
            border: `1px solid ${newType === t ? 'transparent' : 'var(--bdr)'}`
          }}>
            {t === 'Card' ? '💳 Card' : '📱 UPI'}
          </div>
        ))}
      </div>

      {newType === 'Card' ? (
        <div style={{ background: 'var(--inp)', border: '1px dashed var(--bdr)', padding: '20px', borderRadius: 16, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--mut)', marginBottom: 10 }}>Enter card number (last 4 digits saved)</div>
          <input value={newCard} onChange={e => setNewCard(e.target.value.replace(/\D/g, ''))} type="tel" maxLength="16" placeholder="0000 0000 0000 0000" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 14, border: '2px solid var(--inpB)', background: 'var(--card)', color: 'var(--txt)', fontSize: 18, textAlign: 'center', letterSpacing: 2 }} />
        </div>
      ) : (
        <div style={{ background: 'var(--inp)', border: '1px dashed var(--bdr)', padding: '20px', borderRadius: 16, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--mut)', marginBottom: 10 }}>Enter your UPI ID</div>
          <input value={newUPI} onChange={e => setNewUPI(e.target.value)} placeholder="yourname@upi" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 14, border: '2px solid var(--inpB)', background: 'var(--card)', color: 'var(--txt)', fontSize: 15, textAlign: 'center' }} />
        </div>
      )}

      <button onClick={addMethod} disabled={saving || (newType === 'Card' ? newCard.length < 4 : !newUPI.includes('@'))} className="press" style={{
        width: '100%', padding: '15px', borderRadius: 16, border: 'none',
        background: (newType === 'Card' ? newCard.length >= 4 : newUPI.includes('@')) && !saving ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--bdr)',
        color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', opacity: saving ? 0.7 : 1
      }}>
        {saving ? 'Linking...' : 'Link Method Securely 🔒'}
      </button>
    </>
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>💳 Payment Methods</div>
        <button onClick={() => setIsAdding(true)} className="press" style={{ padding: '6px 12px', borderRadius: 10, background: 'rgba(255,107,53,.1)', color: 'var(--acc)', fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer' }}>+ Add</button>
      </div>

      {cards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, filter: 'grayscale(1)', opacity: 0.5, marginBottom: 10 }}>💳</div>
          <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 16 }}>No payment methods saved yet.</div>
          <button onClick={() => setIsAdding(true)} className="press" style={{ padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}>Add Your First Method</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {cards.map(c => (
            <div key={c.id} className="glass" style={{ padding: '14px 16px', borderRadius: 16, border: `1px solid ${c.isDefault ? 'rgba(255,107,53,.4)' : 'var(--bdr)'}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 30, borderRadius: 6, background: 'linear-gradient(135deg,#232526,#414345)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>{c.type}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{c.type === 'UPI' ? c.address : `•••• ${c.last4}`}</div>
              </div>
              {c.isDefault ? (
                <div style={{ fontSize: 18, color: '#facc15' }}>⭐</div>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                   <button onClick={() => setDef(c.id)} className="press" style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--inp)', border: '1px solid var(--bdr)', color: 'var(--txt)', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Set ⭐</button>
                   <button onClick={() => remove(c.id)} className="press" style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>✕</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
