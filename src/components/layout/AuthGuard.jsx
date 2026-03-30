import { useEffect } from 'react';
import { ROUTE_CONFIG } from '../../data/routes';

/**
 * AuthGuard — blocks rendering until Firebase auth state is resolved.
 * Three-phase rendering:
 *   1. authLoading → SplashScreen (not blank)
 *   2. Guard fails → navigate + render null
 *   3. Guard passes → render children
 */
export function AuthGuard({ route, firebaseUser, authLoading, college, navigate, splashElement, children }) {
  const config = ROUTE_CONFIG[route] || {};

  useEffect(() => {
    if (authLoading) return;

    // Unauthenticated user trying to access protected route
    if (config.requiresAuth && !firebaseUser) {
      navigate('login', true);
      return;
    }

    // Authenticated user on login page → redirect to home or college select
    if (route === 'login' && firebaseUser) {
      navigate(college ? 'home' : 'selectCollege', true);
      return;
    }

    // Needs college but none selected
    if (config.requiresCollege && !college) {
      navigate('selectCollege', true);
      return;
    }
  }, [route, firebaseUser, authLoading, college, navigate, config]);

  // Phase 1: Still resolving auth → show splash
  if (authLoading) {
    return splashElement || null;
  }

  // Phase 2: Guard failures → render nothing (navigate fires in useEffect)
  if (config.requiresAuth && !firebaseUser) return null;
  if (route === 'login' && firebaseUser) return null;
  if (config.requiresCollege && !college) return null;

  // Phase 3: All checks passed
  return children;
}
