import { useState } from 'react';
import { COUPONS, PREP_FEE } from '../data/constants';
import { resolveFoodItem } from '../utils/helpers';
import { BottomNav } from '../components/layout/BottomNav';
import { SwipeToPay } from '../components/payment/SwipeToPay';
import { usePreventExit } from '../hooks';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartView({ user, college, cart, setCart, addToast, go, onGoToPay }) {
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [disc, setDisc] = useState(0);
  const [showOffers, setShowOffers] = useState(false);
  const [fulfillment, setFulfillment] = useState('pickup');
  const [room, setRoom] = useState('');
  const [phone, setPhone] = useState('');

  usePreventExit('/home');

  const items = Object.entries(cart).map(([id, qty]) => { const f = resolveFoodItem(id); return f ? { ...f, qty } : null; }).filter(Boolean);
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  const dk = Math.round(sub * (disc / 100));
  const deliveryFee = fulfillment === 'delivery' ? 10 : 0;
  const total = sub + PREP_FEE + deliveryFee - dk;
  const totalItems = items.reduce((a, b) => a + b.qty, 0);

  const inc = id => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const dec = id => setCart(p => { const n = { ...p }; n[id] = (n[id] || 1) - 1; if (n[id] <= 0) delete n[id]; return n; });

  const applyCoupon = (codeToApply = coupon) => {
    const c = codeToApply.trim().toUpperCase();
    setCoupon(c);
    if (COUPONS[c] !== undefined) {
      setDisc(COUPONS[c]);
      setCouponMsg(COUPONS[c] > 0 ? `✅ ${COUPONS[c]}% off applied — you save ₹${Math.round(sub * (COUPONS[c] / 100))}` : '✅ Free dessert added! 🎂');
      addToast({ icon: '🏷️', title: 'Coupon applied!', msg: COUPONS[c] > 0 ? `Saved ₹${Math.round(sub * (COUPONS[c] / 100))}` : 'Free dessert incoming 🎂', cta: '🎉' });
      return true;
    } else {
      setCouponMsg('❌ Invalid code. Try COLLEGE20 or QUICK10'); setDisc(0);
      return false;
    }
  };

  if (items.length === 0) return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
      <div style={{ fontSize: 72, marginBottom: 18 }}>🛒</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 8 }}>Cart is empty</div>
      <div style={{ fontSize: 14, color: 'var(--mut)', textAlign: 'center', marginBottom: 28 }}>Add something delicious from the menu!</div>
      <button onClick={() => go('home')} className="press" style={{ padding: '14px 36px', borderRadius: 17, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 28px rgba(255,107,53,.42)' }}>Browse Menu →</button>
      <BottomNav view="cart" go={go} cartCount={0} />
    </div>
  );

  if (showOffers) {
    return (
      <div className="anim-slideLeft" style={{ position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: 100 }}>
        {/* Offers Header */}
        <div className="glass-hdr" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '38px 16px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => go('home')} className="press glass" style={{ width: 40, height: 40, borderRadius: 14, border: '1px solid var(--glassB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--txt)', cursor: 'pointer' }}>🏠</button>
          <button onClick={() => setShowOffers(false)} className="press glass" style={{ width: 40, height: 40, borderRadius: 14, border: '1px solid var(--glassB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--txt)', cursor: 'pointer' }}>←</button>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Offers & Coupons</div>
        </div>
        {/* Offers Content (No BottomNav) */}
        <div className="hs" style={{ position: 'absolute', top: 92, bottom: 0, left: 0, right: 0, overflowY: 'auto', padding: '16px', boxSizing: 'border-box' }}>
          
          <div className="glass anim-fadeUp" style={{ borderRadius: 18, padding: '16px', marginBottom: 20, boxShadow: '0 4px 18px var(--shadow)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', marginBottom: 11, display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'Sora',sans-serif" }}>
              Redeem Code
            </div>
            <div style={{ display: 'flex', gap: 9 }}>
              <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && applyCoupon(coupon)} placeholder="Enter code..."
                style={{ flex: 1, padding: '12px 14px', borderRadius: 13, border: '2px solid var(--inpB)', background: 'var(--inp)', fontSize: 13, color: 'var(--txt)', letterSpacing: 1.2, fontWeight: 700, transition: 'border-color .2s' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = 'var(--inpB)'}
              />
              <button onClick={() => { if (applyCoupon(coupon)) setTimeout(() => setShowOffers(false), 900); }} className="press" style={{ padding: '0 18px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 12.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,53,.38)', whiteSpace: 'nowrap' }}>Apply</button>
            </div>
             {couponMsg && <div className="anim-fadeIn" style={{ marginTop: 12, fontSize: 12, color: disc > 0 ? 'var(--grn)' : '#ef4444', fontWeight: 600, background: disc > 0 ? 'rgba(34,197,94,.07)' : 'rgba(239,68,68,.07)', borderRadius: 10, padding: '9px 12px', border: `1px solid ${disc > 0 ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.2)'}` }}>{couponMsg}</div>}
          </div>

          <div className="anim-fadeUp" style={{ animationDelay: '.06s', fontSize: 14, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 12, paddingLeft: 4 }}>Available Offers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
            {Object.entries(COUPONS).map(([c, val], i) => (
              <div key={c} className="glass anim-fadeUp" style={{ animationDelay: `${.1 + i * .05}s`, borderRadius: 18, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(255,107,53,.15)', border: '1px dashed var(--acc)', color: 'var(--acc)', borderRadius: 8, fontSize: 12, fontWeight: 800, letterSpacing: .5, marginBottom: 8 }}>{c}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--txt)' }}>{val > 0 ? `Get ${val}% OFF` : 'Free Dessert'}</div>
                  <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 2 }}>{val > 0 ? 'Use this coupon to save on your cart.' : 'Includes a free pastry with your meal.'}</div>
                </div>
                <button onClick={() => { if (applyCoupon(c)) setTimeout(() => setShowOffers(false), 900); }} className="press" style={{ padding: '8px 16px', borderRadius: 12, border: '1px solid var(--bdr)', background: 'transparent', color: 'var(--txt)', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}>Apply</button>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>
      {/* Header */}
      <div className="glass-hdr" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '38px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => go('home')} className="press glass" style={{ width: 40, height: 40, borderRadius: 14, border: '1px solid var(--glassB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--txt)', cursor: 'pointer', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9.5, color: 'var(--acc)', fontWeight: 700, letterSpacing: .5, marginBottom: 2 }}>📍 {college?.canteen || 'Campus Canteen'}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Your Cart 🛒</div>
          </div>
          <div className="glass" style={{ fontSize: 11, color: 'var(--sub)', fontWeight: 700, padding: '6px 14px', borderRadius: 99, border: '1px solid var(--bdr)', flexShrink: 0 }}>{totalItems} item{totalItems !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="hs" style={{ position: 'absolute', top: 90, bottom: 0, left: 0, right: 0, width: '100%', boxSizing: 'border-box', overflowY: 'auto', padding: '14px 16px 40px' }}>

        {/* Items card */}
        <div className="glass anim-fadeUp" style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 14, boxShadow: '0 8px 32px var(--shadow)' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--bdr)', display: 'flex', gap: 7, alignItems: 'center' }}>
            <span style={{ fontSize: 16 }}>🛒</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Order Items</span>
          </div>
          <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div key={item.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.9, height: 0, padding: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: [0.25, 1, 0.5, 1] }}
              style={{ padding: '13px 16px', borderBottom: i < items.length - 1 ? '1px solid var(--bdr)' : 'none', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--card)' }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 15, background: item.g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>{item.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Sora',sans-serif" }}>{item.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--mut)', marginTop: 1 }}>₹{item.price} × {item.qty}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 3px 12px rgba(255,107,53,.35)', flexShrink: 0 }}>
                <button onClick={() => dec(item.id)} className="press" style={{ background: 'transparent', border: 'none', color: '#fff', width: 40, height: 40, fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => inc(item.id)} className="press" style={{ background: 'transparent', border: 'none', color: '#fff', width: 40, height: 40, fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)', minWidth: 52, textAlign: 'right', flexShrink: 0 }}>₹{item.price * item.qty}</div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {/* Compact Coupon cell */}
        <div onClick={() => setShowOffers(true)} className="glass anim-fadeUp press lift" style={{ animationDelay: '.06s', borderRadius: 18, padding: '16px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 18px var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,61,96,.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1px solid var(--bdr)' }}>🏷️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Apply Coupon</div>
              {disc > 0 ? (
                <div style={{ fontSize: 11.5, color: 'var(--grn)', fontWeight: 700, marginTop: 2 }}>"{coupon}" applied!</div>
              ) : (
                <div style={{ fontSize: 11.5, color: 'var(--mut)', marginTop: 2 }}>View offers & discounts</div>
              )}
            </div>
          </div>
          <div style={{ color: 'var(--acc)', fontWeight: 800, fontSize: 18 }}>›</div>
        </div>

        {/* Fulfillment Method */}
        <div className="glass anim-fadeUp" style={{ animationDelay: '.08s', borderRadius: 18, padding: '16px', marginBottom: 14, boxShadow: '0 4px 18px var(--shadow)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', marginBottom: 14, fontFamily: "'Sora',sans-serif" }}>Fulfillment Option</div>
          
          <div style={{ display: 'flex', gap: 8, background: 'var(--inp)', padding: 6, borderRadius: 14, marginBottom: fulfillment === 'delivery' ? 16 : 0 }}>
            <button onClick={() => setFulfillment('pickup')} className={fulfillment === 'pickup' ? 'press lift' : 'press'} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: fulfillment === 'pickup' ? 'var(--surface)' : 'transparent', color: fulfillment === 'pickup' ? 'var(--txt)' : 'var(--sub)', fontWeight: 800, fontSize: 13, transition: 'all .2s', boxShadow: fulfillment === 'pickup' ? '0 2px 8px var(--shadow)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              🏪 Pickup
            </button>
            <button onClick={() => setFulfillment('delivery')} className={fulfillment === 'delivery' ? 'press lift' : 'press'} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: fulfillment === 'delivery' ? 'var(--surface)' : 'transparent', color: fulfillment === 'delivery' ? 'var(--txt)' : 'var(--sub)', fontWeight: 800, fontSize: 13, transition: 'all .2s', boxShadow: fulfillment === 'delivery' ? '0 2px 8px var(--shadow)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              🛵 Delivery
            </button>
          </div>

          {fulfillment === 'delivery' && (
            <div className="anim-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={room} onChange={e => setRoom(e.target.value)} placeholder="Hostel Block & Room No. (e.g. B-102)" style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--bdr)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13, outline: 'none' }} />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--bdr)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13, outline: 'none' }} />
            </div>
          )}
        </div>

        {/* Bill */}
        <div className="glass anim-fadeUp" style={{ animationDelay: '.1s', borderRadius: 18, padding: '16px', marginBottom: 14, boxShadow: '0 4px 18px var(--shadow)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'Sora',sans-serif" }}>
            <span style={{ fontSize: 16 }}>🧾</span> Bill Details
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
            <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>Item Total</span>
            <span style={{ fontSize: 12.5, color: 'var(--txt)', fontWeight: 600 }}>₹{sub}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
            <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>Canteen Prep Fee</span>
            <span style={{ fontSize: 12.5, color: 'var(--txt)', fontWeight: 600 }}>₹{PREP_FEE}</span>
          </div>
          {deliveryFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
              <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>Delivery Fee</span>
              <span style={{ fontSize: 12.5, color: 'var(--txt)', fontWeight: 600 }}>₹{deliveryFee}</span>
            </div>
          )}
          {dk > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
              <span style={{ fontSize: 12.5, color: 'var(--grn)' }}>Discount Applied</span>
              <span style={{ fontSize: 12.5, color: 'var(--grn)', fontWeight: 700 }}>−₹{dk}</span>
            </div>
          )}
          <div style={{ height: 1, background: 'var(--bdr)', marginBottom: 13 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Total Payable</span>
            <span style={{ fontSize: 21, fontWeight: 900, background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Sora',sans-serif" }}>₹{total}</span>
          </div>
        </div>

        {/* Savings note */}
        <div className="anim-fadeUp" style={{ animationDelay: '.14s', background: 'rgba(34,197,94,.07)', border: '1px solid rgba(34,197,94,.18)', borderRadius: 15, padding: '12px 15px', display: 'flex', gap: 11, alignItems: 'center', marginBottom: 18 }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: 'rgba(34,197,94,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🎉</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--grn)' }}>No hidden charges!</div>
            <div style={{ fontSize: 10.5, color: 'var(--grn)', marginTop: 1, opacity: .8 }}>All taxes included · {fulfillment === 'delivery' ? 'Direct to your room' : 'Free canteen pickup'}</div>
          </div>
        </div>

        {/* Swipe to pay */}
        <div className="anim-fadeUp" style={{ animationDelay: '.16s', marginBottom: 14 }}>
          {fulfillment === 'delivery' && (room.trim().length === 0 || phone.trim().length === 0) ? (
            <button className="press" disabled style={{ width: '100%', padding: '16px', borderRadius: 18, border: 'none', background: 'var(--bdr)', color: 'var(--mut)', fontWeight: 800, fontSize: 16 }}>Enter Delivery Form First</button>
          ) : (
            <SwipeToPay total={total} onPay={() => onGoToPay({ items, sub, fee: PREP_FEE, dk, deliveryFee, total, fulfillment, room, phone })} />
          )}
        </div>

      </div>
    </div>
  );
}
