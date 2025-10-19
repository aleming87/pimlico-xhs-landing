"use client";

import Image from "next/image";
import { useState } from "react";
import { Footer } from '@/components/footer';

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gray-900">
      {/* Navigation */}
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
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300"
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
            <a href="/pricing" className="text-sm/6 font-semibold text-white">Pricing</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/contact" className="text-sm/6 font-semibold text-blue-400">Book a demo <span aria-hidden="true">&rarr;</span></a>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Pimlico XHS</span>
                  <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-8 w-auto" />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-300"
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
                    <a href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">Home</a>
                    <a href="/#differentiators" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">How it works</a>
                    <a href="/ai" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">AI</a>
                    <a href="/payments" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">Payments</a>
                    <a href="/pricing" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">Pricing</a>
                  </div>
                  <div className="py-6">
                    <a href="/contact" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-blue-400 hover:bg-gray-800">Book a demo</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Contact Form Section */}
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}} className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0B1B3B] to-[#1E3A8A] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">Contact sales</h2>
          <p className="mt-2 text-lg/8 text-gray-400">Get in touch with our team to learn how XHS™ can transform your regulatory compliance workflows.</p>
        </div>
        
        <form action="mailto:contact@pimlicosolutions.com" method="POST" encType="text/plain" className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name" className="block text-sm/6 font-semibold text-white">First name</label>
              <div className="mt-2.5">
                <input id="first-name" type="text" name="first-name" autoComplete="given-name" className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500" />
              </div>
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm/6 font-semibold text-white">Last name</label>
              <div className="mt-2.5">
                <input id="last-name" type="text" name="last-name" autoComplete="family-name" className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="company" className="block text-sm/6 font-semibold text-white">Company</label>
              <div className="mt-2.5">
                <input id="company" type="text" name="company" autoComplete="organization" className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm/6 font-semibold text-white">Email</label>
              <div className="mt-2.5">
                <input id="email" type="email" name="email" autoComplete="email" className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-white">Phone number</label>
              <div className="mt-2.5">
                <div className="flex rounded-md bg-white/5 outline outline-1 -outline-offset-1 outline-white/10 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-blue-500">
                  <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                    <select id="country" name="country" autoComplete="country" aria-label="Country" className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-transparent py-2 pr-7 pl-3.5 text-base text-white placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6">
                      <option value="+1">🇺🇸 US (+1)</option>
                      <option value="+1">🇨🇦 CA (+1)</option>
                      <option value="+44">🇬🇧 UK (+44)</option>
                      <option value="+61">🇦🇺 AU (+61)</option>
                      <option value="+49">🇩🇪 DE (+49)</option>
                      <option value="+33">🇫🇷 FR (+33)</option>
                      <option value="+39">🇮🇹 IT (+39)</option>
                      <option value="+34">🇪🇸 ES (+34)</option>
                      <option value="+31">🇳🇱 NL (+31)</option>
                      <option value="+32">🇧🇪 BE (+32)</option>
                      <option value="+41">🇨🇭 CH (+41)</option>
                      <option value="+43">🇦🇹 AT (+43)</option>
                      <option value="+45">🇩🇰 DK (+45)</option>
                      <option value="+46">🇸🇪 SE (+46)</option>
                      <option value="+47">🇳🇴 NO (+47)</option>
                      <option value="+358">🇫🇮 FI (+358)</option>
                      <option value="+353">🇮🇪 IE (+353)</option>
                      <option value="+351">🇵🇹 PT (+351)</option>
                      <option value="+48">🇵🇱 PL (+48)</option>
                      <option value="+65">🇸🇬 SG (+65)</option>
                      <option value="+852">🇭🇰 HK (+852)</option>
                      <option value="+81">🇯🇵 JP (+81)</option>
                      <option value="+82">🇰🇷 KR (+82)</option>
                      <option value="+86">🇨🇳 CN (+86)</option>
                      <option value="+91">🇮🇳 IN (+91)</option>
                      <option value="+971">🇦🇪 AE (+971)</option>
                      <option value="+966">🇸🇦 SA (+966)</option>
                      <option value="+55">🇧🇷 BR (+55)</option>
                      <option value="+52">🇲🇽 MX (+52)</option>
                      <option value="+54">🇦🇷 AR (+54)</option>
                      <option value="+27">🇿🇦 ZA (+27)</option>
                      <option value="+64">🇳🇿 NZ (+64)</option>
                    </select>
                    <svg viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4">
                      <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                  </div>
                  <input id="phone-number" type="text" name="phone-number" placeholder="123-456-7890" className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm/6 font-semibold text-white">Message</label>
              <div className="mt-2.5">
                <textarea id="message" name="message" rows={4} className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"></textarea>
              </div>
            </div>
            <div className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center">
                <input id="agree-to-policies" type="checkbox" name="agree-to-policies" className="size-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900" />
              </div>
              <label htmlFor="agree-to-policies" className="text-sm/6 text-gray-400">
                By selecting this, you agree to our{' '}
                <a href="/privacy" className="font-semibold whitespace-nowrap text-blue-400 hover:text-blue-300">privacy policy</a>.
              </label>
            </div>
          </div>
          <div className="mt-10">
            <button type="submit" className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Let&apos;s talk</button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
