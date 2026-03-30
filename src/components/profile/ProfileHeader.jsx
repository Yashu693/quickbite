import { useState, useRef, useEffect } from 'react';
import { AVATAR_GRAD } from '../../data/constants';
import { uploadProfilePhoto } from '../../services/storageService';
import { updateUserProfile } from '../../services/userService';
import { auth, db, doc, onSnapshot } from '../../firebase';

export const ProfileHeader = ({ user, college, onChangeCollege, go, addToast }) => {
  const avatarBg = AVATAR_GRAD[(user?.avatar || 0) % AVATAR_GRAD.length];
  const fileInputRef = useRef(null);

  const [loadingPic, setLoadingPic] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
  
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || 'Student');
  
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(user?.phoneNumber || '+91 ');

  // Live stats from Firestore
  const [stats, setStats] = useState({ orders: 0, addresses: 0, points: 0 });

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setStats({
            orders: d.totalOrders || 0,
            addresses: d.addressesCount || 0,
            points: d.loyaltyPoints || 0
          });
          if (d.photoURL) setPhotoURL(d.photoURL);
          if (d.displayName) setName(d.displayName);
          if (d.phoneNumber) setPhone(d.phoneNumber);
        }
      },
      (error) => {
        console.warn('Profile header listener error:', error);
      }
    );
    return () => unsub();
  }, [user?.uid]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.uid) return;
    setLoadingPic(true);
    try {
      const url = await uploadProfilePhoto(user.uid, file);
      await updateUserProfile(user.uid, { photoURL: url });
      setPhotoURL(url);
      toast({ icon: '📸', title: 'Success', msg: 'Profile photo updated' });
    } catch (err) {
      console.error('Photo upload error:', err);
      toast({ icon: '❌', title: 'Error', msg: 'Failed to upload photo' });
    } finally {
      setLoadingPic(false);
    }
  };

  const saveName = async () => {
    setEditingName(false);
    if (!user?.uid || name.trim() === '') return;
    try {
      await updateUserProfile(user.uid, { displayName: name });
      toast({ icon: '✅', title: 'Saved', msg: 'Name updated' });
    } catch(e) {
      toast({ icon: '❌', title: 'Error', msg: 'Failed to save name' });
    }
  };

  const savePhone = async () => {
    setEditingPhone(false);
    if (!user?.uid || phone.trim() === '') return;
    try {
      await updateUserProfile(user.uid, { phoneNumber: phone });
      toast({ icon: '✅', title: 'Saved', msg: 'Phone updated' });
    } catch(e) {
      toast({ icon: '❌', title: 'Error', msg: 'Failed to save phone' });
    }
  };

  return (
    <>
      <div className="anim-fadeUp glass" style={{ borderRadius: 26, overflow: 'hidden', marginBottom: 14, boxShadow: '0 8px 36px var(--shadow)' }}>
        <div style={{ background: 'linear-gradient(160deg,rgba(255,107,53,.14),rgba(255,61,96,.08))', padding: '28px 20px 22px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: .05, fontSize: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>👤</div>
          <div style={{ position: 'relative' }}>
            
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handlePhotoUpload} />
            <div onClick={() => fileInputRef.current.click()} className="anim-popIn" style={{ width: 76, height: 76, borderRadius: 24, background: photoURL ? `url(${photoURL}) center/cover` : avatarBg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,.25)', marginBottom: 12, cursor: 'pointer', position: 'relative', opacity: loadingPic ? 0.5 : 1 }}>
              {!photoURL && name[0]}
              {loadingPic && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏳</div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {editingName ? (
                <input autoFocus value={name} onChange={e => setName(e.target.value)} onBlur={saveName} onKeyDown={e => e.key === 'Enter' && saveName()} style={{ fontSize: 21, fontWeight: 900, color: 'var(--txt)', background: 'var(--inp)', border: '1px solid var(--bdr)', borderRadius: 8, textAlign: 'center', width: 140 }} />
              ) : (
                <div style={{ fontSize: 21, fontWeight: 900, color: 'var(--txt)' }}>{name}</div>
              )}
              <div onClick={() => setEditingName(true)} style={{ cursor: 'pointer', opacity: 0.5 }}>✏️</div>
            </div>
            
            <div style={{ fontSize: 12, color: 'var(--sub)' }}>{user?.email}</div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 11 }}>
              {editingPhone ? (
                <input autoFocus value={phone} onChange={e => setPhone(e.target.value)} onBlur={savePhone} onKeyDown={e => e.key === 'Enter' && savePhone()} style={{ fontSize: 12, color: 'var(--sub)', background: 'var(--inp)', border: '1px solid var(--bdr)', borderRadius: 8, textAlign: 'center', width: 120 }} />
              ) : (
                <div style={{ fontSize: 12, color: 'var(--sub)' }}>{phone}</div>
              )}
              <div onClick={() => setEditingPhone(true)} style={{ cursor: 'pointer', opacity: 0.5, fontSize: 12 }}>✏️</div>
            </div>

          </div>
        </div>
        <div style={{ padding: '13px 20px', borderTop: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ fontSize: 22 }}>{college?.emoji || '🏫'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--txt)' }}>{college?.canteen || 'Campus Canteen'}</div>
          </div>
          <button onClick={onChangeCollege} className="press glass" style={{ padding: '6px 13px', borderRadius: 10, border: '1px solid var(--bdr)', color: 'var(--sub)', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', background: 'transparent' }}>Change</button>
        </div>
      </div>

      <div className="anim-fadeUp" style={{ animationDelay: '.06s', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          [stats.orders, 'Orders', '📋'], 
          [stats.addresses, 'Addresses', '📍'], 
          [`${stats.points}pts`, 'Points', '⭐']
        ].map(([v, l, e]) => (
          <div key={l} onClick={() => l === 'Orders' && go('history')} className="press glass" style={{ borderRadius: 18, padding: '16px 10px', textAlign: 'center', cursor: l === 'Orders' ? 'pointer' : 'default' }}>
            <div style={{ fontSize: 20, marginBottom: 5 }}>{e}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--acc)', lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 9.5, color: 'var(--mut)', fontWeight: 600, letterSpacing: .4, textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
    </>
  );
};
