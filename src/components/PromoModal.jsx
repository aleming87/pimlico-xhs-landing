'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if modal has been shown before
    const hasSeenPromo = localStorage.getItem('hasSeenPromo')
    
    if (!hasSeenPromo) {
      // Show modal after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('hasSeenPromo', 'true')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-lg w-full ring-2 ring-blue-500/50 hover:ring-blue-500 transition-all animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all ring-2 ring-gray-700 hover:ring-blue-500 shadow-lg"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Logos */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image 
              src="/Pimlico_Logo_Inverted.png" 
              alt="Pimlico" 
              width={120} 
              height={32} 
              className="h-7 w-auto"
            />
            <div className="h-8 w-px bg-blue-500/30"></div>
            <Image 
              src="/XHS_Logo_White.png" 
              alt="XHS" 
              width={80} 
              height={40} 
              className="h-8 w-auto"
            />
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 px-4 py-2 ring-1 ring-blue-500/30">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-semibold text-blue-300">Limited Time Offer</span>
            </div>
          </div>

          {/* Main message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Save up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">50%</span>
            </h2>
            <p className="text-xl text-gray-300 mb-2">
              on your regulatory intelligence costs
            </p>
            <p className="text-sm text-gray-400">
              when you switch to XHS<sup className="text-xs">™</sup> today
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 ring-1 ring-white/10">
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 flex-none text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
                <span className="text-sm">AI-powered compliance workspaces</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 flex-none text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
                <span className="text-sm">180+ jurisdictions covered</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 flex-none text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
                <span className="text-sm">7-day free trial included</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <a
            href="/contact"
            onClick={handleClose}
            className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-center text-base font-semibold text-white shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-2xl hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Book a demo
          </a>

          <button
            onClick={handleClose}
            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
