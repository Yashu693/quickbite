/**
 * Lightweight analytics hook.
 * Logs navigation and events to console + gtag (if available).
 */
export function useAnalytics() {
  const logPageView = (route, props = {}) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Page view: ${route}`, props);
    }
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: route,
        page_path: `/${route}`,
        ...props,
      });
    }
  };

  const logEvent = (name, properties = {}) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Event: ${name}`, properties);
    }
    if (window.gtag) {
      window.gtag('event', name, properties);
    }
  };

  return { logPageView, logEvent };
}
