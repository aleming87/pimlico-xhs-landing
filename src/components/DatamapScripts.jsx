'use client'

import { useEffect } from 'react'

export default function DatamapScripts() {
  useEffect(() => {
    // Load external scripts
    const scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.9/topojson.min.js',
      'https://datamaps.github.io/scripts/datamaps.world.min.js'
    ]

    let loadedScripts = 0
    
    scripts.forEach((src) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        loadedScripts++
        if (loadedScripts === scripts.length) {
          initializeDatamap()
        }
      }
      document.head.appendChild(script)
    })

    function initializeDatamap() {
      const mapElement = document.querySelector('#hs-users-datamap')
      if (!mapElement || typeof window.Datamap === 'undefined') return
      
      // All countries from the Pimlico tagging scheme - highlighted by default
      const taggedCountries = {
        // Europe
        'GBR': 'COVERED', 'DEU': 'COVERED', 'FRA': 'COVERED', 'ITA': 'COVERED', 
        'ESP': 'COVERED', 'NLD': 'COVERED', 'SWE': 'COVERED', 'DNK': 'COVERED',
        'GRC': 'COVERED', 'ROU': 'COVERED', 'HRV': 'COVERED', 'MLT': 'COVERED',
        'PRT': 'COVERED', 'BEL': 'COVERED', 'AUT': 'COVERED', 'CHE': 'COVERED',
        'IRL': 'COVERED', 'POL': 'COVERED', 'CZE': 'COVERED', 'HUN': 'COVERED',
        'FIN': 'COVERED', 'NOR': 'COVERED', 'LUX': 'COVERED', 'CYP': 'COVERED',
        'EST': 'COVERED', 'LVA': 'COVERED', 'LTU': 'COVERED', 'SVK': 'COVERED',
        'SVN': 'COVERED', 'BGR': 'COVERED', 'ISL': 'COVERED', 'UKR': 'COVERED',
        'ALB': 'COVERED', 'ARM': 'COVERED', 'AZE': 'COVERED', 'BLR': 'COVERED',
        'BIH': 'COVERED', 'GEO': 'COVERED', 'KAZ': 'COVERED', 'LIE': 'COVERED',
        'MDA': 'COVERED', 'MNE': 'COVERED', 'MKD': 'COVERED', 'RUS': 'COVERED',
        'SRB': 'COVERED', 'TUR': 'COVERED',
        // North America
        'USA': 'COVERED', 'CAN': 'COVERED', 'MEX': 'COVERED',
        // South America
        'BRA': 'COVERED', 'ARG': 'COVERED', 'COL': 'COVERED', 'CHL': 'COVERED', 'PER': 'COVERED',
        // Asia-Pacific
        'AUS': 'COVERED', 'NZL': 'COVERED', 'JPN': 'COVERED', 'KOR': 'COVERED',
        'SGP': 'COVERED', 'HKG': 'COVERED', 'CHN': 'COVERED', 'IND': 'COVERED',
        'PHL': 'COVERED', 'MYS': 'COVERED', 'THA': 'COVERED', 'VNM': 'COVERED',
        'IDN': 'COVERED', 'TWN': 'COVERED', 'KHM': 'COVERED', 'LAO': 'COVERED',
        'MMR': 'COVERED', 'BGD': 'COVERED', 'PAK': 'COVERED', 'LKA': 'COVERED',
        'NPL': 'COVERED', 'BTN': 'COVERED', 'MNG': 'COVERED', 'BRN': 'COVERED',
        'MAC': 'COVERED', 'TLS': 'COVERED',
        // Middle East
        'ARE': 'COVERED', 'SAU': 'COVERED', 'ISR': 'COVERED', 'QAT': 'COVERED',
        'BHR': 'COVERED', 'KWT': 'COVERED', 'JOR': 'COVERED', 'LBN': 'COVERED',
        'IRQ': 'COVERED', 'IRN': 'COVERED', 'OMN': 'COVERED', 'YEM': 'COVERED',
        'SYR': 'COVERED', 'PSE': 'COVERED',
        // Africa
        'ZAF': 'COVERED', 'NGA': 'COVERED', 'KEN': 'COVERED', 'EGY': 'COVERED',
        'MAR': 'COVERED', 'GHA': 'COVERED', 'ETH': 'COVERED', 'TZA': 'COVERED',
        'UGA': 'COVERED', 'RWA': 'COVERED', 'SEN': 'COVERED', 'CIV': 'COVERED',
        'CMR': 'COVERED', 'AGO': 'COVERED', 'MOZ': 'COVERED', 'NAM': 'COVERED',
        'BWA': 'COVERED', 'ZWE': 'COVERED', 'ZMB': 'COVERED', 'MUS': 'COVERED',
        'SYC': 'COVERED', 'DZA': 'COVERED', 'TUN': 'COVERED', 'LBY': 'COVERED',
        'SDN': 'COVERED', 'GAB': 'COVERED', 'COG': 'COVERED', 'COD': 'COVERED',
        'MDG': 'COVERED', 'MWI': 'COVERED', 'MLI': 'COVERED', 'NER': 'COVERED',
        'BFA': 'COVERED', 'GIN': 'COVERED', 'GMB': 'COVERED', 'GNB': 'COVERED',
        'CPV': 'COVERED', 'LBR': 'COVERED', 'SLE': 'COVERED', 'TGO': 'COVERED',
        'BEN': 'COVERED', 'SOM': 'COVERED', 'DJI': 'COVERED', 'ERI': 'COVERED',
        'LSO': 'COVERED', 'SWZ': 'COVERED'
      }
      
      const dataMap = new window.Datamap({
        element: mapElement,
        projection: 'mercator',
        responsive: true,
        fills: {
          defaultFill: '#374151',
          COVERED: '#60a5fa',  // Light blue for covered jurisdictions
          AI: '#a78bfa',
          PAYMENTS: '#3b82f6',
          GAMBLING: '#10b981'
        },
        data: taggedCountries,
        geographyConfig: {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 0.5,
          highlightOnHover: true,
          highlightFillColor: '#93c5fd',
          highlightBorderColor: 'rgba(255, 255, 255, 0.5)',
          highlightBorderWidth: 1,
          popupOnHover: false
        }
      })
      
      // Store the map instance globally
      window.dataMapInstance = dataMap
      
      // Track currently highlighted countries
      let currentlyHighlighted = []
      
      // Define comprehensive regional groupings
      const regions = {
        NORTH_AMERICA: ['USA', 'CAN', 'MEX'],
        EUROPE: ['GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'DNK', 'NOR', 'FIN', 'POL', 'IRL', 'PRT', 'CZE', 'GRC', 'ROU', 'HUN', 'BGR', 'HRV', 'SVK', 'SVN', 'LTU', 'LVA', 'EST', 'MLT', 'CYP', 'LUX', 'ISL', 'UKR'],
        APAC: ['JPN', 'KOR', 'CHN', 'AUS', 'NZL', 'SGP', 'HKG', 'TWN', 'IND', 'THA', 'VNM', 'IDN', 'MYS', 'PHL', 'KHM', 'LAO', 'MMR', 'BGD', 'PAK', 'LKA'],
        MIDDLE_EAST: ['ARE', 'SAU', 'QAT', 'BHR', 'OMN', 'KWT', 'ISR', 'JOR', 'LBN', 'TUR', 'EGY', 'IRQ'],
        LATAM: ['BRA', 'ARG', 'MEX', 'CHL', 'COL', 'PER', 'URY', 'PRY', 'ECU', 'BOL', 'VEN', 'PAN', 'CRI', 'GTM', 'HND', 'SLV', 'NIC', 'DOM', 'CUB', 'JAM'],
        AFRICA: ['ZAF', 'KEN', 'NGA', 'GHA', 'UGA', 'TZA', 'ZWE', 'ZMB', 'BWA', 'NAM', 'MOZ', 'AGO', 'ETH', 'SEN', 'CIV', 'CMR', 'RWA']
      }
      
      // Create a global function to highlight specific regions with a color
      window.highlightRegions = function(regionNames, fillKey, stayHighlighted = false) {
        // First reset previously highlighted countries
        if (currentlyHighlighted.length > 0) {
          const resetData = {}
          currentlyHighlighted.forEach(code => {
            resetData[code] = { fillKey: 'defaultFill' }
          })
          dataMap.updateChoropleth(resetData)
        }
        
        // Collect countries to highlight
        const highlightData = {}
        const newHighlights = []
        regionNames.forEach(regionName => {
          if (regions[regionName]) {
            regions[regionName].forEach(code => {
              highlightData[code] = { fillKey: fillKey }
              newHighlights.push(code)
            })
          }
        })
        
        // Apply highlights
        dataMap.updateChoropleth(highlightData)
        currentlyHighlighted = newHighlights
      }
      
      // Alternative function to highlight by country codes directly
      window.highlightCountries = function(countryCodes, fillKey, stayHighlighted = false) {
        // First reset previously highlighted countries
        if (currentlyHighlighted.length > 0) {
          const resetData = {}
          currentlyHighlighted.forEach(code => {
            resetData[code] = { fillKey: 'defaultFill' }
          })
          dataMap.updateChoropleth(resetData)
        }
        
        // Then highlight the requested countries
        const highlightData = {}
        countryCodes.forEach(code => {
          highlightData[code] = { fillKey: fillKey }
        })
        dataMap.updateChoropleth(highlightData)
        currentlyHighlighted = countryCodes
        
        // Only auto-reset if stayHighlighted is false
        if (!stayHighlighted) {
          setTimeout(() => {
            const autoReset = {}
            countryCodes.forEach(code => {
              autoReset[code] = { fillKey: 'defaultFill' }
            })
            dataMap.updateChoropleth(autoReset)
            currentlyHighlighted = []
          }, 3000)
        }
      }
      
      window.addEventListener('resize', function () {
        if (dataMap && dataMap.resize) {
          dataMap.resize()
        }
      })
    }

    // Simple counter animation (no gradient)
    function animateCounter(elementId, targetValue, duration = 2000) {
      const element = document.getElementById(elementId)
      if (!element) return
      
      const startValue = 0
      const increment = targetValue / (duration / 16)
      let currentValue = startValue
      
      const timer = setInterval(() => {
        currentValue += increment
        if (currentValue >= targetValue) {
          currentValue = targetValue
          clearInterval(timer)
        }
        element.textContent = Math.floor(currentValue)
      }, 16)
    }
    
    function initializeCounters() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => animateCounter('counter-875k', 875, 2000), 200)
            setTimeout(() => animateCounter('counter-180', 180, 2000), 400)
            setTimeout(() => animateCounter('counter-90', 90, 2000), 600)
            observer.disconnect()
          }
        })
      }, { threshold: 0.5 })
      
      const statsSection = document.querySelector('#counter-875k')?.closest('.bg-white')
      if (statsSection) {
        observer.observe(statsSection)
      }
    }
    
    initializeCounters()
  }, [])

  return null
}