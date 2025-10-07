import Hero from "@/components/Hero";
import Differentiators from "@/components/Differentiators";
import DeploySection from "@/components/DeploySection";
import DatamapScripts from "@/components/DatamapScripts";

export const metadata = {
  title: "Pimlico XHS — Regulatory AI workspaces",
  description: "AI-agentic monitoring, analysis & collaboration for regulated teams.",
}

export default function Page() {
  return (
    <>
      <main className="bg-white text-slate-900">
        <Hero />
        <Differentiators />
        <DeploySection />
        
      <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:ml-auto lg:pt-4 lg:pl-4">
              <div className="lg:max-w-lg">
                <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-white sm:text-4xl lg:text-5xl">Build <span className="text-blue-400">AI-agentic</span> workspaces with XHS™</p>
                <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-400 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <svg className="absolute top-1 left-1 size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personalisation.
                    </dt>
                    <dd className="inline"> Targeted insights on opportunities and risks for your business context</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <svg className="absolute top-1 left-1 size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                      User Experience.
                    </dt>
                    <dd className="inline"> Intuitive, customisable user journeys, intelligent workflows, and adaptive interfaces</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <svg className="absolute top-1 left-1 size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Integrations.
                    </dt>
                    <dd className="inline"> Via enterprise-grade APIs enabling seamless scaling and powerful network effects across teams</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <svg className="absolute top-1 left-1 size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cost Efficiency.
                    </dt>
                    <dd className="inline"> Affordable, AI-native solution delivering measurable time savings and reduced compliance costs</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex items-start justify-end lg:order-first">
              <div className="w-full">
                <div className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10 bg-gray-800 p-4">
                  <div id="hs-users-datamap" className="h-96"></div>

                  {/* Status indicators */}
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                      <span>Active Monitoring: 6 Regions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-3 h-3 rounded bg-gray-600"></div>
                      <span>Coverage: 90+ Jurisdictions</span>
                    </div>
                  </div>
                </div>
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
              <dt className="text-base/7 text-gray-600">Regulatory updates parsed annually</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                <span id="counter-750k">0</span>k+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Global jurisdictions monitored</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                <span id="counter-90">0</span>+
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">Regulatory topics covered</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                <span id="counter-50">0</span>+
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
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl whitespace-nowrap">Get notified when <span className="text-blue-400">XHS™</span> launches.</h2>
                <p className="mt-6 text-base text-gray-400 sm:text-lg/8">Be first to experience XHS™ regulatory AI workspaces.</p>
                <form className="mt-10 flex flex-col sm:flex-row max-w-md gap-3 sm:gap-x-4 mx-auto" action="mailto:contact@pimlicosolutions.com" method="post" encType="text/plain">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full sm:min-w-0 sm:flex-auto rounded-md bg-white/10 px-3.5 py-3 text-base text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 border-0"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto sm:flex-none rounded-md bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    Notify me
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl" id="team">Our Team</h2>
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
              <img src="/Urjit.png" alt="Urjit Bhatia" className="mx-auto size-48 rounded-full outline-1 -outline-offset-1 outline-black/5 md:size-56" />
              <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">Urjit Bhatia</h3>
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
      <DatamapScripts />
    </>
  );
}