// ═══════════════════════════════════════════════════════════════════════════
//  ROUTE CONFIGURATION — Single source of truth for all routes
//  Consumed by: router.js, AuthGuard, BottomNav
// ═══════════════════════════════════════════════════════════════════════════

export const ROUTE_CONFIG = {
  login: {
    path: '/login',
    requiresAuth: false,
    requiresCollege: false,
    showBottomNav: false,
  },
  selectCollege: {
    path: '/select-college',
    requiresAuth: true,
    requiresCollege: false,
    showBottomNav: false,
  },
  home: {
    path: '/home',
    requiresAuth: true,
    requiresCollege: true,
    showBottomNav: true,
    tabName: 'Home',
    tabIcon: '🏠',
  },
  cart: {
    path: '/cart',
    requiresAuth: true,
    requiresCollege: true,
    showBottomNav: false,
  },
  checkout: {
    path: '/checkout',
    requiresAuth: true,
    requiresCollege: true,
    showBottomNav: false,
  },
  tracking: {
    path: '/tracking',
    requiresAuth: true,
    requiresCollege: true,
    showBottomNav: false,
  },
  receipt: {
    path: '/receipt',
    requiresAuth: true,
    requiresCollege: true,
    showBottomNav: false,
  },
  orders: {
    path: '/orders',
    requiresAuth: true,
    requiresCollege: true,
    showBottomNav: true,
    tabName: 'Orders',
    tabIcon: '📋',
  },
  profile: {
    path: '/profile',
    requiresAuth: true,
    requiresCollege: true,
    showBottomNav: true,
    tabName: 'Profile',
    tabIcon: '👤',
  },
  admin: {
    path: '/admin',
    requiresAuth: true,
    requiresCollege: false,
    showBottomNav: false,
  },
};

// Derive path ↔ key lookup maps from the single config
export const PATH_TO_KEY = Object.fromEntries(
  Object.entries(ROUTE_CONFIG).map(([key, cfg]) => [cfg.path, key])
);

export const KEY_TO_PATH = Object.fromEntries(
  Object.entries(ROUTE_CONFIG).map(([key, cfg]) => [key, cfg.path])
);

// Derive tab routes for BottomNav
export const TAB_ROUTES = Object.entries(ROUTE_CONFIG)
  .filter(([, config]) => config.showBottomNav)
  .map(([key, config]) => ({
    route: key,
    name: config.tabName,
    icon: config.tabIcon,
  }));
