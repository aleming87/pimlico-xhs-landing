'use client'

import { useState } from 'react'

export default function MapSection() {
  const [activeSelection, setActiveSelection] = useState(null)

  const handleAIClick = () => {
    // AI covers major regulatory jurisdictions globally
    if (window.highlightCountries) {
      const aiCountries = [
        'USA', 'CAN', 'MEX',  // North America
        'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'CZE', 'GRC', 'ROU', 'HUN', 'BGR', 'HRV', 'SVK', 'SVN', 'LTU', 'LVA', 'EST', 'MLT', 'CYP', 'LUX', 'ISL', 'UKR', 'SRB', 'BIH', 'MKD', 'ALB', 'MNE', 'MDA', 'BLR', 'GEO', 'ARM', 'AZE',  // Europe
        'JPN', 'CHN', 'SGP', 'KOR', 'AUS', 'NZL', 'IND', 'THA', 'VNM', 'IDN', 'MYS', 'PHL', 'HKG', 'TWN', 'KHM', 'LAO', 'MMR', 'BGD', 'PAK', 'LKA', 'NPL', 'BTN', 'MNG',  // APAC
        'BRA', 'ARG', 'CHL', 'COL', 'PER', 'URY', 'PRY', 'ECU', 'BOL', 'VEN', 'PAN', 'CRI', 'GTM', 'HND', 'SLV', 'NIC', 'CUB', 'DOM', 'HTI', 'JAM', 'TTO', 'BRB', 'BHS', 'GUY', 'SUR',  // LATAM
        'ZAF', 'KEN', 'NGA', 'GHA', 'UGA', 'TZA', 'ZWE', 'ZMB', 'BWA', 'NAM', 'MOZ', 'AGO', 'ETH', 'SEN', 'CIV', 'CMR', 'RWA', 'MUS', 'SYC', 'MDG', 'MWI', 'BEN', 'TGO', 'BFA', 'MLI', 'NER', 'TCD', 'GAB', 'GNQ', 'COG', 'CAF', 'SSD', 'SOM', 'DJI', 'ERI',  // Africa
        'ARE', 'SAU', 'QAT', 'BHR', 'OMN', 'KWT', 'ISR', 'JOR', 'LBN', 'TUR', 'EGY', 'IRQ', 'IRN', 'AFG', 'YEM', 'SYR', 'PSE',  // Middle East
        'RUS', 'KAZ', 'UZB', 'TKM', 'TJK', 'KGZ'  // Eurasia
      ]
      window.highlightCountries(aiCountries, 'AI', true)
      setActiveSelection('AI')
    }
  }

  const handlePaymentsClick = () => {
    // Payments covers comprehensive global coverage
    if (window.highlightRegions) {
      window.highlightRegions(['NORTH_AMERICA', 'EUROPE', 'MIDDLE_EAST', 'APAC', 'LATAM', 'AFRICA'], 'PAYMENTS', true)
      setActiveSelection('PAYMENTS')
    }
  }

  const handleGamblingClick = () => {
    // Gambling covers major regulated gambling jurisdictions worldwide
    if (window.highlightCountries) {
      const gamblingCountries = [
        'USA', 'CAN', 'MEX',  // North America
        'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'MLT', 'CYP', 'GRC', 'CZE', 'SVK', 'HRV', 'BGR', 'ROU', 'EST', 'LVA', 'LTU', 'SVN', 'LUX', 'ISL', 'SRB', 'MKD', 'ALB', 'BIH', 'MNE', 'GEO', 'ARM',  // Europe
        'BRA', 'ARG', 'CHL', 'COL', 'PER', 'URY', 'PRY', 'ECU', 'BOL', 'PAN', 'CRI', 'GTM', 'DOM', 'JAM', 'TTO', 'BHS', 'BRB',  // LATAM
        'AUS', 'NZL', 'JPN', 'KOR', 'SGP', 'HKG', 'MAC', 'PHL', 'MYS', 'KHM', 'NPL', 'IND', 'LKA',  // APAC
        'ZAF', 'KEN', 'NGA', 'GHA', 'UGA', 'TZA', 'ZWE', 'ZMB', 'BWA', 'NAM', 'RWA', 'MUS', 'SYC',  // Africa
        'TUR', 'RUS', 'UKR', 'BLR', 'KAZ', 'MDA'  // Eastern Europe/Eurasia
      ]
      window.highlightCountries(gamblingCountries, 'GAMBLING', true)
      setActiveSelection('GAMBLING')
    }
  }

  // Define stats based on selection
  const getStats = () => {
    switch(activeSelection) {
      case 'AI':
        return { regions: 6, jurisdictions: 120 }
      case 'PAYMENTS':
        return { regions: 6, jurisdictions: 180 }
      case 'GAMBLING':
        return { regions: 6, jurisdictions: 90 }
      default:
        return { regions: 6, jurisdictions: 180 }  // Show full coverage by default
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
