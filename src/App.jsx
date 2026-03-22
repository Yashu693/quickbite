import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import './index.css';

import SamosaImg from './assets/Images/Samosa.jpg';
import ColdCoffeeImg from './assets/Images/ColdCoffee.jpg';
import VadaPavImg from './assets/Images/VadaPav.jpg';
import GrilledSandwichImg from './assets/Images/GrilledSandwich.jpg';
import MasalaChaiImg from './assets/Images/MasalaChai.jpg';
import PaneerWrapImg from './assets/Images/PaneerWrap.jpg';
import PavBhajiImg from './assets/Images/PavBhaji.jpg';
import LimeSodaImg from './assets/Images/LimeSoda.jpg';
import PohaImg from './assets/Images/Poha.jpg';
import MangoLassiImg from './assets/Images/MangoLassi.jpg';

// ═══════════════════════════════════════════════════════════════════════════
//  STORAGE  (localStorage — swap for Firestore by replacing DB.get / DB.set)
// ═══════════════════════════════════════════════════════════════════════════
const DB = {
  get(k)    { try { const v = localStorage.getItem('qb_' + k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set(k, v) { try { localStorage.setItem('qb_' + k, JSON.stringify(v)); } catch {} },
  del(k)    { try { localStorage.removeItem('qb_' + k); } catch {} },
};

// ═══════════════════════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════════════════════
const COLLEGES = [
  { id:1, name:'NIRMA University',          short:'NIRMA',  canteen:'NIRMA Food Court — Block C',   emoji:'🎓', color:'linear-gradient(135deg,#DC2626,#B91C1C)', students:'8,200+',  area:'Sarkhej–Gandhinagar Hwy', timing:'8AM–9PM'   },
  { id:2, name:'LD College of Engineering', short:'LDCE',   canteen:'LDCE Central Canteen',          emoji:'⚙️', color:'linear-gradient(135deg,#1D4ED8,#1E40AF)', students:'5,800+',  area:'Navrangpura',              timing:'7:30AM–8PM' },
  { id:3, name:'DA-IICT',                   short:'DAIICT', canteen:'DAIICT Mess & Café',            emoji:'💻', color:'linear-gradient(135deg,#0D9488,#0F766E)', students:'3,200+',  area:'Gandhinagar',              timing:'8AM–10PM'  },
  { id:4, name:'Gujarat University',         short:'GU',     canteen:'GU Central Canteen',            emoji:'🏛️', color:'linear-gradient(135deg,#D97706,#B45309)', students:'22,000+', area:'Navrangpura',              timing:'7AM–8PM'   },
  { id:5, name:'CEPT University',            short:'CEPT',   canteen:'CEPT Studio Café',              emoji:'🏗️', color:'linear-gradient(135deg,#7C3AED,#6D28D9)', students:'2,800+',  area:'University Road',          timing:'9AM–9PM'   },
  { id:6, name:'Ahmedabad University',       short:'AU',     canteen:'AU Central Dining Hall',        emoji:'🎯', color:'linear-gradient(135deg,#059669,#047857)', students:'4,500+',  area:'Navrangpura',              timing:'7:30AM–9PM'},
  { id:7, name:'IIM Ahmedabad',              short:'IIMA',   canteen:'IIMA Dhaba',                    emoji:'📊', color:'linear-gradient(135deg,#9333EA,#7E22CE)', students:'1,400+',  area:'Vastrapur',                timing:'6AM–11PM'  },
  { id:8, name:'JG University',              short:'JGU',    canteen:'JGU Canteen',                   emoji:'🏫', color:'linear-gradient(135deg,#6B7280,#4B5563)', students:'2,000+',  area:'Ahmedabad',                timing:'8AM–6PM',  locked: true },
];

const FOOD = [
  {
    id:1, name:'Special Samosa', cat:'Snacks', price:25, rating:4.8, votes:'2.3k', time:5, cal:180, tag:'Bestseller',
    veg:true, emoji:'🥟', desc:'Crispy gold pastry stuffed with spiced potato & green peas',
    img:SamosaImg,
    g:'linear-gradient(135deg,#f97316,#ef4444)',
    proof:{orders:47,viewers:3,low:false},
  },
  {
    id:2, name:'Cold Coffee', cat:'Drinks', price:60, rating:4.9, votes:'1.8k', time:3, cal:220, tag:'Fan Fav ❤️',
    veg:true, emoji:'☕', desc:'Thick cold brew with chocolate drizzle & whipped cream',
    img:ColdCoffeeImg,
    g:'linear-gradient(135deg,#78350f,#1c0a00)',
    proof:{orders:31,viewers:5,low:false},
  },
  {
    id:3, name:'Vada Pav', cat:'Snacks', price:20, rating:4.7, votes:'3.1k', time:4, cal:150, tag:'Classic',
    veg:true, emoji:'🍔', desc:"Mumbai's legendary street burger with green & tamarind chutneys",
    img:VadaPavImg,
    g:'linear-gradient(135deg,#d97706,#92400e)',
    proof:{orders:62,viewers:2,low:false},
  },
  {
    id:4, name:'Grilled Sandwich', cat:'Combos', price:80, rating:4.9, votes:'987', time:8, cal:380, tag:'🔥 Hot',
    veg:true, emoji:'🥪', desc:'Double molten cheddar with fresh veggies on toasted rustic bread',
    img:GrilledSandwichImg,
    g:'linear-gradient(135deg,#f59e0b,#d97706)',
    proof:{orders:18,viewers:4,low:true},
  },
  {
    id:5, name:'Masala Chai', cat:'Drinks', price:15, rating:4.6, votes:'4.5k', time:2, cal:80, tag:'⚡ Quick',
    veg:true, emoji:'🍵', desc:'Aromatic ginger-cardamom brew steeped to perfection',
    img:MasalaChaiImg,
    g:'linear-gradient(135deg,#ef4444,#dc2626)',
    proof:{orders:88,viewers:6,low:false},
  },
  {
    id:6, name:'Paneer Wrap', cat:'Combos', price:75, rating:4.8, votes:'654', time:7, cal:320, tag:'Filling',
    veg:true, emoji:'🌯', desc:'Creamy tikka paneer stuffed in a soft warm roti wrap',
    img:PaneerWrapImg,
    g:'linear-gradient(135deg,#22c55e,#16a34a)',
    proof:{orders:23,viewers:2,low:false},
  },
  {
    id:7, name:'Pav Bhaji', cat:'Combos', price:55, rating:4.7, votes:'1.9k', time:10, cal:420, tag:'🌶️ Spicy',
    veg:true, emoji:'🍛', desc:'Mumbai-style spicy mashed veggie curry with buttered pav',
    img:PavBhajiImg,
    g:'linear-gradient(135deg,#ef4444,#f97316)',
    proof:{orders:39,viewers:3,low:false},
  },
  {
    id:8, name:'Fresh Lime Soda', cat:'Drinks', price:30, rating:4.5, votes:'789', time:2, cal:45, tag:'Refreshing',
    veg:true, emoji:'🥤', desc:'Chilled fizzy lime soda with a perfectly salted rim',
    img:LimeSodaImg,
    g:'linear-gradient(135deg,#84cc16,#16a34a)',
    proof:{orders:14,viewers:1,low:false},
  },
  {
    id:9, name:'Poha', cat:'Snacks', price:30, rating:4.6, votes:'1.2k', time:6, cal:210, tag:'Morning Pick',
    veg:true, emoji:'🍚', desc:'Light & fluffy flattened rice with peanuts, curry leaves & lemon',
    img:PohaImg,
    g:'linear-gradient(135deg,#fbbf24,#f59e0b)',
    proof:{orders:29,viewers:2,low:false},
  },
  {
    id:10, name:'Mango Lassi', cat:'Drinks', price:50, rating:4.8, votes:'2.1k', time:3, cal:260, tag:'Summer Love',
    veg:true, emoji:'🥭', desc:'Thick creamy mango blended with chilled yogurt & saffron',
    img:MangoLassiImg,
    g:'linear-gradient(135deg,#f59e0b,#d97706)',
    proof:{orders:41,viewers:4,low:true},
  },
];

const BANNERS = [
  { id:1, title:'🎓 College Special', sub:'Extra 20% off all combos today!', code:'COLLEGE20', cta:'GRAB DEAL', bg:'linear-gradient(135deg,#FF6B35 0%,#FF3D60 70%)', e:'🍔' },
  { id:2, title:'⚡ Lightning Deal',   sub:'Samosa + Chai bundle just ₹35',  code:'QUICK10',   cta:'ORDER NOW', bg:'linear-gradient(135deg,#7C3AED 0%,#4C1D95 80%)', e:'⚡' },
  { id:3, title:'🎁 Weekend Fiesta',   sub:'Free dessert on orders above ₹100', code:'FREE100', cta:'CLAIM IT',  bg:'linear-gradient(135deg,#059669 0%,#064E3B 80%)', e:'🎁' },
  { id:4, title:'🌅 Morning Rush',     sub:'Breakfast combo from just ₹45',  code:'MORNING15', cta:'EAT NOW',   bg:'linear-gradient(135deg,#D97706 0%,#92400E 80%)', e:'☀️' },
];

const CATS    = ['All', 'Snacks', 'Drinks', 'Combos'];
const SORTS   = ['Relevance', 'Rating ↓', 'Price ↑', 'Price ↓', 'Fastest'];
const COUPONS = { QUICK10: 10, COLLEGE20: 20, MORNING15: 15, FREE100: 0 };
const PREP_FEE = 5;
const MAX_QTY  = 20;

const AVATAR_GRAD = [
  'linear-gradient(135deg,#FF6B35,#FF3D60)',
  'linear-gradient(135deg,#7C3AED,#6D28D9)',
  'linear-gradient(135deg,#0891B2,#0E7490)',
  'linear-gradient(135deg,#16A34A,#15803D)',
  'linear-gradient(135deg,#D97706,#B45309)',
];

const MOCK_ACCOUNTS = [];

// ═══════════════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const randId    = () => 'QB-' + String(Math.floor(Math.random() * 9000) + 1000);
const randToken = () => '#'   + String(Math.floor(Math.random() * 90   + 10));

function fmtDate(d) {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt)) return '';
  const now = new Date(), diff = now - dt, m = Math.floor(diff / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return 'Today, '     + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (h < 48) return 'Yesterday, ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return dt.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ', ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
const fmtSecs = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ═══════════════════════════════════════════════════════════════════════════
//  HOOKS
// ═══════════════════════════════════════════════════════════════════════════
function useNetwork() {
  const [online, set] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => set(true), dn = () => set(false);
    window.addEventListener('online',  up);
    window.addEventListener('offline', dn);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', dn); };
  }, []);
  return online;
}

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useToasts() {
  const [toasts, set] = useState([]);
  const add = useCallback(({ icon, title, msg, cta = '→' }) => {
    const id = Date.now() + Math.random();
    set(p => [{ id, icon, title, msg, cta }, ...p.slice(0, 2)]);
    setTimeout(() => set(p => p.filter(t => t.id !== id)), 3600);
  }, []);
  return [toasts, add];
}

// ═══════════════════════════════════════════════════════════════════════════
//  QB LOGO
// ═══════════════════════════════════════════════════════════════════════════
function QBLogo({ size = 40, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
      <defs>
        <linearGradient id="qbg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FF3D60" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#qbg1)" />
      <rect width="48" height="48" rx="14" fill="rgba(255,255,255,.06)" />
      <line x1="18" y1="10" x2="18" y2="22" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <line x1="14" y1="10" x2="14" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <line x1="22" y1="10" x2="22" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <path d="M14 16 Q18 20 22 16" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <path d="M30 10 L30 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <path d="M30 10 Q36 10 36 16 Q36 22 30 22" fill="rgba(255,255,255,.22)" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <text x="24" y="42" textAnchor="middle" fontFamily="'Sora',sans-serif" fontWeight="800" fontSize="9" fill="rgba(255,255,255,.95)" letterSpacing="1.5">QB</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  NETWORK BANNER
// ═══════════════════════════════════════════════════════════════════════════
function NetworkBanner({ online }) {
  const [show, setShow] = useState(!online);
  useEffect(() => {
    if (!online) setShow(true);
    else { const t = setTimeout(() => setShow(false), 2200); return () => clearTimeout(t); }
  }, [online]);
  if (!show) return null;
  return (
    <div style={{
      position:'absolute',top:0,left:0,right:0,zIndex:9000,
      background: online ? 'var(--netOK)' : 'var(--netErr)',
      color:'#fff',fontSize:11.5,fontWeight:700,padding:'7px 16px',textAlign:'center',
      animation:'netSlide .35s ease',display:'flex',alignItems:'center',justifyContent:'center',gap:7,
    }}>
      {online ? '✅ Back online!' : '📡 No internet — changes sync when reconnected'}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  TOAST OVERLAY
// ═══════════════════════════════════════════════════════════════════════════
function ToastOverlay({ toasts }) {
  return (
    <div style={{ position:'absolute',top:0,left:0,right:0,zIndex:8999,padding:'0 12px',pointerEvents:'none' }}>
      {toasts.map((t, i) => (
        <div key={t.id} style={{
          marginTop: i === 0 ? 54 : 6,
          background:'rgba(6,4,10,.97)', backdropFilter:'blur(32px) saturate(200%)',
          color:'#fff', borderRadius:20, padding:'12px 15px',
          display:'flex', alignItems:'center', gap:12,
          boxShadow:'0 20px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08)',
          border:'1px solid rgba(255,107,53,.22)',
          animation:'toastSlide .42s cubic-bezier(.34,1.56,.64,1) both',
          pointerEvents:'auto',
        }}>
          <div style={{ width:40,height:40,borderRadius:13,background:'linear-gradient(135deg,rgba(255,107,53,.2),rgba(255,61,96,.18))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{t.icon}</div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontWeight:700,fontSize:13,letterSpacing:.1,fontFamily:"'Sora',sans-serif" }}>{t.title}</div>
            <div style={{ fontSize:11,color:'rgba(255,255,255,.48)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{t.msg}</div>
          </div>
          <div style={{ background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:9,fontWeight:800,padding:'4px 10px',borderRadius:99,letterSpacing:.5,flexShrink:0 }}>{t.cta}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  CONFETTI
// ═══════════════════════════════════════════════════════════════════════════
function Confetti({ active }) {
  const pieces = useMemo(() => Array.from({ length: 52 }, (_, i) => ({
    id:i, x:Math.random()*100,
    color:['#FF6B35','#FF3D60','#FFB300','#22C55E','#3B82F6','#A855F7','#F472B6','#FBBF24'][Math.floor(Math.random()*8)],
    size:Math.random()*9+5, delay:Math.random()*2.2, dur:Math.random()*1.2+1.8, isRect:Math.random()>.5,
  })), []);
  if (!active) return null;
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:7000,overflow:'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute', left:`${p.x}%`, top:-14,
          width:p.size, height:p.size, borderRadius:p.isRect?'3px':'50%',
          background:p.color, animation:`confettiFall ${p.dur}s ease ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  LAZY IMAGE  — FIX: skeleton while loading, emoji fallback on error
// ═══════════════════════════════════════════════════════════════════════════
const LazyImg = memo(function LazyImg({ item, h = 132 }) {
  const [s, setS] = useState('loading');
  return (
    <div style={{ position:'relative',height:h,overflow:'hidden',borderRadius:'inherit' }}>
      {s === 'loading' && <div className="sk" style={{ position:'absolute',inset:0 }} />}
      {s === 'error' ? (
        <div style={{ position:'absolute',inset:0,background:item.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:Math.round(h*0.42) }}>{item.emoji}</div>
      ) : (
        <img src={item.img} alt={item.name} loading="lazy" decoding="async"
          onLoad={() => setS('loaded')} onError={() => setS('error')}
          style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:s==='loaded'?1:0,transition:'opacity .42s ease' }} />
      )}
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
//  SKELETON CARD
// ═══════════════════════════════════════════════════════════════════════════
function SkeletonCard() {
  return (
    <div style={{ borderRadius:20,overflow:'hidden',border:'1px solid var(--bdr)' }}>
      <div className="sk" style={{ height:130 }} />
      <div style={{ padding:'12px 13px',background:'var(--card)' }}>
        <div className="sk" style={{ height:12,borderRadius:6,width:'60%',marginBottom:8 }} />
        <div className="sk" style={{ height:9, borderRadius:5,width:'86%',marginBottom:14 }} />
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div className="sk" style={{ height:9,borderRadius:5,width:'28%' }} />
          <div className="sk" style={{ height:30,borderRadius:11,width:62 }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  SOCIAL PROOF
// ═══════════════════════════════════════════════════════════════════════════
function SocialProof({ item }) {
  const p = item.proof || {};
  return (
    <div style={{ display:'flex',flexWrap:'wrap',gap:4,marginTop:5 }}>
      {p.orders  > 20 && <span style={{ fontSize:9,background:'rgba(255,107,53,.1)',color:'#ea580c',padding:'2px 7px',borderRadius:99,fontWeight:700 }}>🔥 {p.orders}+ today</span>}
      {p.viewers > 2  && <span style={{ fontSize:9,background:'rgba(59,130,246,.08)',color:'var(--blue)',padding:'2px 7px',borderRadius:99,fontWeight:700 }}>👀 {p.viewers} viewing</span>}
      {p.low          && <span style={{ fontSize:9,background:'rgba(239,68,68,.1)',color:'#ef4444',padding:'2px 7px',borderRadius:99,fontWeight:700 }}>⚠️ Only 2 left!</span>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  FOOD CARD
// ═══════════════════════════════════════════════════════════════════════════
const FoodCard = memo(function FoodCard({ item, qty, onAdd, onInc, onDec }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="glass"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:20, overflow:'hidden', cursor:'pointer',
        transform:   hov ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow:   hov ? '0 20px 48px rgba(255,107,53,.28),0 4px 16px rgba(0,0,0,.12)' : '0 2px 12px var(--shadow)',
        transition:  'transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s ease',
        willChange:  'transform',
      }}>
      <div style={{ position:'relative',overflow:'hidden' }}>
        <LazyImg item={item} h={128} />
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 55%,rgba(0,0,0,.42) 100%)',pointerEvents:'none' }} />
        {item.tag && <div style={{ position:'absolute',top:9,left:9,background:'rgba(255,255,255,.96)',backdropFilter:'blur(10px)',color:'#ea580c',fontSize:9.5,fontWeight:800,padding:'3px 9px',borderRadius:99 }}>{item.tag}</div>}
        <div style={{ position:'absolute',top:9,right:9,background:'rgba(0,0,0,.52)',backdropFilter:'blur(8px)',color:'#fff',fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:99 }}>⭐{item.rating}</div>
        <div style={{ position:'absolute',bottom:7,left:9,display:'flex',alignItems:'center',gap:3 }}>
          <div style={{ width:13,height:13,borderRadius:3,border:'2px solid #22c55e',background:'rgba(255,255,255,.9)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'#22c55e' }} />
          </div>
          <span style={{ fontSize:8,fontWeight:700,color:'rgba(255,255,255,.92)' }}>VEG</span>
        </div>
      </div>
      <div style={{ padding:'11px 12px',background:'var(--card)' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:3 }}>
          <div style={{ fontSize:13,fontWeight:800,color:'var(--txt)',lineHeight:1.25,flex:1,paddingRight:6,fontFamily:"'Sora',sans-serif" }}>{item.name}</div>
          <div style={{ fontSize:14,fontWeight:800,color:'var(--acc)',flexShrink:0 }}>₹{item.price}</div>
        </div>
        <div style={{ fontSize:10.5,color:'var(--mut)',lineHeight:1.5,marginBottom:6,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{item.desc}</div>
        <SocialProof item={item} />
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:9 }}>
          <div style={{ display:'flex',gap:5 }}>
            <span style={{ fontSize:9.5,fontWeight:700,color:'var(--sub)',background:'var(--inp)',borderRadius:7,padding:'3px 7px',border:'1px solid var(--bdr)' }}>🕐{item.time}m</span>
            <span style={{ fontSize:9.5,fontWeight:700,color:'var(--sub)',background:'var(--inp)',borderRadius:7,padding:'3px 7px',border:'1px solid var(--bdr)' }}>🔥{item.cal}</span>
          </div>
          {qty === 0 ? (
            <button onClick={onAdd} className="press" style={{ background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',border:'none',borderRadius:11,padding:'7px 14px',fontSize:11.5,fontWeight:800,cursor:'pointer',boxShadow:'0 4px 16px rgba(255,107,53,.45)',letterSpacing:.3 }}>+ ADD</button>
          ) : (
            <div style={{ display:'flex',alignItems:'center',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',borderRadius:11,overflow:'hidden',boxShadow:'0 4px 14px rgba(255,107,53,.42)' }}>
              <button onClick={onDec} className="press" style={{ background:'transparent',border:'none',color:'#fff',width:30,height:30,fontSize:17,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>−</button>
              <span style={{ color:'#fff',fontWeight:800,fontSize:12,minWidth:16,textAlign:'center' }}>{qty}</span>
              <button onClick={onInc} className="press" style={{ background:'transparent',border:'none',color:'#fff',width:30,height:30,fontSize:17,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
//  BANNER CAROUSEL  — FIX: smaller, swipeable with touch events
// ═══════════════════════════════════════════════════════════════════════════
function BannerCarousel({ onToast }) {
  const [idx, setIdx]    = useState(0);
  const touchXRef        = useRef(null);
  const timerRef         = useRef(null);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 4500);
  };
  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, []);

  const next = () => { setIdx(i => (i + 1) % BANNERS.length); resetTimer(); };
  const prev = () => { setIdx(i => (i - 1 + BANNERS.length) % BANNERS.length); resetTimer(); };

  const onTouchStart = e => { touchXRef.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchXRef.current;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    touchXRef.current = null;
  };

  const b = BANNERS[idx];
  return (
    <div style={{ borderRadius:18,overflow:'hidden',marginBottom:14,boxShadow:'0 8px 28px rgba(255,107,53,.22)',cursor:'pointer',userSelect:'none' }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      onClick={() => onToast({ icon:'🏷️', title:'Coupon copied!', msg:`Use "${b.code}" at checkout`, cta:'GOT IT' })}>
      {/* ── Slide ── */}
      <div style={{ background:b.bg, padding:'14px 16px 16px', minHeight:82, position:'relative', overflow:'hidden', transition:'background .7s ease' }}>
        <div style={{ position:'absolute',right:-18,top:-18,fontSize:88,opacity:.1,transform:'rotate(-16deg)',pointerEvents:'none' }}>{b.e}</div>
        <div style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,.18)',backdropFilter:'blur(14px)',borderRadius:12,padding:'7px 12px',border:'1px solid rgba(255,255,255,.28)' }}>
          <div style={{ fontSize:10,color:'#fff',fontWeight:800,letterSpacing:.5,textAlign:'center' }}>{b.cta}</div>
        </div>
        <div style={{ display:'inline-block',background:'rgba(255,255,255,.18)',borderRadius:99,padding:'2px 9px',fontSize:9.5,color:'#fff',fontWeight:800,letterSpacing:.4,marginBottom:4 }}>{b.code}</div>
        <div style={{ fontSize:17,fontWeight:900,color:'#fff',letterSpacing:-.5,lineHeight:1.15,marginBottom:3,fontFamily:"'Sora',sans-serif" }}>{b.title}</div>
        <div style={{ fontSize:11.5,color:'rgba(255,255,255,.84)',fontWeight:500 }}>{b.sub}</div>
      </div>
      {/* ── Dots ── */}
      <div style={{ display:'flex',justifyContent:'center',gap:5,padding:'6px 0',background:'rgba(0,0,0,.14)' }}>
        {BANNERS.map((_, i) => (
          <div key={i}
            onClick={e => { e.stopPropagation(); setIdx(i); resetTimer(); }}
            style={{ width:i===idx?20:6,height:6,borderRadius:99,background:i===idx?'#fff':'rgba(255,255,255,.32)',transition:'all .32s ease',cursor:'pointer' }} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  CIRCULAR TIMER
// ═══════════════════════════════════════════════════════════════════════════
function CircularTimer({ progress, countdown, stage, completedIn }) {
  const R = 52, CIRC = 2 * Math.PI * R;
  const offset  = CIRC * (1 - Math.min(1, Math.max(0, progress)));
  const isReady = stage >= 3;
  return (
    <div style={{ position:'relative',width:148,height:148,margin:'0 auto' }}>
      <svg width="148" height="148" viewBox="0 0 148 148">
        <defs>
          <linearGradient id="ctGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FF3D60" />
          </linearGradient>
        </defs>
        <circle cx="74" cy="74" r={R} fill="none" stroke={isReady?'rgba(34,197,94,.14)':'rgba(255,107,53,.13)'} strokeWidth="7.5" />
        <circle cx="74" cy="74" r={R} fill="none" stroke={isReady?'#22C55E':'url(#ctGrad)'} strokeWidth="7.5"
          strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 74 74)"
          style={{ transition:'stroke-dashoffset .9s ease,stroke .6s ease' }} />
        {!isReady && progress > 0.02 && progress < 1 && (
          <circle
            cx={74 + R * Math.cos(-Math.PI/2 + 2*Math.PI*progress)}
            cy={74 + R * Math.sin(-Math.PI/2 + 2*Math.PI*progress)}
            r="5" fill="#FF6B35" opacity=".85" />
        )}
      </svg>
      <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',pointerEvents:'none' }}>
        {isReady ? (
          <div className="anim-popIn anim-greenGlow" style={{ width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#22C55E,#16A34A)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 24px rgba(34,197,94,.5)' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l6 6 10-12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="0" style={{ animation:'checkDraw .5s ease .1s both' }} />
            </svg>
          </div>
        ) : stage === 2 ? (
          <>
            <div style={{ fontSize:26,fontWeight:900,color:'var(--acc)',fontFamily:"'Sora',sans-serif",letterSpacing:-1.5,lineHeight:1 }}>{fmtSecs(countdown)}</div>
            <div style={{ fontSize:9.5,color:'var(--sub)',fontWeight:600,letterSpacing:.6,marginTop:3 }}>REMAINING</div>
          </>
        ) : (
          <div className="anim-pulse" style={{ fontSize:32 }}>⏳</div>
        )}
      </div>
      {isReady && <div style={{ position:'absolute',inset:-8,borderRadius:'50%',border:'2px solid #22C55E',animation:'ringOut 1.5s ease infinite',pointerEvents:'none' }} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  SWIPE TO PAY
// ═══════════════════════════════════════════════════════════════════════════
function SwipeToPay({ total, onPay }) {
  const [x,    setX]    = useState(0);
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState(false);
  const trackW = 332, thumbW = 58, maxX = trackW - thumbW - 8;
  const onMove = e => {
    if (!drag) return;
    const cl   = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx   = Math.max(0, Math.min(maxX, cl - rect.left - thumbW / 2));
    setX(nx);
    if (nx >= maxX - 14) { setDone(true); setDrag(false); setTimeout(onPay, 320); }
  };
  const endDrag = () => { if (!done) { setX(0); setDrag(false); } };
  const pct = x / maxX;
  return (
    <div style={{ background:'var(--card)',borderRadius:22,padding:5,border:'1px solid var(--bdr)',boxShadow:'0 4px 22px var(--shadow)',userSelect:'none',touchAction:'none' }}
      onMouseMove={onMove} onMouseUp={endDrag} onMouseLeave={endDrag}
      onTouchMove={onMove} onTouchEnd={endDrag}>
      <div style={{ height:60,borderRadius:18,background:done?'linear-gradient(135deg,#22C55E,#16A34A)':`linear-gradient(90deg,rgba(255,107,53,${.12+pct*.7}),rgba(255,61,96,${.08+pct*.5}))`,position:'relative',overflow:'hidden',transition:done?'background .35s':'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'grab' }}>
        <div style={{ position:'absolute',left:0,top:0,bottom:0,width:`${(x+thumbW/2)/trackW*100}%`,background:'linear-gradient(90deg,rgba(255,107,53,.22),transparent)',pointerEvents:'none',transition:drag?'none':'width .2s' }} />
        <span style={{ fontSize:13,fontWeight:700,color:done?'#fff':`rgba(${pct>.4?'255,255,255':'180,100,60'},${.45+pct*.55})`,letterSpacing:.4,zIndex:1,pointerEvents:'none',transition:'color .3s' }}>
          {done ? '✅ Order Placed!' : 'Swipe to Pay  ₹' + total}
        </span>
        <div onMouseDown={() => setDrag(true)} onTouchStart={() => setDrag(true)}
          style={{ position:'absolute',left:x+4,top:4,width:thumbW,height:52,borderRadius:15,background:done?'rgba(255,255,255,.25)':'linear-gradient(135deg,#FF6B35,#FF3D60)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:done?'none':'0 4px 22px rgba(255,107,53,.55)',transition:drag?'none':'left .2s ease',cursor:'grab',zIndex:2 }}>
          {done ? <span style={{ fontSize:24 }}>✅</span> : <QBLogo size={34} style={{ borderRadius:9 }} />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  OTP INPUT
// ═══════════════════════════════════════════════════════════════════════════
function OTPInput({ value, onChange, shake }) {
  const inputRefs = useRef([]);
  const focus = i => { if (inputRefs.current[i]) inputRefs.current[i].focus(); };
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !e.target.value && i > 0) focus(i - 1);
    if (e.key === 'ArrowLeft'  && i > 0) focus(i - 1);
    if (e.key === 'ArrowRight' && i < 5) focus(i + 1);
  };
  const handleChange = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const arr = [...value.padEnd(6, ' ')];
    arr[i] = d;
    onChange(arr.join('').replace(/ /g, ''));
    if (d && i < 5) focus(i + 1);
  };
  const handlePaste = e => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(p);
    focus(p.length > 0 ? Math.min(p.length, 5) : 0);
  };
  return (
    <div style={{ display:'flex',gap:9,justifyContent:'center',marginBottom:6 }}>
      {Array.from({ length:6 }, (_, i) => (
        <input key={i} ref={el => inputRefs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width:42,height:50,textAlign:'center',
            fontSize:20,fontWeight:800,color:'var(--txt)',
            background:'var(--inp)',
            border:`2px solid ${value[i]?'#FF6B35':'var(--inpB)'}`,
            borderRadius:14,transition:'border-color .2s,transform .2s',
            animation:shake?'shake .45s ease':'none',
            transform:value[i]?'scale(1.04)':'scale(1)',
          }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  BOTTOM NAV  — FIX: removed cart tab (3 tabs: Home, Orders, Profile)
// ═══════════════════════════════════════════════════════════════════════════
function BottomNav({ view, go, cartCount }) {
  const tabs = [
    { id:'home',    icon:'🏠', label:'Home'   },
    { id:'history', icon:'📋', label:'Orders' },
    { id:'profile', icon:'👤', label:'Profile'},
  ];
  return (
    <div className="glass-nav" style={{ position:'absolute',bottom:0,left:0,right:0,height:74,display:'flex',alignItems:'flex-start',paddingTop:8,zIndex:50,boxShadow:'0 -4px 28px var(--shadow)' }}>
      {tabs.map(t => (
        <div key={t.id} onClick={() => go(t.id)} className="press" style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer',padding:'3px 0' }}>
          <div style={{ width:44,height:33,borderRadius:13,background:view===t.id?'linear-gradient(135deg,rgba(255,107,53,.18),rgba(255,61,96,.12))':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:21,transition:'all .22s ease',filter:view===t.id?'none':'opacity(.6) grayscale(.2)' }}>
            {t.id === 'home' && view === t.id ? <QBLogo size={26} /> : t.icon}
          </div>
          <div style={{ fontSize:9.5,fontWeight:view===t.id?700:500,color:view===t.id?'var(--acc)':'var(--mut)',transition:'color .2s',letterSpacing:.2 }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  SPLASH SCREEN
// ═══════════════════════════════════════════════════════════════════════════
function SplashScreen({ onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setOut(true),  2000);
    const t2 = setTimeout(() => onDone(),       2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div style={{ position:'absolute',inset:0,background:'linear-gradient(160deg,#0A0608 0%,#1A0A10 50%,#0E0812 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:9999,animation:out?'fadeOut .52s ease forwards':'none' }}>
      <div style={{ animation:'splashLogo .8s cubic-bezier(.34,1.56,.64,1) .15s both',textAlign:'center' }}>
        <QBLogo size={88} style={{ borderRadius:28,boxShadow:'0 20px 60px rgba(255,107,53,.5)',marginBottom:22 }} />
        <div style={{ fontSize:36,fontWeight:900,background:'linear-gradient(135deg,#FF6B35 0%,#FF3D60 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:-1.5,fontFamily:"'Sora',sans-serif",lineHeight:1 }}>QuickBite</div>
        <div style={{ fontSize:11,color:'rgba(255,255,255,.38)',marginTop:8,letterSpacing:3.5,fontWeight:600,textTransform:'uppercase' }}>College Canteen · Reimagined</div>
      </div>
      <div style={{ position:'absolute',bottom:52,display:'flex',gap:6 }}>
        {[0,1,2].map(i => <div key={i} className="anim-pulse" style={{ width:6,height:6,borderRadius:'50%',background:'rgba(255,107,53,.5)',animationDelay:`${i*.22}s` }} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  LOGIN VIEW
// ═══════════════════════════════════════════════════════════════════════════
function LoginView({ onLogin, dark, toggleDark }) {
  const [tab,        setTab]        = useState('login');
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [pass,       setPass]       = useState('');
  const [otp,        setOtp]        = useState('');
  const [otpSent,    setOtpSent]    = useState(false);
  const [shakeOtp,   setShakeOtp]   = useState(false);
  const [loading,    setLd]         = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [err,        setErr]        = useState('');
  const [showGoogle, setShowGoogle] = useState(false);
  const [fE, setFE] = useState(false);
  const [fP, setFP] = useState(false);
  const [fN, setFN] = useState(false);
  const DEMO_OTP = '123456';

  const validate = () => {
    if (tab === 'signup' && !name.trim()) { setErr('Please enter your name'); return false; }
    if (!email.includes('@'))             { setErr('Enter a valid email address'); return false; }
    if (pass.length < 3)                  { setErr('Password must be at least 3 characters'); return false; }
    return true;
  };
  const sendOTP = () => {
    if (!email.includes('@')) { setErr('Enter a valid email first'); return; }
    setErr(''); setLd(true);
    setTimeout(() => {
      setOtpSent(true); setLd(false);
      alert(`Demo OTP for ${email}:\n\n  1  2  3  4  5  6\n\n(In production this is sent via email/SMS)`);
    }, 1200);
  };
  const verifyOTP = () => {
    if (otp === DEMO_OTP) {
      setLd(true);
      setTimeout(() => {
        const nm = name || email.split('@')[0];
        onLogin({ name:nm.charAt(0).toUpperCase()+nm.slice(1), email, avatar:Math.floor(Math.random()*5), method:'otp' });
      }, 800);
    } else {
      setShakeOtp(true); setErr('Invalid OTP. Try 123456');
      setTimeout(() => setShakeOtp(false), 600);
    }
  };
  const doLogin = () => {
    setErr('');
    if (!validate()) return;
    setLd(true);
    setTimeout(() => {
      const uname = tab === 'signup' ? name : email.split('@')[0];
      onLogin({ name:uname.charAt(0).toUpperCase()+uname.slice(1), email, avatar:Math.floor(Math.random()*5), method:'email' });
    }, 1500);
  };
  const googleLogin = acct => {
    setShowGoogle(false); setLd(true);
    setTimeout(() => onLogin({ ...acct, avatar:Math.floor(Math.random()*5), method:'google' }), 1200);
  };

  const inpStyle = focused => ({
    width:'100%', padding:'14px 14px 14px 44px', borderRadius:15,
    border:`2px solid ${focused?'#FF6B35':'var(--inpB)'}`,
    background:'var(--inp)', fontSize:13, color:'var(--txt)',
    transition:'border-color .2s,box-shadow .2s',
    boxShadow: focused?'0 0 0 4px rgba(255,107,53,.12)':'none',
    fontWeight:500,
  });

  return (
    <div className="hs" style={{ position:'absolute',inset:0,background:'var(--bg)',overflowY:'auto' }}>
      <button onClick={toggleDark} className="press" style={{ position:'fixed',top:18,right:16,width:38,height:38,borderRadius:13,background:'var(--glass)',border:'1px solid var(--glassB)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,zIndex:100,backdropFilter:'blur(16px)',boxShadow:'0 4px 14px var(--shadow)' }}>
        {dark?'☀️':'🌙'}
      </button>
      <div style={{ padding:'64px 24px 0',textAlign:'center' }}>
        <div className="anim-bounce" style={{ display:'inline-block',marginBottom:16 }}>
          <QBLogo size={78} style={{ borderRadius:24,boxShadow:'0 14px 44px rgba(255,107,53,.4)' }} />
        </div>
        <div className="anim-fadeUp" style={{ animationDelay:'.05s' }}>
          <div style={{ fontSize:34,fontWeight:900,background:'linear-gradient(135deg,#FF6B35 0%,#FF3D60 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:-1.5,fontFamily:"'Sora',sans-serif",lineHeight:1 }}>QuickBite</div>
          <div style={{ fontSize:10,color:'var(--mut)',marginTop:7,letterSpacing:3.2,fontWeight:700,textTransform:'uppercase' }}>Campus Canteen · Reimagined</div>
        </div>
        <div className="anim-fadeUp" style={{ marginTop:14,animationDelay:'.1s' }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,107,53,.08)',borderRadius:99,padding:'8px 18px',border:'1px solid rgba(255,107,53,.18)' }}>
            <span style={{ fontSize:12,fontWeight:700,color:'#ea580c',letterSpacing:.2 }}>"Skip the queue. Claim your time."</span>
          </div>
        </div>
      </div>

      <div className="anim-fadeUp" style={{ display:'flex',gap:9,margin:'20px 22px 0',animationDelay:'.12s' }}>
        {[['500+','Orders Daily'],['4.9★','Rating'],['< 5 min','Avg Pickup']].map(([v,l]) => (
          <div key={l} className="glass" style={{ flex:1,borderRadius:16,padding:'13px 8px',textAlign:'center' }}>
            <div style={{ fontSize:14,fontWeight:800,color:'var(--acc)',fontFamily:"'Sora',sans-serif" }}>{v}</div>
            <div style={{ fontSize:9,color:'var(--mut)',marginTop:2,fontWeight:600,letterSpacing:.5,textTransform:'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>

      <div className="anim-fadeUp" style={{ padding:'20px 22px 0',animationDelay:'.15s' }}>
        {/* Tab Toggle */}
        <div style={{ display:'flex',background:'var(--card)',borderRadius:16,padding:4,border:'1px solid var(--bdr)',marginBottom:18 }}>
          {['login','signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErr(''); setOtpSent(false); setOtp(''); }} className="press"
              style={{ flex:1,padding:'11px',borderRadius:12,border:'none',background:tab===t?'linear-gradient(135deg,#FF6B35,#FF3D60)':'transparent',color:tab===t?'#fff':'var(--sub)',fontSize:13,fontWeight:700,cursor:'pointer',transition:'all .25s',boxShadow:tab===t?'0 4px 16px rgba(255,107,53,.38)':'none' }}>
              {t==='login'?'Log In':'Sign Up'}
            </button>
          ))}
        </div>

        {/* Google */}
        <button onClick={() => setShowGoogle(true)} className="press lift"
          style={{ width:'100%',padding:'14px',borderRadius:16,border:'1px solid var(--bdr)',background:'var(--glass)',color:'var(--txt)',fontSize:13.5,fontWeight:700,cursor:'pointer',marginBottom:14,backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',gap:11 }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
          <div style={{ flex:1,height:1,background:'var(--bdr)' }} />
          <span style={{ fontSize:11,color:'var(--mut)',fontWeight:600 }}>or with email</span>
          <div style={{ flex:1,height:1,background:'var(--bdr)' }} />
        </div>

        {tab === 'signup' && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'var(--sub)',marginBottom:5,letterSpacing:.8,textTransform:'uppercase' }}>Full Name</div>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:16 }}>👤</span>
              <input value={name} onChange={e=>setName(e.target.value)} onFocus={()=>setFN(true)} onBlur={()=>setFN(false)} placeholder="Your Name" style={inpStyle(fN)} />
            </div>
          </div>
        )}

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10,fontWeight:700,color:'var(--sub)',marginBottom:5,letterSpacing:.8,textTransform:'uppercase' }}>College Email</div>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:16 }}>📧</span>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFE(true)} onBlur={()=>setFE(false)} placeholder="you@college.edu.in" style={inpStyle(fE)} />
          </div>
        </div>

        {!otpSent ? (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'var(--sub)',marginBottom:5,letterSpacing:.8,textTransform:'uppercase' }}>Password</div>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:16 }}>🔒</span>
              <input type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} onFocus={()=>setFP(true)} onBlur={()=>setFP(false)} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="••••••••" style={{ ...inpStyle(fP),paddingRight:46 }} />
              <button onClick={() => setShowPass(s=>!s)} style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16 }}>{showPass?'🙈':'👁️'}</button>
            </div>
            <button onClick={sendOTP} style={{ marginTop:8,background:'none',border:'none',cursor:'pointer',fontSize:11,color:'var(--acc)',fontWeight:700,textDecoration:'underline',padding:0 }}>Or use OTP instead →</button>
          </div>
        ) : (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'var(--sub)',marginBottom:5,letterSpacing:.8,textTransform:'uppercase' }}>Enter OTP sent to {email}</div>
            <OTPInput value={otp} onChange={setOtp} shake={shakeOtp} />
            <div style={{ display:'flex',justifyContent:'space-between',marginTop:8 }}>
              <button onClick={() => { setOtpSent(false); setOtp(''); setErr(''); }} style={{ background:'none',border:'none',cursor:'pointer',fontSize:11,color:'var(--mut)',fontWeight:600 }}>← Use Password</button>
              <button onClick={sendOTP} style={{ background:'none',border:'none',cursor:'pointer',fontSize:11,color:'var(--acc)',fontWeight:700 }}>Resend OTP</button>
            </div>
          </div>
        )}

        {err && <div className="anim-fadeIn" style={{ marginBottom:14,fontSize:12,color:'#ef4444',fontWeight:600,background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:12,padding:'9px 14px' }}>⚠️ {err}</div>}

        <button onClick={otpSent?verifyOTP:doLogin} className="press"
          style={{ width:'100%',padding:'16px',borderRadius:17,border:'none',background:loading?'rgba(255,107,53,.35)':'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:14.5,fontWeight:800,cursor:'pointer',letterSpacing:.3,boxShadow:loading?'none':'0 10px 32px rgba(255,107,53,.44)',transition:'all .3s',display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:10 }}>
          {loading ? <><span className="anim-spin" style={{ width:19,height:19,border:'2.5px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block' }} />Please wait...</> : otpSent?'✅ Verify OTP →':tab==='login'?'🎓 Log In →':'🚀 Create Account →'}
        </button>
        <div style={{ textAlign:'center',marginTop:6,fontSize:10.5,color:'var(--mut)' }}>🔐 SSL Secured · Session persists after close</div>
      </div>

      <div className="anim-fadeUp" style={{ display:'flex',justifyContent:'center',gap:8,padding:'20px 24px 44px',animationDelay:'.2s' }}>
        {['🍕','🥤','🍜','🥙','🧁','🍱','🌮'].map((e,i) => (
          <div key={i} className="anim-float glass" style={{ animationDelay:`${i*.26}s`,width:38,height:38,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17 }}>{e}</div>
        ))}
      </div>

      {/* Google modal */}
      {showGoogle && (
        <div className="anim-fadeIn" style={{ position:'absolute',inset:0,background:'rgba(0,0,0,.65)',backdropFilter:'blur(12px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 24px' }}>
          <div className="anim-scaleIn" style={{ width:'100%',maxWidth:340,borderRadius:24,padding:'20px 0 8px',background:'var(--card)',border:'1px solid var(--bdr)' }}>
            <div style={{ padding:'0 20px 16px',borderBottom:'1px solid var(--bdr)' }}>
              <div style={{ fontSize:14,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:6 }}>Sign in with Google</div>
              <div style={{ fontSize:11,color:'var(--sub)' }}>Choose an account to continue to QuickBite</div>
            </div>
            {MOCK_ACCOUNTS.length === 0 ? (
              <div style={{ padding:'20px',textAlign:'center' }}>
                <div style={{ fontSize:36,marginBottom:10 }}>👤</div>
                <div style={{ fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:5 }}>No saved accounts</div>
                <div style={{ fontSize:11,color:'var(--mut)',marginBottom:14 }}>Enter your Google account email</div>
                <input placeholder="your@gmail.com" style={{ width:'100%',padding:'11px 14px',borderRadius:12,border:'2px solid var(--inpB)',background:'var(--inp)',fontSize:13,color:'var(--txt)',marginBottom:10 }}
                  onKeyDown={e => { if (e.key === 'Enter' && e.target.value.includes('@')) { const nm = e.target.value.split('@')[0]; googleLogin({ name:nm.charAt(0).toUpperCase()+nm.slice(1), email:e.target.value }); } }} />
                <div style={{ fontSize:10,color:'var(--mut)' }}>Press Enter to sign in</div>
              </div>
            ) : MOCK_ACCOUNTS.map(a => (
              <div key={a.email} onClick={() => googleLogin(a)} className="press" style={{ display:'flex',alignItems:'center',gap:13,padding:'13px 20px',cursor:'pointer' }}>
                <div style={{ width:40,height:40,borderRadius:'50%',background:AVATAR_GRAD[a.avatar||0],display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:800,color:'#fff',flexShrink:0 }}>{a.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:'var(--txt)' }}>{a.name}</div>
                  <div style={{ fontSize:11,color:'var(--mut)',marginTop:1 }}>{a.email}</div>
                </div>
                <div style={{ color:'var(--mut)',fontSize:18 }}>›</div>
              </div>
            ))}
            <div style={{ padding:'8px 20px 14px',borderTop:'1px solid var(--bdr)',marginTop:4 }}>
              <button onClick={() => setShowGoogle(false)} className="press" style={{ width:'100%',padding:'11px',borderRadius:13,border:'1px solid var(--bdr)',background:'transparent',color:'var(--sub)',fontSize:13,fontWeight:600,cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  COLLEGE SELECT
// ═══════════════════════════════════════════════════════════════════════════
function CollegeSelectView({ user, onSelect }) {
  const [sel,     setSel]     = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <div className="hs" style={{ position:'absolute',inset:0,background:'var(--bg)',overflowY:'auto' }}>
      <div style={{ padding:'52px 18px 20px' }}>
        <div className="anim-fadeUp" style={{ textAlign:'center',marginBottom:22 }}>
          <div style={{ fontSize:38,marginBottom:10 }}>🏫</div>
          <div style={{ fontSize:23,fontWeight:900,color:'var(--txt)',letterSpacing:-.8,fontFamily:"'Sora',sans-serif",marginBottom:5 }}>Hey {user?.name?.split(' ')[0]}! 👋</div>
          <div style={{ fontSize:14,color:'var(--sub)' }}>Which college are you at?</div>
          <div style={{ fontSize:11,color:'var(--mut)',marginTop:3 }}>We'll show your canteen menu & timings</div>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:11,marginBottom:22 }}>
          {COLLEGES.map((c,i) => (
            <div key={c.id} className={`anim-fadeUp ${c.locked?'':'press'}`}
              style={{ animationDelay:`${i*.055}s`,position:'relative',background:c.locked?'var(--card2)':sel?.id===c.id?'var(--card2)':'var(--card)',border:`2px solid ${c.locked?'var(--bdr)':sel?.id===c.id?'var(--acc)':'var(--bdr)'}`,borderRadius:20,padding:'16px 13px',cursor:c.locked?'not-allowed':'pointer',boxShadow:sel?.id===c.id?'0 6px 28px rgba(255,107,53,.28)':'0 2px 14px var(--shadow)',transition:'all .25s ease',backdropFilter:'blur(12px)',opacity:c.locked?.55:1 }}
              onClick={() => { if (!c.locked) setSel(c); }}>
              {c.locked && (
                <div style={{ position:'absolute',inset:0,borderRadius:18,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',paddingBottom:10,zIndex:2,pointerEvents:'none' }}>
                  <div style={{ background:'rgba(239,68,68,.9)',backdropFilter:'blur(8px)',borderRadius:99,padding:'3px 9px',display:'flex',alignItems:'center',gap:4 }}>
                    <span style={{ fontSize:8.5 }}>🔒</span>
                    <span style={{ fontSize:8.5,fontWeight:800,color:'#fff',letterSpacing:.3 }}>Temporarily Unavailable</span>
                  </div>
                </div>
              )}
              <div style={{ width:46,height:46,borderRadius:15,background:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:23,marginBottom:9,boxShadow:'0 4px 18px rgba(0,0,0,.22)',filter:c.locked?'grayscale(.7)':'none' }}>{c.emoji}</div>
              <div style={{ fontSize:12.5,fontWeight:800,color:c.locked?'var(--mut)':'var(--txt)',fontFamily:"'Sora',sans-serif",lineHeight:1.25,marginBottom:3 }}>{c.short}</div>
              <div style={{ fontSize:9.5,color:'var(--sub)',fontWeight:500,marginBottom:5 }}>{c.name}</div>
              <div style={{ fontSize:9,color:'var(--mut)' }}>📍{c.area}</div>
              {!c.locked && sel?.id===c.id && <div className="anim-popIn" style={{ position:'absolute',top:9,right:9,width:20,height:20,borderRadius:'50%',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:800 }}>✓</div>}
            </div>
          ))}
        </div>
        {sel && (
          <div className="anim-slideUp glass" style={{ borderRadius:20,padding:'16px',marginBottom:16,display:'flex',gap:13,alignItems:'center' }}>
            <div style={{ width:46,height:46,borderRadius:14,background:sel.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>{sel.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>{sel.canteen}</div>
              <div style={{ fontSize:11,color:'var(--sub)',marginTop:2 }}>⏰ {sel.timing} · 👥 {sel.students}</div>
            </div>
          </div>
        )}
        <button onClick={() => { if (!sel||loading) return; setLoading(true); setTimeout(()=>onSelect(sel),1300); }} className="press"
          style={{ width:'100%',padding:'16px',borderRadius:17,border:'none',background:!sel?'rgba(180,130,110,.28)':'linear-gradient(135deg,#FF6B35,#FF3D60)',color:!sel?'var(--mut)':'#fff',fontSize:14.5,fontWeight:800,cursor:!sel?'not-allowed':'pointer',letterSpacing:.3,boxShadow:!sel?'none':'0 10px 32px rgba(255,107,53,.44)',transition:'all .3s',display:'flex',alignItems:'center',justifyContent:'center',gap:10 }}>
          {loading ? <><span className="anim-spin" style={{ width:19,height:19,border:'2.5px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block' }} />Setting up your canteen...</> : sel?`🍽️ Enter ${sel.short} Canteen →`:'Select your college above'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  HOME VIEW
// ═══════════════════════════════════════════════════════════════════════════
function HomeView({ user, college, cart, setCart, addToast, go, dark, toggleDark, skeletonMode }) {
  const [search,   setSearch]   = useState('');
  const [cat,      setCat]      = useState('All');
  const [sort,     setSort]     = useState('Relevance');
  const [showSort, setShowSort] = useState(false);
  const [scrollY,  setScrollY]  = useState(0);
  const scrollRef  = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const h = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', h, { passive:true });
    return () => el.removeEventListener('scroll', h);
  }, []);

  const addItem = useCallback(item => {
    setCart(p => ({ ...p, [item.id]:Math.min((p[item.id]||0)+1, MAX_QTY) }));
    addToast({ icon:item.emoji, title:'Added to cart!', msg:`${item.name} · ₹${item.price}`, cta:'🛒' });
  }, [setCart, addToast]);

  const incItem = useCallback(item => {
    setCart(p => ({ ...p, [item.id]:Math.min((p[item.id]||0)+1, MAX_QTY) }));
  }, [setCart]);

  const decItem = useCallback(item => {
    setCart(p => {
      const next = { ...p };
      next[item.id] = (next[item.id]||1) - 1;
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
    return pool.sort((a,b) => b.rating - a.rating).slice(0, 5);
  }, [cart]);

  const aiCopy = useMemo(() => {
    const h = new Date().getHours();
    if (h < 10)  return '🌅 Good morning — start fresh!';
    if (h < 12)  return '☀️ Breakfast time, fuel up!';
    if (h < 14)  return '⚡ Lunch rush — order early!';
    if (h < 17)  return '🍵 Afternoon snack time 😋';
    if (h < 20)  return '🌆 Evening munchies? We got you';
    return '🌙 Late night cravings incoming';
  }, []);

  let filtered = FOOD.filter(f => {
    const mCat = cat==='All' || f.cat===cat;
    const mS   = !debouncedSearch || f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || f.desc.toLowerCase().includes(debouncedSearch.toLowerCase());
    return mCat && mS;
  });
  if (sort==='Rating ↓') filtered = [...filtered].sort((a,b) => b.rating-a.rating);
  else if (sort==='Price ↑') filtered = [...filtered].sort((a,b) => a.price-b.price);
  else if (sort==='Price ↓') filtered = [...filtered].sort((a,b) => b.price-a.price);
  else if (sort==='Fastest')  filtered = [...filtered].sort((a,b) => a.time-b.time);

  const totalItems = Object.values(cart).reduce((a,b) => a+b, 0);
  const totalPrice = Object.entries(cart).reduce((s,[id,q]) => {
    const f = FOOD.find(x => String(x.id)===String(id)); return s+(f?f.price*q:0);
  }, 0);
  const hdr  = scrollY > 16;
  const hour = new Date().getHours();
  const greeting = hour<12?'Good Morning ☀️':hour<17?'Good Afternoon 🌤️':'Good Evening 🌙';

  return (
    <div style={{ position:'absolute',inset:0,background:'var(--bg)' }}>
      {/* ── HEADER ── */}
      <div className={hdr?'glass-hdr':''} style={{ position:'absolute',top:0,left:0,right:0,zIndex:20,padding:'38px 16px 12px',transition:'all .3s ease',background:hdr?'var(--hdr)':'transparent' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div>
            <div style={{ fontSize:9.5,color:'var(--acc)',fontWeight:700,letterSpacing:.5,marginBottom:2,display:'flex',alignItems:'center',gap:4 }}>
              <span>📍</span>{college?.canteen||'Campus Canteen'}
            </div>
            <div style={{ fontSize:18,fontWeight:900,color:'var(--txt)',letterSpacing:-.5,fontFamily:"'Sora',sans-serif" }}>{greeting}, {user?.name?.split(' ')[0]}!</div>
          </div>
          <div style={{ display:'flex',gap:8,alignItems:'center' }}>
            <button onClick={toggleDark} className="press glass" style={{ width:36,height:36,borderRadius:12,border:'1px solid var(--glassB)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,backdropFilter:'blur(16px)' }}>{dark?'☀️':'🌙'}</button>
            <div onClick={() => go('profile')} className="press" style={{ width:36,height:36,borderRadius:12,background:AVATAR_GRAD[user?.avatar||0],display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:900,color:'#fff',boxShadow:'0 4px 16px rgba(255,107,53,.42)',cursor:'pointer',fontFamily:"'Sora',sans-serif" }}>{user?.name?.[0]||'U'}</div>
          </div>
        </div>
      </div>

      {/* ── SCROLL BODY ── */}
      <div ref={scrollRef} className="hs" style={{ position:'absolute',inset:0,overflowY:'auto',overflowX:'hidden',paddingTop:90,paddingBottom:totalItems>0?162:88 }}>
        <div style={{ padding:'0 14px' }}>

          {/* Banner */}
          <BannerCarousel onToast={addToast} />

          {/* AI header strip */}
          {!search && cat==='All' && (
            <div className="anim-fadeUp glass" style={{ borderRadius:16,padding:'11px 14px',marginBottom:14,display:'flex',alignItems:'center',gap:10,animationDelay:'.08s' }}>
              <div style={{ width:36,height:36,borderRadius:12,background:'linear-gradient(135deg,#7C3AED,#6D28D9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0,boxShadow:'0 4px 14px rgba(124,58,237,.35)' }}>🧠</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11.5,fontWeight:700,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>{aiCopy}</div>
                <div style={{ fontSize:10,color:'var(--mut)',marginTop:1 }}>AI-powered suggestions just for you</div>
              </div>
              <div style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)',color:'#fff',fontSize:8.5,fontWeight:800,padding:'3px 9px',borderRadius:99,letterSpacing:.5,flexShrink:0 }}>AI</div>
            </div>
          )}

          {/* FIX: Search — removed backdropFilter from input to fix blur ── */}
          <div style={{ display:'flex',gap:9,marginBottom:14 }}>
            <div style={{ flex:1,position:'relative' }}>
              <span style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:16,pointerEvents:'none',zIndex:1 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search samosa, chai..."
                style={{ width:'100%',padding:'12px 36px 12px 40px',borderRadius:14,border:'2px solid var(--inpB)',background:'var(--inp)',fontSize:13,color:'var(--txt)',transition:'border-color .2s,box-shadow .2s' }}
                onFocus={e=>{ e.target.style.borderColor='#FF6B35'; e.target.style.boxShadow='0 0 0 4px rgba(255,107,53,.1)'; }}
                onBlur={e=>{  e.target.style.borderColor='var(--inpB)'; e.target.style.boxShadow='none'; }} />
              {search && <button onClick={()=>setSearch('')} aria-label="Clear search" style={{ position:'absolute',right:4,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:14,color:'var(--mut)',width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',zIndex:1 }}>✕</button>}
            </div>
            <div style={{ position:'relative',flexShrink:0 }}>
              <button onClick={() => setShowSort(s=>!s)} className="press" style={{ height:'100%',padding:'0 14px',borderRadius:14,border:`2px solid ${showSort?'#FF6B35':'var(--inpB)'}`,background:showSort?'rgba(255,107,53,.08)':'var(--glass)',color:showSort?'var(--acc)':'var(--sub)',fontSize:11,fontWeight:700,whiteSpace:'nowrap',cursor:'pointer',backdropFilter:'blur(12px)' }}>↕ Sort</button>
              {showSort && (
                <div className="anim-scaleIn" style={{ position:'absolute',right:0,top:'calc(100% + 6px)',background:'var(--card)',border:'1px solid var(--bdr)',borderRadius:18,padding:6,zIndex:50,minWidth:155,boxShadow:'0 16px 48px var(--shadow)' }}>
                  {SORTS.map(o => <div key={o} onClick={() => { setSort(o); setShowSort(false); }} className="press" style={{ padding:'10px 13px',borderRadius:11,fontSize:12.5,fontWeight:o===sort?800:500,color:o===sort?'var(--acc)':'var(--txt)',cursor:'pointer',background:o===sort?'rgba(255,107,53,.09)':'transparent',transition:'background .15s' }}>{o}</div>)}
                </div>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div style={{ display:'flex',gap:7,marginBottom:18,overflowX:'auto',paddingBottom:3 }} className="hs">
            {CATS.map((c,i) => (
              <button key={c} onClick={() => setCat(c)} className="press anim-fadeUp"
                style={{ animationDelay:`${i*.06}s`,flexShrink:0,padding:'8px 16px',borderRadius:99,border:`2px solid ${cat===c?'var(--acc)':'var(--bdr)'}`,background:cat===c?'linear-gradient(135deg,#FF6B35,#FF3D60)':'var(--glass)',color:cat===c?'#fff':'var(--sub)',fontSize:11.5,fontWeight:700,cursor:'pointer',transition:'all .2s',whiteSpace:'nowrap',boxShadow:cat===c?'0 4px 16px rgba(255,107,53,.35)':'none',backdropFilter:'blur(10px)' }}>
                {{'All':'🍽️',Snacks:'🥟',Drinks:'🥤',Combos:'🍱'}[c]} {c}
              </button>
            ))}
          </div>

          {/* ── AI Recommended (WORKABLE: click adds to cart) ── */}
          {!search && cat==='All' && aiRecs.length > 0 && (
            <div className="anim-fadeUp" style={{ marginBottom:20,animationDelay:'.1s' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}>
                <div style={{ width:28,height:28,borderRadius:9,background:'linear-gradient(135deg,#7c3aed,#6d28d9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,boxShadow:'0 4px 12px rgba(124,58,237,.38)' }}>🧠</div>
                <span style={{ fontSize:14,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Recommended For You</span>
                <div style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)',color:'#fff',fontSize:9,fontWeight:800,padding:'3px 9px',borderRadius:99 }}>AI PICK</div>
              </div>
              <div style={{ display:'flex',gap:11,overflowX:'auto',paddingBottom:4 }} className="hs">
                {aiRecs.map((item,i) => (
                  <div key={item.id} className="anim-slideLeft glass" style={{ animationDelay:`${i*.07}s`,flexShrink:0,width:162,borderRadius:18,overflow:'hidden',cursor:'pointer' }}>
                    <div style={{ position:'relative' }} onClick={() => addItem(item)}>
                      <LazyImg item={item} h={92} />
                      <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.38) 100%)',pointerEvents:'none' }} />
                      <div style={{ position:'absolute',top:6,left:6,background:'rgba(124,58,237,.92)',backdropFilter:'blur(8px)',color:'#fff',fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:99 }}>🧠 AI Pick</div>
                      <div style={{ position:'absolute',top:6,right:6,background:'rgba(0,0,0,.52)',color:'#fff',fontSize:9.5,fontWeight:700,padding:'2px 7px',borderRadius:99 }}>⭐{item.rating}</div>
                    </div>
                    <div style={{ padding:'9px 11px 11px',background:'var(--card)' }}>
                      <div style={{ fontSize:12,fontWeight:800,color:'var(--txt)',marginBottom:2,fontFamily:"'Sora',sans-serif",overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize:10,color:'var(--mut)',marginBottom:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{item.desc}</div>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                        <div>
                          <div style={{ fontSize:13.5,fontWeight:800,color:'var(--acc)' }}>₹{item.price}</div>
                          <div style={{ fontSize:9,color:'var(--mut)',marginTop:1 }}>🕐{item.time}m · 🔥{item.cal}kcal</div>
                        </div>
                        {(cart[item.id]||0) === 0 ? (
                          <button onClick={e => { e.stopPropagation(); addItem(item); }} className="press" style={{ background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',border:'none',borderRadius:10,padding:'6px 12px',fontSize:10.5,fontWeight:800,cursor:'pointer',boxShadow:'0 3px 10px rgba(255,107,53,.42)' }}>+ ADD</button>
                        ) : (
                          <div style={{ display:'flex',alignItems:'center',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',borderRadius:10,overflow:'hidden',boxShadow:'0 3px 10px rgba(255,107,53,.42)' }}>
                            <button onClick={e=>{ e.stopPropagation(); decItem(item); }} className="press" style={{ background:'transparent',border:'none',color:'#fff',width:26,height:26,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>−</button>
                            <span style={{ color:'#fff',fontWeight:800,fontSize:11,minWidth:14,textAlign:'center' }}>{cart[item.id]}</span>
                            <button onClick={e=>{ e.stopPropagation(); incItem(item); }} className="press" style={{ background:'transparent',border:'none',color:'#fff',width:26,height:26,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section header */}
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
            <div style={{ fontSize:14.5,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>{search?`"${search}"`:cat==='All'?'All Items':cat}</div>
            <div style={{ fontSize:11,color:'var(--mut)',fontWeight:600 }}>{filtered.length} items</div>
          </div>

          {/* Food grid */}
          {skeletonMode ? (
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,paddingBottom:8 }}>
              {Array(6).fill(0).map((_,i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center',padding:'50px 20px',color:'var(--mut)' }}>
              <div style={{ fontSize:50,marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:16,fontWeight:700,color:'var(--sub)',marginBottom:6,fontFamily:"'Sora',sans-serif" }}>Nothing found</div>
              <div style={{ fontSize:13,marginBottom:20 }}>No items match "{debouncedSearch||cat}"</div>
              <button onClick={() => { setSearch(''); setCat('All'); }} className="press" style={{ padding:'11px 24px',borderRadius:14,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:13,fontWeight:800,cursor:'pointer',boxShadow:'0 4px 16px rgba(255,107,53,.38)' }}>Clear Search</button>
            </div>
          ) : (
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,paddingBottom:8 }}>
              {filtered.map((item,i) => (
                <div key={item.id} className="anim-fadeUp" style={{ animationDelay:`${Math.min(i,.9)*.055}s` }}>
                  <FoodCard item={item} qty={getQty(item.id)} onAdd={()=>addItem(item)} onInc={()=>incItem(item)} onDec={()=>decItem(item)} />
                </div>
              ))}
            </div>
          )}
          <div style={{ height:10 }} />
        </div>
      </div>

      {/* Floating cart bar */}
      {totalItems > 0 && (
        <div className="anim-slideUp" style={{ position:'absolute',bottom:82,left:14,right:14,zIndex:30 }}>
          <button onClick={() => go('cart')} className="press anim-glow" style={{ width:'100%',padding:'15px 20px',borderRadius:21,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 12px 40px rgba(255,107,53,.55)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:11 }}>
              <div style={{ width:34,height:34,borderRadius:11,background:'rgba(255,255,255,.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,fontFamily:"'Sora',sans-serif" }}>{totalItems}</div>
              <div>
                <div style={{ fontSize:13,fontWeight:800,letterSpacing:.2 }}>View Cart</div>
                <div style={{ fontSize:10,opacity:.78,marginTop:.5 }}>Cooking with love ❤️</div>
              </div>
            </div>
            <div style={{ fontSize:17,fontWeight:900,fontFamily:"'Sora',sans-serif" }}>₹{totalPrice} →</div>
          </button>
        </div>
      )}

      {showSort && <div onClick={() => setShowSort(false)} style={{ position:'absolute',inset:0,zIndex:40 }} />}
      <BottomNav view="home" go={go} cartCount={totalItems} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  CART VIEW  — FIX: centered layout, premium glass aesthetic
// ═══════════════════════════════════════════════════════════════════════════
function CartView({ user, college, cart, setCart, addToast, go, onGoToPay }) {
  const [coupon,    setCoupon]    = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [disc,      setDisc]      = useState(0);

  const items      = Object.entries(cart).map(([id,qty]) => { const f=FOOD.find(x=>String(x.id)===String(id)); return f?{...f,qty}:null; }).filter(Boolean);
  const sub        = items.reduce((s,i) => s+i.price*i.qty, 0);
  const dk         = Math.round(sub*(disc/100));
  const total      = sub + PREP_FEE - dk;
  const totalItems = items.reduce((a,b) => a+b.qty, 0);

  const inc = id => setCart(p => ({ ...p,[id]:(p[id]||0)+1 }));
  const dec = id => setCart(p => { const n={...p}; n[id]=(n[id]||1)-1; if(n[id]<=0) delete n[id]; return n; });

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (COUPONS[c] !== undefined) {
      setDisc(COUPONS[c]);
      setCouponMsg(COUPONS[c]>0 ? `✅ ${COUPONS[c]}% off applied — you save ₹${Math.round(sub*(COUPONS[c]/100))}` : '✅ Free dessert added! 🎂');
      addToast({ icon:'🏷️', title:'Coupon applied!', msg:COUPONS[c]>0?`Saved ₹${Math.round(sub*(COUPONS[c]/100))}`:'Free dessert incoming 🎂', cta:'🎉' });
    } else {
      setCouponMsg('❌ Invalid code. Try COLLEGE20 or QUICK10'); setDisc(0);
    }
  };

  if (items.length === 0) return (
    <div style={{ position:'absolute',inset:0,background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 28px',textAlign:'center' }}>
      <div style={{ fontSize:72,marginBottom:18 }}>🛒</div>
      <div style={{ fontSize:22,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:8 }}>Cart is empty</div>
      <div style={{ fontSize:14,color:'var(--mut)',textAlign:'center',marginBottom:28 }}>Add something delicious from the menu!</div>
      <button onClick={() => go('home')} className="press" style={{ padding:'14px 36px',borderRadius:17,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:14,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 28px rgba(255,107,53,.42)' }}>Browse Menu →</button>
      <BottomNav view="cart" go={go} cartCount={0} />
    </div>
  );

  return (
    <div style={{ position:'absolute',inset:0,background:'var(--bg)' }}>
      {/* Header */}
      <div className="glass-hdr" style={{ position:'absolute',top:0,left:0,right:0,zIndex:20,padding:'38px 16px 14px' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:9.5,color:'var(--acc)',fontWeight:700,letterSpacing:.5,marginBottom:2 }}>📍 {college?.canteen||'Campus Canteen'}</div>
            <div style={{ fontSize:20,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Your Cart 🛒</div>
          </div>
          <div className="glass" style={{ fontSize:11,color:'var(--sub)',fontWeight:700,padding:'6px 14px',borderRadius:99,border:'1px solid var(--bdr)' }}>{totalItems} item{totalItems!==1?'s':''}</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="hs" style={{ position:'absolute',top:90,bottom:74,overflowY:'auto',padding:'14px 16px' }}>

        {/* Items card */}
        <div className="glass anim-fadeUp" style={{ borderRadius:22,overflow:'hidden',marginBottom:14,boxShadow:'0 8px 32px var(--shadow)' }}>
          <div style={{ padding:'13px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',gap:7,alignItems:'center' }}>
            <span style={{ fontSize:16 }}>🛒</span>
            <span style={{ fontSize:13,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Order Items</span>
          </div>
          {items.map((item,i) => (
            <div key={item.id} style={{ padding:'13px 16px',borderBottom:i<items.length-1?'1px solid var(--bdr)':'none',display:'flex',alignItems:'center',gap:12,background:'var(--card)' }}>
              <div style={{ width:50,height:50,borderRadius:15,background:item.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0,boxShadow:'0 4px 12px rgba(0,0,0,.15)' }}>{item.emoji}</div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13,fontWeight:700,color:'var(--txt)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:"'Sora',sans-serif" }}>{item.name}</div>
                <div style={{ fontSize:10.5,color:'var(--mut)',marginTop:1 }}>₹{item.price} × {item.qty}</div>
              </div>
              <div style={{ display:'flex',alignItems:'center',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',borderRadius:12,overflow:'hidden',boxShadow:'0 3px 12px rgba(255,107,53,.35)',flexShrink:0 }}>
                <button onClick={() => dec(item.id)} className="press" style={{ background:'transparent',border:'none',color:'#fff',width:30,height:30,fontSize:17,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>−</button>
                <span style={{ color:'#fff',fontWeight:800,fontSize:13,minWidth:16,textAlign:'center' }}>{item.qty}</span>
                <button onClick={() => inc(item.id)} className="press" style={{ background:'transparent',border:'none',color:'#fff',width:30,height:30,fontSize:17,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>+</button>
              </div>
              <div style={{ fontSize:14,fontWeight:800,color:'var(--txt)',minWidth:52,textAlign:'right',flexShrink:0 }}>₹{item.price*item.qty}</div>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="glass anim-fadeUp" style={{ animationDelay:'.06s',borderRadius:18,padding:'14px 16px',marginBottom:14,boxShadow:'0 4px 18px var(--shadow)' }}>
          <div style={{ fontSize:13,fontWeight:800,color:'var(--txt)',marginBottom:11,display:'flex',alignItems:'center',gap:7,fontFamily:"'Sora',sans-serif" }}>
            <span style={{ fontSize:16 }}>🏷️</span> Apply Coupon
          </div>
          <div style={{ display:'flex',gap:9 }}>
            <input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&applyCoupon()} placeholder="Enter code..."
              style={{ flex:1,padding:'11px 14px',borderRadius:13,border:'2px solid var(--inpB)',background:'var(--inp)',fontSize:12.5,color:'var(--txt)',letterSpacing:1.2,fontWeight:700,transition:'border-color .2s' }}
              onFocus={e=>e.target.style.borderColor='#FF6B35'}
              onBlur={e=>e.target.style.borderColor='var(--inpB)'}
            />
            <button onClick={applyCoupon} className="press" style={{ padding:'11px 17px',borderRadius:13,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:11.5,fontWeight:800,cursor:'pointer',boxShadow:'0 4px 14px rgba(255,107,53,.38)',whiteSpace:'nowrap' }}>Apply</button>
          </div>
          {couponMsg && <div className="anim-fadeIn" style={{ marginTop:9,fontSize:11.5,color:disc>0?'var(--grn)':'#ef4444',fontWeight:600,background:disc>0?'rgba(34,197,94,.07)':'rgba(239,68,68,.07)',borderRadius:10,padding:'7px 11px',border:`1px solid ${disc>0?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}` }}>{couponMsg}</div>}
          <div style={{ display:'flex',flexWrap:'wrap',gap:7,marginTop:11 }}>
            {Object.keys(COUPONS).map(c => (
              <button key={c} onClick={() => { setCoupon(c); }} className="press"
                style={{ padding:'5px 12px',borderRadius:99,border:'1.5px solid var(--acc)',background:coupon===c?'rgba(255,107,53,.1)':'transparent',color:'var(--acc)',fontSize:10.5,fontWeight:700,cursor:'pointer',transition:'all .2s',letterSpacing:.5 }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Bill */}
        <div className="glass anim-fadeUp" style={{ animationDelay:'.1s',borderRadius:18,padding:'16px',marginBottom:14,boxShadow:'0 4px 18px var(--shadow)' }}>
          <div style={{ fontSize:13,fontWeight:800,color:'var(--txt)',marginBottom:14,display:'flex',alignItems:'center',gap:7,fontFamily:"'Sora',sans-serif" }}>
            <span style={{ fontSize:16 }}>🧾</span> Bill Details
          </div>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:9 }}>
            <span style={{ fontSize:12.5,color:'var(--sub)' }}>Item Total</span>
            <span style={{ fontSize:12.5,color:'var(--txt)',fontWeight:600 }}>₹{sub}</span>
          </div>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:9 }}>
            <span style={{ fontSize:12.5,color:'var(--sub)' }}>Canteen Prep Fee</span>
            <span style={{ fontSize:12.5,color:'var(--txt)',fontWeight:600 }}>₹{PREP_FEE}</span>
          </div>
          {dk > 0 && (
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:9 }}>
              <span style={{ fontSize:12.5,color:'var(--grn)' }}>Discount Applied</span>
              <span style={{ fontSize:12.5,color:'var(--grn)',fontWeight:700 }}>−₹{dk}</span>
            </div>
          )}
          <div style={{ height:1,background:'var(--bdr)',marginBottom:13 }} />
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <span style={{ fontSize:15,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Total Payable</span>
            <span style={{ fontSize:21,fontWeight:900,background:'linear-gradient(135deg,#FF6B35,#FF3D60)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontFamily:"'Sora',sans-serif" }}>₹{total}</span>
          </div>
        </div>

        {/* Savings note */}
        <div className="anim-fadeUp" style={{ animationDelay:'.14s',background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.18)',borderRadius:15,padding:'12px 15px',display:'flex',gap:11,alignItems:'center',marginBottom:18 }}>
          <div style={{ width:34,height:34,borderRadius:11,background:'rgba(34,197,94,.14)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0 }}>🎉</div>
          <div>
            <div style={{ fontSize:12.5,fontWeight:700,color:'var(--grn)' }}>No hidden charges!</div>
            <div style={{ fontSize:10.5,color:'var(--grn)',marginTop:1,opacity:.8 }}>All taxes included · Free canteen pickup</div>
          </div>
        </div>

        {/* Swipe to pay */}
        <div className="anim-fadeUp" style={{ animationDelay:'.16s',marginBottom:14 }}>
          <SwipeToPay total={total} onPay={() => onGoToPay({ items,sub,fee:PREP_FEE,dk,total })} />
        </div>

        <div style={{ textAlign:'center',margin:'10px 0 10px',fontSize:11.5,color:'var(--mut)' }}>— or choose payment method —</div>

        <button onClick={() => onGoToPay({ items,sub,fee:PREP_FEE,dk,total })} className="press anim-fadeUp"
          style={{ animationDelay:'.18s',width:'100%',padding:'15px',borderRadius:17,border:'none',background:'linear-gradient(135deg,#1e40af,#1d4ed8)',color:'#fff',fontSize:13.5,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 26px rgba(59,130,246,.38)',display:'flex',alignItems:'center',justifyContent:'center',gap:9,marginBottom:26 }}>
          💳 UPI / Card / Net Banking
        </button>
      </div>

      <BottomNav view="cart" go={go} cartCount={totalItems} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PAYMENT VIEW
// ═══════════════════════════════════════════════════════════════════════════
function PaymentView({ orderData, college, onSuccess, onBack }) {
  const [state,      setState]  = useState('methods');
  const [method,     setMethod] = useState(null);
  const [confetti,   setConfetti] = useState(false);
  const [failReason, setFail]   = useState('');
  const { total } = orderData;

  const METHODS = [
    { id:'gpay', label:'Google Pay / PhonePe', icon:'💚', sub:'Most popular · Instant' },
    { id:'upi',  label:'UPI ID / QR Code',      icon:'📱', sub:'BHIM, Paytm, any UPI' },
    { id:'card', label:'Credit / Debit Card',    icon:'💳', sub:'Visa, Mastercard, RuPay' },
    { id:'nb',   label:'Net Banking',             icon:'🏦', sub:'All major banks' },
  ];
  const FAIL_REASONS = ['Payment declined by bank','UPI timeout. Please retry.','Network error. Please try again.'];

  const pay = m => {
    setMethod(m); setState('processing');
    setTimeout(() => {
      if (Math.random() > .12) { setState('success'); setConfetti(true); setTimeout(onSuccess, 2800); }
      else { setState('failed'); setFail(FAIL_REASONS[Math.floor(Math.random()*FAIL_REASONS.length)]); }
    }, 2400);
  };

  return (
    <div style={{ position:'absolute',inset:0,background:'var(--bg)',display:'flex',flexDirection:'column' }}>
      <Confetti active={confetti} />
      <div className="glass-hdr" style={{ padding:'38px 16px 14px',flexShrink:0 }}>
        <div style={{ display:'flex',alignItems:'center',gap:13 }}>
          {state==='methods' && <button onClick={onBack} className="press" style={{ width:36,height:36,borderRadius:12,background:'var(--glass)',border:'1px solid var(--glassB)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,backdropFilter:'blur(12px)' }}>‹</button>}
          <div>
            <div style={{ fontSize:9.5,color:'var(--acc)',fontWeight:700,letterSpacing:.5,marginBottom:1 }}>📍 {college?.canteen||'Campus Canteen'}</div>
            <div style={{ fontSize:20,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>
              {state==='methods'?'Payment 💳':state==='processing'?'Processing...':state==='success'?'Payment Done! 🎉':'Payment Failed 😟'}
            </div>
          </div>
        </div>
      </div>
      <div className="hs" style={{ flex:1,overflowY:'auto',padding:'16px' }}>
        {state==='methods' && (
          <>
            <div className="anim-fadeIn glass" style={{ borderRadius:18,padding:'14px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:40,height:40,borderRadius:13,background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>🔒</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12,fontWeight:700,color:'var(--txt)' }}>100% Secure · 256-bit SSL</div>
                <div style={{ fontSize:10.5,color:'var(--mut)',marginTop:1 }}>PCI DSS Compliant · Your data is safe</div>
              </div>
              <div style={{ fontSize:22,fontWeight:900,color:'var(--acc)',fontFamily:"'Sora',sans-serif" }}>₹{total}</div>
            </div>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--sub)',letterSpacing:.8,textTransform:'uppercase',marginBottom:12 }}>Select Method</div>
            {METHODS.map(m => (
              <div key={m.id} onClick={() => pay(m.id)} className="press lift glass" style={{ borderRadius:18,padding:'14px 16px',marginBottom:10,display:'flex',alignItems:'center',gap:13,cursor:'pointer' }}>
                <div style={{ width:46,height:46,borderRadius:13,background:'var(--inp)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0,border:'1px solid var(--bdr)' }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:'var(--txt)' }}>{m.label}</div>
                  <div style={{ fontSize:10.5,color:'var(--mut)',marginTop:2 }}>{m.sub}</div>
                </div>
                <div style={{ color:'var(--mut)',fontSize:22 }}>›</div>
              </div>
            ))}
          </>
        )}
        {state==='processing' && (
          <div className="anim-fadeIn" style={{ textAlign:'center',padding:'48px 20px' }}>
            <div style={{ width:90,height:90,borderRadius:'50%',background:'linear-gradient(135deg,rgba(255,107,53,.12),rgba(255,61,96,.08))',margin:'0 auto 24px',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <div className="anim-spin" style={{ width:48,height:48,border:'3.5px solid rgba(255,107,53,.2)',borderTopColor:'#FF6B35',borderRadius:'50%' }} />
            </div>
            <div style={{ fontSize:20,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:8 }}>Verifying Payment</div>
            <div style={{ fontSize:13,color:'var(--sub)',marginBottom:28 }}>Connecting to {METHODS.find(m=>m.id===method)?.label||'bank'}...</div>
            <div style={{ height:5,borderRadius:99,background:'var(--bdr)',overflow:'hidden',maxWidth:260,margin:'0 auto' }}>
              <div style={{ height:'100%',borderRadius:99,background:'linear-gradient(90deg,#FF6B35,#FF3D60)',animation:'progressFill 2.4s ease forwards' }} />
            </div>
            <div style={{ fontSize:11,color:'var(--mut)',marginTop:12 }}>Don't press back or close the app</div>
          </div>
        )}
        {state==='success' && (
          <div className="anim-fadeIn" style={{ textAlign:'center',padding:'40px 20px' }}>
            <div className="anim-popIn anim-greenGlow" style={{ width:88,height:88,borderRadius:'50%',background:'linear-gradient(135deg,#22C55E,#16A34A)',margin:'0 auto 22px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 36px rgba(34,197,94,.45)' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20l9 9 15-16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="0" style={{ animation:'checkDraw .55s ease .1s both' }} /></svg>
            </div>
            <div style={{ fontSize:24,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:8 }}>Payment Successful! 🎉</div>
            <div style={{ fontSize:14,color:'var(--sub)',marginBottom:4 }}>₹{total} paid via {METHODS.find(m=>m.id===method)?.label}</div>
            <div style={{ fontSize:12,color:'var(--mut)' }}>Sending your order to the canteen...</div>
          </div>
        )}
        {state==='failed' && (
          <div className="anim-fadeIn" style={{ textAlign:'center',padding:'40px 20px' }}>
            <div className="anim-popIn" style={{ width:84,height:84,borderRadius:'50%',background:'linear-gradient(135deg,#EF4444,#DC2626)',margin:'0 auto 22px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 32px rgba(239,68,68,.4)' }}>
              <span style={{ fontSize:38,color:'#fff' }}>✕</span>
            </div>
            <div style={{ fontSize:20,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:8 }}>Payment Failed</div>
            <div style={{ fontSize:13,color:'var(--sub)',marginBottom:6 }}>{failReason}</div>
            <div className="glass" style={{ borderRadius:16,padding:'12px 16px',marginBottom:22,textAlign:'left' }}>
              <div style={{ fontSize:11,fontWeight:700,color:'var(--mut)',marginBottom:8,textTransform:'uppercase',letterSpacing:.7 }}>What to do?</div>
              {['Check your internet connection','Ensure sufficient balance','Try a different payment method'].map((t,i) => (
                <div key={i} style={{ display:'flex',gap:8,alignItems:'flex-start',marginBottom:6 }}>
                  <span style={{ color:'var(--acc)',fontWeight:700,marginTop:1 }}>•</span>
                  <span style={{ fontSize:12,color:'var(--sub)' }}>{t}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setState('methods')} className="press" style={{ width:'100%',padding:'15px',borderRadius:17,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:14,fontWeight:800,cursor:'pointer',boxShadow:'0 8px 28px rgba(255,107,53,.42)',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'center',gap:9 }}>🔄 Retry Payment</button>
            <button onClick={onBack} className="press" style={{ width:'100%',padding:'14px',borderRadius:17,border:'1px solid var(--bdr)',background:'transparent',color:'var(--sub)',fontSize:14,fontWeight:700,cursor:'pointer' }}>← Back to Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  TRACKING VIEW
// ═══════════════════════════════════════════════════════════════════════════
function TrackingView({ order, onDone, onViewReceipt, addToast }) {
  const maxPrepSecs = useMemo(() => {
    if (!order?.items||order.items.length===0) return 64;
    return Math.max(...order.items.map(i => i.time||5))*9;
  }, [order]);

  const [stage,      setStage]  = useState(0);
  const [countdown,  setCd]     = useState(maxPrepSecs);
  const [elapsed,    setEl]     = useState(0);
  const [notified,   setNotif]  = useState(false);
  const [completedIn,setDoneIn] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1800);
    const t2 = setTimeout(() => setStage(2), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  useEffect(() => { const t = setInterval(() => setEl(e=>e+1),1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (stage < 2) return;
    if (countdown <= 0) { if (!notified) { setNotif(true); setDoneIn(elapsed); setStage(3); addToast?.({ icon:'🎯',title:'Order Ready!',msg:`${order?.token||''}—Counter B · Pick it up!`,cta:'COLLECT' }); } return; }
    const t = setInterval(() => setCd(c => {
      if (c <= 1) { setDoneIn(elapsed+1); setStage(3); if (!notified) { setNotif(true); addToast?.({ icon:'🎯',title:'Order Ready!',msg:`${order?.token||''}—Counter B · Pick it up!`,cta:'COLLECT' }); } clearInterval(t); return 0; }
      return c-1;
    }),1000);
    return () => clearInterval(t);
  }, [stage, countdown]);

  const pct     = stage<2?0:stage>=3?1:(maxPrepSecs-countdown)/maxPrepSecs;
  const estMins = order?.items?Math.max(...order.items.map(i=>i.time||5)):5;
  const stages  = [
    { icon:'📋',label:'Order Received',   detail:'Canteen has your order!',                                         time:'Just now', done:true },
    { icon:'✅',label:'Payment Confirmed', detail:`₹${order?.total||0} — ${order?.payMethod||'paid successfully'}`, time:'',        done:stage>=1 },
    { icon:'👨‍🍳',label:"Chef is Cooking", detail:'"Almost there... don\'t get hungry 😄"',                          time:stage===2?fmtSecs(elapsed):'', done:stage>=3, active:stage===2 },
    { icon:'🎯',label:'Ready for Pickup',  detail:`Counter B · ${order?.token||'QB42'}`,                            time:completedIn?`Done in ${fmtSecs(completedIn)}`:'', done:stage>=3 },
  ];

  return (
    <div style={{ position:'absolute',inset:0,background:'var(--bg)',display:'flex',flexDirection:'column' }}>
      <div className="glass-hdr" style={{ padding:'38px 16px 14px',flexShrink:0 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div>
            <div style={{ fontSize:9.5,color:'var(--acc)',fontWeight:700,letterSpacing:.5,marginBottom:2 }}>📍 {order?.canteen||'Campus Canteen'}</div>
            <div style={{ fontSize:20,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Live Tracking 📍</div>
          </div>
          <div className="glass" style={{ borderRadius:13,padding:'6px 13px' }}>
            <div style={{ fontSize:9,color:'var(--mut)',fontWeight:600,letterSpacing:.4 }}>ORDER</div>
            <div style={{ fontSize:12.5,fontWeight:800,color:'var(--acc)' }}>{order?.id||'QB-0000'}</div>
          </div>
        </div>
      </div>
      <div className="hs" style={{ flex:1,overflowY:'auto',padding:'16px' }}>
        <div className="anim-scaleIn glass" style={{ borderRadius:26,padding:'22px 20px',marginBottom:14,overflow:'hidden',position:'relative' }}>
          <div style={{ position:'absolute',top:-40,right:-40,width:150,height:150,borderRadius:'50%',background:stage>=3?'rgba(34,197,94,.06)':'rgba(255,107,53,.05)',transition:'background .7s' }} />
          <CircularTimer progress={pct} countdown={countdown} stage={stage} completedIn={completedIn} />
          <div style={{ textAlign:'center',marginTop:16 }}>
            <div style={{ fontSize:17,fontWeight:800,color:stage>=3?'var(--grn)':'var(--txt)',fontFamily:"'Sora',sans-serif",transition:'color .5s',marginBottom:4 }}>
              {stage===0?'Order Received! 📋':stage===1?'Payment Confirmed ✅':stage===2?'Cooking with love ❤️':'Order Ready! 🎉'}
            </div>
            <div style={{ fontSize:12,color:'var(--sub)' }}>
              {stage===2?`Est. ~${estMins} min · Prep started`:stage>=3?`Collected at Counter B · Token ${order?.token||''}`:'' }
            </div>
          </div>
          {stage>=3&&completedIn&&(
            <div className="anim-popIn" style={{ marginTop:14,background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.25)',borderRadius:14,padding:'10px 16px',textAlign:'center' }}>
              <div style={{ fontSize:12,fontWeight:700,color:'var(--grn)' }}>✅ Completed in {fmtSecs(completedIn)}</div>
              <div style={{ fontSize:10.5,color:'var(--mut)',marginTop:2 }}>Show token {order?.token||''} at Counter B</div>
            </div>
          )}
          {stage===2&&(
            <div style={{ marginTop:14 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                <span style={{ fontSize:10.5,color:'var(--sub)',fontWeight:600 }}>Preparation</span>
                <span style={{ fontSize:10.5,fontWeight:800,color:'var(--acc)' }}>{Math.round(pct*100)}%</span>
              </div>
              <div style={{ height:5,borderRadius:99,background:'var(--bdr)',overflow:'hidden' }}>
                <div style={{ height:'100%',borderRadius:99,background:'linear-gradient(90deg,#FF6B35,#FF3D60)',width:`${pct*100}%`,transition:'width .9s ease' }} />
              </div>
            </div>
          )}
        </div>
        <div className="glass" style={{ borderRadius:22,padding:'16px',marginBottom:14 }}>
          <div style={{ fontSize:13,fontWeight:800,color:'var(--txt)',marginBottom:16,fontFamily:"'Sora',sans-serif" }}>⏱️ Order Timeline</div>
          {stages.map((s,i) => (
            <div key={i} style={{ display:'flex',gap:14,marginBottom:i<stages.length-1?18:0,position:'relative' }}>
              {i<stages.length-1&&<div style={{ position:'absolute',left:17,top:38,width:2,height:20,background:stages[i+1].done||stages[i+1].active?'linear-gradient(to bottom,#FF6B35,rgba(255,107,53,.2))':'var(--bdr)',transition:'background .5s',borderRadius:99 }} />}
              <div style={{ width:35,height:35,borderRadius:'50%',background:s.done?'linear-gradient(135deg,#22C55E,#16A34A)':s.active?'linear-gradient(135deg,#FF6B35,#FF3D60)':'var(--inp)',border:`2px solid ${s.done?'#22C55E':s.active?'#FF6B35':'var(--bdr)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0,transition:'all .4s',boxShadow:s.active?'0 4px 16px rgba(255,107,53,.42)':s.done?'0 4px 16px rgba(34,197,94,.3)':'none' }}>
                {s.done?'✓':s.icon}
              </div>
              <div style={{ paddingTop:6,flex:1 }}>
                <div style={{ fontSize:13,fontWeight:700,color:s.done||s.active?'var(--txt)':'var(--mut)',transition:'color .4s',fontFamily:"'Sora',sans-serif" }}>{s.label}</div>
                <div style={{ fontSize:11,color:'var(--sub)',marginTop:1 }}>{s.detail}</div>
                {s.time&&<div style={{ fontSize:10,color:'var(--acc)',fontWeight:700,marginTop:2 }}>{s.time}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="glass" style={{ borderRadius:20,padding:'14px 16px',marginBottom:14 }}>
          <div style={{ fontSize:13,fontWeight:800,color:'var(--txt)',marginBottom:12,fontFamily:"'Sora',sans-serif" }}>🍱 Your Order</div>
          {order?.items?.map((item,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:12,marginBottom:i<order.items.length-1?10:0 }}>
              <div style={{ width:38,height:38,borderRadius:11,background:item.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0 }}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5,fontWeight:700,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>{item.name}</div>
                <div style={{ fontSize:10.5,color:'var(--mut)' }}>Qty {item.qty} · ₹{item.price*item.qty}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop:'1px solid var(--bdr)',paddingTop:10,marginTop:12,display:'flex',justifyContent:'space-between' }}>
            <span style={{ fontSize:12,color:'var(--sub)' }}>Total Paid</span>
            <span style={{ fontSize:16,fontWeight:900,color:'var(--acc)' }}>₹{order?.total||0}</span>
          </div>
        </div>
        <div style={{ display:'flex',gap:10,marginBottom:24 }}>
          <button onClick={onViewReceipt} className="press glass" style={{ flex:1,padding:'14px',borderRadius:16,border:'1px solid var(--bdr)',color:'var(--sub)',fontSize:13,fontWeight:700,cursor:'pointer',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',gap:7 }}>🧾 View Receipt</button>
          <button onClick={onDone} className="press" style={{ flex:2,padding:'14px',borderRadius:16,border:'none',background:stage>=3?'linear-gradient(135deg,#22C55E,#16A34A)':'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:13.5,fontWeight:800,cursor:'pointer',boxShadow:stage>=3?'0 8px 28px rgba(34,197,94,.4)':'0 6px 24px rgba(255,107,53,.38)',transition:'all .5s',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
            {stage>=3?'🏠 Go Home':'← Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  RECEIPT VIEW
// ═══════════════════════════════════════════════════════════════════════════
function ReceiptView({ order, onDone }) {
  const [copied, setCopied] = useState(false);
  const shareText = `QuickBite Receipt\nOrder: ${order?.id}\nCanteen: ${order?.canteen}\n${order?.items?.map(i=>`• ${i.name} ×${i.qty} — ₹${i.price*i.qty}`).join('\n')}\nTotal: ₹${order?.total}\nDate: ${fmtDate(order?.date)}\nToken: ${order?.token}`;
  const copy  = () => { navigator.clipboard?.writeText(shareText).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); }); };
  const print = () => window.print();

  return (
    <div style={{ position:'absolute',inset:0,background:'var(--bg)',display:'flex',flexDirection:'column' }}>
      <div className="glass-hdr no-print" style={{ padding:'38px 16px 14px',flexShrink:0 }}>
        <div style={{ display:'flex',alignItems:'center',gap:13 }}>
          <button onClick={onDone} className="press" style={{ width:36,height:36,borderRadius:12,background:'var(--glass)',border:'1px solid var(--glassB)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,backdropFilter:'blur(12px)' }}>‹</button>
          <div style={{ fontSize:20,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Receipt 🧾</div>
        </div>
      </div>
      <div className="hs" style={{ flex:1,overflowY:'auto',padding:'16px' }}>
        <div className="print-card anim-slideLeft" style={{ background:'var(--card)',borderRadius:24,overflow:'hidden',border:'1px solid var(--bdr)',boxShadow:'0 8px 40px var(--shadow)' }}>
          <div style={{ background:'linear-gradient(135deg,#FF6B35,#FF3D60)',padding:'22px 20px',textAlign:'center',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',inset:0,opacity:.08,fontSize:120,display:'flex',alignItems:'center',justifyContent:'center' }}>🍔</div>
            <QBLogo size={48} style={{ marginBottom:10,borderRadius:16,boxShadow:'0 6px 20px rgba(0,0,0,.25)' }} />
            <div style={{ fontSize:22,fontWeight:900,color:'#fff',fontFamily:"'Sora',sans-serif",letterSpacing:-1 }}>QuickBite</div>
            <div style={{ fontSize:11,color:'rgba(255,255,255,.75)',marginTop:4,letterSpacing:.5 }}>{order?.canteen||'Campus Canteen'}</div>
          </div>
          <div style={{ padding:'18px 20px' }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:16 }}>
              <div>
                <div style={{ fontSize:10,color:'var(--mut)',fontWeight:600,letterSpacing:.6,textTransform:'uppercase' }}>Order ID</div>
                <div style={{ fontSize:16,fontWeight:900,color:'var(--acc)',fontFamily:"'Sora',sans-serif" }}>{order?.id||'QB-0000'}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:10,color:'var(--mut)',fontWeight:600,letterSpacing:.6,textTransform:'uppercase' }}>Token</div>
                <div style={{ fontSize:16,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>{order?.token||'QB42'}</div>
              </div>
            </div>
            <div style={{ fontSize:10.5,color:'var(--mut)',marginBottom:14 }}>{fmtDate(order?.date)}</div>
            {order?.items?.map((item,i) => (
              <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:10,marginBottom:10,borderBottom:i<order.items.length-1?'1px solid var(--bdr)':'none' }}>
                <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <div style={{ width:34,height:34,borderRadius:10,background:item.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{item.emoji}</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>{item.name}</div>
                    <div style={{ fontSize:10.5,color:'var(--mut)' }}>₹{item.price} × {item.qty}</div>
                  </div>
                </div>
                <div style={{ fontSize:13.5,fontWeight:800,color:'var(--txt)' }}>₹{item.price*item.qty}</div>
              </div>
            ))}
            <div style={{ borderTop:'2px dashed var(--bdr)',paddingTop:14,marginTop:4 }}>
              {[['Item Total',`₹${order?.sub||0}`],['Service Fee',`₹${order?.fee||PREP_FEE}`]].map(([l,v]) => (
                <div key={l} style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                  <span style={{ fontSize:12,color:'var(--sub)' }}>{l}</span>
                  <span style={{ fontSize:12,color:'var(--txt)',fontWeight:600 }}>{v}</span>
                </div>
              ))}
              {order?.dk>0&&<div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}><span style={{ fontSize:12,color:'var(--grn)' }}>Discount</span><span style={{ fontSize:12,color:'var(--grn)',fontWeight:700 }}>−₹{order.dk}</span></div>}
              <div style={{ borderTop:'2px solid var(--bdr)',paddingTop:12,display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:4 }}>
                <span style={{ fontSize:15,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Total Paid</span>
                <span style={{ fontSize:22,fontWeight:900,background:'linear-gradient(135deg,#FF6B35,#FF3D60)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>₹{order?.total||0}</span>
              </div>
            </div>
            <div style={{ marginTop:18,textAlign:'center' }}>
              <div style={{ fontSize:11,color:'var(--mut)',marginBottom:4 }}>Payment: {order?.payMethod||'Online'}</div>
              <div style={{ fontSize:11,color:'var(--grn)',fontWeight:600 }}>✅ Payment Successful</div>
              <div style={{ marginTop:14,fontSize:12,color:'var(--mut)',fontStyle:'italic' }}>"Cooked with love ❤️ — QuickBite Team"</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex',gap:10,marginTop:16,marginBottom:26 }} className="no-print">
          <button onClick={copy} className="press glass" style={{ flex:1,padding:'14px',borderRadius:16,border:'1px solid var(--bdr)',color:copied?'var(--grn)':'var(--sub)',fontSize:13,fontWeight:700,cursor:'pointer',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',gap:7,transition:'color .2s' }}>
            {copied?'✅ Copied!':'📋 Copy Receipt'}
          </button>
          <button onClick={print} className="press" style={{ flex:1,padding:'14px',borderRadius:16,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,.38)',display:'flex',alignItems:'center',justifyContent:'center',gap:7 }}>
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  HISTORY VIEW
// ═══════════════════════════════════════════════════════════════════════════
function HistoryView({ orders, go, addToast, setCart, cartCount = 0 }) {
  const totalSpent = orders.reduce((s,o) => s+o.total, 0);
  const reorder = order => {
    const nc = {};
    order.items.forEach(i => { nc[i.id] = (nc[i.id]||0)+i.qty; });
    setCart(nc);
    addToast({ icon:'🛒',title:'Items back in cart!',msg:`${order.items.length} item${order.items.length!==1?'s':''} added`,cta:'VIEW' });
    go('cart');
  };

  return (
    <div style={{ position:'absolute',inset:0,background:'var(--bg)' }}>
      <div className="glass-hdr" style={{ position:'absolute',top:0,left:0,right:0,zIndex:20,padding:'38px 16px 14px' }}>
        <div style={{ fontSize:20,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:2 }}>Order History 📋</div>
        <div style={{ fontSize:12,color:'var(--sub)' }}>{orders.length} orders · ₹{totalSpent} total spent</div>
      </div>
      <div className="hs" style={{ position:'absolute',top:88,bottom:74,overflowY:'auto',padding:'14px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign:'center',padding:'60px 20px' }}>
            <div style={{ fontSize:56,marginBottom:14 }}>📭</div>
            <div style={{ fontSize:19,fontWeight:800,color:'var(--sub)',marginBottom:8,fontFamily:"'Sora',sans-serif" }}>No orders yet</div>
            <div style={{ fontSize:13,color:'var(--mut)',marginBottom:26 }}>Your order history appears here after your first order!</div>
            <button onClick={() => go('home')} className="press" style={{ padding:'13px 32px',borderRadius:16,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:13.5,fontWeight:800,cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,.42)' }}>Order Now →</button>
          </div>
        ) : (
          <>
            <div style={{ display:'flex',gap:10,marginBottom:16 }}>
              {[[orders.length,'Orders','📋'],[`₹${Math.round(totalSpent/Math.max(orders.length,1))}`,'Avg Order','📊'],[orders.filter(o=>o.status==='Delivered').length,'Delivered','✅']].map(([v,l,e]) => (
                <div key={l} className="glass" style={{ flex:1,borderRadius:16,padding:'12px 10px',textAlign:'center' }}>
                  <div style={{ fontSize:12,marginBottom:4 }}>{e}</div>
                  <div style={{ fontSize:16,fontWeight:800,color:'var(--acc)',fontFamily:"'Sora',sans-serif" }}>{v}</div>
                  <div style={{ fontSize:9,color:'var(--mut)',fontWeight:600,letterSpacing:.4,textTransform:'uppercase',marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            {orders.map((order,idx) => (
              <div key={order.id} className="anim-fadeUp lift glass" style={{ animationDelay:`${idx*.05}s`,borderRadius:22,overflow:'hidden',marginBottom:12 }}>
                <div style={{ background:'linear-gradient(135deg,rgba(255,107,53,.08),rgba(255,61,96,.05))',padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:13,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>{order.id}</div>
                    <div style={{ fontSize:10.5,color:'var(--sub)',marginTop:1 }}>{fmtDate(order.date)} · {order.college}</div>
                  </div>
                  <div style={{ background:'rgba(34,197,94,.1)',color:'var(--grn)',fontSize:10.5,fontWeight:700,padding:'4px 11px',borderRadius:99,border:'1px solid rgba(34,197,94,.2)' }}>✓ {order.status}</div>
                </div>
                <div style={{ padding:'13px 16px' }}>
                  {order.items.map((item,i) => (
                    <div key={i} style={{ display:'flex',alignItems:'center',gap:10,marginBottom:i<order.items.length-1?9:0 }}>
                      <div style={{ width:36,height:36,borderRadius:11,background:item.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{item.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12.5,fontWeight:700,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>{item.name}</div>
                        <div style={{ fontSize:10.5,color:'var(--mut)' }}>×{item.qty} · ₹{item.price*item.qty}</div>
                      </div>
                    </div>
                  ))}
                  <div className="glass" style={{ borderRadius:12,padding:'9px 13px',margin:'12px 0',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <div style={{ fontSize:11,color:'var(--sub)' }}>
                      {order.dk>0&&<span style={{ color:'var(--grn)',fontWeight:700 }}>Saved ₹{order.dk} · </span>}
                      Token {order.token}
                    </div>
                    <div style={{ fontSize:17,fontWeight:900,color:'var(--acc)',fontFamily:"'Sora',sans-serif" }}>₹{order.total}</div>
                  </div>
                  <div style={{ display:'flex',gap:9 }}>
                    <button className="press glass" style={{ flex:1,padding:'10px',borderRadius:13,border:'1px solid var(--bdr)',background:'transparent',color:'var(--sub)',fontSize:11.5,fontWeight:700,cursor:'pointer' }}>⭐ Rate</button>
                    <button onClick={() => reorder(order)} className="press" style={{ flex:1,padding:'10px',borderRadius:13,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontSize:11.5,fontWeight:800,cursor:'pointer',boxShadow:'0 4px 14px rgba(255,107,53,.32)' }}>🔄 Reorder</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div style={{ height:8 }} />
      </div>
      <BottomNav view="history" go={go} cartCount={cartCount} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PROFILE VIEW  — FIX: centered layout, premium glass aesthetic
// ═══════════════════════════════════════════════════════════════════════════
function ProfileView({ user, college, dark, toggleDark, go, orders, onLogout, onChangeCollege, cartCount = 0 }) {
  const totalSpent = orders.reduce((s,o) => s+o.total, 0);
  const avatarBg   = AVATAR_GRAD[(user?.avatar||0) % AVATAR_GRAD.length];
  const [modal,         setModal]       = useState(null);
  const [notifOn,       setNotifOn]     = useState(true);
  const [feedbackText,  setFeedback]    = useState('');
  const [feedbackSent,  setFeedbackSent]= useState(false);
  const close = () => setModal(null);

  return (
    <div style={{ position:'absolute',inset:0,background:'var(--bg)' }}>
      <div className="glass-hdr" style={{ position:'absolute',top:0,left:0,right:0,zIndex:20,padding:'38px 16px 14px' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{ fontSize:20,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Profile 👤</div>
          <button onClick={toggleDark} className="press glass" style={{ width:36,height:36,borderRadius:12,border:'1px solid var(--glassB)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,backdropFilter:'blur(16px)' }}>{dark?'☀️':'🌙'}</button>
        </div>
      </div>

      <div className="hs" style={{ position:'absolute',top:88,bottom:74,overflowY:'auto',padding:'14px 16px' }}>

        {/* ── Profile card ── */}
        <div className="anim-fadeUp glass" style={{ borderRadius:26,overflow:'hidden',marginBottom:14,boxShadow:'0 8px 36px var(--shadow)' }}>
          {/* Avatar section — centered */}
          <div style={{ background:'linear-gradient(160deg,rgba(255,107,53,.14),rgba(255,61,96,.08))',padding:'28px 20px 22px',textAlign:'center',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',inset:0,opacity:.05,fontSize:100,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none' }}>👤</div>
            <div style={{ position:'relative' }}>
              <div className="anim-popIn" style={{ width:76,height:76,borderRadius:24,background:avatarBg,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:900,color:'#fff',boxShadow:'0 10px 30px rgba(0,0,0,.25)',marginBottom:12,fontFamily:"'Sora',sans-serif" }}>
                {user?.name?.[0]||'U'}
              </div>
              <div style={{ fontSize:21,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",letterSpacing:-.5,marginBottom:4 }}>{user?.name||'Student'}</div>
              <div style={{ fontSize:12,color:'var(--sub)',marginBottom:11 }}>{user?.email||'student@college.edu.in'}</div>
              <div style={{ display:'flex',justifyContent:'center',gap:7,flexWrap:'wrap' }}>
                <div style={{ display:'inline-flex',alignItems:'center',gap:5,background:'rgba(255,107,53,.1)',border:'1px solid rgba(255,107,53,.22)',borderRadius:99,padding:'4px 12px' }}>
                  <span style={{ fontSize:12 }}>{college?.emoji||'🎓'}</span>
                  <span style={{ fontSize:11,fontWeight:700,color:'#ea580c' }}>{college?.short||'Campus'}</span>
                </div>
                {user?.method&&<div style={{ display:'inline-flex',alignItems:'center',gap:4,background:'var(--inp)',border:'1px solid var(--bdr)',borderRadius:99,padding:'4px 12px' }}>
                  <span style={{ fontSize:10.5,fontWeight:700,color:'var(--sub)' }}>{user.method==='google'?'🔵 Google':user.method==='otp'?'📱 OTP':'📧 Email'}</span>
                </div>}
              </div>
            </div>
          </div>
          {/* Canteen row */}
          <div style={{ padding:'13px 20px',borderTop:'1px solid var(--bdr)',display:'flex',alignItems:'center',gap:11 }}>
            <span style={{ fontSize:22,flexShrink:0 }}>{college?.emoji||'🏫'}</span>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:12.5,fontWeight:700,color:'var(--txt)',fontFamily:"'Sora',sans-serif",overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{college?.canteen||'Campus Canteen'}</div>
              <div style={{ fontSize:10.5,color:'var(--mut)',marginTop:1 }}>{college?.name||'Your College'} · {college?.area||''}</div>
            </div>
            <button onClick={onChangeCollege} className="press glass" style={{ padding:'6px 13px',borderRadius:10,border:'1px solid var(--bdr)',color:'var(--sub)',fontSize:10.5,fontWeight:700,cursor:'pointer',background:'transparent',backdropFilter:'blur(10px)',flexShrink:0 }}>Change</button>
          </div>
        </div>

        {/* Stats — centered grid */}
        <div className="anim-fadeUp" style={{ animationDelay:'.06s',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14 }}>
          {[[orders.length,'Orders','📋'],[`₹${totalSpent}`,'Spent','💰'],[`${orders.length*6+10}pts`,'Points','⭐']].map(([v,l,e]) => (
            <div key={l} onClick={() => l==='Orders'&&go('history')} className="press glass" style={{ borderRadius:18,padding:'16px 10px',textAlign:'center',cursor:l==='Orders'?'pointer':'default' }}>
              <div style={{ fontSize:20,marginBottom:5 }}>{e}</div>
              <div style={{ fontSize:16,fontWeight:800,color:'var(--acc)',fontFamily:"'Sora',sans-serif",lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:9.5,color:'var(--mut)',fontWeight:600,letterSpacing:.4,textTransform:'uppercase',marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Settings list */}
        <div className="anim-fadeUp glass" style={{ animationDelay:'.1s',borderRadius:20,overflow:'hidden',marginBottom:14,boxShadow:'0 4px 20px var(--shadow)' }}>
          <div style={{ padding:'12px 16px',borderBottom:'1px solid var(--bdr)' }}>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--mut)',letterSpacing:.8,textTransform:'uppercase' }}>Settings & More</div>
          </div>
          {[
            { icon:dark?'☀️':'🌙', label:dark?'Switch to Light Mode':'Switch to Dark Mode', action:toggleDark,    toggle:true, on:dark },
            { icon:'🔔', label:'Notifications',       action:()=>setModal('notifications'), badge:notifOn?'ON':null, chevron:true },
            { icon:'🛡️', label:'Privacy & Security',  action:()=>setModal('privacy'),        chevron:true },
            { icon:'❓', label:'Help & Support',       action:()=>setModal('help'),            chevron:true },
            { icon:'⭐', label:'Rate QuickBite',       action:()=>setModal('rate'),            chevron:true },
            { icon:'💬', label:'Send Feedback',        action:()=>setModal('feedback'),        chevron:true },
            { icon:'📤', label:'Share App',            action:()=>{ if(navigator.share) navigator.share({ title:'QuickBite',text:'Skip the queue!',url:window.location.href }); else navigator.clipboard?.writeText(window.location.href); }, chevron:true },
          ].map((item,i,arr) => (
            <div key={item.label} onClick={item.action} className="press"
              style={{ padding:'13px 16px',borderBottom:i<arr.length-1?'1px solid var(--bdr)':'none',display:'flex',alignItems:'center',gap:13,cursor:'pointer',transition:'background .15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--inp)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{ width:38,height:38,borderRadius:12,background:i===0?'linear-gradient(135deg,rgba(255,107,53,.15),rgba(255,61,96,.1))':'var(--inp)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0,border:'1px solid var(--bdr)' }}>{item.icon}</div>
              <div style={{ fontSize:13.5,fontWeight:600,color:'var(--txt)',flex:1 }}>{item.label}</div>
              {item.badge&&<div style={{ background:'rgba(34,197,94,.12)',color:'var(--grn)',fontSize:9.5,fontWeight:800,padding:'3px 9px',borderRadius:99,border:'1px solid rgba(34,197,94,.2)' }}>{item.badge}</div>}
              {item.chevron&&<div style={{ color:'var(--mut)',fontSize:20 }}>›</div>}
              {item.toggle&&<div style={{ width:42,height:24,borderRadius:99,background:item.on?'linear-gradient(135deg,#FF6B35,#FF3D60)':'var(--bdr)',position:'relative',transition:'background .3s',flexShrink:0 }}>
                <div style={{ position:'absolute',top:3,left:item.on?20:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left .28s cubic-bezier(.34,1.56,.64,1)',boxShadow:'0 2px 6px rgba(0,0,0,.2)' }} />
              </div>}
            </div>
          ))}
        </div>

        {/* Recent orders */}
        {orders.length > 0 && (
          <div className="anim-fadeUp glass" style={{ animationDelay:'.14s',borderRadius:20,overflow:'hidden',marginBottom:14 }}>
            <div style={{ padding:'13px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <div style={{ fontSize:13,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Recent Orders</div>
              <button onClick={() => go('history')} style={{ fontSize:11.5,fontWeight:700,color:'var(--acc)',background:'none',border:'none',cursor:'pointer' }}>View All →</button>
            </div>
            {orders.slice(0,2).map((order,i) => (
              <div key={order.id} style={{ padding:'12px 16px',borderBottom:i<1&&orders.length>1?'1px solid var(--bdr)':'none',display:'flex',alignItems:'center',gap:10 }}>
                <div style={{ display:'flex',gap:4,flex:1,flexWrap:'wrap' }}>
                  {order.items.slice(0,3).map((item,j) => <div key={j} style={{ width:30,height:30,borderRadius:9,background:item.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14 }}>{item.emoji}</div>)}
                  {order.items.length>3&&<div style={{ width:30,height:30,borderRadius:9,background:'var(--inp)',border:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:'var(--sub)' }}>+{order.items.length-3}</div>}
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:14,fontWeight:800,color:'var(--acc)',fontFamily:"'Sora',sans-serif" }}>₹{order.total}</div>
                  <div style={{ fontSize:9.5,color:'var(--mut)',marginTop:1 }}>{fmtDate(order.date)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Version */}
        <div className="anim-fadeUp" style={{ animationDelay:'.16s',textAlign:'center',marginBottom:14 }}>
          <div style={{ fontSize:11,color:'var(--mut)',fontWeight:600 }}>QuickBite v2.0 · localStorage mode</div>
          <div style={{ fontSize:10,color:'var(--mut)',marginTop:2 }}>🟡 Connect Firebase for cloud sync</div>
        </div>

        {/* Logout */}
        <div className="anim-fadeUp" style={{ animationDelay:'.18s',marginBottom:24 }}>
          <button onClick={onLogout} className="press" style={{ width:'100%',padding:'15px',borderRadius:17,border:'2px solid rgba(239,68,68,.25)',background:'rgba(239,68,68,.06)',color:'#ef4444',fontSize:14,fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:9 }}>
            🚪 Log Out
          </button>
        </div>
      </div>

      <BottomNav view="profile" go={go} cartCount={cartCount} />

      {/* ── BOTTOM SHEET MODALS ── */}
      {modal && (
        <div className="anim-fadeIn" style={{ position:'absolute',inset:0,background:'rgba(0,0,0,.6)',backdropFilter:'blur(14px)',zIndex:200,display:'flex',alignItems:'flex-end' }} onClick={close}>
          <div className="anim-slideUp" style={{ width:'100%',background:'var(--card)',borderRadius:'28px 28px 0 0',padding:'0 0 36px',maxHeight:'80vh',overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:40,height:4,borderRadius:99,background:'var(--bdr)',margin:'12px auto 0' }} />

            {modal==='notifications' && (
              <div style={{ padding:'20px 20px 0' }}>
                <div style={{ fontSize:18,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:4 }}>🔔 Notifications</div>
                <div style={{ fontSize:12,color:'var(--mut)',marginBottom:20 }}>Control what QuickBite can notify you about</div>
                {[{label:'Order Ready Alerts',sub:'Get notified when food is ready',on:true},{label:'Promo & Deals',sub:'Flash sales and coupon alerts',on:notifOn},{label:'New Menu Items',sub:'When canteen adds new dishes',on:false},{label:'Weekly Summary',sub:'Your spending & order digest',on:true}].map((n,i) => (
                  <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:i<3?'1px solid var(--bdr)':'none' }}>
                    <div>
                      <div style={{ fontSize:13,fontWeight:700,color:'var(--txt)' }}>{n.label}</div>
                      <div style={{ fontSize:11,color:'var(--mut)',marginTop:2 }}>{n.sub}</div>
                    </div>
                    <div onClick={() => i===1&&setNotifOn(p=>!p)} style={{ width:42,height:24,borderRadius:99,background:(i===1?notifOn:n.on)?'linear-gradient(135deg,#FF6B35,#FF3D60)':'var(--bdr)',position:'relative',cursor:'pointer',flexShrink:0,transition:'background .3s' }}>
                      <div style={{ position:'absolute',top:3,left:(i===1?notifOn:n.on)?20:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left .28s cubic-bezier(.34,1.56,.64,1)',boxShadow:'0 2px 6px rgba(0,0,0,.2)' }} />
                    </div>
                  </div>
                ))}
                <button onClick={close} className="press" style={{ width:'100%',marginTop:20,padding:'14px',borderRadius:16,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 6px 22px rgba(255,107,53,.38)' }}>Save Preferences</button>
              </div>
            )}

            {modal==='privacy' && (
              <div style={{ padding:'20px 20px 0' }}>
                <div style={{ fontSize:18,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:4 }}>🛡️ Privacy & Security</div>
                <div style={{ fontSize:12,color:'var(--mut)',marginBottom:20 }}>Your data is safe with us</div>
                {[{icon:'🔐',title:'End-to-End Encryption',desc:'All payments are encrypted with 256-bit SSL'},{icon:'🗄️',title:'Data Storage',desc:'Your data is stored locally in your browser'},{icon:'🚫',title:'No Ads or Tracking',desc:'We never sell your data to third parties'},{icon:'🗑️',title:'Delete Account',desc:'Permanently remove all your data',danger:true}].map((p,i) => (
                  <div key={i} className="press" style={{ display:'flex',gap:13,padding:'13px 0',borderBottom:i<3?'1px solid var(--bdr)':'none',cursor:'pointer' }} onClick={() => p.danger&&alert('In production, this deletes all your data.')}>
                    <div style={{ width:40,height:40,borderRadius:13,background:p.danger?'rgba(239,68,68,.08)':'var(--inp)',border:`1px solid ${p.danger?'rgba(239,68,68,.2)':'var(--bdr)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{p.icon}</div>
                    <div><div style={{ fontSize:13,fontWeight:700,color:p.danger?'#ef4444':'var(--txt)' }}>{p.title}</div><div style={{ fontSize:11,color:'var(--mut)',marginTop:2 }}>{p.desc}</div></div>
                  </div>
                ))}
                <button onClick={close} className="press" style={{ width:'100%',marginTop:20,padding:'14px',borderRadius:16,border:'1px solid var(--bdr)',background:'transparent',color:'var(--sub)',fontWeight:700,fontSize:14,cursor:'pointer' }}>Close</button>
              </div>
            )}

            {modal==='help' && (
              <div style={{ padding:'20px 20px 0' }}>
                <div style={{ fontSize:18,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:4 }}>❓ Help & Support</div>
                <div style={{ fontSize:12,color:'var(--mut)',marginBottom:20 }}>We're here to help you 24/7</div>
                {[['How do I place an order?','Browse the menu, add items to cart, and swipe to pay or choose a payment method.'],['How long does pickup take?','Usually 3–10 minutes depending on your order. The live timer shows exact prep time.'],['Can I cancel my order?','Orders can be cancelled within 60 seconds of placing. After that, contact the canteen counter.'],['My payment failed — what now?','No money is deducted on failed payments. Try again or use a different method.'],['How do coupons work?','Enter the coupon code in cart before payment. Try: QUICK10, COLLEGE20, MORNING15, FREE100.']].map(([q,a],i) => (
                  <div key={i} style={{ padding:'13px 0',borderBottom:i<4?'1px solid var(--bdr)':'none' }}>
                    <div style={{ fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:5 }}>Q: {q}</div>
                    <div style={{ fontSize:11.5,color:'var(--sub)',lineHeight:1.6 }}>→ {a}</div>
                  </div>
                ))}
                <div style={{ marginTop:16,padding:'14px',background:'rgba(255,107,53,.06)',borderRadius:14,border:'1px solid rgba(255,107,53,.15)' }}>
                  <div style={{ fontSize:12,fontWeight:700,color:'var(--acc)' }}>📧 Still need help?</div>
                  <div style={{ fontSize:11,color:'var(--sub)',marginTop:4 }}>Email us at support@quickbite.app</div>
                </div>
                <button onClick={close} className="press" style={{ width:'100%',marginTop:16,padding:'14px',borderRadius:16,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer' }}>Got It 👍</button>
              </div>
            )}

            {modal==='rate' && (
              <div style={{ padding:'20px 20px 0',textAlign:'center' }}>
                <div style={{ fontSize:42,marginBottom:10 }}>⭐</div>
                <div style={{ fontSize:18,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:6 }}>Enjoying QuickBite?</div>
                <div style={{ fontSize:13,color:'var(--sub)',marginBottom:22 }}>Your rating helps us improve and reach more students</div>
                <div style={{ display:'flex',justifyContent:'center',gap:10,marginBottom:22 }}>
                  {[1,2,3,4,5].map(s => (
                    <div key={s} style={{ fontSize:36,cursor:'pointer',transition:'transform .2s' }}
                      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.3)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                      onClick={close}>⭐</div>
                  ))}
                </div>
                <button onClick={close} className="press" style={{ width:'100%',padding:'14px',borderRadius:16,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer',marginBottom:10 }}>Rate on App Store 🚀</button>
                <button onClick={close} style={{ background:'none',border:'none',color:'var(--mut)',fontSize:12,cursor:'pointer' }}>Maybe later</button>
              </div>
            )}

            {modal==='feedback' && (
              <div style={{ padding:'20px 20px 0' }}>
                <div style={{ fontSize:18,fontWeight:900,color:'var(--txt)',fontFamily:"'Sora',sans-serif",marginBottom:4 }}>💬 Send Feedback</div>
                <div style={{ fontSize:12,color:'var(--mut)',marginBottom:18 }}>Tell us what's on your mind — we read every message</div>
                {feedbackSent ? (
                  <div className="anim-popIn" style={{ textAlign:'center',padding:'30px 0' }}>
                    <div style={{ fontSize:48,marginBottom:12 }}>🙏</div>
                    <div style={{ fontSize:17,fontWeight:800,color:'var(--txt)',fontFamily:"'Sora',sans-serif" }}>Thank you!</div>
                    <div style={{ fontSize:13,color:'var(--sub)',marginTop:6 }}>Your feedback makes QuickBite better for everyone</div>
                    <button onClick={() => { setFeedbackSent(false); setFeedback(''); close(); }} className="press" style={{ marginTop:20,padding:'12px 28px',borderRadius:14,border:'none',background:'linear-gradient(135deg,#FF6B35,#FF3D60)',color:'#fff',fontWeight:800,cursor:'pointer' }}>Close</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display:'flex',gap:8,marginBottom:14,flexWrap:'wrap' }}>
                      {['🐛 Bug Report','💡 Feature Idea','😍 Love it!','😤 Frustrated'].map(tag => (
                        <div key={tag} onClick={() => setFeedback(p=>p?p:`${tag}: `)} className="press" style={{ padding:'5px 12px',borderRadius:99,border:'1.5px solid var(--bdr)',fontSize:11,fontWeight:700,color:'var(--sub)',cursor:'pointer',background:'var(--inp)' }}>{tag}</div>
                      ))}
                    </div>
                    <textarea value={feedbackText} onChange={e=>setFeedback(e.target.value)} placeholder="What's on your mind? Be honest, we can take it 😄"
                      rows={5} style={{ width:'100%',padding:'13px',borderRadius:14,border:'2px solid var(--inpB)',background:'var(--inp)',color:'var(--txt)',fontSize:13,resize:'none',lineHeight:1.6,fontFamily:"'DM Sans',sans-serif" }}
                      onFocus={e=>e.target.style.borderColor='#FF6B35'} onBlur={e=>e.target.style.borderColor='var(--inpB)'}/>
                    <button onClick={() => { if(feedbackText.trim()) setFeedbackSent(true); }} className="press"
                      style={{ width:'100%',marginTop:12,padding:'14px',borderRadius:16,border:'none',background:feedbackText.trim()?'linear-gradient(135deg,#FF6B35,#FF3D60)':'var(--bdr)',color:feedbackText.trim()?'#fff':'var(--mut)',fontWeight:800,fontSize:14,cursor:feedbackText.trim()?'pointer':'not-allowed',transition:'all .2s' }}>
                      Send Feedback 🚀
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [splash,       setSplash]  = useState(true);
  const [view,         setView]    = useState('login');
  const [user,         setUser]    = useState(null);
  const [college,      setCollege] = useState(null);
  const [cart,         setCart]    = useState({});
  const [orders,       setOrders]  = useState([]);
  const [pendingOrder, setPending] = useState(null);
  const [payData,      setPayData] = useState(null);
  const [dark,         setDark]    = useState(false);
  const [skel,         setSkel]    = useState(false);
  const [toasts,       addToast]   = useToasts();
  const online = useNetwork();

  const totalCartItems = Object.values(cart).reduce((a,b) => a+b, 0);

  // Session restore
  useEffect(() => {
    const savedUser    = DB.get('user');
    const savedCollege = DB.get('college');
    const savedOrders  = DB.get('orders') || [];
    const savedDark    = DB.get('dark')   || false;
    if (savedDark) setDark(true);
    setTimeout(() => {
      if (savedUser) {
        setUser(savedUser);
        setOrders(savedOrders.map(o => ({ ...o, date:new Date(o.date) })));
        if (savedCollege) { setCollege(savedCollege); setSkel(true); setView('home'); setTimeout(() => setSkel(false), 2200); }
        else setView('collegeSelect');
        addToast({ icon:'👋', title:`Welcome back, ${savedUser.name.split(' ')[0]}!`, msg:'Your session is restored', cta:'🎉' });
      } else setView('login');
      setSplash(false);
    }, 2500);
  }, [addToast]);

  const toggleDark = () => { const nd=!dark; setDark(nd); DB.set('dark',nd); };
  const doLogin    = u => { setUser(u); DB.set('user',u); setView('collegeSelect'); };
  const doCollege  = c => { setCollege(c); DB.set('college',c); setSkel(true); setView('home'); setTimeout(()=>setSkel(false),2200); addToast({ icon:c.emoji, title:`Welcome to ${c.short}!`, msg:c.canteen, cta:'EXPLORE' }); };
  const onGoToPay  = d => { setPayData(d); setView('payment'); };
  const onPayOK    = () => {
    const o = {
      id:randId(), date:new Date(),
      items:payData.items.map(i=>({ id:i.id,name:i.name,qty:i.qty,price:i.price,emoji:i.emoji,g:i.g,time:i.time })),
      sub:payData.sub, fee:payData.fee, dk:payData.dk, total:payData.total,
      college:college?.short||'Campus', canteen:college?.canteen||'Campus Canteen',
      status:'Delivered', token:randToken(), payMethod:payData.payMethod||'Online Payment',
    };
    const newOrders = [o,...orders];
    setOrders(newOrders); DB.set('orders',newOrders);
    setPending(o); setCart({}); setView('tracking');
  };
  const onLogout = () => {
    DB.del('user'); DB.del('college');
    setUser(null); setCollege(null); setCart({}); setPending(null); setPayData(null); setView('login');
  };
  const go = v => { if(v==='tracking'&&!pendingOrder) return; setView(v); };

  return (
    <div className={dark?'theme-dark':'theme-light'} style={{ display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'100%',background:dark?'#06040A':'#B8A8A0' }}>
      <div style={{ position:'relative',width:'100%',maxWidth:430,height:'100%',maxHeight:'100vh',background:'var(--bg-raw)',overflow:'hidden',boxShadow:'0 0 0 1px rgba(255,255,255,.04),0 40px 120px rgba(0,0,0,.65)' }}>
        <div style={{ position:'absolute',inset:0,background:'var(--bg)',pointerEvents:'none',zIndex:0 }} />
        <div style={{ position:'relative',zIndex:1,width:'100%',height:'100%' }}>
          {splash                              && <SplashScreen      onDone={() => {}} />}
          {!splash && view==='login'           && <LoginView         onLogin={doLogin} dark={dark} toggleDark={toggleDark} />}
          {!splash && view==='collegeSelect'   && <CollegeSelectView user={user} onSelect={doCollege} />}
          {!splash && view==='home'            && <HomeView          user={user} college={college} cart={cart} setCart={setCart} addToast={addToast} go={go} dark={dark} toggleDark={toggleDark} skeletonMode={skel} />}
          {!splash && view==='cart'            && <CartView          user={user} college={college} cart={cart} setCart={setCart} addToast={addToast} go={go} onGoToPay={onGoToPay} />}
          {!splash && view==='payment' && payData   && <PaymentView  orderData={payData} college={college} onSuccess={onPayOK} onBack={() => setView('cart')} />}
          {!splash && view==='tracking' && pendingOrder && <TrackingView order={pendingOrder} onDone={() => go('home')} onViewReceipt={() => go('receipt')} addToast={addToast} />}
          {!splash && view==='receipt'  && pendingOrder && <ReceiptView  order={pendingOrder} onDone={() => go('tracking')} />}
          {!splash && view==='history'         && <HistoryView orders={orders} go={go} addToast={addToast} setCart={setCart} cartCount={totalCartItems} />}
          {!splash && view==='profile'         && <ProfileView user={user} college={college} dark={dark} toggleDark={toggleDark} go={go} orders={orders} onLogout={onLogout} onChangeCollege={() => setView('collegeSelect')} cartCount={totalCartItems} />}
        </div>
        <NetworkBanner online={online} />
        <ToastOverlay toasts={toasts} />
      </div>
    </div>
  );
}
