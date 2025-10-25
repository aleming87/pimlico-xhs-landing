"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function ConfirmationPage() {
  useEffect(() => {
    // Mark call as booked in localStorage
    localStorage.setItem('callBooked', 'true');
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico XHS</span>
              <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
            </a>
          </div>
        </nav>
      </header>

      {/* Confirmation Content */}
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl pt-20">
          
          {/* Success Icon */}
          <div className="text-center mb-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 mb-6">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
              Your demo is scheduled!
            </h1>
            
            <p className="text-lg text-gray-300 mb-8">
              We're looking forward to showing you how XHS™ can transform your regulatory workflow
            </p>
          </div>

          {/* Personal Thank You Messages */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              A message from our team
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Andrew */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      A
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Andrew Leming</h3>
                    <p className="text-sm text-gray-400">Co-Founder & CEO</p>
                    <a 
                      href="https://www.linkedin.com/in/andrewleming" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mt-1"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Connect
                    </a>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "Thank you for booking a demo! I'm excited to show you how XHS™ can help you stay ahead of regulatory changes and streamline your compliance workflows. See you soon!"
                </p>
              </div>

              {/* Orjit */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      O
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Orjit Sengupta</h3>
                    <p className="text-sm text-gray-400">Co-Founder & CTO</p>
                    <a 
                      href="https://www.linkedin.com/in/orjitsengupta" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mt-1"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Connect
                    </a>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "Looking forward to our demo! I'll walk you through our AI-powered regulatory monitoring and show you how we're helping teams like yours automate compliance. Talk soon!"
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Follow on Social Media */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
            <div className="flex items-start gap-6">
              {/* Step Number */}
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Follow us on social media
                </h2>
                <p className="text-gray-300 mb-6">
                  Stay updated with the latest regulatory insights and product updates
                </p>
                
                <div className="space-y-4">
                  {/* Company LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/pimlico-solutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-[#0A66C2] px-5 py-3 text-white hover:bg-[#004182] transition-all w-full sm:w-auto"
                  >
                    <svg className="h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <div className="text-left">
                      <div className="font-semibold">Pimlico Solutions on LinkedIn</div>
                      <div className="text-sm text-blue-100">Follow our company page</div>
                    </div>
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href="https://twitter.com/pimlicosolutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 transition-all w-full sm:w-auto"
                  >
                    <svg className="h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <div className="text-left">
                      <div className="font-semibold">Follow us on X</div>
                      <div className="text-sm text-gray-300">Get real-time updates</div>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/447961642867"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-[#25D366] px-5 py-3 text-white hover:bg-[#1DA851] transition-all w-full sm:w-auto"
                  >
                    <svg className="h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="font-semibold">Message us on WhatsApp</div>
                      <div className="text-sm text-green-100">Quick questions? We're here</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-500/20 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              What to expect before our call
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">✓</span>
                <span>You'll receive a calendar invitation with a meeting link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">✓</span>
                <span>We'll review your survey responses to personalize the demo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">✓</span>
                <span>Bring any specific compliance questions or challenges you'd like to discuss</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">✓</span>
                <span>We'll show you live examples relevant to your jurisdictions and sectors</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <a href="/" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
              ← Back to homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
