import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, doc, setDoc, addDoc, collection, serverTimestamp } from './firebase.js';
import { DB, randId, randToken } from './utils/helpers';
import { useToasts, useNetwork } from './hooks';
import { NetworkBanner } from './components/layout/NetworkBanner';
import { ToastOverlay } from './components/layout/ToastOverlay';
import { useTheme } from './context/ThemeContext';
import './index.css';

// ── Direct imports (instant navigation, no skeleton flicker) ──
import SplashScreen from './views/SplashScreen';
import LoginView from './views/LoginView';
import CollegeSelectView from './views/CollegeSelectView';
import HomeView from './views/HomeView';
import CartView from './views/CartView';
import PaymentView from './views/PaymentView';
import TrackingView from './views/TrackingView';
import ReceiptView from './views/ReceiptView';
import HistoryView from './views/HistoryView';
import ProfileView from './views/ProfileView';
import AdminDashboardView from './views/AdminDashboardView';

// ═══════════════════════════════════════════════════════════════════════════
//  ROOT APP — Orchestrates routing, state, and Firebase auth
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const [splash, setSplash] = useState(true);
  const [user, setUser] = useState(null);

  const setView = (v) => navigate(v === 'login' ? '/' : `/${v}`);

  useEffect(() => {
    // Android hardware back button exit prevention
    if (window.history.length <= 1) {
      window.history.pushState(null, "", window.location.href);
    }
  }, []);
  const [college, setCollege] = useState(null);
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [pendingOrder, setPending] = useState(null);
  const [payData, setPayData] = useState(null);
  const [skel, setSkel] = useState(false);
  const [toasts, addToast] = useToasts();
  const online = useNetwork();

  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);

  // ── Session restore ──
  useEffect(() => {

    const splashTimer = setTimeout(() => {
      setSplash(false);
    }, 2500);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // ── CRITICAL FIX: Detect if user has changed ──
        const previousUser = DB.get('user');
        const isNewOrDifferentUser = !previousUser || previousUser.uid !== firebaseUser.uid;

        if (isNewOrDifferentUser) {
          // Keep stale data but clear global user session.
          DB.del('user');
        }

        const u = {
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          avatar: Math.floor(Math.random() * 5),
          method: 'firebase'
        };
        setUser(u);
        DB.set('user', u);

        // Read college/orders specific to THIS user
        const uId = firebaseUser.uid;
        const savedCollege = DB.get(`college_${uId}`);
        const savedOrders = DB.get(`orders_${uId}`) || [];

        setOrders(savedOrders.map(o => ({ ...o, date: new Date(o.date) })));
        if (savedCollege) {
          setCollege(savedCollege);
          setSkel(true);
          setView('home');
          setTimeout(() => setSkel(false), 2200);
        } else {
          setView('collegeSelect');
        }

        if (isNewOrDifferentUser) {
          addToast({ icon: '🎉', title: `Welcome, ${u.name.split(' ')[0]}!`, msg: 'Your account is ready', cta: '🚀' });
        } else {
          addToast({ icon: '👋', title: `Welcome back, ${u.name.split(' ')[0]}!`, msg: 'Your session is restored', cta: '🎉' });
        }
      } else {
        setUser(null);
        setView('login');
      }
    });

    return () => {
      clearTimeout(splashTimer);
      unsubscribe();
    };
  }, [addToast]);

  // ── Actions ──
  const doLogin = u => { setUser(u); DB.set('user', u); setView('collegeSelect'); };
  const doCollege = async c => {
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email || '',
          displayName: user.name || '',
          college: c.name,
          createdAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.error("Firestore College error:", e);
      }
    }
    setCollege(c);
    if (user?.uid) DB.set(`college_${user.uid}`, c);
    setSkel(true); setView('home');
    setTimeout(() => setSkel(false), 2200);
    addToast({ icon: c.emoji, title: `Welcome to ${c.short}!`, msg: c.canteen, cta: 'EXPLORE' });
  };
  const onGoToPay = d => { setPayData(d); setView('payment'); };
  const onPayOK = async () => {
    let orderId = randId();
    const finalItems = payData.items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, emoji: i.emoji, g: i.g, time: i.time }));

    if (user) {
      try {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'orders'), {
          items: finalItems,
          totalPrice: payData.total,
          college: college?.name || 'Unknown',
          status: 'pending',
          timestamp: serverTimestamp()
        });
        orderId = docRef.id;
      } catch (e) { console.error("Firestore order error:", e); }
    }

    const o = {
      id: orderId, date: new Date(),
      items: finalItems,
      sub: payData.sub, fee: payData.fee, dk: payData.dk, total: payData.total,
      college: college?.short || 'Campus', canteen: college?.canteen || 'Campus Canteen',
      status: 'pending', token: randToken(), payMethod: payData.payMethod || 'Online Payment',
    };
    const newOrders = [o, ...orders];
    setOrders(newOrders);
    if (user?.uid) DB.set(`orders_${user.uid}`, newOrders);
    setPending(o); setCart({}); setView('tracking');
  };
  const onLogout = () => {
    signOut(auth).then(() => {
      // Clear user session indicator but preserve user's data records
      DB.del('user'); 
      setCollege(null); setCart({}); setOrders([]); setPending(null); setPayData(null);
    });
  };
  const go = v => { if (v === 'tracking' && !pendingOrder) return; setView(v); };
  const viewOrder = o => { setPending(o); setView('tracking'); };

  return (
    <div className={dark ? 'theme-dark' : 'theme-light'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100dvh', background: dark ? '#08060A' : '#f5f5f5' }}>
      <div className="app-container">
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', pointerEvents: 'none', zIndex: 0 }} />
        <div className="view-container" style={{ zIndex: 1 }}>
          {splash ? (
            <SplashScreen onDone={() => { }} />
          ) : (
            <Routes>
              <Route path="/" element={<LoginView onLogin={doLogin} dark={dark} toggleDark={toggleDark} />} />
              <Route path="/collegeSelect" element={<CollegeSelectView user={user} onSelect={doCollege} />} />
              <Route path="/home" element={<HomeView user={user} college={college} cart={cart} setCart={setCart} addToast={addToast} go={go} dark={dark} toggleDark={toggleDark} skeletonMode={skel} pendingOrder={pendingOrder} />} />
              <Route path="/cart" element={<CartView user={user} college={college} cart={cart} setCart={setCart} addToast={addToast} go={go} onGoToPay={onGoToPay} />} />
              <Route path="/payment" element={payData ? <PaymentView orderData={payData} college={college} onSuccess={onPayOK} onBack={() => setView('cart')} /> : <Navigate to="/cart" />} />
              <Route path="/tracking" element={pendingOrder ? <TrackingView order={pendingOrder} onDone={() => go('home')} onViewReceipt={() => go('receipt')} addToast={addToast} /> : <Navigate to="/home" />} />
              <Route path="/receipt" element={pendingOrder ? <ReceiptView order={pendingOrder} onDone={() => go('tracking')} /> : <Navigate to="/home" />} />
              <Route path="/history" element={<HistoryView orders={orders} go={go} addToast={addToast} setCart={setCart} cartCount={totalCartItems} onViewTracking={viewOrder} />} />
              <Route path="/profile" element={<ProfileView user={user} college={college} dark={dark} toggleDark={toggleDark} go={go} orders={orders} onLogout={onLogout} onChangeCollege={() => setView('collegeSelect')} cartCount={totalCartItems} addToast={addToast} />} />
              <Route path="/admin" element={<AdminDashboardView go={go} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
        <NetworkBanner online={online} />
        <ToastOverlay toasts={toasts} />
      </div>
    </div>
  );
}