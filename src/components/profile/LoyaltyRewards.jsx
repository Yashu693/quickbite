import { useState, useEffect } from 'react';
import { db, doc, onSnapshot, setDoc } from '../../firebase';

const REWARDS = [
  { id: 'free_delivery', label: 'Free Campus Delivery', cost: 50, icon: '🚚' },
  { id: 'ten_percent', label: '10% off any Canteen', cost: 150, icon: '🏷️' },
  { id: 'free_coffee', label: 'Free Cold Coffee', cost: 300, icon: '☕' },
];

export const LoyaltyRewards = ({ user, close, addToast }) => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [redeemed, setRedeemed] = useState([]); // Track redeemed rewards for this session

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    const unsub = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setPoints(data.loyaltyPoints || 0);
          setRedeemed(data.redeemedRewards || []);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Loyalty listener error:', error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  // Determine tiers
  let tierName = 'Bronze';
  let nextTier = 'Silver';
  let target = 200;
  let icon = '🥉';
  let tierColor = '#cd7f32';

  if (points >= 1000) { tierName = 'Platinum'; nextTier = 'Maxed'; target = points; icon = '💎'; tierColor = '#e5e4e2'; }
  else if (points >= 500) { tierName = 'Gold'; nextTier = 'Platinum'; target = 1000; icon = '🥇'; tierColor = '#ffd700'; }
  else if (points >= 200) { tierName = 'Silver'; nextTier = 'Gold'; target = 500; icon = '🥈'; tierColor = '#c0c0c0'; }

  const prog = Math.min(100, Math.max(0, (points / target) * 100));

  const handleRedeem = async (reward) => {
    if (points < reward.cost || redeeming) return;

    setRedeeming(reward.id);
    try {
      const newPoints = points - reward.cost;
      const newRedeemed = [...redeemed, { id: reward.id, label: reward.label, redeemedAt: new Date().toISOString() }];

      await setDoc(doc(db, 'users', user.uid), {
        loyaltyPoints: newPoints,
        redeemedRewards: newRedeemed
      }, { merge: true });

      toast({ icon: '🎉', title: 'Redeemed!', msg: `${reward.label} has been applied to your account` });
    } catch (e) {
      console.error('Redeem error:', e);
      toast({ icon: '❌', title: 'Error', msg: 'Failed to redeem reward. Try again' });
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading rewards... ⏳</div>;

  return (
    <>
      <div style={{ textAlign: 'center', padding: '10px 0 24px' }}>
        <div style={{ fontSize: 60, marginBottom: -10 }}>{icon}</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{tierName} Tier</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--acc)', fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>{points}</div>
        <div style={{ fontSize: 13, color: 'var(--txt)', fontWeight: 700 }}>Active QuickPoints</div>
      </div>

      <div style={{ background: 'var(--inp)', borderRadius: 16, padding: '16px', border: '1px solid var(--bdr)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: 'var(--sub)', textTransform: 'uppercase', marginBottom: 8 }}>
          <span>Current: {tierName}</span>
          <span>{nextTier !== 'Maxed' ? `Next: ${nextTier}` : 'Max Tier Reached'}</span>
        </div>
        <div style={{ width: '100%', height: 12, borderRadius: 99, background: 'var(--bdr)', overflow: 'hidden' }}>
          <div style={{ width: `${prog}%`, height: '100%', background: `linear-gradient(90deg, #FF6B35, ${tierColor})`, transition: 'width 1s cubic-bezier(0.1, 2, 0.4, 1)' }} />
        </div>
        {nextTier !== 'Maxed' && <div style={{ fontSize: 11, color: 'var(--mut)', textAlign: 'center', marginTop: 10 }}>{target - points} more points to unlock {nextTier}</div>}
      </div>

      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)', marginBottom: 12 }}>Available Rewards</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {REWARDS.map((r) => {
          const canAfford = points >= r.cost;
          const isRedeeming = redeeming === r.id;
          return (
            <div key={r.id} className="press" style={{ padding: '14px', borderRadius: 12, background: 'var(--inp)', border: `1px ${canAfford ? 'solid rgba(255,107,53,.3)' : 'dashed var(--bdr)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: canAfford ? 1 : 0.55 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ fontSize: 22 }}>{r.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--mut)', fontWeight: 700 }}>{r.cost} pts</div>
                </div>
              </div>
              <button
                onClick={() => handleRedeem(r)}
                disabled={!canAfford || isRedeeming}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: canAfford ? 'pointer' : 'not-allowed',
                  background: canAfford ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--bg)',
                  border: canAfford ? 'none' : '1px solid var(--bdr)',
                  color: canAfford ? '#fff' : 'var(--mut)',
                  opacity: isRedeeming ? 0.6 : 1
                }}
              >
                {isRedeeming ? '...' : canAfford ? 'Redeem' : '🔒 Locked'}
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={close} className="press" style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: 'var(--inp)', color: 'var(--txt)', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Close</button>
    </>
  );
};
