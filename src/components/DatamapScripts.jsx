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
      
      const dataMap = new window.Datamap({
        element: mapElement,
        projection: 'mercator',
        responsive: true,
        fills: {
          defaultFill: '#374151',
          AI: '#a78bfa',
          PAYMENTS: '#3b82f6',
          GAMBLING: '#10b981'
        },
        data: {},
        geographyConfig: {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 0.5,
          highlightOnHover: true,
          highlightFillColor: '#6b7280',
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
            setTimeout(() => animateCounter('counter-1200k', 1.2, 2000), 200)
            setTimeout(() => animateCounter('counter-180', 180, 2000), 400)
            setTimeout(() => animateCounter('counter-90', 90, 2000), 600)
            observer.disconnect()
          }
        })
      }, { threshold: 0.5 })
      
      const statsSection = document.querySelector('#counter-1200k')?.closest('.bg-white')
      if (statsSection) {
        observer.observe(statsSection)
      }
    }
    
    initializeCounters()
  }, [])

  return null
}