/**
 * Cross-domain attribution helpers for Pimlico → xhsdata.ai handoffs.
 *
 * Google Ads sets `gclid`/`gbraid`/`wbraid` on the landing URL when a paid
 * click arrives. If the user browses pimlicosolutions.com first and only
 * later clicks through to xhsdata.ai/register, that click-id is lost
 * unless we carry it across the domain boundary ourselves.
 *
 * Flow:
 *   1. `<InboundParamCapture />` calls `captureInboundParams()` once on
 *      mount in the root layout. Any tracked params in the URL are
 *      persisted to sessionStorage.
 *   2. `ConversionTracker.jsx` reads from `getStoredInboundParams()` at
 *      click-time and appends them to outbound xhsdata.ai hrefs
 *      (gclid/gbraid/wbraid always; utm_* only when the URL doesn't
 *      already set them).
 *   3. Programmatic redirects (e.g. contact/page.jsx trial-redirect) and
 *      email CTAs (quote-request/contact API routes) call `buildTrialUrl()`
 *      or forward the params via request body respectively.
 *
 * Why sessionStorage and not localStorage:
 *   - Session-level attribution is sufficient for marketing→app handoff.
 *     Once the user crosses to xhsdata.ai, `lib/analytics.ts` persists
 *     the gclid to localStorage with Google's 90-day window. Keeping
 *     marketing-site storage to a single session avoids leaking stale
 *     attribution into a new visit days later.
 */

const STORAGE_KEY = 'pimlico_inbound_params_v1';

// Click identifiers from paid ad platforms. Always preserved across
// the boundary; never clobbered by explicit builder extras.
const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'];

// Campaign-attribution params (GA4 standard). Preserved on outbound URLs
// only if the URL (or an explicit builder extra) doesn't already set them.
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

const TRACKED_KEYS = [...CLICK_ID_KEYS, ...UTM_KEYS];

const TRIAL_BASE = 'https://xhsdata.ai/register';
const CONTACT_BASE = '/contact';

/**
 * Read tracked params from the current URL, persist to sessionStorage,
 * return the current set (merged with any pre-existing stored values).
 *
 * Policy:
 *   - If the URL contains a fresh click-id, treat this as a new paid
 *     click and REPLACE all stored state. (An old session's utm_*
 *     shouldn't pollute a new paid visit.)
 *   - If the URL has only utm_* params (no click-id), MERGE over stored.
 *   - If the URL has nothing tracked, return the existing stored state.
 *
 * Idempotent — safe to call multiple times per page load.
 */
export function captureInboundParams() {
  if (typeof window === 'undefined') return {};

  let incoming = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of TRACKED_KEYS) {
      const value = params.get(key);
      if (value) incoming[key] = value;
    }
  } catch {
    return getStoredInboundParams();
  }

  if (Object.keys(incoming).length === 0) {
    return getStoredInboundParams();
  }

  const hasFreshClickId = CLICK_ID_KEYS.some((k) => incoming[k]);
  const existing = hasFreshClickId ? {} : getStoredInboundParams();
  const merged = { ...existing, ...incoming };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Private mode / iframes can throw on sessionStorage writes.
    // Values are then in-memory only for this render.
  }
  return merged;
}

/** Return the currently-stored inbound params, or `{}` if none. Never throws. */
export function getStoredInboundParams() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Build a trial-signup URL with stored click-ids + utms applied.
 *
 * Precedence (highest wins):
 *   1. Query params already on the base URL (e.g. `?plan=enterprise`)
 *   2. `extraParams` passed to this call (per-call intent wins over stored)
 *   3. Stored inbound params (fallback)
 */
export function buildTrialUrl(extraParams = {}) {
  return buildUrlWithStoredParams(TRIAL_BASE, extraParams);
}

/** Same as buildTrialUrl but points at the pimlicosolutions.com /contact page. */
export function buildContactUrl(extraParams = {}) {
  return buildUrlWithStoredParams(CONTACT_BASE, extraParams);
}

function buildUrlWithStoredParams(base, extraParams) {
  const stored = getStoredInboundParams();
  let url;
  try {
    url = new URL(base, 'https://pimlicosolutions.com');
  } catch {
    return base;
  }

  const baseKeys = new Set([...url.searchParams.keys()]);

  // Stored params — don't clobber anything already on the URL.
  for (const [k, v] of Object.entries(stored)) {
    if (v != null && !baseKeys.has(k)) {
      url.searchParams.set(k, v);
    }
  }

  // Explicit extras — these win over stored (but not over URL-baked params).
  for (const [k, v] of Object.entries(extraParams)) {
    if (v != null && !baseKeys.has(k)) {
      url.searchParams.set(k, v);
    } else if (v != null && baseKeys.has(k)) {
      // URL had it; extras want to set it too. URL wins.
    }
  }

  return url.toString();
}
