import { useState, useEffect } from 'react';
import { submitReview, getUserReview } from '../../services/reviewService';

const CATEGORIES = ['Food Quality', 'Delivery Speed', 'App Experience', 'Value for Money'];

export const RatingModal = ({ user, close, addToast }) => {
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedCats, setSelectedCats] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    getUserReview(user.uid)
      .then((existing) => {
        if (existing) {
          setStars(existing.stars);
          setSelectedCats(existing.categories || []);
          setReviewText(existing.reviewText || '');
          setIsUpdate(true);
        }
      })
      .catch((err) => {
        console.warn('Could not load previous review:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const toggleCat = (c) => {
    setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const submit = async () => {
    if (!user?.uid || stars === 0) return;
    setSubmitting(true);
    try {
      await submitReview(user.uid, {
        displayName: user.name || 'Anonymous',
        photoURL: user.photoURL || null,
        stars,
        categories: selectedCats,
        reviewText
      });
      setSuccess(true);
    } catch (error) {
      console.error("Full error:", error.code, error.message, error);
      toast({ icon: '❌', title: 'Error', msg: error.message || 'Failed to submit review' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your previous review... ⏳</div>;

  if (success) return (
    <div className="anim-popIn" style={{ textAlign: 'center', padding: '30px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', marginBottom: 6 }}>Review {isUpdate ? 'Updated' : 'Submitted'}!</div>
      <div style={{ fontSize: 13, color: 'var(--sub)' }}>Thank you for your valuable feedback!</div>
      <button onClick={close} className="press" style={{ marginTop: 24, padding: '14px 30px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Close</button>
    </div>
  );

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div className="anim-popIn" style={{ fontSize: 52, marginBottom: 8, display: 'inline-block', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }}>
          {stars === 5 ? '🤩' : stars === 4 ? '😊' : stars === 3 ? '😐' : stars === 2 ? '😕' : stars === 1 ? '😞' : '⭐'}
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 4 }}>
          {isUpdate ? 'Update Your Rating' : 'How was your food?'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--sub)' }}>Your feedback helps us improve your canteen!</div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '24px 0 28px' }}>
        {[1,2,3,4,5].map(s => (
          <div 
            key={s} 
            onMouseEnter={() => setHoverStar(s)} 
            onMouseLeave={() => setHoverStar(0)} 
            onClick={() => setStars(s)}
            style={{ 
              fontSize: 42, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: (hoverStar || stars) === s ? 'scale(1.25) translateY(-4px)' : (hoverStar || stars) > s ? 'scale(1.1)' : 'scale(1)',
              filter: (hoverStar || stars) >= s ? 'drop-shadow(0 4px 12px rgba(255,165,0,0.4))' : 'grayscale(100%) opacity(20%)'
            }}
          >⭐️</div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
        {CATEGORIES.map(c => {
          const active = selectedCats.includes(c);
          return (
            <div key={c} onClick={() => toggleCat(c)} className="press" style={{
              padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: active ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--bdr)',
              color: active ? '#fff' : 'var(--txt)', border: `1px solid ${active ? 'transparent' : 'var(--glassB)'}`
            }}>{c}</div>
          );
        })}
      </div>

      <div className="anim-fadeUp" style={{ position: 'relative', marginBottom: 20 }}>
        <textarea 
          value={reviewText} onChange={e => setReviewText(e.target.value.slice(0, 500))} 
          placeholder={stars >= 4 ? "Tell us what you loved! (Optional)" : "How can we improve? (Optional)"} 
          rows={3} 
          style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: 20, border: '1px solid var(--bdr)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13, resize: 'none', transition: 'all .3s', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = '#FF6B35'; e.target.style.background = 'var(--surface)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--bdr)'; e.target.style.background = 'var(--inp)'; }}
        />
        <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 10, color: 'var(--mut)', fontWeight: 700 }}>
          {reviewText.length}/500
        </div>
      </div>

      <button disabled={stars === 0 || submitting} onClick={submit} className={stars === 0 ? "" : "press"} style={{ 
        width: '100%', padding: '16px', borderRadius: 18, border: 'none', 
        background: stars === 0 ? 'var(--bdr)' : 'linear-gradient(135deg,#FF6B35,#FF3D60)', 
        color: stars === 0 ? 'var(--mut)' : '#fff', fontWeight: 800, fontSize: 15, 
        cursor: stars === 0 ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
        boxShadow: stars === 0 ? 'none' : '0 8px 24px rgba(255,107,53,0.3)'
      }}>
        {submitting ? 'Submitting...' : (isUpdate ? 'Update Review 🚀' : 'Submit Feedback 🚀')}
      </button>
    </>
  );
};
