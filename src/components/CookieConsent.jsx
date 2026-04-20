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
  /* Rev 48e4 \u2014 more subtle. Single-line copy at XS size, compact
     padding, and the whole card sits semi-transparent so it reads
     as a system-level notice rather than a splash. Still accessible,
     still clickable \u2014 just quieter. Andrew: "you can make it a
     little more subtle." */
  return (
    <div
      className={clsx(
        // Rev 48e5 \u2014 centred. Andrew: "it could be a little more
        //   central." Still bottom-anchored + compact so it doesn\u2019t
        //   cover content; just no longer glued to the left edge.
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(380px,calc(100vw-2rem))]',
        'transition-all duration-300 ease-in-out',
        isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      )}
      role="dialog"
      aria-label="Cookie notice"
    >
      <div className="rounded-lg bg-[#0b1738]/95 backdrop-blur text-white/90 shadow-lg ring-1 ring-white/10 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <p className="text-[11px] leading-snug text-white/75 flex-1">
            We use cookies to improve your experience.{' '}
            <Link href="/privacy" className="text-white underline underline-offset-2 hover:text-white/80">
              Privacy
            </Link>
            .
          </p>
          <button
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#0b1738] hover:bg-white/90 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            aria-label="Reject cookies"
            className="text-white/50 hover:text-white/90 text-[11px] transition-colors px-1"
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
