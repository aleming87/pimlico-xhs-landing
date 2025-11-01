'use client'

export default function MapSection() {
  return (
    <div className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10 bg-gray-800 p-4">
      <div id="hs-users-datamap" className="h-[500px]"></div>

      {/* Solution Area Buttons */}
      <div className="mt-6 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => {
              // Highlight AI regions: North America, Europe, APAC
              if (window.highlightRegions) window.highlightRegions(['USA', 'CAN', 'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'JPN', 'KOR', 'AUS', 'NZL', 'SGP', 'HKG'], '#3b82f6')
            }}
            className="group px-4 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-750 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold transition-all duration-200 border border-gray-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 group-hover:bg-white"></span>
              <span>AI</span>
            </div>
          </button>
          <button 
            onClick={() => {
              // Highlight Payments regions: North America, Europe, Middle East, APAC
              if (window.highlightRegions) window.highlightRegions(['USA', 'CAN', 'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'ARE', 'SAU', 'QAT', 'BHR', 'JPN', 'KOR', 'AUS', 'NZL', 'SGP', 'HKG', 'IND', 'THA'], '#3b82f6')
            }}
            className="group px-4 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-750 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold transition-all duration-200 border border-gray-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 group-hover:bg-white"></span>
              <span>Payments</span>
            </div>
          </button>
          <button 
            onClick={() => {
              // Highlight Gambling regions: Europe, LATAM, APAC, Africa
              if (window.highlightRegions) window.highlightRegions(['GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'MLT', 'CYP', 'BRA', 'ARG', 'MEX', 'CHL', 'COL', 'PER', 'AUS', 'NZL', 'JPN', 'KOR', 'SGP', 'PHL', 'ZAF', 'KEN', 'NGA'], '#10b981')
            }}
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
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2 text-gray-300">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
          <span>Active Monitoring: 6 Regions</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <div className="w-3 h-3 rounded bg-gray-600"></div>
          <span>Coverage: 90+ Jurisdictions</span>
        </div>
      </div>
    </div>
  )
}
