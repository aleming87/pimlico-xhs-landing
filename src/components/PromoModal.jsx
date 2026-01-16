'use client'

import { useState, useEffect } from 'react'

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if modal has been shown before
    const hasSeenPromo = localStorage.getItem('hasSeenPromo')
    
    if (!hasSeenPromo) {
      // Show modal after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('hasSeenPromo', 'true')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-blue-500/20">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Save up to <span className="text-blue-400">50%</span> on your regulatory intelligence costs today
            </h2>
            <p className="text-gray-400 text-sm">
              When you switch to XHS<sup className="text-xs">™</sup>
            </p>
          </div>

          <a
            href="/contact"
            onClick={handleClose}
            className="inline-block w-full rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Book a demo
          </a>

          <button
            onClick={handleClose}
            className="mt-4 text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
