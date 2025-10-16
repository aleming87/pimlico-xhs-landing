"use client";

import Image from "next/image";
import { useState } from "react";
import { Footer } from '@/components/footer';
import { AnimatedNumber } from '@/components/animated-number';

export default function AIPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedJurisdiction, setExpandedJurisdiction] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'AI Legislation & Governance',
      description: 'Track national and international AI laws, regulatory frameworks, and governance policies shaping how AI systems can be developed and deployed.'
    },
    {
      id: 2,
      name: 'Compute & Infrastructure',
      description: 'Monitor requirements for AI computing resources, hardware restrictions, and infrastructure standards including chip export controls and data center regulations.'
    },
    {
      id: 3,
      name: 'Data Protection',
      description: 'Navigate privacy regulations governing AI training data, model outputs, and personal data processing requirements across jurisdictions.'
    },
    {
      id: 4,
      name: 'Technical Standards',
      description: 'Stay current on AI safety requirements, testing protocols, transparency standards, and technical compliance specifications.'
    },
    {
      id: 5,
      name: 'National Security & Export Controls',
      description: 'Track restrictions on AI technology transfers, export controls, and national security requirements affecting AI development and deployment.'
    },
    {
      id: 6,
      name: 'Consumer Protection & Conduct',
      description: 'Monitor consumer rights, disclosure requirements, fairness standards, and conduct rules for AI-powered products and services.'
    }
  ];

  const jurisdictions = [
    {
      id: 1,
      name: 'United States',
      regulations: ['NIST AI Risk Management Framework', 'Executive Order 14110 on Safe AI', 'OMB AI Governance Memorandum', 'California AI Transparency Act (SB 942)', 'Colorado AI Act (SB 24-205)', 'New York AI Bias Audit Law']
    },
    {
      id: 2,
      name: 'European Union',
      regulations: ['EU AI Act', 'GDPR (AI-related provisions)', 'Digital Services Act']
    },
    {
      id: 3,
      name: 'United Kingdom',
      regulations: ['AI White Paper', 'ICO AI Guidance', 'Online Safety Act (AI provisions)']
    },
    {
      id: 4,
      name: 'Singapore',
      regulations: ['Model AI Governance Framework', 'AI Verify Foundation', 'PDPA AI Guidelines']
    },
    {
      id: 5,
      name: 'China',
      regulations: ['Deep Synthesis Regulations', 'Algorithm Recommendation Regulations', 'Generative AI Measures']
    },
    {
      id: 6,
      name: 'Brazil',
      regulations: ['LGPD AI provisions', 'AI Bill (PL 2338/2023)', 'National AI Strategy']
    },
    {
      id: 8,
      name: 'United Arab Emirates',
      regulations: ['UAE AI Guidelines', 'Dubai AI Principles', 'National AI Strategy 2031']
    },
    {
      id: 9,
      name: 'India',
      regulations: ['Digital India AIRAWAT', 'DPDP Act AI provisions', 'National AI Portal frameworks']
    }
  ];

  return (
    <div className="bg-white">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico XHS</span>
              <Image src="/Pimlico_Logo.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm/6 font-semibold text-gray-900">Home</a>
            <a href="/#differentiators" className="text-sm/6 font-semibold text-gray-900">How it works</a>
            <a href="/ai" className="text-sm/6 font-semibold text-blue-600">AI</a>
            <a href="/payments" className="text-sm/6 font-semibold text-gray-900">Payments</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/#contact" className="text-sm/6 font-semibold text-gray-900">Book a demo <span aria-hidden="true">&rarr;</span></a>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Pimlico XHS</span>
                  <Image src="/Pimlico_Logo.png" alt="Pimlico" width={100} height={27} className="h-8 w-auto" />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Home</a>
                    <a href="/#differentiators" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">How it works</a>
                    <a href="/ai" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-blue-600 hover:bg-gray-50">AI</a>
                    <a href="/payments" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Payments</a>
                  </div>
                  <div className="py-6">
                    <a href="/#contact" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Book a demo</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="py-32 sm:py-48 lg:py-56">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Manage <span className="text-blue-600">AI</span> Regulations with XHS™
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Stay ahead of regulations. Deploy with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stay Ahead Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Stay ahead of emerging <span className="text-blue-600">risks</span> and <span className="text-blue-600">opportunities</span>
            </h2>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">AI regulations tracked</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                <AnimatedNumber start={0} end={500} />+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Jurisdictions monitored</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                <AnimatedNumber start={0} end={75} />+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">AI subcategories covered</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                <AnimatedNumber start={0} end={6} />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* AI Categories Section */}
      <div id="features" className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* AI Category Box */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 border border-gray-700 shadow-2xl">
              <div className="flex items-center mb-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-6 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">AI Regulation Trends</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="bg-gradient-to-r from-gray-700 to-gray-750 rounded-2xl border border-gray-600 overflow-hidden transition-all duration-200">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:from-gray-600 hover:to-gray-650 transition-all duration-200"
                    >
                      <span className="text-white font-semibold text-base text-left">{category.name}</span>
                      <svg 
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-90' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {expandedCategory === category.id && (
                      <div className="px-6 pb-5 pt-0">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Regulations Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Global AI Regulatory Coverage
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Track AI regulations across major jurisdictions worldwide
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {jurisdictions.map((jurisdiction) => (
              <div key={jurisdiction.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedJurisdiction(expandedJurisdiction === jurisdiction.id ? null : jurisdiction.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{jurisdiction.name}</h3>
                  </div>
                  <svg 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedJurisdiction === jurisdiction.id ? 'rotate-90' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {expandedJurisdiction === jurisdiction.id && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Key Legislation:</p>
                      <ul className="space-y-2">
                        {jurisdiction.regulations.map((regulation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <svg className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-700">{regulation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid - Product Breakdown */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-base/7 font-semibold text-indigo-400">Everything you need</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            End-to-end AI-native regulatory workflows
          </p>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            {/* Monitor - Large left column */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-gray-800 lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">Monitor</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                    Real-time regulatory updates across all jurisdictions in a unified feed
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute inset-x-8 top-10 bottom-8 overflow-hidden rounded-lg bg-gray-900 shadow-2xl ring-1 ring-white/10">
                    <Image
                      src="/AIProductII.png"
                      alt="AI Regulatory Monitoring Dashboard"
                      width={1200}
                      height={800}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
            </div>

            {/* Analyse - Top right */}
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-t-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-4 sm:px-10 sm:pt-10 sm:pb-6">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">Analyse</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                    AI-powered insights identify regulatory impacts and obligations
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 pb-8 sm:px-10 lg:pb-10">
                  <div className="w-full max-lg:max-w-xs bg-gray-700/30 rounded-lg p-6 border border-gray-600/50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Impact Score</span>
                        <span className="text-sm font-semibold text-red-400">High</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 bg-red-500 rounded flex-1"></div>
                          <span className="text-xs text-gray-400">85%</span>
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
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
            </div>

            {/* Collaborate - Middle right */}
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-gray-800"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">Collaborate</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                    Team workspaces for shared regulatory intelligence
                  </p>
                </div>
                <div className="flex flex-1 flex-col justify-center px-8 max-lg:py-6 lg:pb-2">
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
                    <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                      <div className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white">JD</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white">Jane added a note</div>
                          <div className="text-xs text-gray-400 mt-0.5">EU AI Act - High risk classification needs review</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                      <div className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white">SK</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white">Sam assigned a task</div>
                          <div className="text-xs text-gray-400 mt-0.5">Review NIST guidelines compliance</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5"></div>
            </div>

            {/* Integrate - Large right column */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">Integrate</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                    Connect with your existing workflow tools and systems
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl ring-1 ring-white/10">
                    <div className="flex bg-gray-800 ring-1 ring-white/5 border-b border-gray-700">
                      <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                        <div className="border-r border-b border-r-white/20 border-b-transparent bg-gray-900 px-4 py-2 text-white flex items-center gap-2">
                          <span>integrations.js</span>
                        </div>
                        <div className="border-r border-gray-600/10 px-4 py-2">webhooks.js</div>
                        <div className="border-r border-gray-600/10 px-4 py-2">README.md</div>
                      </div>
                    </div>
                    <div className="px-6 pt-4 pb-6 overflow-auto h-full">
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
                          <div className="flex items-center gap-2 mt-2 mb-2">
                            <Image
                              src="/logo-timeline/slack.svg"
                              alt="Slack"
                              width={16}
                              height={16}
                              className="opacity-80"
                            />
                            <span className="text-gray-400 text-xs">Push alerts to Slack channels</span>
                          </div>
                          <div className="text-purple-400">await</div>
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
                            <span className="text-green-400">'regulation.updated'</span>
                            <span className="text-gray-300">{`]`}</span>
                          </div>
                          <div className="text-gray-300">{`})`}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get notified when <span className="text-blue-400">XHS™</span> launches
            </h2>
            <p className="mt-6 text-lg text-gray-300">
              Be first to experience AI regulatory intelligence workspaces
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/#contact" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Request early access
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
