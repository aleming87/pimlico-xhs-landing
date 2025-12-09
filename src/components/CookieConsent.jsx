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

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsClosing(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setIsClosing(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6',
        'transition-all duration-300 ease-in-out',
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cookie Notice
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. 
                  By clicking "Accept", you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:ml-8">
                <button
                  onClick={handleReject}
                  className={clsx(
                    'inline-flex items-center justify-center px-6 py-2.5',
                    'rounded-full border border-gray-300 shadow-sm',
                    'text-sm font-medium whitespace-nowrap text-gray-700',
                    'hover:bg-gray-50 transition-colors'
                  )}
                >
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className={clsx(
                    'inline-flex items-center justify-center px-6 py-2.5',
                    'rounded-full border border-transparent bg-gray-950 shadow-md',
                    'text-sm font-medium whitespace-nowrap text-white',
                    'hover:bg-gray-800 transition-colors'
                  )}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
