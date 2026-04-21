"use client";

import Image from "next/image";

const PRODUCTS = [
  { label: 'Projects\u2122',    desc: 'Organise regulatory items into workstreams and track progress against compliance objectives.' },
  { label: 'Blocklists\u2122',  desc: 'Monitor blocked URLs and enforcement actions across jurisdictions in real time.' },
  { label: 'Competitors\u2122', desc: 'Track competitor licences, enforcements, deals and products across jurisdictions.' },
  { label: 'Lens\u2122',        desc: 'Drill down into the technical standards and regulatory trends impacting your business.' },
  { label: 'Technical\u2122',   desc: 'Access and compare technical standards, testing requirements and certification frameworks.' },
  { label: 'Partners\u2122',    desc: 'Connect with vetted legal, compliance and advisory partners across your key jurisdictions.' },
];

const TIMELINE = [
  {
    week: 'Week 1',
    title: 'Setup & Access',
    color: 'bg-blue-600',
    items: [
      'Your team receives account activation emails and login credentials',
      'Jurisdiction and vertical configuration is applied to your workspace',
      'Welcome call or training session scheduled (if requested)',
      'Onboarding guide shared with your primary contact',
    ],
  },
  {
    week: 'Week 2',
    title: 'Explore & Configure',
    color: 'bg-blue-500',
    items: [
      'Your team begins using Projects, Blocklists and monitoring tools',
      'Short product survey sent to gather early impressions',
      'Dedicated support available for questions and workspace fine-tuning',
      'Team can explore Lens and Competitors modules',
    ],
  },
  {
    week: 'Week 3',
    title: 'Review & Optimize',
    color: 'bg-blue-400',
    items: [
      'Check-in call to review usage, answer questions and gather feedback',
      'Product review opportunity for in-depth feedback on specific tools',
      'Workspace optimisation based on your team\'s observed workflows',
      'Onboarding complete \u2014 dedicated support continues',
    ],
  },
];

const FAQS = [
  {
    q: 'How many people can use the platform?',
    a: 'The number of seats is configured per organization. Your admin will know your seat limit \u2014 additional seats can be added at any time.',
  },
  {
    q: 'Can we add more jurisdictions later?',
    a: 'Absolutely. Jurisdictions can be added or removed at any time through the platform. Your initial selections help us configure the best starting view.',
  },
  {
    q: 'What happens during the training call?',
    a: 'A 30\u201345 minute video call where we walk your team through the key features, answer questions, and tailor the setup to your specific use case.',
  },
  {
    q: 'How long do product surveys take?',
    a: 'Surveys are short \u2014 typically 3\u20135 minutes. They help us understand what\'s working well and where we can improve.',
  },
  {
    q: 'Is our data secure?',
    a: 'Yes. All data is encrypted in transit and at rest. We follow industry-standard security practices and never share client data with third parties.',
  },
  {
    q: 'Who do I contact for support?',
    a: 'Email support@pimlicosolutions.com or use the in-platform chat. We aim to respond within 4 business hours.',
  },
];

export default function OnboardingGuidePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <nav className="flex items-center justify-between px-6 py-4 lg:px-8 max-w-5xl mx-auto">
          <a href="/" className="flex items-center gap-3">
            <Image src="/Pimlico_Logo.png" alt="Pimlico" width={110} height={30} className="h-7 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <Image src="/XHS Logo BLUE on WHITE.png" alt="XHS" width={80} height={32} className="h-8 w-auto" />
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ONBOARDING GUIDE</span>
          </div>
        </nav>
      </header>

      <div className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl mb-4">
              Onboarding Guide
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              {"Everything you need to know about getting started with Pimlico XHS\u2122. Share this page with your team as a reference."}
            </p>
          </div>

          {/* What is XHS */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
            <h2 className="text-xl font-medium text-slate-900 mb-4">What is Pimlico XHS{'\u2122'}?</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Pimlico XHS{'\u2122'} is a regulatory intelligence platform that helps compliance, legal, and public affairs teams monitor, track, and act on regulatory changes across multiple jurisdictions. From real-time blocklist monitoring to competitor analysis and technical standards tracking, XHS gives your team the tools to stay ahead.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your workspace is configured with the jurisdictions and verticals most relevant to your organization, so you only see what matters.
            </p>
          </section>

          {/* Products */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
            <h2 className="text-xl font-medium text-slate-900 mb-2">XHS{'\u2122'} Platform Products</h2>
            <p className="text-sm text-slate-500 mb-6">The tools available in your XHS{'\u2122'} workspace</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRODUCTS.map(p => (
                <div key={p.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="font-medium text-slate-900 text-sm mb-2">{p.label}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
            <h2 className="text-xl font-medium text-slate-900 mb-2">Onboarding Timeline</h2>
            <p className="text-sm text-slate-500 mb-6">{"What to expect in your first three weeks"}</p>

            <div className="relative">
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-blue-200" />

              <div className="space-y-6">
                {TIMELINE.map(t => (
                  <div key={t.week} className="flex gap-4">
                    <div className={`relative z-10 w-9 h-9 rounded-full ${t.color} text-white flex items-center justify-center text-[10px] font-medium flex-shrink-0 leading-none`}>
                      {t.week.replace('Week ', 'W')}
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h3 className="text-sm font-medium text-slate-900">{t.week} {'\u2014'} {t.title}</h3>
                      <ul className="mt-2 space-y-1.5">
                        {t.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-blue-500 mt-0.5">{'\u2022'}</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What we ask of you */}
          <section className="bg-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-200 mb-6">
            <h2 className="text-xl font-medium text-blue-900 mb-4">What We Ask of You</h2>
            <p className="text-sm text-blue-800 leading-relaxed mb-5">
              Getting the most out of XHS{'\u2122'} is a two-way process. Here{'\u2019'}s how your team can help us deliver the best experience:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-sm">{'\uD83D\uDCCA'}</span>
                  <h3 className="text-sm font-medium text-slate-900">Product Surveys</h3>
                </div>
                <p className="text-xs text-slate-600">Short 3{'\u2013'}5 minute surveys sent at key milestones to track satisfaction and identify areas for improvement.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-sm">{'\uD83D\uDD0D'}</span>
                  <h3 className="text-sm font-medium text-slate-900">Product Reviews</h3>
                </div>
                <p className="text-xs text-slate-600">Deeper feedback sessions on specific products after a few weeks of usage. Your insights directly shape product development.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-sm">{'\uD83D\uDDE3\uFE0F'}</span>
                  <h3 className="text-sm font-medium text-slate-900">Check-in Calls</h3>
                </div>
                <p className="text-xs text-slate-600">Brief calls at the end of weeks 2{'\u2013'}3 to discuss your experience and ensure everything is configured correctly.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-sm">{'\uD83D\uDE80'}</span>
                  <h3 className="text-sm font-medium text-slate-900">Early Access</h3>
                </div>
                <p className="text-xs text-slate-600">Opportunity to try new features before general release. Opt in during onboarding to be among the first to test.</p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
            <h2 className="text-xl font-medium text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-sm font-medium text-slate-900 mb-1.5">{faq.q}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-center mb-6">
            <h2 className="text-xl font-medium text-white mb-2">Need Help?</h2>
            <p className="text-sm text-slate-400 mb-5">{"Our team is here to support you throughout onboarding and beyond."}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:support@pimlicosolutions.com"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Email Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Contact Us
              </a>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 py-4">
            <p>{'\u00A9'} {new Date().getFullYear()} Pimlico Solutions Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
