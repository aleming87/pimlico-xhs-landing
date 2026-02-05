"use client";

import Image from "next/image";
import { useState } from "react";
import { Footer } from '@/components/footer';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CurrencySelector } from '@/components/currency-selector';

function FAQ({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="py-6">
      <dt>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-start justify-between text-left text-white"
        >
          <span className="text-base/7 font-semibold">{question}</span>
          <span className="ml-6 flex h-7 items-center">
            <svg 
              className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </button>
      </dt>
      {isOpen && (
        <dd className="mt-2 pr-12">
          <p className="text-base/7 text-gray-400">{answer}</p>
        </dd>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const { currencyData, isLoading } = useCurrency();

  return (
    <div className="bg-gray-900">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico XHS</span>
              <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm/6 font-semibold text-white">Home</a>
            <a href="/#differentiators" className="text-sm/6 font-semibold text-white">How it works</a>
            <a href="/ai" className="text-sm/6 font-semibold text-white">AI</a>
            <a href="/payments" className="text-sm/6 font-semibold text-white">Payments</a>
            <a href="/gambling" className="text-sm/6 font-semibold text-white">Gambling</a>
            <a href="/insights" className="text-sm/6 font-semibold text-white">Insights</a>
            <a href="/pricing" className="text-sm/6 font-semibold text-indigo-400">Pricing</a>
            <a href="/#team" className="text-sm/6 font-semibold text-white">Team</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/contact" className="inline-flex items-center rounded-md px-5 py-2.5 font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105">
              Book a demo <span aria-hidden="true" className="ml-1">&rarr;</span>
            </a>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50"></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Pimlico XHS</span>
                  <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-8 w-auto" />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-200"
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
                    <a href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Home</a>
                    <a href="/#differentiators" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>How it works</a>
                    <a href="/ai" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>AI</a>
                    <a href="/payments" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Payments</a>
                    <a href="/gambling" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Gambling</a>
                    <a href="/pricing" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-indigo-400 hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                    <a href="/#team" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Team</a>
                  </div>
                  <div className="py-6">
                    <a href="/contact" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Book a demo</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Pricing section */}
        <div className="bg-gray-900 pt-24 sm:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <CurrencySelector />
              </div>
              <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">XHS<span className="text-2xl align-super">™</span> Pricing</p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">Choose the plan that fits your regulatory compliance needs.</p>
            <p className="mx-auto mt-8 max-w-2xl text-center text-base font-medium text-pretty text-gray-400">Annual plans save 8%.</p>
            <div className="mt-4 flex justify-center">
              <fieldset aria-label="Payment frequency">
                <div className="grid grid-cols-2 gap-x-1 rounded-full bg-blue-600/20 p-1 text-center text-xs/5 font-semibold ring-1 ring-inset ring-blue-500/30">
                  <label className={`cursor-pointer rounded-full px-2.5 py-1 transition-colors ${frequency === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}>
                    <input type="radio" name="frequency" value="monthly" checked={frequency === 'monthly'} onChange={(e) => setFrequency(e.target.value)} className="sr-only" />
                    <span>Monthly</span>
                  </label>
                  <label className={`cursor-pointer rounded-full px-2.5 py-1 transition-colors ${frequency === 'annually' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}>
                    <input type="radio" name="frequency" value="annually" checked={frequency === 'annually'} onChange={(e) => setFrequency(e.target.value)} className="sr-only" />
                    <span>Annually</span>
                  </label>
                </div>
              </fieldset>
            </div>
            <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
              {/* Professional Tier */}
              <div className="rounded-3xl bg-gray-800/50 p-8 ring-1 ring-white/15 hover:ring-blue-500 transition-all">
                <h3 className="text-lg/8 font-semibold text-white">Professional</h3>
                <p className="mt-4 text-sm/6 text-gray-300">For consultants, lawyers, and advisors providing regulatory compliance services.</p>
                <p className="mt-8 text-xs text-gray-400">Starting at</p>
                <p className="mt-2 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {isLoading ? '...' : `${currencyData.symbol}${frequency === 'monthly' ? currencyData.professional.monthly : currencyData.professional.annually}`}
                  </span>
                  <span className="text-sm/6 font-semibold text-gray-400">/{frequency === 'monthly' ? 'month' : 'year'}</span>
                </p>
                {frequency === 'annually' && (
                  <p className="mt-2 text-xs text-gray-400">Save 8% annually</p>
                )}
                <a href="/contact" className="mt-6 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm/6 font-semibold text-white hover:bg-blue-500 transition-colors">Book a demo</a>
                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300">
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>1 vertical</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Up to 10 jurisdictions</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Real-time monitoring</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Country reports</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Email support</li>
                </ul>
              </div>

              {/* Team Tier - Most Popular */}
              <div className="rounded-3xl bg-gray-800/50 p-8 ring-2 ring-blue-500 hover:ring-blue-400 transition-all group">
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg/8 font-semibold text-white">Team</h3>
                  <p className="rounded-full bg-blue-600 px-2.5 py-1 text-xs/5 font-semibold text-white">Most popular</p>
                </div>
                <p className="mt-4 text-sm/6 text-gray-300">For teams collaborating on regulatory compliance workflows across jurisdictions.</p>
                <p className="mt-8 text-xs text-gray-400">Starting at</p>
                <p className="mt-2 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {isLoading ? '...' : `${currencyData.symbol}${frequency === 'monthly' ? currencyData.team.monthly : currencyData.team.annually}`}
                  </span>
                  <span className="text-sm/6 font-semibold text-gray-400">/{frequency === 'monthly' ? 'month' : 'year'}</span>
                </p>
                {frequency === 'annually' && (
                  <p className="mt-2 text-xs text-gray-400">Save 8% annually</p>
                )}
                <a href="/contact" className="mt-6 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm/6 font-semibold text-white hover:bg-blue-500 transition-colors">Book a demo</a>
                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300">
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>2 verticals</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Unlimited users beyond allocation at {isLoading ? '...' : `${currencyData.symbol}${currencyData.team.perUser}`}/user/month</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>All jurisdictions</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Real-time monitoring</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Full platform access</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Collaborative workspaces</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>API access & integrations</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Priority support</li>
                </ul>
              </div>

              {/* Enterprise Tier */}
              <div className="rounded-3xl bg-gray-800/50 p-8 ring-1 ring-white/15 hover:ring-blue-500 transition-all">
                <h3 className="text-lg/8 font-semibold text-white">Enterprise</h3>
                <p className="mt-4 text-sm/6 text-gray-300">Tailored solutions with dedicated support for organizations with complex compliance requirements.</p>
                <p className="mt-12 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">Custom</span>
                </p>
                <a href="/contact" className="mt-6 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm/6 font-semibold text-white hover:bg-blue-500 transition-colors">Book a demo</a>
                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300">
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Unlimited verticals</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Unlimited users</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>All jurisdictions</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Custom integrations</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Dedicated account manager</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>SLA & uptime guarantee</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-500"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Priority support & training</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="bg-gray-900 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <h2 className="text-center text-lg/8 font-semibold text-white">Trusted by</h2>
              <div className="mx-auto mt-10 flex items-center justify-center gap-x-8 sm:gap-x-12">
                <img
                  src="/Microsoft_logo_(2012).svg"
                  alt="Microsoft"
                  className="max-h-8 w-auto object-contain brightness-0 invert"
                />
                <img
                  src="/BVNK.svg"
                  alt="BVNK"
                  className="max-h-6 w-auto object-contain brightness-0 invert"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
