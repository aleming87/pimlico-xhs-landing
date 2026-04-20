'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Link } from './link'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Check if user has already accepted/rejected cookies
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  const emit = (value) => {
    localStorage.setItem('cookieConsent', value)
    // Notify other components (Analytics) in the same tab without polling.
    // `storage` events only fire cross-tab, so we dispatch a custom event.
    try {
      window.dispatchEvent(new CustomEvent('consent:updated', { detail: value }))
    } catch {
      // Older browsers: fall back silently; Analytics will catch up on
      // the next route change or full reload.
    }
  }

  const handleAccept = () => {
    emit('accepted')
    setIsClosing(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  const handleReject = () => {
    emit('rejected')
    setIsClosing(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible) return null

  /* Rev 48e3 \u2014 brand-aligned cookie notice. Previous version was a
     full-width bg-white card on our own dark brand pages, which
     clashed hard (Andrew: "the cookie notice is rather large right
     now, it should be brand aligned and more subtle"). Now: anchored
     bottom-left, compact, dark navy matching the site brand, tight
     1-line copy with a link to the full policy. Also doesn\u2019t fight
     the Nadia bubble which sits bottom-right. */
  return (
    <div
      className={clsx(
        'fixed bottom-4 left-4 z-50 max-w-sm',
        'transition-all duration-300 ease-in-out',
        isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      )}
      role="dialog"
      aria-label="Cookie notice"
    >
      <div className="rounded-xl bg-[#0b1738] text-white/90 shadow-xl ring-1 ring-white/10 border border-white/10 p-4">
        <p className="text-[12.5px] leading-relaxed text-white/80">
          We use cookies to improve your experience and measure site usage.{' '}
          <Link href="/privacy" className="text-white underline underline-offset-2 hover:text-white/80">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-[#0b1738] hover:bg-white/90 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-4 py-1.5 text-[12px] font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
