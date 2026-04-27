/**
 * Client-side analytics helpers.
 *
 * `trackEvent` DUAL-FIRES events to:
 *   1. GA4 via the gtag global (existing behaviour)
 *   2. Pimlico's canonical analytics_customer_activity stream via the
 *      record-marketing-activity edge function on sup.xhsdata.ai
 *
 * Per Andrew 2026-04-27 pt33 evening + ChatGPT Pro v2: marketing-site
 * visitor → app sign-up → trial → paid conversion should be ONE timeline
 * across the canonical event spine, not split between GA4 + Supabase.
 *
 * Anon visitor identity is a UUID stored in cookie `anon_visitor_id`
 * (1-year expiry). On sign-up the new app sends this id to start-trial
 * so a server-side merge step rewrites visitor rows to actor_kind=
 * 'customer' under the new user_id.
 *
 * Events buffered in memory + flushed every 10s OR on beforeunload via
 * sendBeacon. Failures are silent — never crash a UI handler.
 *
 * GA4 naming conventions (snake_case, GA4 standard):
 *   generate_lead         — contact form / quote request submitted
 *   begin_trial           — outbound click to xhsdata.ai/register
 *   select_content        — section CTAs, sitelinks, nav
 *   view_search_results   — insights search
 *   configure_quote       — pricing configurator interaction (debounced)
 *   newsletter_signup     — if/when a newsletter form ships
 */

const PIMLICO_INGEST_URL = 'https://sup.xhsdata.ai/functions/v1/record-marketing-activity'
const ANON_COOKIE = 'anon_visitor_id'
const SESSION_COOKIE = 'mkt_session_id'
const SESSION_LAST_TS_COOKIE = 'mkt_session_last_ts'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year for visitor
const SESSION_IDLE_MS = 30 * 60 * 1000     // 30min idle = new session (Pro v3 §2C)
const FLUSH_INTERVAL = 10_000
const MAX_BUFFER = 50

let buffer = []
let flushTimer = null

function uuidv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name, value, maxAge) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; secure; samesite=lax`
}

function getAnonVisitorId() {
  const existing = getCookie(ANON_COOKIE)
  if (existing) return existing
  const id = uuidv4()
  setCookie(ANON_COOKIE, id, COOKIE_MAX_AGE)
  return id
}

// Pro v3 §2C: a marketing session is a contiguous run of events with no
// 30-minute idle gap. We need this so attribution_touches can pin first/
// last touch per visit, not just per visitor lifetime.
function getMarketingSessionId() {
  if (typeof document === 'undefined') return null
  const now = Date.now()
  const lastTs = parseInt(getCookie(SESSION_LAST_TS_COOKIE) ?? '0', 10) || 0
  const existing = getCookie(SESSION_COOKIE)
  if (existing && now - lastTs < SESSION_IDLE_MS) {
    setCookie(SESSION_LAST_TS_COOKIE, String(now), 60 * 60 * 24)
    return existing
  }
  const id = uuidv4()
  setCookie(SESSION_COOKIE, id, 60 * 60 * 24)
  setCookie(SESSION_LAST_TS_COOKIE, String(now), 60 * 60 * 24)
  return id
}

function getUtmParams() {
  if (typeof window === 'undefined') return {}
  try {
    const u = new URL(window.location.href)
    const utm = {}
    for (const k of ['source', 'medium', 'campaign', 'term', 'content']) {
      const v = u.searchParams.get(`utm_${k}`)
      if (v) utm[k] = v
    }
    return utm
  } catch {
    return {}
  }
}

function flushPimlicoEvents(useBeacon = false) {
  if (buffer.length === 0) return
  const events = buffer.splice(0, buffer.length)
  const anonId = getAnonVisitorId()
  if (!anonId) return
  const body = JSON.stringify({
    anon_visitor_id: anonId,
    marketing_session_id: getMarketingSessionId(),
    events,
    utm: getUtmParams(),
  })
  try {
    if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon(PIMLICO_INGEST_URL, blob)
    } else if (typeof fetch !== 'undefined') {
      fetch(PIMLICO_INGEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => { /* silent */ })
    }
  } catch {
    // re-buffer on transient failure (next flush retries)
    buffer.unshift(...events)
  }
}

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    flushPimlicoEvents(false)
  }, FLUSH_INTERVAL)
}

if (typeof window !== 'undefined') {
  // Flush on tab hide / close so we don't lose visitor signals
  window.addEventListener('beforeunload', () => flushPimlicoEvents(true))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPimlicoEvents(true)
  })
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return

  // 1. GA4
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params)
    }
  } catch (err) {
    console.debug('[analytics] gtag failed:', name, err)
  }

  // 2. Pimlico canonical stream
  try {
    // Pro v3 idempotency: synthetic key from anon + name + ts so retried
    // beacons dedupe at the activity_ingest_receipts layer.
    const anonId = getAnonVisitorId()
    const occurredAt = new Date().toISOString()
    buffer.push({
      event_type: name,
      page_path: typeof window !== 'undefined' ? window.location.pathname : null,
      occurred_at: occurredAt,
      duration_ms: typeof params.value === 'number' ? params.value : null,
      idempotency_key: `${anonId}:${name}:${occurredAt}`,
      metadata: {
        ...params,
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        title: typeof document !== 'undefined' ? document.title || null : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent || null : null,
      },
    })
    if (buffer.length >= MAX_BUFFER) {
      flushPimlicoEvents(false)
    } else {
      scheduleFlush()
    }
  } catch (err) {
    console.debug('[analytics] pimlico buffer failed:', name, err)
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

/**
 * Expose anonymous visitor + session IDs to outbound CTAs that need to
 * carry them across the domain hop into xhsdata.ai for merge_visitor_to_user.
 *
 * Usage in a signup CTA (or anywhere outbound to /register):
 *   const url = appendIdentityParams('https://xhsdata.ai/register?plan=trial')
 *   window.location.href = url
 *
 * The /register flow on the app domain reads ?avid=… and ?msid=… off the
 * URL and stashes them in localStorage for the start-trial edge function
 * to pass into public.merge_visitor_to_user(). That stitches the
 * pre-signup marketing timeline to the post-signup customer one.
 */
export function appendIdentityParams(url) {
  if (typeof window === 'undefined') return url
  try {
    const u = new URL(url, window.location.origin)
    const anonId = getAnonVisitorId()
    const sessionId = getMarketingSessionId()
    if (anonId) u.searchParams.set('avid', anonId)
    if (sessionId) u.searchParams.set('msid', sessionId)
    return u.toString()
  } catch {
    return url
  }
}

// Expose for tests / debugging
export const _internal = {
  flushPimlicoEvents,
  getAnonVisitorId,
  getMarketingSessionId,
  appendIdentityParams,
}
