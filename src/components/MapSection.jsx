'use client'

import { useState } from 'react'

export default function MapSection() {
  const [activeSelection, setActiveSelection] = useState(null)

  const handleAIClick = () => {
    // AI covers: North America, UK, Europe, Japan, China, Singapore, Australia, India, Brazil, Chile, Argentina, South Africa, South Korea, New Zealand
    if (window.highlightCountries) {
      const aiCountries = [
        'USA', 'CAN', 'MEX',  // North America
        'GBR',  // UK
        'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'CZE', 'GRC', 'ROU', 'HUN', 'BGR', 'HRV', 'SVK', 'SVN', 'LTU', 'LVA', 'EST', 'MLT', 'CYP', 'LUX', 'ISL',  // Europe
        'JPN',  // Japan
        'CHN',  // China
        'SGP',  // Singapore
        'KOR',  // South Korea
        'AUS',  // Australia
        'NZL',  // New Zealand
        'IND',  // India
        'BRA',  // Brazil
        'CHL',  // Chile
        'ARG',  // Argentina
        'ZAF'   // South Africa
      ]
      window.highlightCountries(aiCountries, 'AI', true)  // true = stay highlighted
      setActiveSelection('AI')
    }
  }

  const handlePaymentsClick = () => {
    // Payments covers: ALL regions
    if (window.highlightRegions) {
      window.highlightRegions(['NORTH_AMERICA', 'EUROPE', 'MIDDLE_EAST', 'APAC', 'LATAM', 'AFRICA'], 'PAYMENTS', true)
      setActiveSelection('PAYMENTS')
    }
  }

  const handleGamblingClick = () => {
    // Gambling covers major regulated gambling jurisdictions worldwide
    if (window.highlightCountries) {
      const gamblingCountries = [
        // North America
        'USA', 'CAN', 'MEX',
        // Europe (comprehensive - all major gambling markets)
        'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'MLT', 'CYP', 'GRC', 'CZE', 'SVK', 'HRV', 'BGR', 'ROU', 'EST', 'LVA', 'LTU', 'SVN', 'LUX', 'ISL', 'SRB', 'MKD', 'ALB', 'BIH', 'MNE',
        // LATAM (major markets)
        'BRA', 'ARG', 'CHL', 'COL', 'PER', 'URY', 'PRY', 'ECU', 'BOL', 'PAN', 'CRI', 'GTM', 'DOM', 'JAM', 'TTO', 'BHS', 'BRB', 'CUW',
        // APAC (regulated markets)
        'AUS', 'NZL', 'JPN', 'KOR', 'SGP', 'HKG', 'MAC', 'PHL', 'MYS', 'KHM', 'NPL',
        // Africa (regulated markets)
        'ZAF', 'KEN', 'NGA', 'GHA', 'UGA', 'TZA', 'ZWE', 'ZMB', 'BWA', 'NAM', 'RWA', 'MUS', 'SYC',
        // Middle East (limited - only where legal)
        'TUR', 'GEO', 'ARM',  // Turkey, Georgia, Armenia (some forms allowed)
        // Eastern Europe/Eurasia
        'RUS', 'UKR', 'BLR', 'KAZ', 'MDA'
      ]
      window.highlightCountries(gamblingCountries, 'GAMBLING', true)
      setActiveSelection('GAMBLING')
    }
  }

  // Define stats based on selection
  const getStats = () => {
    switch(activeSelection) {
      case 'AI':
        return { regions: 5, jurisdictions: 45 }  // North America, Europe, Asia-Pacific, LATAM (select), Africa (select)
      case 'PAYMENTS':
        return { regions: 6, jurisdictions: 150 }  // All regions
      case 'GAMBLING':
        return { regions: 6, jurisdictions: 80 }  // Global gambling jurisdictions (excluding prohibited countries)
      default:
        return { regions: 6, jurisdictions: 150 }  // All regions when nothing selected
    }
  }

  const stats = getStats()

  return (
    <div className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10 bg-gray-800 p-4">
      <div id="hs-users-datamap" className="h-[500px]"></div>

      {/* Solution Area Buttons */}
      <div className="mt-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={handleAIClick}
            className="group px-4 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-750 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold transition-all duration-200 border border-gray-600 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 group-hover:bg-white"></span>
              <span>AI</span>
            </div>
          </button>
          <button 
            onClick={handlePaymentsClick}
            className="group px-4 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-750 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold transition-all duration-200 border border-gray-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 group-hover:bg-white"></span>
              <span>Payments</span>
            </div>
          </button>
          <button 
            onClick={handleGamblingClick}
            className="group px-4 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-750 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold transition-all duration-200 border border-gray-600 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-white"></span>
              <span>Gambling</span>
            </div>
          </button>
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-4 flex justify-center gap-8 text-sm">
        <div className="flex items-center space-x-2 text-gray-300">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse-slow"></div>
          <span>Active Monitoring: {stats.regions} Region{stats.regions !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <div className="w-3 h-3 rounded bg-gray-600"></div>
          <span>Coverage: {stats.jurisdictions}+ Jurisdictions</span>
        </div>
      </div>
    </div>
  )
}
