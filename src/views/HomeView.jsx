import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FOOD, CATS, SORTS, MAX_QTY, AVATAR_GRAD } from '../data/constants';
import { DB, resolveFoodItem } from '../utils/helpers';
import { useDebounce } from '../hooks';
import { QBLogo } from '../components/common/QBLogo';
import { LazyImg } from '../components/common/LazyImg';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { BottomNav } from '../components/layout/BottomNav';
import { FoodCard } from '../components/food/FoodCard';
import { BannerCarousel } from '../components/food/BannerCarousel';

export default function HomeView({ user, college, cart, setCart, addToast, go, dark, toggleDark, skeletonMode, pendingOrder }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Relevance');
  const [showSort, setShowSort] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [dealClaimed, setDealClaimed] = useState(() => DB.get('crazy_deal_claimed') === new Date().toDateString());
  const scrollRef = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const h = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', h, { passive: true });
    return () => el.removeEventListener('scroll', h);
  }, []);

  const addItem = useCallback(item => {
    setCart(p => ({ ...p, [item.id]: Math.min((p[item.id] || 0) + 1, MAX_QTY) }));
    addToast({ icon: item.emoji, title: 'Added to cart!', msg: `${item.name} · ₹${item.price}`, cta: '🛒' });
  }, [setCart, addToast]);

  const incItem = useCallback(item => {
    setCart(p => ({ ...p, [item.id]: Math.min((p[item.id] || 0) + 1, MAX_QTY) }));
  }, [setCart]);

  const decItem = useCallback(item => {
    setCart(p => {
      const next = { ...p };
      next[item.id] = (next[item.id] || 1) - 1;
      if (next[item.id] <= 0) delete next[item.id];
      return next;
    });
  }, [setCart]);

  const getQty = id => cart[id] || 0;

  // ── AI RECOMMENDATIONS: time-aware, excludes items already in cart ──
  const aiRecs = useMemo(() => {
    const h = new Date().getHours();
    const preferDrinks = h >= 14 && h < 17;
    const preferSnacks = h < 11 || h >= 20;
    let pool = FOOD.filter(f => !cart[f.id]);
    if (preferDrinks) pool = pool.filter(f => f.cat === 'Drinks' || f.cat === 'Snacks');
    else if (preferSnacks) pool = pool.filter(f => f.cat === 'Snacks');
    return pool.sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [cart]);

  let filtered = FOOD.filter(f => {
    const mCat = cat === 'All' || f.cat === cat;
    const mS = !debouncedSearch || f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || f.desc.toLowerCase().includes(debouncedSearch.toLowerCase());
    return mCat && mS;
  });
  if (sort === 'Rating ↓') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sort === 'Price ↑') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'Price ↓') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'Fastest') filtered = [...filtered].sort((a, b) => a.time - b.time);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((s, [id, q]) => {
    const f = resolveFoodItem(id); return s + (f ? f.price * q : 0);
  }, 0);
  const hdr = scrollY > 16;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning ☀️' : hour < 17 ? 'Good Afternoon 🌤️' : 'Good Evening 🌙';

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>
      {/* ── HEADER ── */}
      <div className={hdr ? 'glass-hdr' : ''} style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '38px 16px 12px', transition: 'all .3s ease', background: hdr ? 'var(--hdr)' : 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9.5, color: 'var(--acc)', fontWeight: 700, letterSpacing: .5, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>📍</span>{college?.canteen || 'Campus Canteen'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', letterSpacing: -.5, fontFamily: "'Sora',sans-serif" }}>{greeting}, {user?.name?.split(' ')[0]}!</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={toggleDark} className="press glass" style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid var(--glassB)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, backdropFilter: 'blur(16px)' }}>{dark ? '☀️' : '🌙'}</button>
            <div onClick={() => go('profile')} className="press" style={{ width: 36, height: 36, borderRadius: 12, background: AVATAR_GRAD[user?.avatar || 0], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#fff', boxShadow: '0 4px 16px rgba(255,107,53,.42)', cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>{user?.name?.[0] || 'U'}</div>
          </div>
        </div>
      </div>

      {/* ── SCROLL BODY ── */}
      <div ref={scrollRef} className="hs" style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 90, paddingBottom: totalItems > 0 ? 162 : 88 }}>
        <div style={{ padding: '0 14px' }}>

          {/* Banner */}
          <BannerCarousel onToast={addToast} />

          {/* Crazy Deals header strip */}
          {!search && cat === 'All' && !dealClaimed && (
            <div className="anim-fadeUp glass" style={{ borderRadius: 16, padding: '11px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, animationDelay: '.08s' }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, boxShadow: '0 4px 14px rgba(239,68,68,.35)' }}>🔥</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 900, color: '#ef4444', fontFamily: "'Sora',sans-serif" }}>Crazy Deals Active!</div>
                <div style={{ fontSize: 10, color: 'var(--txt)', marginTop: 2, fontWeight: 600 }}>You can grab only this limited deal, grab it quickly! 🏃‍♂️</div>
              </div>
            </div>
          )}

          {/* Search */}
          <div style={{ display: 'flex', gap: 9, marginBottom: 14 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none', zIndex: 1 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search samosa, chai..."
                style={{ width: '100%', padding: '12px 36px 12px 40px', borderRadius: 14, border: '2px solid var(--inpB)', background: 'var(--inp)', fontSize: 13, color: 'var(--txt)', transition: 'border-color .2s,box-shadow .2s' }}
                onFocus={e => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,53,.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--inpB)'; e.target.style.boxShadow = 'none'; }} />
              {search && <button onClick={() => setSearch('')} aria-label="Clear search" style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--mut)', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>✕</button>}
            </div>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button onClick={() => setShowSort(s => !s)} className="press" style={{ height: '100%', padding: '0 14px', borderRadius: 14, border: `2px solid ${showSort ? '#FF6B35' : 'var(--inpB)'}`, background: showSort ? 'rgba(255,107,53,.08)' : 'var(--glass)', color: showSort ? 'var(--acc)' : 'var(--sub)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>↕ Sort</button>
              {showSort && (
                <div className="anim-scaleIn" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 18, padding: 6, zIndex: 50, minWidth: 155, boxShadow: '0 16px 48px var(--shadow)' }}>
                  {SORTS.map(o => <div key={o} onClick={() => { setSort(o); setShowSort(false); }} className="press" style={{ padding: '10px 13px', borderRadius: 11, fontSize: 12.5, fontWeight: o === sort ? 800 : 500, color: o === sort ? 'var(--acc)' : 'var(--txt)', cursor: 'pointer', background: o === sort ? 'rgba(255,107,53,.09)' : 'transparent', transition: 'background .15s' }}>{o}</div>)}
                </div>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 18, overflowX: 'auto', paddingBottom: 3 }} className="hs">
            {CATS.map((c, i) => (
              <button key={c} onClick={() => setCat(c)} className="press anim-fadeUp"
                style={{ animationDelay: `${i * .06}s`, flexShrink: 0, padding: '8px 16px', borderRadius: 99, border: `2px solid ${cat === c ? 'var(--acc)' : 'var(--bdr)'}`, background: cat === c ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--glass)', color: cat === c ? '#fff' : 'var(--sub)', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap', boxShadow: cat === c ? '0 4px 16px rgba(255,107,53,.35)' : 'none', backdropFilter: 'blur(10px)' }}>
                {{ 'All': '🍽️', Snacks: '🥟', Drinks: '🥤', Combos: '🍱' }[c]} {c}
              </button>
            ))}
          </div>

          {/* ── Crazy Deals Strip ── */}
          {!search && cat === 'All' && aiRecs.length > 0 && !dealClaimed && (
            <div className="anim-fadeUp" style={{ marginBottom: 20, animationDelay: '.1s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, boxShadow: '0 4px 12px rgba(239,68,68,.38)' }}>🔥</div>
                <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", textTransform: 'uppercase', letterSpacing: .5 }}>Crazy Deals</span>
                <div style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 99, letterSpacing: .5 }}>1/DAY</div>
              </div>
              <div style={{ display: 'flex', gap: 11, overflowX: 'auto', paddingBottom: 4 }} className="hs">
                {aiRecs.slice(0, 4).map((baseItem, i) => {
                  const item = resolveFoodItem(baseItem.id + '_deal');
                  return (
                  <div key={item.id} className="anim-slideLeft glass" style={{ animationDelay: `${i * .07}s`, flexShrink: 0, width: 162, borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
                    <div style={{ position: 'relative' }} onClick={() => { addItem(item); setDealClaimed(true); DB.set('crazy_deal_claimed', new Date().toDateString()); }}>
                      <LazyImg item={item} h={92} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.38) 100%)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(239,68,68,.92)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 7px', borderRadius: 99 }}>🔥 {baseItem.cat === 'Combos' ? '20% OFF' : '10% OFF'}</div>
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.52)', color: '#fff', fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>⭐{item.rating}</div>
                    </div>
                    <div style={{ padding: '9px 11px 11px', background: 'var(--card)' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--txt)', marginBottom: 2, fontFamily: "'Sora',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{baseItem.name}</div>
                      <div style={{ fontSize: 10, color: '#ea580c', marginBottom: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>Grab it quickly!</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--acc)' }}>₹{item.price} <span style={{ textDecoration: 'line-through', fontSize: 9, color: 'var(--mut)' }}>₹{item.origPrice}</span></div>
                          <div style={{ fontSize: 9, color: 'var(--mut)', marginTop: 1 }}>🕐{item.time}m · 🔥{item.cal}kcal</div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); addItem(item); setDealClaimed(true); DB.set('crazy_deal_claimed', new Date().toDateString()); }} className="press" style={{ background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 10.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 3px 10px rgba(255,107,53,.42)' }}>CLAIM</button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>{search ? `"${search}"` : cat === 'All' ? 'All Items' : cat}</div>
            <div style={{ fontSize: 11, color: 'var(--mut)', fontWeight: 600 }}>{filtered.length} items</div>
          </div>

          {/* Food grid */}
          {skeletonMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 8 }}>
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--mut)' }}>
              <div style={{ fontSize: 50, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--sub)', marginBottom: 6, fontFamily: "'Sora',sans-serif" }}>Nothing found</div>
              <div style={{ fontSize: 13, marginBottom: 20 }}>No items match "{debouncedSearch || cat}"</div>
              <button onClick={() => { setSearch(''); setCat('All'); }} className="press" style={{ padding: '11px 24px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,107,53,.38)' }}>Clear Search</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 8 }}>
              {filtered.map((item, i) => (
                <div key={item.id} className="anim-fadeUp" style={{ animationDelay: `${Math.min(i, .9) * .055}s` }}>
                  <FoodCard item={item} qty={getQty(item.id)} onAdd={() => addItem(item)} onInc={() => incItem(item)} onDec={() => decItem(item)} />
                </div>
              ))}
            </div>
          )}
          <div style={{ height: 10 }} />
        </div>
      </div>

      {/* Floating Pending Order Banner */}
      {(() => {
        if (!pendingOrder) return false;
        const maxMins = pendingOrder.items ? Math.max(...pendingOrder.items.map(i => i.time || 5)) : 5;
        const maxSecs = maxMins * 9;
        const passedSecs = pendingOrder.date ? Math.floor((Date.now() - new Date(pendingOrder.date).getTime()) / 1000) : Infinity;
        if (passedSecs >= maxSecs + 3) return false; // timer finished

        return (
          <div className="anim-slideUp" style={{ position: 'absolute', bottom: totalItems > 0 ? 174 : 104, left: 0, right: 0, zIndex: 35, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <button 
              onClick={() => go('tracking')} 
              className="press anim-glow" 
              style={{ 
                width: '100%', 
                maxWidth: 340, 
                padding: '12px 18px', 
                borderRadius: 24, 
                border: '1px solid rgba(255,255,255,0.4)', 
                background: 'linear-gradient(135deg, #10B981, #059669)', 
                backdropFilter: 'blur(24px) saturate(180%)',
                color: '#fff', 
                cursor: 'pointer', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                boxShadow: '0 16px 40px rgba(16,185,129,0.35), inset 0 1px 2px rgba(255,255,255,0.6)',
                pointerEvents: 'auto'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎯</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>Live Order Tracking</div>
                  <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>Order {pendingOrder.id || 'Active'} in progress</div>
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>→</div>
            </button>
          </div>
        );
      })()}

      {/* Premium Glassmorphic Floating Cart */}
      {totalItems > 0 && (
        <div className="anim-slideUp" style={{ position: 'absolute', bottom: 104, left: 0, right: 0, zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <button 
            onClick={() => go('cart')} 
            className="press anim-glow" 
            style={{ 
              width: '100%', 
              maxWidth: 340, // Specifically smaller than the BottomNav (360px)
              padding: '12px 18px', 
              borderRadius: 24, 
              border: '1px solid rgba(255,255,255,0.4)', 
              background: 'linear-gradient(135deg, rgba(255,107,53, 0.88), rgba(255,61,96, 0.88))', 
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              color: '#fff', 
              cursor: 'pointer', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              boxShadow: '0 16px 40px rgba(255,61,96, 0.35), inset 0 1px 2px rgba(255,255,255, 0.6)',
              pointerEvents: 'auto'
            }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Item Count Box - Inner Glass */}
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 14, 
                background: 'rgba(255,255,255,0.22)', 
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 18, 
                fontWeight: 900, 
                fontFamily: "'Sora',sans-serif",
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)'
              }}>
                {totalItems}
              </div>
              
              {/* Text Content */}
              <div style={{ textAlign: 'left', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.3, fontFamily: "'Sora',sans-serif" }}>View Cart</div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>Cooking with love ❤️</div>
              </div>
            </div>

            {/* Price & Arrow */}
            <div style={{ 
              fontSize: 18, 
              fontWeight: 900, 
              fontFamily: "'Sora',sans-serif", 
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              ₹{totalPrice} 
              <span style={{ fontSize: 18, paddingTop: 1 }}>→</span>
            </div>
            
          </button>
        </div>
      )}

      {showSort && <div onClick={() => setShowSort(false)} style={{ position: 'absolute', inset: 0, zIndex: 40 }} />}
      <BottomNav view="home" go={go} cartCount={totalItems} />
    </div>
  );
}
