// ═══════════════════════════════════════════════════════════════════════════
//  ROUTER — Custom HTML5 History API router (zero dependencies)
//  Uses ROUTE_CONFIG as single source of truth
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useEffect } from 'react';
import { PATH_TO_KEY, KEY_TO_PATH } from './data/routes';

/**
 * Custom router hook using HTML5 History API.
 *
 * @returns {{ currentRoute: string, navigate: Function, getQueryParams: Function }}
 */
export function useRouter() {
  // Parse initial route from current URL
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    // Handle root path
    if (path === '/' || path === '') return 'home';
    return PATH_TO_KEY[path] || 'home';
  });

  // Sync initial history state on mount
  useEffect(() => {
    const path = window.location.pathname;
    const routeName = (path === '/' || path === '') ? 'home' : (PATH_TO_KEY[path] || 'home');

    // Set initial history state so popstate has data to work with
    window.history.replaceState(
      { route: routeName, timestamp: Date.now() },
      '',
      KEY_TO_PATH[routeName] || '/home'
    );

    if (routeName !== currentRoute) {
      setCurrentRoute(routeName);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to a route
  const navigate = useCallback((routeName, replace = false) => {
    const path = KEY_TO_PATH[routeName];
    if (!path) {
      console.error(`[Router] Invalid route: ${routeName}`);
      return;
    }

    // Skip if already on this path
    if (window.location.pathname === path) return;

    const method = replace ? 'replaceState' : 'pushState';
    window.history[method](
      { route: routeName, timestamp: Date.now() },
      '',
      path
    );

    setCurrentRoute(routeName);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const routeName = (path === '/' || path === '') ? 'home' : (PATH_TO_KEY[path] || 'home');
      setCurrentRoute(routeName);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Get query params for current route
  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params);
  }, []);

  return { currentRoute, navigate, getQueryParams };
}
