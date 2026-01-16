"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Footer } from '@/components/footer';
import { AnimatedNumber } from '@/components/animated-number';
import { AnimatedImpactScore, AnimatedCollaborate, AnimatedCodeIntegration } from '@/components/BentoAnimations';

export default function GamblingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedJurisdiction, setExpandedJurisdiction] = useState(null);

  // Handle hash navigation to expand category
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#category-')) {
      const categoryId = parseInt(hash.replace('#category-', ''));
      setExpandedCategory(categoryId);
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, []);

  const categories = [
    {
      id: 1,
      name: 'Licensing & Operator Regulation',
      description: 'Track licensing requirements, operator obligations, and regulatory frameworks governing gambling providers across jurisdictions.'
    },
    {
      id: 2,
      name: 'Player Protection & Responsible Gaming',
      description: 'Monitor responsible gambling requirements, self-exclusion schemes, deposit limits, and consumer protection measures.'
    },
    {
      id: 3,
      name: 'Anti-Money Laundering (AML)',
      description: 'Stay current on AML/CFT obligations, customer due diligence, suspicious transaction reporting, and financial crime prevention for gambling operators.'
    },
    {
      id: 4,
      name: 'Advertising & Marketing',
      description: 'Navigate advertising restrictions, marketing standards, affiliate regulations, and promotional content requirements across markets.'
    },
    {
      id: 5,
      name: 'Online & Digital Gaming',
      description: 'Track online casino, sports betting, and digital gaming regulations including geolocation, age verification, and technical standards.'
    },
    {
      id: 6,
      name: 'Tax & Financial Compliance',
      description: 'Monitor gaming taxes, duties, financial reporting requirements, and revenue-sharing arrangements across jurisdictions.'
    },
    {
      id: 7,
      name: 'Sports Integrity & Betting',
      description: 'Track sports betting regulations, integrity monitoring, match-fixing prevention, and sports betting data requirements.'
    },
    {
      id: 8,
      name: 'Technology & Innovation',
      description: 'Stay ahead of regulations governing new technologies including crypto gambling, blockchain gaming, and emerging gambling formats.'
    }
  ];

  const jurisdictions = [
    {
      id: 1,
      name: 'United Kingdom',
      regulations: ['Gambling Act 2005', 'UKGC Licence Conditions and Codes of Practice', 'Remote Gambling Regulations', 'Advertising Standards', 'Social Responsibility Code']
    },
    {
      id: 2,
      name: 'Malta',
      regulations: ['Gaming Act', 'MGA Directives', 'Player Protection Directive', 'Gaming Tax Regulations', 'Remote Gaming Regulations']
    },
    {
      id: 3,
      name: 'Gibraltar',
      regulations: ['Gambling Act 2005', 'Gibraltar Regulatory Authority Requirements', 'Remote Gambling Regulations', 'Advertising Code']
    },
    {
      id: 4,
      name: 'United States',
      regulations: ['Wire Act', 'UIGEA', 'State-level regulations (NJ, PA, MI, etc.)', 'PASPA (repealed)', 'Indian Gaming Regulatory Act']
    },
    {
      id: 5,
      name: 'European Union',
      regulations: ['EU AML Directives (4th, 5th, 6th)', 'Consumer Rights Directive', 'Cross-border Gambling Services', 'Payment Services Directives']
    },
    {
      id: 6,
      name: 'Australia',
      regulations: ['Interactive Gambling Act 2001', 'National Consumer Protection Framework', 'State-based Gambling Acts', 'Advertising Standards']
    },
    {
      id: 7,
      name: 'Sweden',
      regulations: ['Swedish Gambling Act', 'Spelinspektionen Regulations', 'Bonus Restrictions', 'Marketing Requirements']
    },
    {
      id: 8,
      name: 'Netherlands',
      regulations: ['Remote Gambling Act (KOA)', 'Dutch Gaming Authority Requirements', 'CRUKS Self-Exclusion', 'Advertising Ban']
    },
    {
      id: 9,
      name: 'Spain',
      regulations: ['Gambling Act 13/2011', 'DGOJ Regulations', 'Advertising Restrictions', 'Player Protection Measures']
    },
    {
      id: 10,
      name: 'Denmark',
      regulations: ['Danish Gambling Act', 'ROFUS Self-Exclusion Register', 'Marketing Restrictions', 'License Requirements']
    },
    {
      id: 11,
      name: 'Italy',
      regulations: ['Gaming Law', 'ADM (Agenzia delle Dogane e dei Monopoli) Regulations', 'Dignity Decree Advertising Restrictions', 'Concessions and Licenses']
    },
    {
      id: 12,
      name: 'Ontario (Canada)',
      regulations: ['iGaming Ontario Framework', 'Gaming Control Act', 'Standards for Internet Gaming', 'Responsible Gaming Requirements']
    }
  ];

  return (
    <div className="bg-white">
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
            <a href="/ai" className="text-sm/6 font-semibold text-gray-900">AI</a>
            <a href="/payments" className="text-sm/6 font-semibold text-gray-900">Payments</a>
            <a href="/gambling" className="text-sm/6 font-semibold text-emerald-600">Gambling</a>
            <a href="/pricing" className="text-sm/6 font-semibold text-gray-900">Pricing</a>
            <a href="/#team" className="text-sm/6 font-semibold text-gray-900">Team</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/contact" className="inline-flex items-center rounded-md px-5 py-2.5 font-semibold text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 hover:scale-105">
              Book a demo <span aria-hidden="true" className="ml-1">&rarr;</span>
            </a>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50"></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Pimlico XHS</span>
                  <Image src="/Pimlico_Logo.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
                </a>
                <button 
                  type="button" 
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                    <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Home</a>
                    <a href="/#differentiators" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>How it works</a>
                    <a href="/ai" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>AI</a>
                    <a href="/payments" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Payments</a>
                    <a href="/gambling" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-blue-600 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Gambling</a>
                    <a href="/pricing" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                    <a href="/#team" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Team</a>
                  </div>
                  <div className="py-6">
                    <a href="/contact" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Book a demo</a>
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
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-400 to-emerald-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="py-32 sm:py-48 lg:py-56">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Navigate <span className="text-emerald-600">Gambling</span> Regulations with XHS<sup className="text-2xl">™</sup>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Stay compliant across markets. Operate with confidence.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="/contact" className="rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 text-center transition-all hover:shadow-xl">Explore</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Navigate complex <span className="text-emerald-600">compliance</span> across <span className="text-emerald-600">global markets</span>
            </h2>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Gambling regulations tracked</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                <AnimatedNumber start={0} end={400} />+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Markets monitored</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                <AnimatedNumber start={0} end={60} />+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Regulatory categories covered</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                <AnimatedNumber start={0} end={8} />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Categories Section */}
      <div id="features" className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 border border-gray-700 shadow-2xl">
              <div className="flex items-center mb-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mr-6 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">Gambling Regulation Categories</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    id={`category-${category.id}`}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-emerald-500 transition-all duration-300 cursor-pointer"
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-semibold text-white mb-2">{category.name}</h4>
                      <svg 
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {expandedCategory === category.id && (
                      <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jurisdictions Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive <span className="text-emerald-600">jurisdictional coverage</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Monitor gambling regulations across major and emerging markets worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jurisdictions.map((jurisdiction) => (
              <div
                key={jurisdiction.id}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setExpandedJurisdiction(expandedJurisdiction === jurisdiction.id ? null : jurisdiction.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{jurisdiction.name}</h3>
                  <svg 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${expandedJurisdiction === jurisdiction.id ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedJurisdiction === jurisdiction.id && (
                  <ul className="mt-3 space-y-2">
                    {jurisdiction.regulations.map((regulation, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span>{regulation}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid - Product Breakdown */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-base/7 font-semibold text-emerald-400">Everything you need</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            End-to-end gambling compliance workflows
          </p>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            {/* Monitor - Large left column */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-gray-800 lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">Monitor</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                    Real-time gambling regulatory updates across all jurisdictions in a unified feed
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute inset-x-8 top-10 bottom-8 overflow-hidden rounded-lg bg-gray-900 shadow-2xl ring-1 ring-white/10">
                    <img
                      src="/AI4.png"
                      alt="Gambling Regulatory Monitoring Dashboard"
                      className="w-full h-auto min-h-full object-cover object-left-top rounded-lg"
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
                    AI-powered insights identify regulatory impacts and compliance obligations
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 pb-8 sm:px-10 lg:pb-10">
                  <AnimatedImpactScore />
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
                    Team workspaces for shared gambling compliance intelligence
                  </p>
                </div>
                <div className="flex flex-1 flex-col justify-center px-8 max-lg:py-6 lg:pb-2">
                  <AnimatedCollaborate />
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
                    Connect with your existing compliance workflow tools and systems
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <AnimatedCodeIntegration />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for gambling <span className="text-emerald-600">compliance teams</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">License Compliance</h3>
              <p className="text-gray-600">
                Track license requirements, renewal deadlines, and regulatory obligations across all markets you operate in.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Player Protection</h3>
              <p className="text-gray-600">
                Stay ahead of responsible gambling requirements, self-exclusion mandates, and player protection regulations.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Compliance</h3>
              <p className="text-gray-600">
                Navigate advertising restrictions, affiliate regulations, and promotional content requirements across markets.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AML/CFT</h3>
              <p className="text-gray-600">
                Monitor evolving anti-money laundering requirements, customer due diligence standards, and financial crime prevention.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Standards</h3>
              <p className="text-gray-600">
                Track technical compliance requirements, testing protocols, and certification standards for online gaming platforms.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax & Reporting</h3>
              <p className="text-gray-600">
                Stay current on gaming tax obligations, duty structures, and financial reporting requirements across jurisdictions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to streamline your gambling compliance?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join leading gambling operators using XHS™ to stay ahead of regulatory changes across global markets.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/contact" className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                Book a demo
              </a>
              <a href="/pricing" className="text-sm font-semibold leading-6 text-white">
                View pricing <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
