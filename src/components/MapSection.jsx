'use client'

import { useState } from 'react'

export default function MapSection() {
  const [activeSelection, setActiveSelection] = useState(null)

  const handleAIClick = () => {
    // AI covers major regulatory jurisdictions - all from Pimlico tagging scheme
    if (window.highlightCountries) {
      const aiCountries = [
        // North America
        'USA', 'CAN', 'MEX',
        // Europe
        'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'CZE', 'GRC', 'EST', 'LVA', 'LTU', 'SVN', 'LUX', 'ISL', 'HUN', 'SVK', 'BGR', 'ROU', 'HRV', 'MLT', 'CYP', 'UKR', 'SRB', 'MKD', 'ALB', 'BIH', 'MNE', 'GEO', 'ARM', 'AZE', 'MDA', 'BLR', 'TUR', 'RUS', 'KAZ',
        // APAC
        'JPN', 'CHN', 'SGP', 'KOR', 'AUS', 'NZL', 'IND', 'HKG', 'TWN', 'THA', 'VNM', 'MYS', 'IDN', 'PHL',
        // LATAM
        'BRA', 'CHL', 'ARG', 'COL', 'PER',
        // Africa
        'ZAF', 'KEN', 'NGA', 'EGY', 'MAR',
        // Middle East
        'ARE', 'SAU', 'ISR', 'QAT', 'BHR', 'KWT'
      ]
      window.highlightCountries(aiCountries, 'AI', true)
      setActiveSelection('AI')
    }
  }

  const handlePaymentsClick = () => {
    // Payments covers nearly the entire world - all from Pimlico tagging scheme
    if (window.highlightCountries) {
      const paymentsCountries = [
        // Europe
        'GBR', 'DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'SWE', 'DNK', 'GRC', 'ROU', 'HRV', 'MLT',
        'PRT', 'BEL', 'AUT', 'CHE', 'IRL', 'POL', 'CZE', 'HUN', 'FIN', 'NOR', 'LUX', 'CYP',
        'EST', 'LVA', 'LTU', 'SVK', 'SVN', 'BGR', 'ISL', 'UKR', 'ALB', 'ARM', 'AZE', 'BLR',
        'BIH', 'GEO', 'KAZ', 'LIE', 'MDA', 'MNE', 'MKD', 'RUS', 'SRB', 'TUR',
        // North America
        'USA', 'CAN', 'MEX',
        // South America
        'BRA', 'ARG', 'COL', 'CHL', 'PER',
        // Asia-Pacific
        'AUS', 'NZL', 'JPN', 'KOR', 'SGP', 'HKG', 'CHN', 'IND', 'PHL', 'MYS', 'THA', 'VNM',
        'IDN', 'TWN', 'KHM', 'LAO', 'MMR', 'BGD', 'PAK', 'LKA', 'NPL', 'BTN', 'MNG', 'BRN', 'MAC', 'TLS',
        // Middle East
        'ARE', 'SAU', 'ISR', 'QAT', 'BHR', 'KWT', 'JOR', 'LBN', 'IRQ', 'IRN', 'OMN', 'YEM', 'SYR',
        // Africa
        'ZAF', 'NGA', 'KEN', 'EGY', 'MAR', 'GHA', 'ETH', 'TZA', 'UGA', 'RWA', 'SEN', 'CIV',
        'CMR', 'AGO', 'MOZ', 'NAM', 'BWA', 'ZWE', 'ZMB', 'MUS', 'SYC', 'DZA', 'TUN', 'LBY',
        'SDN', 'GAB', 'COG', 'COD', 'MDG', 'MWI', 'MLI', 'NER', 'BFA', 'GIN', 'GMB', 'GNB',
        'CPV', 'LBR', 'SLE', 'TGO', 'BEN', 'SOM', 'DJI', 'ERI', 'LSO', 'SWZ'
      ]
      window.highlightCountries(paymentsCountries, 'PAYMENTS', true)
      setActiveSelection('PAYMENTS')
    }
  }

  const handleGamblingClick = () => {
    // Gambling covers same jurisdictions as the Pimlico tagging scheme
    if (window.highlightCountries) {
      const gamblingCountries = [
        // Europe
        'GBR', 'DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'SWE', 'DNK', 'GRC', 'ROU', 'HRV', 'MLT',
        'PRT', 'BEL', 'AUT', 'CHE', 'IRL', 'POL', 'CZE', 'HUN', 'FIN', 'NOR', 'LUX', 'CYP',
        'EST', 'LVA', 'LTU', 'SVK', 'SVN', 'BGR', 'ISL', 'UKR', 'ALB', 'ARM', 'AZE', 'BLR',
        'BIH', 'GEO', 'KAZ', 'LIE', 'MDA', 'MNE', 'MKD', 'RUS', 'SRB', 'TUR',
        // North America
        'USA', 'CAN', 'MEX',
        // South America
        'BRA', 'ARG', 'COL', 'CHL', 'PER',
        // Asia-Pacific
        'AUS', 'NZL', 'JPN', 'KOR', 'SGP', 'HKG', 'CHN', 'IND', 'PHL', 'MYS', 'THA', 'VNM',
        'IDN', 'TWN', 'KHM', 'LAO', 'MMR', 'BGD', 'PAK', 'LKA', 'NPL', 'BTN', 'MNG', 'BRN', 'MAC', 'TLS',
        // Middle East
        'ARE', 'SAU', 'ISR', 'QAT', 'BHR', 'KWT', 'JOR', 'LBN', 'IRQ', 'IRN', 'OMN', 'YEM', 'SYR',
        // Africa
        'ZAF', 'NGA', 'KEN', 'EGY', 'MAR', 'GHA', 'ETH', 'TZA', 'UGA', 'RWA', 'SEN', 'CIV',
        'CMR', 'AGO', 'MOZ', 'NAM', 'BWA', 'ZWE', 'ZMB', 'MUS', 'SYC', 'DZA', 'TUN', 'LBY',
        'SDN', 'GAB', 'COG', 'COD', 'MDG', 'MWI', 'MLI', 'NER', 'BFA', 'GIN', 'GMB', 'GNB',
        'CPV', 'LBR', 'SLE', 'TGO', 'BEN', 'SOM', 'DJI', 'ERI', 'LSO', 'SWZ'
      ]
      window.highlightCountries(gamblingCountries, 'GAMBLING', true)
      setActiveSelection('GAMBLING')
    }
  }

  // Define stats based on selection
  const getStats = () => {
    switch(activeSelection) {
      case 'AI':
        return { regions: 5, jurisdictions: 40 }
      case 'PAYMENTS':
        return { regions: 6, jurisdictions: 180 }
      case 'GAMBLING':
        return { regions: 6, jurisdictions: 180 }
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
          <button 
            onClick={handleAIClick}
            className="group px-4 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-750 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold transition-all duration-200 border border-gray-600 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 group-hover:bg-white"></span>
              <span>AI</span>
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
