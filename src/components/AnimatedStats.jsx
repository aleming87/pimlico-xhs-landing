"use client";

import { useEffect, useState } from 'react';

export default function AnimatedStats() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('loading'); // 'loading', 'complete'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start the gradient wave animation
          setTimeout(() => {
            setAnimationPhase('complete');
          }, 4000); // Animation duration
        }
      },
      { threshold: 0.1 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Improved counter animation with proper number formatting
    const animateCounter = (id, target, delay = 0) => {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (!element) return;

        let current = 0;
        const duration = 2500; // Total animation duration in ms
        const fps = 30; // Frames per second for smoother animation
        const totalFrames = (duration / 1000) * fps;
        const increment = target / totalFrames;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          
          // Format numbers with commas and ensure sequential display
          const displayValue = Math.floor(current);
          if (target >= 1000) {
            element.textContent = displayValue.toLocaleString();
          } else {
            element.textContent = displayValue.toString();
          }
        }, 1000 / fps);
      }, delay);
    };

    // Start counters with staggered timing
    animateCounter('counter-750k', 750000, 800);
    animateCounter('counter-90', 90, 1600);
    animateCounter('counter-50', 50, 2400);
  }, [isVisible]);

  const getNumberClass = () => {
    if (animationPhase === 'loading') {
      return 'bg-gradient-to-r from-blue-300 via-blue-500 via-blue-600 via-blue-500 to-blue-300 bg-clip-text text-transparent animate-gradient-wave';
    }
    return 'text-gray-900 transition-all duration-1000 ease-out';
  };

  return (
    <>
      <style jsx>{`
        @keyframes gradient-wave {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 200% 50%; }
          75% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-wave {
          background-size: 300% 300%;
          animation: gradient-wave 3s ease-in-out infinite;
        }
      `}</style>
      
      <div id="stats-section" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-20 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-6">
              <dt className="text-base/7 text-gray-600">Regulatory updates parsed annually</dt>
              <dd className={`order-first text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl ${getNumberClass()}`}>
                <span id="counter-750k">0</span>+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-6">
              <dt className="text-base/7 text-gray-600">Global jurisdictions monitored</dt>
              <dd className={`order-first text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl ${getNumberClass()}`}>
                <span id="counter-90">0</span>+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-6">
              <dt className="text-base/7 text-gray-600">Regulatory topics covered</dt>
              <dd className={`order-first text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl ${getNumberClass()}`}>
                <span id="counter-50">0</span>+
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}