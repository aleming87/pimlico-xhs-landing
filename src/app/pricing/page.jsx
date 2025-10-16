"use client";

import Image from "next/image";
import { useState } from "react";
import { Footer } from '@/components/footer';

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [frequency, setFrequency] = useState('monthly');

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
            <a href="/#differentiators" className="text-sm/6 font-semibold text-white">How it works</a>
            <a href="/ai" className="text-sm/6 font-semibold text-white">AI</a>
            <a href="/payments" className="text-sm/6 font-semibold text-white">Payments</a>
            <a href="/#use-cases" className="text-sm/6 font-semibold text-white">Use cases</a>
            <a href="/#team" className="text-sm/6 font-semibold text-white">Team</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/#contact" className="text-sm/6 font-semibold text-white">Book a demo <span aria-hidden="true">&rarr;</span></a>
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
                    <a href="/#differentiators" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>How it works</a>
                    <a href="/ai" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>AI</a>
                    <a href="/payments" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Payments</a>
                    <a href="/#use-cases" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Use cases</a>
                    <a href="/#team" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Team</a>
                  </div>
                  <div className="py-6">
                    <a href="/#contact" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Book a demo</a>
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
              <h2 className="text-base/7 font-semibold text-indigo-400">Pricing</h2>
              <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">Pricing that grows with you</p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">Choose an affordable plan that's packed with the best features for regulatory compliance, creating team efficiency, and driving business outcomes.</p>
            <div className="mt-16 flex justify-center">
              <fieldset aria-label="Payment frequency">
                <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs/5 font-semibold ring-1 ring-inset ring-white/10">
                  <label className={`cursor-pointer rounded-full px-2.5 py-1 ${frequency === 'monthly' ? 'bg-indigo-500' : ''}`}>
                    <input type="radio" name="frequency" value="monthly" checked={frequency === 'monthly'} onChange={(e) => setFrequency(e.target.value)} className="sr-only" />
                    <span className={frequency === 'monthly' ? 'text-white' : 'text-gray-400'}>Monthly</span>
                  </label>
                  <label className={`cursor-pointer rounded-full px-2.5 py-1 ${frequency === 'annually' ? 'bg-indigo-500' : ''}`}>
                    <input type="radio" name="frequency" value="annually" checked={frequency === 'annually'} onChange={(e) => setFrequency(e.target.value)} className="sr-only" />
                    <span className={frequency === 'annually' ? 'text-white' : 'text-gray-400'}>Annually</span>
                  </label>
                </div>
              </fieldset>
            </div>
            <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
              {/* Starter Tier */}
              <div className="rounded-3xl bg-gray-800/50 p-8 ring-1 ring-white/15">
                <h3 className="text-lg/8 font-semibold text-white">Starter</h3>
                <p className="mt-4 text-sm/6 text-gray-300">Perfect for small teams getting started with regulatory compliance.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">${frequency === 'monthly' ? '499' : '4,990'}</span>
                  <span className="text-sm/6 font-semibold text-gray-400">/{frequency === 'monthly' ? 'month' : 'year'}</span>
                </p>
                <a href="/#contact" className="mt-6 block w-full rounded-md bg-white/10 px-3 py-2 text-center text-sm/6 font-semibold text-white ring-1 ring-inset ring-white/5 hover:bg-white/20">Get started</a>
                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300">
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Up to 5 users</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>2 regulatory domains</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Basic analytics</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Email support</li>
                </ul>
              </div>

              {/* Professional Tier */}
              <div className="rounded-3xl bg-gray-800/50 p-8 ring-1 ring-white/15">
                <h3 className="text-lg/8 font-semibold text-white">Professional</h3>
                <p className="mt-4 text-sm/6 text-gray-300">For growing teams managing multiple regulatory requirements.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">${frequency === 'monthly' ? '999' : '9,990'}</span>
                  <span className="text-sm/6 font-semibold text-gray-400">/{frequency === 'monthly' ? 'month' : 'year'}</span>
                </p>
                <a href="/#contact" className="mt-6 block w-full rounded-md bg-white/10 px-3 py-2 text-center text-sm/6 font-semibold text-white ring-1 ring-inset ring-white/5 hover:bg-white/20">Get started</a>
                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300">
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Up to 15 users</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>All regulatory domains</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Advanced analytics</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>API access</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Priority support</li>
                </ul>
              </div>

              {/* Enterprise Tier - Featured */}
              <div className="rounded-3xl bg-gray-800/50 p-8 ring-2 ring-indigo-400">
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg/8 font-semibold text-indigo-400">Enterprise</h3>
                  <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs/5 font-semibold text-white">Most popular</p>
                </div>
                <p className="mt-4 text-sm/6 text-gray-300">Comprehensive solution for large organizations with complex needs.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">${frequency === 'monthly' ? '2,499' : '24,990'}</span>
                  <span className="text-sm/6 font-semibold text-gray-400">/{frequency === 'monthly' ? 'month' : 'year'}</span>
                </p>
                <a href="/#contact" className="mt-6 block w-full rounded-md bg-indigo-500 px-3 py-2 text-center text-sm/6 font-semibold text-white hover:bg-indigo-400">Get started</a>
                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300">
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Unlimited users</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>All regulatory domains</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Custom analytics & reporting</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Full API access & webhooks</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Dedicated support & CSM</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>SLA & uptime guarantee</li>
                </ul>
              </div>

              {/* Custom Tier */}
              <div className="rounded-3xl bg-gray-800/50 p-8 ring-1 ring-white/15">
                <h3 className="text-lg/8 font-semibold text-white">Custom</h3>
                <p className="mt-4 text-sm/6 text-gray-300">Tailored solutions for unique regulatory and compliance challenges.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">Contact us</span>
                </p>
                <a href="/#contact" className="mt-6 block w-full rounded-md bg-white/10 px-3 py-2 text-center text-sm/6 font-semibold text-white ring-1 ring-inset ring-white/5 hover:bg-white/20">Contact sales</a>
                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300">
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Everything in Enterprise</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Custom integrations</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>On-premise deployment</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Custom training & onboarding</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>White-label options</li>
                  <li className="flex gap-x-3"><svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-indigo-400"><path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" /></svg>Flexible contract terms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mx-auto mt-24 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Frequently asked questions</h2>
            <dl className="mt-16 divide-y divide-white/10">
              <div className="py-6">
                <dt className="text-base/7 font-semibold text-white">What's included in all plans?</dt>
                <dd className="mt-2 pr-12"><p className="text-base/7 text-gray-400">All plans include access to our AI-powered regulatory monitoring platform, real-time updates, collaborative workspaces, and basic analytics. Higher-tier plans add more users, domains, and advanced features.</p></dd>
              </div>
              <div className="py-6">
                <dt className="text-base/7 font-semibold text-white">Can I switch plans later?</dt>
                <dd className="mt-2 pr-12"><p className="text-base/7 text-gray-400">Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle, and we'll prorate any differences.</p></dd>
              </div>
              <div className="py-6">
                <dt className="text-base/7 font-semibold text-white">Do you offer a free trial?</dt>
                <dd className="mt-2 pr-12"><p className="text-base/7 text-gray-400">We offer a 14-day free trial for all new customers on any plan. No credit card required to start your trial.</p></dd>
              </div>
              <div className="py-6">
                <dt className="text-base/7 font-semibold text-white">What payment methods do you accept?</dt>
                <dd className="mt-2 pr-12"><p className="text-base/7 text-gray-400">We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and can accommodate invoicing for Enterprise and Custom plans.</p></dd>
              </div>
              <div className="py-6">
                <dt className="text-base/7 font-semibold text-white">Is there a setup fee?</dt>
                <dd className="mt-2 pr-12"><p className="text-base/7 text-gray-400">No setup fees for Starter, Professional, and Enterprise plans. Custom plans may include implementation services priced separately based on your specific requirements.</p></dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
