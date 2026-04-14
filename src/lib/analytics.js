/**
 * Client-side analytics helpers.
 *
 * `trackEvent` sends a custom event to GA4 via the gtag global that
 * `<Analytics />` (src/components/Analytics.jsx) loads after consent.
 *
 * If gtag isn't loaded yet (no consent / no env var / SSR), the call
 * is a silent no-op — every consumer can fire events unconditionally
 * without worrying about gating.
 *
 * Naming conventions (snake_case, GA4 standard):
 *   generate_lead         — contact form / quote request submitted
 *   begin_trial           — outbound click to xhsdata.ai/register
 *   select_content        — section CTAs, sitelinks, nav
 *   view_search_results   — insights search
 *   configure_quote       — pricing configurator interaction (debounced)
 *   newsletter_signup     — if/when a newsletter form ships
 */

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  try {
    window.gtag('event', name, params)
  } catch (err) {
    // never crash a UI handler over analytics
    console.debug('[analytics] event failed:', name, err)
  }
}

/**
 * Convenience for outbound link tracking. Adds `transport_type: 'beacon'`
 * so the event still fires when the user navigates away.
 */
export function trackOutbound(name, href, params = {}) {
  trackEvent(name, {
    transport_type: 'beacon',
    link_url: href,
    outbound: true,
    ...params,
  })
}
