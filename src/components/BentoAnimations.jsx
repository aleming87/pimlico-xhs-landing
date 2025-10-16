"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Animated Impact Score Component
export function AnimatedImpactScore() {
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    let interval;
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        setScore(prev => {
          if (prev >= 85) {
            return 85;
          }
          return prev + 1;
        });
      }, 20);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, []);
  
  return (
    <div className="w-full max-lg:max-w-xs bg-gray-700/30 rounded-lg p-6 border border-gray-600/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Impact Score</span>
          <span className="text-sm font-semibold text-red-400">High</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative h-2 bg-gray-700 rounded flex-1 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-red-500 rounded transition-all duration-1000 ease-out"
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 w-10 text-right tabular-nums">{score}%</span>
          </div>
          <div className="text-xs text-gray-300">
            <div className="font-semibold text-white mb-1">Key Obligations:</div>
            <div className="space-y-1 pl-3">
              <div>• Model documentation required</div>
              <div>• Risk assessment mandatory</div>
              <div>• Human oversight needed</div>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-600/50">
          <div className="text-xs text-gray-400">Compliance Deadline</div>
          <div className="text-sm font-semibold text-yellow-400 mt-1">Aug 2, 2026</div>
        </div>
      </div>
    </div>
  );
}

// Animated Collaborate Component with Scrolling Names
const newActivitiesList = [
  { name: 'Alex', initials: 'AM', color: 'purple', action: 'updated status', detail: 'PSD3 implementation timeline adjusted' },
  { name: 'Maria', initials: 'MR', color: 'pink', action: 'added comment', detail: 'MiCA requirements need clarification' },
  { name: 'David', initials: 'DL', color: 'yellow', action: 'shared document', detail: 'Q4 compliance checklist ready for review' },
];

export function AnimatedCollaborate() {
  const [activities, setActivities] = useState([
    { id: 1, name: 'Jane', initials: 'JD', color: 'blue', action: 'added a note', detail: 'EU AI Act - High risk classification needs review' },
    { id: 2, name: 'Sam', initials: 'SK', color: 'green', action: 'assigned a task', detail: 'Review NIST guidelines compliance' },
  ]);
  
  useEffect(() => {
    let index = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < newActivitiesList.length) {
          setActivities(prev => {
            const newItem = { ...newActivitiesList[index], id: Date.now() + index };
            const updated = [newItem, ...prev];
            return updated.slice(0, 3); // Keep only 3 items
          });
          index++;
        }
      }, 4000); // Show new activity every 4 seconds
      
      return () => clearInterval(interval);
    }, 2000); // Start after 2 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-500',
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 ring-2 ring-gray-800 flex items-center justify-center text-xs font-semibold text-white">JD</div>
          <div className="h-8 w-8 rounded-full bg-green-500 ring-2 ring-gray-800 flex items-center justify-center text-xs font-semibold text-white">SK</div>
          <div className="h-8 w-8 rounded-full bg-purple-500 ring-2 ring-gray-800 flex items-center justify-center text-xs font-semibold text-white">AM</div>
          <div className="h-8 w-8 rounded-full bg-gray-600 ring-2 ring-gray-800 flex items-center justify-center text-xs font-semibold text-gray-300">+5</div>
        </div>
        <span className="text-xs text-gray-400">8 team members</span>
      </div>
      <div className="space-y-2 overflow-hidden">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50 animate-in fade-in slide-in-from-top-4 duration-500"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <div className="flex items-start gap-2">
              <div className={`h-6 w-6 rounded-full ${colorClasses[activity.color]} flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white`}>
                {activity.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">{activity.name} {activity.action}</div>
                <div className="text-xs text-gray-400 mt-0.5">{activity.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated Code Scrolling Component
export function AnimatedCodeIntegration() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setScrollPosition(prev => {
        const newPos = prev + 1;
        if (newPos >= 200) return 0; // Reset after scrolling
        return newPos;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  return (
    <div 
      className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl ring-1 ring-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex bg-gray-800 ring-1 ring-white/5 border-b border-gray-700">
        <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
          <div className="border-r border-b border-r-white/20 border-b-transparent bg-gray-900 px-4 py-2 text-white flex items-center gap-2">
            <span>integrations.js</span>
          </div>
          <div className="border-r border-gray-600/10 px-4 py-2">webhooks.js</div>
          <div className="border-r border-gray-600/10 px-4 py-2">README.md</div>
        </div>
      </div>
      <div className="relative h-full overflow-hidden">
        <div 
          className="px-6 pt-4 pb-6"
          style={{ 
            transform: `translateY(-${scrollPosition}px)`,
            transition: 'transform 0.1s linear',
            willChange: 'transform'
          }}
        >
          <div className="font-mono text-xs leading-relaxed">
            <div className="text-gray-500">// XHS API Integration</div>
            <div className="text-purple-400">import</div>
            <span className="text-gray-300">{` { XHSClient } `}</span>
            <span className="text-purple-400">from</span>
            <span className="text-green-400">{` '@xhs/sdk'`}</span>
            
            <div className="mt-3 text-purple-400">const</div>
            <span className="text-blue-300">{` client `}</span>
            <span className="text-gray-300">{`= `}</span>
            <span className="text-purple-400">new</span>
            <span className="text-blue-300">{` XHSClient`}</span>
            <span className="text-gray-300">{`({`}</span>
            <div className="ml-4 text-gray-300">
              <span className="text-blue-300">apiKey:</span>
              <span className="text-green-400">{` 'xhs_live_k8s9d...'`}</span>
              <span>,</span>
            </div>
            <div className="ml-4 text-gray-300">
              <span className="text-blue-300">environment:</span>
              <span className="text-green-400">{` 'production'`}</span>
            </div>
            <div className="text-gray-300">{`})`}</div>
            
            <div className="mt-4 text-gray-500">// Fetch regulations by domain</div>
            <div className="text-purple-400">const</div>
            <span className="text-blue-300">{` data `}</span>
            <span className="text-gray-300">{`= `}</span>
            <span className="text-purple-400">await</span>
            <span className="text-blue-300">{` client`}</span>
            <span className="text-gray-300">.regulations.list(</span>
            <span className="text-gray-300">{`{`}</span>
            <div className="ml-4">
              <span className="text-blue-300">domain:</span>
              <span className="text-green-400">{` 'ai'`}</span>
              <span className="text-gray-300">,</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-300">jurisdictions:</span>
              <span className="text-gray-300">{` [`}</span>
              <span className="text-green-400">'US'</span>
              <span className="text-gray-300">, </span>
              <span className="text-green-400">'EU'</span>
              <span className="text-gray-300">, </span>
              <span className="text-green-400">'UK'</span>
              <span className="text-gray-300">{`],`}</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-300">limit:</span>
              <span className="text-yellow-400">{` 50`}</span>
            </div>
            <div className="text-gray-300">{`})`}</div>

            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="text-gray-500">// Slack Integration</div>
              <div className="text-purple-400 mt-2">await</div>
              <span className="text-blue-300">{` client`}</span>
              <span className="text-gray-300">.webhooks.create(</span>
              <span className="text-gray-300">{`{`}</span>
              <div className="ml-4">
                <span className="text-blue-300">url:</span>
                <span className="text-green-400">{` 'https://hooks.slack.com/...'`}</span>
                <span className="text-gray-300">,</span>
              </div>
              <div className="ml-4">
                <span className="text-blue-300">events:</span>
                <span className="text-gray-300">{` [`}</span>
                <span className="text-green-400">'regulation.created'</span>
                <span className="text-gray-300">{`]`}</span>
              </div>
              <div className="text-gray-300">{`})`}</div>
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="text-gray-500">// Jira Integration</div>
              <div className="text-purple-400 mt-2">await</div>
              <span className="text-blue-300">{` client`}</span>
              <span className="text-gray-300">.integrations.connect(</span>
              <span className="text-gray-300">{`{`}</span>
              <div className="ml-4">
                <span className="text-blue-300">provider:</span>
                <span className="text-green-400">{` 'jira'`}</span>
                <span className="text-gray-300">,</span>
              </div>
              <div className="ml-4">
                <span className="text-blue-300">config:</span>
                <span className="text-gray-300">{` {`}</span>
                <div className="ml-4">
                  <span className="text-blue-300">projectKey:</span>
                  <span className="text-green-400">{` 'COMP'`}</span>
                </div>
              <div className="ml-4 text-gray-300">{`}`}</div>
              </div>
              <div className="text-gray-300">{`})`}</div>
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="text-gray-500">// Export to CSV</div>
              <div className="text-purple-400 mt-2">const</div>
              <span className="text-blue-300">{` csv `}</span>
              <span className="text-gray-300">{`= `}</span>
              <span className="text-purple-400">await</span>
              <span className="text-blue-300">{` client`}</span>
              <span className="text-gray-300">.export(</span>
              <span className="text-gray-300">{`{`}</span>
              <div className="ml-4">
                <span className="text-blue-300">format:</span>
                <span className="text-green-400">{` 'csv'`}</span>
                <span className="text-gray-300">,</span>
              </div>
              <div className="ml-4">
                <span className="text-blue-300">fields:</span>
                <span className="text-gray-300">{` [`}</span>
                <span className="text-green-400">'title'</span>
                <span className="text-gray-300">, </span>
                <span className="text-green-400">'jurisdiction'</span>
                <span className="text-gray-300">{`]`}</span>
              </div>
              <div className="text-gray-300">{`})`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
