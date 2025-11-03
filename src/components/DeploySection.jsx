'use client';
import { useState } from 'react';

export default function DeploySection() {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const categoryDetails = {
    // AI Categories
    'ai-legislation': {
      title: 'AI Legislation & Governance',
      description: 'Track comprehensive AI governance frameworks including the EU AI Act, US Executive Orders, and national AI strategies. Monitor high-risk AI system classifications, prohibited practices, transparency obligations, and conformity assessments across jurisdictions.',
    },
    'ai-compute': {
      title: 'Compute & Infrastructure',
      description: 'Stay informed on regulatory requirements for AI computing infrastructure, including reporting obligations for large-scale training runs, compute threshold monitoring, chip manufacturing regulations, and data center compliance requirements.',
    },
    'ai-data': {
      title: 'Data Protection',
      description: 'Monitor evolving data protection requirements specific to AI systems, including training data governance, synthetic data regulations, data minimization principles, purpose limitation in AI contexts, and cross-border data transfer restrictions for AI applications.',
    },
    'ai-standards': {
      title: 'Technical Standards',
      description: 'Track development of technical standards for AI systems including ISO/IEC standards, NIST AI frameworks, IEEE AI ethics guidelines, testing and validation requirements, documentation standards, and interoperability specifications.',
    },
    'ai-security': {
      title: 'National Security & Export Controls',
      description: 'Monitor AI-related export controls, including semiconductor restrictions, advanced AI model export regulations, dual-use technology controls, foreign investment screening in AI companies, and national security reviews of AI deployments.',
    },
    // Payments Categories
    'payments-licensing': {
      title: 'Licensing & Authorisations',
      description: 'Track licensing requirements across payment institutions, e-money providers, and crypto asset service providers. Monitor authorization processes, prudential requirements, fit and proper assessments, and ongoing supervision obligations across 90+ jurisdictions.',
    },
    'payments-crypto': {
      title: 'Crypto & Digital Assets',
      description: 'Stay updated on cryptocurrency regulations including MiCA in the EU, stablecoin frameworks, DeFi regulatory developments, NFT classifications, tokenization rules, and custody requirements for digital assets across global markets.',
    },
    'payments-aml': {
      title: 'AML/CTF & Sanctions',
      description: 'Monitor anti-money laundering and counter-terrorist financing requirements including customer due diligence, transaction monitoring thresholds, suspicious activity reporting, sanctions screening obligations, and FATF Travel Rule compliance for virtual assets.',
    },
    'payments-resilience': {
      title: 'Operational Resilience & ICT Risk',
      description: 'Track operational resilience frameworks including DORA (EU), critical third-party risk management, incident reporting obligations, business continuity requirements, and ICT security standards for payment service providers.',
    },
    'payments-consumer': {
      title: 'Consumer Protection & Conduct',
      description: 'Monitor consumer protection regulations including PSD2/PSD3 requirements, strong customer authentication, payment service user rights, dispute resolution mechanisms, transparency requirements, and unfair practice prohibitions.',
    },
    // Gambling Categories
    'gambling-licensing': {
      title: 'Licensing & Compliance',
      description: 'Track online and land-based gambling licensing across jurisdictions. Monitor application processes, compliance requirements, technical standards, game fairness certifications, RNG testing, and ongoing regulatory obligations for operators.',
    },
    'gambling-protection': {
      title: 'Player Protection',
      description: 'Stay informed on responsible gambling requirements including self-exclusion programs, deposit limits, reality checks, safer gambling tools, problem gambling identification, age verification, and vulnerable customer protections.',
    },
    'gambling-aml': {
      title: 'AML/CFT & Financial Crime',
      description: 'Monitor anti-money laundering requirements specific to gambling including source of funds/wealth checks, enhanced due diligence thresholds, transaction monitoring for unusual betting patterns, and suspicious activity reporting obligations.',
    },
    'gambling-marketing': {
      title: 'Advertising & Marketing',
      description: 'Track gambling advertising restrictions including watershed rules, influencer marketing regulations, bonus and promotion requirements, responsible gambling messaging, targeting restrictions, and affiliate marketing compliance.',
    },
    'gambling-enforcement': {
      title: 'Enforcement & Blocklists',
      description: 'Monitor regulatory enforcement actions, operator sanctions, license suspensions and revocations, ISP blocking requirements, payment blocking lists, and unlicensed operator blacklists across jurisdictions.',
    },
  };

  return (
    <div id="use-cases" className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance">
            Track the evolution of<br />
            <span className="text-blue-400">AI</span>{", "}<span className="text-blue-400">Payments</span>{" & "}<span className="text-blue-400">Gambling</span> regulation.
          </p>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Stay ahead of regulatory changes with real-time monitoring.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
          {/* AI Column */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 transition-all duration-300 border border-gray-700 shadow-2xl">
            <div className="flex items-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-6 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white">AI</h3>
            </div>
            
            <div className="space-y-3">
              {['ai-legislation', 'ai-compute', 'ai-data', 'ai-standards', 'ai-security'].map((category) => (
                <div key={category} className="border border-gray-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full group bg-gradient-to-r from-gray-700 to-gray-750 px-6 py-4 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border-b border-gray-600 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-base group-hover:text-blue-300 text-left">{categoryDetails[category].title}</span>
                      <svg 
                        className={`h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-400 transition-all ${openCategory === category ? 'rotate-90' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  {openCategory === category && (
                    <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-600">
                      <p className="text-gray-300 text-sm leading-relaxed">{categoryDetails[category].description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="/ai" 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                Learn more
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Payments Column */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 transition-all duration-300 border border-gray-700 shadow-2xl">
            <div className="flex items-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-6 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white">Payments</h3>
            </div>
            
            <div className="space-y-3">
              {['payments-licensing', 'payments-crypto', 'payments-aml', 'payments-resilience', 'payments-consumer'].map((category) => (
                <div key={category} className="border border-gray-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full group bg-gradient-to-r from-gray-700 to-gray-750 px-6 py-4 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border-b border-gray-600 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-base group-hover:text-blue-300 text-left">{categoryDetails[category].title}</span>
                      <svg 
                        className={`h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-400 transition-all ${openCategory === category ? 'rotate-90' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  {openCategory === category && (
                    <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-600">
                      <p className="text-gray-300 text-sm leading-relaxed">{categoryDetails[category].description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="/payments" 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                Learn more
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Gambling Column */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 transition-all duration-300 border border-gray-700 shadow-2xl">
            <div className="flex items-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-6 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white">Gambling</h3>
            </div>
            
            <div className="space-y-3">
              {['gambling-licensing', 'gambling-protection', 'gambling-aml', 'gambling-marketing', 'gambling-enforcement'].map((category) => (
                <div key={category} className="border border-gray-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full group bg-gradient-to-r from-gray-700 to-gray-750 px-6 py-4 hover:from-gray-600 hover:to-gray-650 transition-all duration-200 border-b border-gray-600 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-base group-hover:text-blue-300 text-left">{categoryDetails[category].title}</span>
                      <svg 
                        className={`h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-400 transition-all ${openCategory === category ? 'rotate-90' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  {openCategory === category && (
                    <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-600">
                      <p className="text-gray-300 text-sm leading-relaxed">{categoryDetails[category].description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="/gambling" 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                Learn more
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





