'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { getStoredInboundParams } from '@/lib/trialUrl'

/**
 * Site-wide click delegation for conversion tracking.
 *
 * Watches every <a> click and emits GA4 events for the patterns we
 * care about, so we don't have to wrap each individual button:
 *
 *   xhsdata.ai/register      -> begin_trial
 *   xhsdata.ai/login         -> outbound_login
 *   /contact?interest=demo   -> request_demo
 *   /contact?interest=pricing-> request_pricing
 *   /contact (other)         -> request_contact
 *
 * Also auto-appends `utm_source=site&utm_medium=internal&utm_campaign=<page>`
 * to outbound xhsdata.ai links so attribution flows into the app's
 * analytics. Existing UTM params on the URL are preserved.
 *
 * Mounted once in the root layout.
 */
export default function ConversionTracker() {
  const pathname = usePathname()

  useEffect(() => {
    function findAnchor(target) {
      let el = target
      while (el && el !== document.body) {
        if (el.tagName === 'A' && el.href) return el
        el = el.parentElement
      }
      return null
    }

    function appendUtm(url, campaign) {
      try {
        const u = new URL(url)
        const stored = getStoredInboundParams()

        // Click identifiers (gclid etc) — always add if stored, never clobber
        // anything already on the URL.
        for (const key of ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid']) {
          if (stored[key] && !u.searchParams.has(key)) {
            u.searchParams.set(key, stored[key])
          }
        }

        // UTMs — fill missing keys, preferring stored values (original
        // traffic source) over the site/internal/<page> fallback.
        const utmDefaults = {
          utm_source: 'site',
          utm_medium: 'internal',
          utm_campaign: campaign || 'site_link',
        }
        for (const [key, fallback] of Object.entries(utmDefaults)) {
          if (!u.searchParams.has(key)) {
            u.searchParams.set(key, stored[key] || fallback)
          }
        }

        // Propagate stored utm_content / utm_term when present and not overridden.
        for (const key of ['utm_content', 'utm_term']) {
          if (stored[key] && !u.searchParams.has(key)) {
            u.searchParams.set(key, stored[key])
          }
        }

        return u.toString()
      } catch {
        return url
      }
    }

    function onClick(e) {
      const a = findAnchor(e.target)
      if (!a) return
      const href = a.href
      if (!href) return

      const isTrial = /xhsdata\.ai\/register/i.test(href)
      const isLogin = /xhsdata\.ai\/login/i.test(href)
      const isContactDemo = /\/contact\?.*interest=demo/i.test(href)
      const isContactPricing = /\/contact\?.*interest=pricing/i.test(href)
      const isContact = /\/contact(\?|$|#)/i.test(href) && !isContactDemo && !isContactPricing

      if (isTrial) {
        const tagged = appendUtm(href, `trial_from_${pathname.replace(/^\/|\/$/g, '') || 'home'}`)
        if (tagged !== href) a.href = tagged
        trackEvent('begin_trial', {
          source_page: pathname,
          link_url: tagged,
          transport_type: 'beacon',
        })
        return
      }
      if (isLogin) {
        trackEvent('outbound_login', { source_page: pathname, transport_type: 'beacon' })
        return
      }
      if (isContactDemo) {
        trackEvent('request_demo', { source_page: pathname })
        return
      }
      if (isContactPricing) {
        trackEvent('request_pricing', { source_page: pathname })
        return
      }
      if (isContact) {
        trackEvent('request_contact', { source_page: pathname })
        return
      }
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [pathname])

  return null
}
