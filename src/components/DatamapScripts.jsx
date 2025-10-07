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
      const dataSet = {
        // All countries use default fill - no special highlighting
      }
      
      const mapElement = document.querySelector('#hs-users-datamap')
      if (!mapElement || typeof window.Datamap === 'undefined') return
      
      const dataMap = new window.Datamap({
        element: mapElement,
        projection: 'mercator',
        responsive: true,
        fills: {
          defaultFill: '#374151'
        },
        data: dataSet,
        geographyConfig: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          highlightFillColor: function(geo, data) {
            return data && data.fillKey !== 'defaultFill' ? '#1d4ed8' : '#6b7280'
          },
          highlightBorderColor: '#3b82f6',
          popupTemplate: function (geo, data) {
            if (!data || !data.region) return ''
            
            return '<div style="background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 16px; color: black; min-width: 200px;">' +
              '<div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #1f2937;">' + geo.properties.NAME + '</div>' +
              '<div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Region: <span style="color: #3b82f6; font-weight: 500;">' + data.region + '</span></div>' +
              '<div style="font-size: 12px; color: #9ca3af;">Active regulatory monitoring</div>' +
              '</div>'
          }
        }
      })
      
      window.addEventListener('resize', function () {
        if (dataMap && dataMap.resize) {
          dataMap.resize()
        }
      })
    }

    // Counter animation
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
            setTimeout(() => animateCounter('counter-750k', 750, 2000), 200)
            setTimeout(() => animateCounter('counter-90', 90, 2000), 400)
            setTimeout(() => animateCounter('counter-50', 50, 2000), 600)
            observer.disconnect()
          }
        })
      }, { threshold: 0.5 })
      
      const statsSection = document.querySelector('#counter-750k')?.closest('.bg-white')
      if (statsSection) {
        observer.observe(statsSection)
      }
    }
    
    initializeCounters()
  }, [])

  return null
}