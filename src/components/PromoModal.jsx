'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    // Check if modal has been shown before
    const hasSeenPromo = localStorage.getItem('hasSeenPromo')
    
    if (!hasSeenPromo) {
      // Show modal after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    } else {
      // Show sidebar if user has seen modal
      setShowSidebar(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('hasSeenPromo', 'true')
    // Show sidebar after closing modal
    setTimeout(() => {
      setShowSidebar(true)
    }, 300)
  }

  const handleSidebarClick = () => {
    setIsOpen(true)
    setShowSidebar(false)
  }

  const handleSidebarClose = () => {
    setShowSidebar(false)
  }

  // Sidebar component
  if (showSidebar && !isOpen) {
    return (
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 animate-in slide-in-from-right duration-500">
        <button
          onClick={handleSidebarClick}
          className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-l-2xl shadow-2xl ring-2 ring-blue-500/50 hover:ring-blue-500 transition-all hover:scale-105 p-4 pr-6"
        >
          {/* Close sidebar button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleSidebarClose()
            }}
            className="absolute -left-2 top-2 w-6 h-6 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all flex items-center justify-center text-xs"
          >
            ×
          </button>
          
          <div className="flex flex-col items-center gap-2 text-center w-24">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Save 50%
            </div>
            <div className="text-[11px] text-gray-300 leading-tight">
              on regulatory intelligence costs
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              Ends Mar 31
            </div>
          </div>
        </button>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-lg w-full ring-2 ring-blue-500/50 hover:ring-blue-500 transition-all animate-in zoom-in-95 duration-300 overflow-hidden">
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
              className="h-9 w-auto"
            />
            <div className="h-8 w-px bg-blue-500/30"></div>
            <Image 
              src="/XHS_Logo_White.png" 
              alt="XHS" 
              width={120} 
              height={60} 
              className="h-9 w-auto"
            />
          </div>

          {/* Expiry Date Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 px-4 py-2 ring-1 ring-blue-500/30">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-blue-300">Offer ends March 31st, 2026</span>
            </div>
          </div>

          {/* Main message */}
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Save up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">50%</span>
            </h2>
            <p className="text-xl text-gray-300 mt-1">
              on regulatory intelligence costs
            </p>
          </div>

          {/* Sectors */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="px-4 py-2 rounded-full bg-purple-600/20 ring-1 ring-purple-500/30">
              <span className="text-sm font-medium text-purple-300">AI</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-blue-600/20 ring-1 ring-blue-500/30">
              <span className="text-sm font-medium text-blue-300">Payments</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-indigo-600/20 ring-1 ring-indigo-500/30">
              <span className="text-sm font-medium text-indigo-300">Crypto</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-emerald-600/20 ring-1 ring-emerald-500/30">
              <span className="text-sm font-medium text-emerald-300">Gambling</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 ring-1 ring-white/10">
            <ul className="space-y-3">
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
                <span className="text-sm">Country reports</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 flex-none text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
                <span className="text-sm">Slack, Google, and Microsoft integrations</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 flex-none text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
                <span className="text-sm">Unlimited users</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 flex-none text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
                <span className="text-sm">7-day free trial</span>
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
