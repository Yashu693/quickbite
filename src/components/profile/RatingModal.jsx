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
      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 6, textAlign: 'center' }}>
        {isUpdate ? 'Update Your Rating' : 'Rate QuickBite'}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '20px 0' }}>
        {[1,2,3,4,5].map(s => (
          <div 
            key={s} 
            onMouseEnter={() => setHoverStar(s)} 
            onMouseLeave={() => setHoverStar(0)} 
            onClick={() => setStars(s)}
            style={{ 
              fontSize: 38, cursor: 'pointer', transition: 'transform 0.2s',
              transform: (hoverStar || stars) >= s ? 'scale(1.1)' : 'scale(1)',
              filter: (hoverStar || stars) >= s ? 'none' : 'grayscale(100%) opacity(30%)'
            }}
          >⭐</div>
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

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <textarea 
          value={reviewText} onChange={e => setReviewText(e.target.value.slice(0, 500))} 
          placeholder="Tell us what you loved or what we can improve..." 
          rows={4} 
          style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 16, border: '2px solid var(--inpB)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13, resize: 'none' }} 
        />
        <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 10, color: 'var(--mut)', fontWeight: 600 }}>
          {reviewText.length}/500
        </div>
      </div>

      <button disabled={stars === 0 || submitting} onClick={submit} className="press" style={{ 
        width: '100%', padding: '16px', borderRadius: 16, border: 'none', 
        background: stars === 0 ? 'var(--bdr)' : 'linear-gradient(135deg,#FF6B35,#FF3D60)', 
        color: stars === 0 ? 'var(--mut)' : '#fff', fontWeight: 800, fontSize: 14, 
        cursor: stars === 0 ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1
      }}>
        {submitting ? 'Submitting...' : (isUpdate ? 'Update Review 🚀' : 'Submit Review 🚀')}
      </button>
    </>
  );
};
