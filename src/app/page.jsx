import Hero from "@/components/Hero";
import Differentiators from "@/components/Differentiators";
import DeploySection from "@/components/DeploySection";
import DatamapScripts from "@/components/DatamapScripts";
import MapSection from "@/components/MapSection";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata = {
  title: "Pimlico XHS™ - Regulatory AI workspaces",
  description: "AI-agentic monitoring, analysis & collaboration for regulated teams.",
}

export default function Page() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pimlico XHS",
    "url": "https://pimlicosolutions.com",
    "logo": "https://pimlicosolutions.com/XHS Logo BLUE on WHITE.png",
    "description": "AI-native regulatory intelligence platform for compliance teams",
    "sameAs": [
      "https://www.linkedin.com/company/pimlico-solutions",
      "https://twitter.com/pimlicoxhs"
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pimlico XHS",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "250",
      "highPrice": "750",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "250",
        "priceCurrency": "USD",
        "billingDuration": "P1M"
      }
    },
    "description": "AI-native regulatory intelligence platform for compliance teams. Monitor, analyse, and collaborate on AI and Payments regulations across 90+ jurisdictions.",
    "operatingSystem": "Web",
    "featureList": "Regulatory monitoring, AI compliance, Payments compliance, Real-time updates, Team collaboration"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <main className="bg-white text-slate-900">
        <Hero />
        
        {/* Trusted by section */}
        <div className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <h2 className="text-center text-lg/8 font-semibold text-gray-900">Trusted by</h2>
              <div className="mx-auto mt-10 flex items-center justify-center gap-x-8 sm:gap-x-12">
                <img
                  src="/Microsoft_logo_(2012).svg"
                  alt="Microsoft"
                  className="max-h-8 w-auto object-contain"
                />
                <img
                  src="/BVNK.svg"
                  alt="BVNK"
                  className="max-h-6 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <Differentiators />
        <DeploySection />
        
      <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:ml-auto lg:pt-4 lg:pl-4">
              <div className="lg:max-w-lg">
                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl md:text-6xl lg:text-7xl">XHS<sup className="text-3xl">™</sup> delivers <span className="text-blue-400">compliance success</span></p>
                <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-400 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <svg className="absolute top-1 left-1 size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Intelligent Insights.
                    </dt>
                    <dd className="inline"> AI-powered analysis delivers personalized regulatory intelligence for your business context</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <svg className="absolute top-1 left-1 size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                      Adaptive Experience.
                    </dt>
                    <dd className="inline"> Workspaces that learn and adapt to your team's unique compliance workflows</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <svg className="absolute top-1 left-1 size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Enterprise Security.
                    </dt>
                    <dd className="inline"> Bank-grade encryption and compliance with SOC 2, ISO 27001, and GDPR standards</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <svg className="absolute top-1 left-1 size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      API Integration.
                    </dt>
                    <dd className="inline"> Enterprise-grade APIs that scale effortlessly across your organization</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex items-start justify-end lg:order-first">
              <div className="w-full">
                <MapSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Regulatory updates parsed</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                <span id="counter-875k">0</span>k+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Global jurisdictions covered</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                <span id="counter-180">0</span>+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Topics covered</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                <span id="counter-90">0</span>+
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Launch Notification Signup */}
      <div id="contact" className="overflow-hidden bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-1">
            <div className="lg:pt-4">
              <div className="w-full mx-auto text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">Sign up for a <span className="text-blue-400">7 day trial</span> today</h2>
                <p className="mt-6 text-base text-gray-400 sm:text-lg/8">Transform how your team manages compliance with AI-powered workspaces built for regulated industries.</p>
                <div className="mt-10 flex items-center justify-center">
                  <a
                    href="/contact"
                    className="rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:shadow-xl"
                  >
                    Get started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl lg:text-5xl" id="team">Our Team</h2>
          </div>
          <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            <li className="rounded-2xl bg-gray-100 px-8 py-10">
              <img src="/Andrew.png" alt="Andrew Leming" className="mx-auto size-48 rounded-full outline-1 -outline-offset-1 outline-black/5 md:size-56" />
              <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">Andrew Leming</h3>
              <p className="text-sm/6 text-gray-600">CEO + Cofounder</p>
              <div className="mt-4 flex justify-center">
                <a href="https://www.linkedin.com/in/andrewleming/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </li>
            <li className="rounded-2xl bg-gray-100 px-8 py-10">
              <img src="/Urjit.png" alt="Urjit Singh Bhatia" className="mx-auto size-48 rounded-full outline-1 -outline-offset-1 outline-black/5 md:size-56" />
              <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">Urjit Singh Bhatia</h3>
              <p className="text-sm/6 text-gray-600">CTO + Cofounder</p>
              <div className="mt-4 flex justify-center">
                <a href="https://www.linkedin.com/in/urjitsinghbhatia/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </li>
            <li className="rounded-2xl bg-gray-100 px-8 py-10">
              <img src="/Ashley.png" alt="Ashley Burghardt" className="mx-auto size-48 rounded-full outline-1 -outline-offset-1 outline-black/5 md:size-56" />
              <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">Ashley Burghardt</h3>
              <p className="text-sm/6 text-gray-600">COPO</p>
              <div className="mt-4 flex justify-center">
                <a href="https://www.linkedin.com/in/ashley-burghardt-b7051a21/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

  {/* Footer */}
        <footer className="bg-white">
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <img src="/Pimlico_Logo.png" alt="Pimlico" className="h-8" />
                  <img src="/XHS Logo BLUE on WHITE.png" alt="XHS" className="h-8" />
                </div>
              </div>
              <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-1 xl:mt-0">
                <div>
                  <h3 className="text-sm/6 font-semibold text-gray-900">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="https://www.linkedin.com/company/wearepimlico/" target="_blank" rel="noopener noreferrer" className="text-sm/6 text-gray-600 hover:text-gray-900">About</a>
                    </li>
                    <li>
                      <a href="mailto:contact@pimlicosolutions.com" className="text-sm/6 text-gray-600 hover:text-gray-900">Contact</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm/6 font-semibold text-gray-900">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="/privacy" className="text-sm/6 text-gray-600 hover:text-gray-900">Privacy</a>
                    </li>
                    <li>
                      <a href="/terms" className="text-sm/6 text-gray-600 hover:text-gray-900">Terms</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-16 xl:mt-0 flex justify-center xl:justify-end">
                <div className="flex gap-x-6">
                  <a href="https://wa.me/447961642867" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                    <span className="sr-only">WhatsApp</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                  <a href="https://x.com/PimlicoXHS" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                    <span className="sr-only">X</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/wearepimlico/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
              <p className="text-sm/6 text-gray-600">&copy; 2025 Pimlico Solutions Ltd. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
      <CookieConsent />
      <DatamapScripts />
    </>
  );
}