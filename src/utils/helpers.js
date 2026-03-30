// ═══════════════════════════════════════════════════════════════════════════
//  HELPER UTILITIES — Shared across all views and components
// ═══════════════════════════════════════════════════════════════════════════

import { FOOD } from '../data/constants';

// ── localStorage wrapper ─────────────────────────────────────────────────
export const DB = {
  get(k) { try { const v = localStorage.getItem('qb_' + k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set(k, v) { try { localStorage.setItem('qb_' + k, JSON.stringify(v)); } catch { } },
  del(k) { try { localStorage.removeItem('qb_' + k); } catch { } },
};

// ── Food item resolver (handles deal variants) ───────────────────────────
export function resolveFoodItem(id) {
  const strId = String(id);
  const isDeal = strId.endsWith('_deal');
  const baseId = isDeal ? strId.replace('_deal', '') : strId;
  const f = FOOD.find(x => String(x.id) === baseId);
  if (!f) return null;
  if (isDeal) {
    const disc = f.cat === 'Combos' ? 0.8 : 0.9;
    return { ...f, id: strId, name: `🔥 Deal: ${f.name}`, origPrice: f.price, price: Math.floor(f.price * disc) };
  }
  return f;
}

// ── ID generators ────────────────────────────────────────────────────────
export const randId = () => 'QB-' + String(Math.floor(Math.random() * 9000) + 1000);
export const randToken = () => '#' + String(Math.floor(Math.random() * 90 + 10));

// ── Date formatting ──────────────────────────────────────────────────────
export function fmtDate(d) {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt)) return '';
  const now = new Date(), diff = now - dt, m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return 'Today, ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (h < 48) return 'Yesterday, ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return dt.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ', ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const fmtSecs = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ── Firebase auth error messages ──────────────────────────────────────────
export const getFriendlyError = (code) => {
  switch (code) {
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/user-disabled': return 'This account has been disabled.';
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/wrong-password': return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential': return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use': return 'An account with this email already exists.';
    case 'auth/weak-password': return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/operation-not-allowed': return 'Sign-in method disabled. Please enable it in Firebase Console.';
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.';
    default: return 'An unexpected error occurred. Please try again.';
  }
};
