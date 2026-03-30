// ═══════════════════════════════════════════════════════════════════════════
//  HOOKS — Barrel export for all custom hooks
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';

// Re-export dedicated hook files
export { useLocalStorage } from './useLocalStorage';
export { useAsync } from './useAsync';
export { useAnalytics } from './useAnalytics';
export { usePreventExit } from './usePreventExit';
export { useConfirmExit } from './useConfirmExit';

// ── useNetwork ───────────────────────────────────────────────────────────
export function useNetwork() {
  const [online, set] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => set(true), dn = () => set(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', dn);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', dn); };
  }, []);
  return online;
}

// ── useDebounce ──────────────────────────────────────────────────────────
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── useToasts ────────────────────────────────────────────────────────────
export function useToasts() {
  const [toasts, set] = useState([]);
  const add = useCallback(({ icon, title, msg, cta = '→' }) => {
    const id = Date.now() + Math.random();
    set(p => [{ id, icon, title, msg, cta }, ...p.slice(0, 2)]);
    setTimeout(() => set(p => p.filter(t => t.id !== id)), 3600);
  }, []);
  return [toasts, add];
}
