import { useState } from 'react';
import { submitFeedback } from '../../services/feedbackService';

const TYPES = [
  { id: 'bug', label: '🐛 Bug Report' },
  { id: 'feature', label: '✨ Feature Request' },
  { id: 'compliment', label: '👏 Compliment' },
  { id: 'other', label: '💬 Other' }
];

const LOCATIONS = [
  { id: 'home', label: '🏠 Home / Menu' },
  { id: 'cart', label: '🛒 Cart / Checkout' },
  { id: 'profile', label: '👤 Profile Settings' },
  { id: 'orders', label: '📦 Orders / Tracking' },
  { id: 'other', label: '🌐 Other' }
];

export const FeedbackModal = ({ user, close, addToast }) => {
  const [type, setType] = useState('bug');
  const [location, setLocation] = useState('home');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  const isValid = subject.trim() !== '' && desc.trim().length > 0;

  const submit = async () => {
    if (!user?.uid || !isValid || submitting) return;
    setSubmitting(true);
    try {
      await submitFeedback(user.uid, {
        displayName: user.name || 'Anonymous',
        email: user.email || 'No email',
        type,
        location,
        subject,
        description: desc
      });
      setSuccess(true);
    } catch (error) {
      console.error("Full error:", error.code, error.message, error);
      toast({ icon: '❌', title: 'Error', msg: error.message || 'Failed to send feedback. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return (
    <div className="anim-popIn" style={{ textAlign: 'center', padding: '30px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🙏</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', marginBottom: 6 }}>Feedback Sent!</div>
      <div style={{ fontSize: 13, color: 'var(--sub)' }}>We'll get back to you soon.</div>
      <button onClick={close} className="press" style={{ marginTop: 24, padding: '14px 30px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Close</button>
    </div>
  );

  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 16 }}>💬 Send Feedback</div>
      
      <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 10, marginBottom: 10, WebkitOverflowScrolling: 'touch' }}>
        {TYPES.map(t => (
          <div key={t.id} onClick={() => setType(t.id)} className="press" style={{
            padding: '8px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            background: type === t.id ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--inp)',
            color: type === t.id ? '#fff' : 'var(--txt)', border: `1px solid ${type === t.id ? 'transparent' : 'var(--bdr)'}`
          }}>{t.label}</div>
        ))}
      </div>

      <input 
        value={subject} onChange={e => setSubject(e.target.value)}
        placeholder="Subject (Required)"
        style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 14, border: '2px solid var(--inpB)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13, marginBottom: 12 }}
      />

      <div style={{ position: 'relative', marginBottom: 12 }}>
        <textarea 
          value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Please describe your feedback..."
          rows={5}
          style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 14, border: '2px solid var(--inpB)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13, resize: 'none' }}
        />
        <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 10, color: desc.length > 0 ? '#22c55e' : 'var(--mut)', fontWeight: 600 }}>
          {desc.length} chars
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', marginBottom: 8, marginTop: 4 }}>Where did you experience this?</div>
      <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 10, marginBottom: 20, WebkitOverflowScrolling: 'touch' }}>
        {LOCATIONS.map(loc => (
          <div key={loc.id} onClick={() => setLocation(loc.id)} className="press" style={{
            padding: '8px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            background: location === loc.id ? 'var(--txt)' : 'var(--inp)',
            color: location === loc.id ? 'var(--bg)' : 'var(--txt)', border: `1px solid ${location === loc.id ? 'transparent' : 'var(--bdr)'}`
          }}>{loc.label}</div>
        ))}
      </div>

      <button disabled={!isValid || submitting} onClick={submit} className="press" style={{ 
        width: '100%', padding: '16px', borderRadius: 16, border: 'none', 
        background: isValid ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--bdr)', 
        color: isValid ? '#fff' : 'var(--mut)', fontWeight: 800, fontSize: 14, 
        cursor: isValid ? 'pointer' : 'not-allowed', opacity: submitting ? 0.7 : 1
      }}>
        {submitting ? 'Sending...' : 'Send Feedback 🚀'}
      </button>
    </>
  );
};
