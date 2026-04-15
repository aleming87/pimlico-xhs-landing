'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

/**
 * Consent-gated Google Analytics 4 loader.
 *
 * Loads the gtag tag only when BOTH of the following are true:
 *   1. `NEXT_PUBLIC_GA_ID` is set at build time (e.g. `G-XXXXXXXXXX`)
 *   2. The visitor has accepted cookies
 *      (localStorage.cookieConsent === 'accepted')
 *
 * Consent state is event-driven: `<CookieConsent />` dispatches
 * `consent:updated` whenever the banner is interacted with. We also
 * listen for cross-tab `storage` events so consent toggled in another
 * tab propagates immediately.
 *
 * App Router client-side navigations do not trigger an automatic
 * `page_view` (gtag only ships it on the first load). We fire one
 * manually whenever the pathname or the tracked query params change.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [consented, setConsented] = useState(false)

  // --- consent state, event-driven ---------------------------------
  useEffect(() => {
    if (!gaId) return

    const read = () => {
      try {
        setConsented(localStorage.getItem('cookieConsent') === 'accepted')
      } catch {
        setConsented(false)
      }
    }

    read()
    const onConsent = () => read()
    window.addEventListener('consent:updated', onConsent)
    window.addEventListener('storage', onConsent)
    return () => {
      window.removeEventListener('consent:updated', onConsent)
      window.removeEventListener('storage', onConsent)
    }
  }, [gaId])

  // --- SPA page_view on route change ------------------------------
  useEffect(() => {
    if (!gaId || !consented) return
    if (typeof window === 'undefined') return
    if (typeof window.gtag !== 'function') return
    const qs = searchParams?.toString()
    const page_path = qs ? `${pathname}?${qs}` : pathname
    const page_location = `${window.location.origin}${page_path}`
    window.gtag('event', 'page_view', {
      page_path,
      page_location,
      page_title: document.title,
      send_to: gaId,
    })
  }, [gaId, consented, pathname, searchParams])

  if (!gaId || !consented) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // We fire page_view manually from the App Router effect so
          // disable the default automatic one to avoid double-counting.
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
    </>
  )
}
