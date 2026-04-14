'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

/**
 * Consent-gated Google Analytics 4 loader.
 *
 * Only renders the GA tag when BOTH of the following are true:
 *   1. `NEXT_PUBLIC_GA_ID` is set at build time (e.g. `G-XXXXXXXXXX`)
 *   2. The visitor has clicked "Accept" in the cookie banner
 *      (localStorage key `cookieConsent` === 'accepted')
 *
 * We re-check on `storage` events so consent changes in another tab
 * propagate without a full reload.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const [consented, setConsented] = useState(false)

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
    // Fire when the consent banner updates localStorage in this tab
    // (the banner doesn't dispatch events today, so we poll briefly).
    const id = setInterval(read, 1500)
    window.addEventListener('storage', read)
    return () => {
      clearInterval(id)
      window.removeEventListener('storage', read)
    }
  }, [gaId])

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
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
