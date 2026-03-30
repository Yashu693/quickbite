import { useState } from 'react';
import { changeUserPassword } from '../../services/userService';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db, doc, updateDoc } from '../../firebase';
import { fmtDate } from '../../utils/helpers';

export const PrivacySecurity = ({ user, close, addToast, onLogout }) => {
  const [view, setView] = useState('main'); // main, password, delete
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  // Metadata from Auth
  const creationTime = auth.currentUser?.metadata?.creationTime;
  const lastSignInTime = auth.currentUser?.metadata?.lastSignInTime;

  // Password validation
  const pwdValid = newPwd.length >= 6;
  const pwdMatch = newPwd === confirmPwd && confirmPwd.length > 0;

  const handlePasswordChange = async () => {
    if (!currentPwd || !newPwd || newPwd.length < 6) {
      toast({ icon: '⚠️', title: 'Invalid', msg: 'Please provide valid passwords. New password min 6 chars.' });
      return;
    }
    if (newPwd !== confirmPwd) {
      toast({ icon: '⚠️', title: 'Mismatch', msg: 'New password and confirmation do not match.' });
      return;
    }
    setLoading(true);
    try {
      await changeUserPassword(currentPwd, newPwd);
      toast({ icon: '✅', title: 'Success', msg: 'Password updated successfully!' });
      setView('main');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (e) {
      console.error('Password change error:', e);
      const msg = e.code === 'auth/wrong-password' 
        ? 'Incorrect current password.' 
        : e.code === 'auth/weak-password'
        ? 'Password is too weak. Use at least 6 characters.'
        : 'Failed to update password. Please try again.';
      toast({ icon: '❌', title: 'Error', msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentPwd) {
      toast({ icon: '⚠️', title: 'Required', msg: 'Need current password to confirm deletion.' });
      return;
    }
    
    const confirmed = window.confirm('⚠️ FINAL WARNING: This will permanently delete your account and all associated data. This cannot be undone. Are you absolutely sure?');
    if (!confirmed) return;

    setLoading(true);
    try {
      const u = auth.currentUser;
      const credential = EmailAuthProvider.credential(u.email, currentPwd);
      await reauthenticateWithCredential(u, credential);
      
      // Flag Firestore doc as deleted
      try {
        await updateDoc(doc(db, 'users', u.uid), { accountDeleted: true, deletedAt: new Date() });
      } catch (e) {
        console.warn('Could not mark user doc as deleted:', e);
      }
      
      await deleteUser(u);
      toast({ icon: '👋', title: 'Goodbye', msg: 'Your account has been deleted.' });
      close();
      onLogout();
    } catch (e) {
      console.error('Delete account error:', e);
      const msg = e.code === 'auth/wrong-password'
        ? 'Incorrect password. Please try again.'
        : 'Failed to delete account. Please verify your password.';
      toast({ icon: '❌', title: 'Error', msg });
      setLoading(false);
    }
  };

  const dummy2FA = () => {
    toast({ icon: '🔒', title: 'Coming Soon', msg: 'Two-Factor Authentication will be available in the next update!' });
  };

  if (view === 'password') {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <button onClick={() => { setView('main'); setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); }} className="press" style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid var(--bdr)', background: 'var(--inp)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Change Password</div>
        </div>

        <div style={{ marginBottom: 12, position: 'relative' }}>
          <input type={showCurrent ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Current Password" style={{ width: '100%', boxSizing: 'border-box', padding: '14px 44px 14px 14px', borderRadius: 14, border: '2px solid var(--inpB)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13 }} />
          <button onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.5 }}>{showCurrent ? '🙈' : '👁️'}</button>
        </div>

        <div style={{ marginBottom: 12, position: 'relative' }}>
          <input type={showNew ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="New Password (min 6 chars)" style={{ width: '100%', boxSizing: 'border-box', padding: '14px 44px 14px 14px', borderRadius: 14, border: `2px solid ${newPwd.length > 0 ? (pwdValid ? '#22c55e' : '#ef4444') : 'var(--inpB)'}`, background: 'var(--inp)', color: 'var(--txt)', fontSize: 13 }} />
          <button onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.5 }}>{showNew ? '🙈' : '👁️'}</button>
        </div>
        {newPwd.length > 0 && (
          <div style={{ fontSize: 11, color: pwdValid ? '#22c55e' : '#ef4444', fontWeight: 600, marginTop: -8, marginBottom: 8, paddingLeft: 4 }}>
            {pwdValid ? '✓ Password strength OK' : `✗ ${6 - newPwd.length} more characters needed`}
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Confirm New Password" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 14, border: `2px solid ${confirmPwd.length > 0 ? (pwdMatch ? '#22c55e' : '#ef4444') : 'var(--inpB)'}`, background: 'var(--inp)', color: 'var(--txt)', fontSize: 13 }} />
          {confirmPwd.length > 0 && !pwdMatch && (
            <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginTop: 4, paddingLeft: 4 }}>✗ Passwords don't match</div>
          )}
        </div>

        <button disabled={loading || !currentPwd || !pwdValid || !pwdMatch} onClick={handlePasswordChange} className="press" style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: currentPwd && pwdValid && pwdMatch && !loading ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--bdr)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: currentPwd && pwdValid && pwdMatch ? 'pointer' : 'not-allowed', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Updating...' : 'Update Password 🔐'}
        </button>
      </>
    );
  }

  if (view === 'delete') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <button onClick={() => { setView('main'); setCurrentPwd(''); }} className="press" style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid var(--bdr)', background: 'var(--inp)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        </div>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧨</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ef4444', fontFamily: "'Sora',sans-serif", marginBottom: 6 }}>Delete Account?</div>
        <div style={{ fontSize: 13, color: 'var(--mut)', marginBottom: 20 }}>This action is permanent. All your data, orders, and addresses will be lost. Re-enter your password to proceed.</div>
        <input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Current Password" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 14, border: '2px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.05)', color: 'var(--txt)', fontSize: 13, marginBottom: 20 }} />
        <button disabled={loading || !currentPwd} onClick={handleDeleteAccount} className="press" style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: currentPwd && !loading ? '#ef4444' : 'var(--bdr)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: currentPwd ? 'pointer' : 'not-allowed', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Deleting...' : 'Permanent Delete 🚨'}
        </button>
      </div>
    );
  }

  // MAIN VIEW
  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 16 }}>🛡️ Privacy & Security</div>
      <div className="glass" style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--bdr)', marginBottom: 20 }}>
        <div onClick={() => setView('password')} className="press" style={{ padding: '14px 16px', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 18 }}>🔑</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)' }}>Change Password</div>
          </div>
          <div style={{ color: 'var(--sub)' }}>›</div>
        </div>
        <div onClick={dummy2FA} className="press" style={{ padding: '14px 16px', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 18 }}>🔒</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)' }}>Two-Factor Auth (2FA)</div>
          </div>
          <div style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(255,107,53,.1)', color: 'var(--acc)', fontSize: 9, fontWeight: 800 }}>SOON</div>
        </div>
        <div onClick={() => setView('delete')} className="press" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 18 }}>🗑️</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#ef4444' }}>Delete Account</div>
          </div>
          <div style={{ color: '#ef4444' }}>›</div>
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Session Metadata</div>
      <div className="glass" style={{ borderRadius: 16, padding: '14px 16px', border: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--sub)' }}>Member Since</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)' }}>{creationTime ? fmtDate(new Date(creationTime)) : 'Unknown'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--sub)' }}>Last Sign-in</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)' }}>{lastSignInTime ? fmtDate(new Date(lastSignInTime)) : 'Current Session'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--sub)' }}>Auth Provider</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)' }}>{auth.currentUser?.providerData?.[0]?.providerId === 'password' ? 'Email / Password' : auth.currentUser?.providerData?.[0]?.providerId || 'Unknown'}</span>
        </div>
      </div>
      
      <button onClick={close} className="press" style={{ width: '100%', marginTop: 20, padding: '14px', borderRadius: 16, border: '1px solid var(--bdr)', background: 'transparent', color: 'var(--sub)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Close</button>
    </>
  );
};
