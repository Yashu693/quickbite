import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BottomNav } from '../components/layout/BottomNav';

// Profile modular components
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { SettingsTile } from '../components/profile/SettingsTile';
import { RatingModal } from '../components/profile/RatingModal';
import { FeedbackModal } from '../components/profile/FeedbackModal';
import { NotificationSettings } from '../components/profile/NotificationSettings';
import { PrivacySecurity } from '../components/profile/PrivacySecurity';
import { HelpSupport } from '../components/profile/HelpSupport';
import { SavedAddresses } from '../components/profile/SavedAddresses';
import { PaymentMethods } from '../components/profile/PaymentMethods';
import { LoyaltyRewards } from '../components/profile/LoyaltyRewards';
import { RecentOrders } from '../components/profile/RecentOrders';

export default function ProfileView({ user, college, go, orders, onLogout, onChangeCollege, cartCount = 0, addToast }) {
  const { dark, toggleDark } = useTheme();
  const [modal, setModal] = useState(null);
  
  const close = () => setModal(null);

  // Settings Definitions
  const MENU_ITEMS = [
    ...(user?.email === 'shahyash1804@gmail.com' ? [{ icon: '👨‍🍳', label: 'Canteen Admin Dashboard', action: () => go('admin'), chevron: true }] : []),
    { icon: '🌙', label: dark ? 'Switch to Light Mode' : 'Switch to Dark Mode', action: toggleDark, toggle: true, on: dark },
    { icon: '📍', label: 'Saved Addresses', action: () => setModal('addresses'), chevron: true, iconBg: 'rgba(239, 68, 68, 0.1)' },
    { icon: '💳', label: 'Payment Methods', action: () => setModal('payments'), chevron: true },
    { icon: '🎁', label: 'Loyalty & Rewards', action: () => setModal('loyalty'), chevron: true },
    { icon: '📦', label: 'Recent Orders', action: () => setModal('orders'), chevron: true },
    { icon: '🔔', label: 'Notifications', action: () => setModal('notifications'), chevron: true },
    { icon: '🛡️', label: 'Privacy & Security', action: () => setModal('privacy'), chevron: true },
    { icon: '❓', label: 'Help & Support', action: () => setModal('help'), chevron: true },
    { icon: '⭐', label: 'Rate QuickBite', action: () => setModal('rate'), chevron: true },
    { icon: '💬', label: 'Send Feedback', action: () => setModal('feedback'), chevron: true },
  ];

  const handleLogout = () => {
    const isSure = window.confirm("Are you sure you want to logout?");
    if (isSure) {
      onLogout();
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>
      {/* HEADER */}
      <div className="glass-hdr" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '38px 16px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>Profile 🍌</div>
          <button onClick={toggleDark} className="press glass" style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid var(--glassB)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{dark ? '☀️' : '🌙'}</button>
        </div>
      </div>

      {/* BODY */}
      <div className="hs" style={{ position: 'absolute', top: 88, bottom: 0, left: 0, right: 0, width: '100%', boxSizing: 'border-box', overflowY: 'auto', padding: '14px 16px 120px' }}>
        
        <ProfileHeader 
          user={user} 
          college={college} 
          onChangeCollege={onChangeCollege} 
          go={go} 
          addToast={addToast} 
        />

        {/* SETTINGS GROUP */}
        <div className="anim-fadeUp glass" style={{ animationDelay: '.1s', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--bdr)', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bdr)', background: 'var(--inp)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mut)', letterSpacing: .8, textTransform: 'uppercase' }}>Settings & More</div>
          </div>
          {MENU_ITEMS.map((item, i, arr) => (
            <SettingsTile key={item.label} item={item} isLast={i === arr.length - 1} />
          ))}
        </div>

        {/* GLOBAL PREFERENCES */}
        <div className="anim-fadeUp glass" style={{ animationDelay: '.15s', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--bdr)', marginBottom: 20 }}>
           <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bdr)', background: 'var(--inp)' }}>
             <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mut)', letterSpacing: .8, textTransform: 'uppercase' }}>Preferences</div>
           </div>
           <SettingsTile item={{ icon: '🌐', label: 'Language & Region', action: () => addToast && addToast({ icon: '🌐', title: 'Language', msg: 'Language set to English (India)' }), chevron: true }} isLast={false} />
           <SettingsTile item={{ icon: 'ℹ️', label: 'About App', action: () => addToast && addToast({ icon: 'ℹ️', title: 'QuickBite v2.0', msg: 'Made with ❤️ for campus students' }), chevron: true }} isLast={true} />
        </div>

        {/* LOGOUT */}
        <div className="anim-fadeUp" style={{ animationDelay: '.18s', marginBottom: 24 }}>
          <button onClick={handleLogout} className="press" style={{ width: '100%', padding: '15px', borderRadius: 17, border: '2px solid rgba(239,68,68,.25)', background: 'rgba(239,68,68,.06)', color: '#ef4444', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            🚪 Log Out
          </button>
        </div>
      </div>

      <BottomNav view="profile" go={go} cartCount={cartCount} />

      {/* MODAL SYSTEM */}
      {modal && (
        <div className="anim-fadeIn" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(14px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={close}>
          <div className="anim-slideUp" style={{ width: '100%', background: 'var(--card)', borderRadius: '28px 28px 0 0', padding: '0 0 36px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--bdr)', margin: '12px auto 0' }} />
            <div style={{ padding: '20px 20px 0' }}>
              {modal === 'rate' && <RatingModal user={user} close={close} addToast={addToast} />}
              {modal === 'feedback' && <FeedbackModal user={user} close={close} addToast={addToast} />}
              {modal === 'notifications' && <NotificationSettings user={user} close={close} addToast={addToast} />}
              {modal === 'privacy' && <PrivacySecurity user={user} close={close} addToast={addToast} onLogout={onLogout} />}
              {modal === 'help' && <HelpSupport close={close} addToast={addToast} />}
              {modal === 'addresses' && <SavedAddresses user={user} close={close} addToast={addToast} />}
              {modal === 'payments' && <PaymentMethods user={user} close={close} addToast={addToast} />}
              {modal === 'loyalty' && <LoyaltyRewards user={user} close={close} addToast={addToast} />}
              {modal === 'orders' && <RecentOrders orders={orders} go={go} close={close} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
