export default function DeploySection() {
  return (
    <div id="use-cases" className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance">
            Track the evolution of<br />
            <span className="text-blue-400">AI</span> & <span className="text-blue-400">Payments</span> regulation.
          </p>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Stay ahead of regulatory changes with real-time monitoring.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* AI Column */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 hover:from-gray-750 hover:to-gray-850 transition-all duration-300 border border-gray-700 hover:border-gray-600 shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center mb-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-6 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white">AI</h3>
            </div>
            
            <div className="space-y-4">
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">AI Legislation & Governance</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">Compute & Infrastructure</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">Data Protection</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">Technical Standards</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">National Security & Export Controls</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Column */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 hover:from-gray-750 hover:to-gray-850 transition-all duration-300 border border-gray-700 hover:border-gray-600 shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center mb-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-6 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white">Payments</h3>
            </div>
            
            <div className="space-y-4">
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">Licensing & Authorisations</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">Crypto & Digital Assets</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">AML/CTF & Sanctions</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">Operational Resilience & ICT Risk</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl px-6 py-5 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border border-gray-600 hover:border-blue-400/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-base group-hover:text-blue-300">Consumer Protection & Conduct</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}