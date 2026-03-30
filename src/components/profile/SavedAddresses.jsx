import { useState, useEffect } from 'react';
import { db, collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from '../../firebase';

export const SavedAddresses = ({ user, close, addToast }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('Dorm Room');
  const [newAddr, setNewAddr] = useState('');
  const [saving, setSaving] = useState(false);

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    const unsub = onSnapshot(
      collection(db, 'users', user.uid, 'addresses'),
      (snap) => {
        const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAddresses(arr);
        setLoading(false);
      },
      (error) => {
        console.warn('Addresses listener error:', error);
        setLoading(false); // Show empty state instead of infinite loading
      }
    );
    return () => unsub();
  }, [user]);

  const addAddress = async () => {
    if (!newAddr.trim() || saving) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'addresses'), {
        label: newLabel,
        address: newAddr,
        isDefault: addresses.length === 0,
        createdAt: serverTimestamp()
      });
      // Update count on user doc
      await setDoc(doc(db, 'users', user.uid), { addressesCount: addresses.length + 1 }, { merge: true });
      setIsAdding(false);
      setNewAddr('');
      toast({ icon: '✅', title: 'Added', msg: 'Address saved successfully' });
    } catch(e) {
      console.error('Add address error:', e);
      toast({ icon: '❌', title: 'Error', msg: 'Failed to save address' });
    } finally {
      setSaving(false);
    }
  };

  const setAsDefault = async (id) => {
    try {
      // Set all to non-default, target to default via batch-style
      for (let a of addresses) {
        await setDoc(doc(db, 'users', user.uid, 'addresses', a.id), { isDefault: a.id === id }, { merge: true });
      }
      toast({ icon: '📍', title: 'Updated', msg: 'Default address changed' });
    } catch(e) {
      toast({ icon: '❌', title: 'Error', msg: 'Failed to update default address' });
    }
  };

  const deleteAddr = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'addresses', id));
      await setDoc(doc(db, 'users', user.uid), { addressesCount: Math.max(0, addresses.length - 1) }, { merge: true });
      toast({ icon: '🗑️', title: 'Deleted', msg: 'Address removed' });
    } catch(e) {
      toast({ icon: '❌', title: 'Error', msg: 'Failed to delete address' });
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading addresses... ⏳</div>;

  if (isAdding) return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setIsAdding(false)} className="press" style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid var(--bdr)', background: 'var(--inp)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Add New Address</div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--mut)', textTransform: 'uppercase', marginBottom: 6 }}>Label</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Dorm Room', 'Library', 'Classroom', 'Other'].map(l => (
            <div key={l} onClick={() => setNewLabel(l)} className="press" style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12, cursor: 'pointer', border: `1px solid ${newLabel === l ? 'transparent' : 'var(--bdr)'}`, background: newLabel === l ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--inp)', color: newLabel === l ? '#fff' : 'var(--txt)', fontWeight: 600 }}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--mut)', textTransform: 'uppercase', marginBottom: 6 }}>Full Address (Room, Building, Landmark)</div>
        <textarea value={newAddr} onChange={e => setNewAddr(e.target.value)} rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 14, border: '2px solid var(--inpB)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13, resize: 'none' }} placeholder="E.g. Room 402, Block A, Engineering Campus" />
      </div>
      <button onClick={addAddress} disabled={!newAddr.trim() || saving} className="press" style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: newAddr.trim() && !saving ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--bdr)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: newAddr.trim() && !saving ? 'pointer' : 'not-allowed', opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Saving...' : 'Save Address'}
      </button>
    </>
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>📍 Saved Addresses</div>
        <button onClick={() => setIsAdding(true)} className="press" style={{ padding: '6px 12px', borderRadius: 10, background: 'rgba(255,107,53,.1)', color: 'var(--acc)', fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer' }}>+ Add</button>
      </div>

      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, filter: 'grayscale(1)', opacity: 0.5, marginBottom: 10 }}>🗺️</div>
          <div style={{ fontSize: 13, color: 'var(--sub)' }}>No addresses saved yet.</div>
          <button onClick={() => setIsAdding(true)} className="press" style={{ marginTop: 16, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}>Add Your First Address</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {addresses.map(a => (
            <div key={a.id} className="glass" style={{ padding: '14px', borderRadius: 16, border: `1px solid ${a.isDefault ? 'rgba(255,107,53,.4)' : 'var(--bdr)'}`, position: 'relative' }}>
              {a.isDefault && <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 800, background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', padding: '3px 8px', borderRadius: 99 }}>Default</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 18 }}>{a.label === 'Dorm Room' ? '🛏️' : a.label === 'Library' ? '📚' : a.label === 'Classroom' ? '🏫' : '📍'}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)' }}>{a.label}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.4, marginBottom: 12, paddingRight: 40 }}>{a.address}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {!a.isDefault && <button onClick={() => setAsDefault(a.id)} className="press" style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'var(--inp)', border: '1px solid var(--bdr)', color: 'var(--txt)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Set Default</button>}
                <button onClick={() => deleteAddr(a.id)} className="press" style={{ flex: a.isDefault ? 1 : 0, minWidth: a.isDefault ? '100%' : 80, padding: '8px', borderRadius: 10, background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
