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
  /* Rev 48f2 \u2014 redesigned per Andrew: "this bar could be longer,
     a thin line, kind of see-through, and the blue doesn\u2019t match."
     Now a wider strip (560px) with tighter vertical padding, much
     lower bg opacity (/70 with backdrop blur so the content behind
     shows through), and a 1px top accent in the brand navy so it
     reads as a system notice instead of a coloured card. Privacy
     link uses the same white underline pattern \u2014 no competing
     blue. Still centred, still dismissable. */
  return (
    <div
      className={clsx(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(560px,calc(100vw-2rem))]',
        'transition-all duration-300 ease-in-out',
        isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      )}
      role="dialog"
      aria-label="Cookie notice"
    >
      <div className="rounded-full bg-[#0b1738]/70 backdrop-blur-md ring-1 ring-white/10 px-4 py-1.5">
        <div className="flex items-center gap-3">
          <p className="text-[11px] leading-snug text-white/75 flex-1 truncate">
            We use cookies to improve your experience.{' '}
            <Link href="/privacy" className="text-white underline underline-offset-2 hover:text-white/80">
              Privacy
            </Link>
          </p>
          <button
            onClick={handleAccept}
            className="shrink-0 inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#0b1738] hover:bg-white/90 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            aria-label="Reject cookies"
            className="shrink-0 text-white/50 hover:text-white/90 text-[11px] transition-colors px-1"
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
