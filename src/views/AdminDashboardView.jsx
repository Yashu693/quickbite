import { useEffect, useState } from 'react';

export default function AdminDashboardView({ go, user }) {
  const [authError, setAuthError] = useState('');

  // Check if user is authorized (allowing both spelling variations seen in the prompts)
  const isAuthorized = user?.email === 'shahyassh1804@gmail.com' || user?.email === 'shahyash1804@gmail.com';

  if (!isAuthorized) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ color: 'var(--txt)', fontFamily: "'Sora', sans-serif", marginBottom: 12 }}>Access Denied</h2>
        <p style={{ color: 'var(--mut)', marginBottom: 24, fontSize: 14 }}>
          You do not have permission to view the Canteen Dashboard. Please log in with an authorized account.
        </p>
        <button onClick={() => go('home')} style={{ background: 'var(--acc)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
          Return to Home
        </button>
      </div>
    );
  }

  // Construct URL with Firebase Config from Vite environment
  const configParams = new URLSearchParams({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  }).toString();

  const [isMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    // On mobile, redirect the entire page to the HTML file natively
    // to avoid iOS iframe touch/scroll issues.
    if (isMobile) {
      window.location.href = `/quickbite-admin.html?${configParams}`;
    }
  }, [configParams, isMobile]);

  if (isMobile) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--txt)' }}>Loading Admin Dashboard...</div>
      </div>
    );
  }

  // On desktop, render fully-functional iframe
  const iframeSrc = `/quickbite-admin.html?${configParams}`;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <iframe 
        src={iframeSrc} 
        style={{ width: '100%', height: '100%', border: 'none' }} 
        title="QuickBite Admin Dashboard"
      />
    </div>
  );
}
