// ═══════════════════════════════════════════════════════════════════════════
//  APP CONTEXT — Global state without prop drilling
// ═══════════════════════════════════════════════════════════════════════════

import { createContext, useContext } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children, value }) {
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Convenience hook to consume AppContext.
 * Throws if used outside of an AppProvider.
 */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
