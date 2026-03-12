"use client";

import Image from "next/image";
import { useState } from "react";

/* ───────────────────────────────────────────────
   Section definitions — each section has tailored
   rating criteria shown only when user says "Yes"
   to "Did you use this?"
   ─────────────────────────────────────────────── */

const UI_RATINGS = [
  { key: 'ui_easeOfUse', label: 'Overall Ease of Use', desc: 'How intuitive was the platform to pick up?' },
  { key: 'ui_navigation', label: 'Navigation', desc: 'Finding your way around and locating what you need' },
  { key: 'ui_design', label: 'Visual Design & Layout', desc: 'Look, feel, and organisation of the interface' },
  { key: 'ui_search', label: 'Search & Filtering', desc: 'Narrowing down content by jurisdiction, topic, etc.' },
  { key: 'ui_statusSystem', label: 'Status System', desc: 'Understanding regulatory lifecycle stages at a glance' },
  { key: 'ui_mobile', label: 'Mobile / Responsive Experience', desc: 'Using the platform on smaller screens' },
];

const REG_RATINGS = [
  { key: 'reg_coverage', label: 'Regulatory Coverage', desc: 'Breadth of jurisdictions and topics tracked' },
  { key: 'reg_updateSpeed', label: 'Speed of Updates', desc: 'How quickly new regulatory developments appeared' },
  { key: 'reg_feedOrg', label: 'Feed Organisation', desc: 'How well the feed was structured and prioritised' },
  { key: 'reg_clarity', label: 'Clarity of Information', desc: 'How clearly regulatory changes were explained' },
  { key: 'reg_alerts', label: 'Alerts & Notifications', desc: 'Staying informed about relevant changes' },
];

const CR_RATINGS = [
  { key: 'cr_quality', label: 'Quality & Accuracy', desc: 'How reliable and well-researched the reports were' },
  { key: 'cr_coverage', label: 'Country Coverage', desc: 'Range of jurisdictions with available reports' },
  { key: 'cr_usefulness', label: 'Practical Usefulness', desc: 'How actionable the reports were for your work' },
  { key: 'cr_crossBorder', label: 'Cross-Border Comparison', desc: 'Comparing regulatory approaches across jurisdictions' },
];

const INT_RATINGS = [
  { key: 'int_easeOfSetup', label: 'Ease of Setup', desc: 'How simple it was to connect your tools' },
  { key: 'int_reliability', label: 'Reliability', desc: 'Consistency and dependability of the connection' },
  { key: 'int_range', label: 'Range of Options', desc: 'Variety of integrations available' },
];

const UPCOMING_FEATURES = [
  { key: 'projects', label: 'Projects', desc: 'Organise regulatory items into workstreams and track progress against compliance objectives' },
  { key: 'lens', label: 'Lens', desc: 'AI-powered analysis that surfaces the regulatory changes most relevant to your business' },
  { key: 'competitors', label: 'Competitors', desc: 'See how peer organisations are responding to the same regulatory developments' },
  { key: 'blocklists', label: 'Blocklists', desc: 'Filter out noise by blocking jurisdictions, topics, or sources you don\u2019t need to track' },
];

const DETAIL_LABELS = [
  { val: 1, label: 'Far too little', short: 'Too little' },
  { val: 2, label: 'A bit too little', short: 'Slightly low' },
  { val: 3, label: 'Just right', short: 'Just right' },
  { val: 4, label: 'A bit too much', short: 'Slightly high' },
  { val: 5, label: 'Far too much', short: 'Too much' },
];

/* ─────────────────────────────────────────────── */

export default function OffboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Identity
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [trialDuration, setTrialDuration] = useState('');

  // Steps 2 & 3 — Sectioned ratings
  const [sectionUsed, setSectionUsed] = useState({});   // { ui: 'Yes', reg: 'No', cr: 'Yes', int: 'No' }
  const [ratings, setRatings] = useState({});            // flat: { ui_easeOfUse: 4, reg_coverage: 3, ... }
  const [detailLevel, setDetailLevel] = useState({});    // { reg: 3, cr: 2 }
  const [sectionFeedback, setSectionFeedback] = useState({}); // { ui: '...', reg: '...', cr: '...', int: '...' }

  // Step 4 — Upcoming features
  const [upcomingInterest, setUpcomingInterest] = useState({});
  const [keepInTouch, setKeepInTouch] = useState('');

  // Step 5 — Overall
  const [overallRating, setOverallRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [meetExpectations, setMeetExpectations] = useState('');
  const [mostValuable, setMostValuable] = useState('');
  const [missingFeatures, setMissingFeatures] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const TOTAL_STEPS = 5;

  /* Helpers */
  const setRating = (key, value) => setRatings(prev => ({ ...prev, [key]: value }));
  const setUsed = (section, value) => setSectionUsed(prev => ({ ...prev, [section]: value }));
  const setDetail = (section, value) => setDetailLevel(prev => ({ ...prev, [section]: value }));
  const setFeedback = (section, value) => setSectionFeedback(prev => ({ ...prev, [section]: value }));
  const setUpcoming = (key, value) => setUpcomingInterest(prev => ({ ...prev, [key]: value }));

  const canProceed = () => {
    if (step === 1) return name.trim() && email.trim();
    return true;
  };

  /* Submit */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Build feature ratings grouped by section label
      const buildSectionRatings = (items) => {
        const out = {};
        items.forEach(f => { if (ratings[f.key]) out[f.label] = ratings[f.key]; });
        return out;
      };

      const upcomingLabelled = {};
      UPCOMING_FEATURES.forEach(f => { if (upcomingInterest[f.key]) upcomingLabelled[f.label] = upcomingInterest[f.key]; });

      const res = await fetch('/api/offboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, company, role, trialDuration,
          sections: {
            ui: {
              used: sectionUsed.ui || 'Not answered',
              ratings: buildSectionRatings(UI_RATINGS),
              feedback: sectionFeedback.ui || '',
            },
            regulatory: {
              used: sectionUsed.reg || 'Not answered',
              ratings: buildSectionRatings(REG_RATINGS),
              detailLevel: detailLevel.reg || null,
              feedback: sectionFeedback.reg || '',
            },
            countryReports: {
              used: sectionUsed.cr || 'Not answered',
              ratings: buildSectionRatings(CR_RATINGS),
              detailLevel: detailLevel.cr || null,
              feedback: sectionFeedback.cr || '',
            },
            integrations: {
              used: sectionUsed.int || 'Not answered',
              ratings: buildSectionRatings(INT_RATINGS),
              feedback: sectionFeedback.int || '',
            },
          },
          upcomingFeatureInterest: upcomingLabelled,
          keepInTouch,
          overallRating,
          wouldRecommend,
          meetExpectations,
          mostValuable,
          missingFeatures,
          additionalFeedback,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Reusable sub-components ── */

  const StarRow = ({ item, value, onRate }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{item.label}</p>
        <p className="text-xs text-gray-500">{item.desc}</p>
      </div>
      <div className="flex gap-0.5 flex-shrink-0">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => onRate(n)}
            className={`text-lg min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors ${
              n <= (value || 0) ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'
            }`}
          >★</button>
        ))}
        {value > 0 && (
          <button type="button" onClick={() => onRate(0)}
            className="text-xs text-gray-600 hover:text-gray-400 ml-1 min-w-[28px]" title="Clear">✕</button>
        )}
      </div>
    </div>
  );

  const DetailScale = ({ value, onChange, label }) => (
    <div className="px-4 py-4">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      <p className="text-xs text-gray-500 mb-3">How would you rate the level of detail provided?</p>
      <div className="flex gap-1.5">
        {DETAIL_LABELS.map(d => (
          <button key={d.val} type="button" onClick={() => onChange(d.val)}
            className={`flex-1 py-2.5 px-1 rounded-lg text-xs font-medium transition-all text-center leading-tight ${
              value === d.val
                ? d.val === 3 ? 'bg-green-600 text-white' : d.val < 3 ? 'bg-amber-600 text-white' : 'bg-amber-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >{d.short}</button>
        ))}
      </div>
      <div className="flex justify-between mt-1 px-1">
        <span className="text-[10px] text-gray-600">← Not enough</span>
        <span className="text-[10px] text-gray-600">Too much →</span>
      </div>
    </div>
  );

  const DidYouUse = ({ section, label }) => (
    <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] rounded-lg mb-3">
      <p className="text-sm text-gray-300">Did you use <span className="text-white font-medium">{label}</span>?</p>
      <div className="flex gap-2">
        {['Yes', 'No'].map(opt => (
          <button key={opt} type="button" onClick={() => setUsed(section, opt)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              sectionUsed[section] === opt
                ? opt === 'Yes' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >{opt}</button>
        ))}
      </div>
    </div>
  );

  const SectionFeedbackBox = ({ section, prompt }) => (
    <div className="px-4 py-3">
      <label className="block text-sm text-gray-400 mb-1">{prompt}</label>
      <textarea
        value={sectionFeedback[section] || ''} onChange={e => setFeedback(section, e.target.value)}
        rows={2}
        placeholder="Your suggestions..."
        className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
      />
    </div>
  );

  const SectionCard = ({ icon, title, sectionKey, usedLabel, ratingItems, detailSection, detailLabel, feedbackPrompt, children }) => (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="px-5 pb-1">
        <DidYouUse section={sectionKey} label={usedLabel} />
      </div>

      {sectionUsed[sectionKey] === 'Yes' && (
        <div className="border-t border-white/[0.06]">
          <div className="divide-y divide-white/[0.04]">
            {ratingItems.map((item, i) => (
              <div key={item.key} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                <StarRow item={item} value={ratings[item.key] || 0} onRate={v => setRating(item.key, v)} />
              </div>
            ))}
            {detailSection && (
              <div className="bg-white/[0.02]">
                <DetailScale
                  value={detailLevel[detailSection] || 0}
                  onChange={v => setDetail(detailSection, v)}
                  label={detailLabel || 'Level of Detail'}
                />
              </div>
            )}
            {children}
          </div>
        </div>
      )}

      <div className={`border-t border-white/[0.06] ${sectionUsed[sectionKey] !== 'Yes' ? 'mt-1' : ''}`}>
        <SectionFeedbackBox section={sectionKey} prompt={feedbackPrompt} />
      </div>
    </div>
  );

  const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`text-2xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
            n <= value ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
          }`}
        >★</button>
      ))}
    </div>
  );

  /* ── Thank-you screen ── */
  if (submitted) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico XHS</span>
              <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
            </a>
          </nav>
        </header>
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Thank you for your feedback</h1>
            <p className="text-gray-400 text-lg mb-8">
              Your insights help us make Pimlico XHS™ better for everyone. We genuinely appreciate you taking the time.
            </p>
            {keepInTouch === 'Yes please' && (
              <p className="text-sm text-blue-400 mb-6">
                We&apos;ll keep you in the loop as new features launch — look out for updates from us soon.
              </p>
            )}
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors">
              Back to homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main survey ── */
  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Pimlico XHS</span>
            <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
          </a>
        </nav>
      </header>

      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10 pt-12">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
              Trial Completion Survey
            </h1>
            <p className="text-base text-gray-400">
              Help us understand your experience — your feedback shapes what we build next
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Step {step} of {TOTAL_STEPS}</span>
              <span className="text-xs text-gray-500">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              {['About you', 'UI & Monitoring', 'Reports & Integrations', 'Coming Soon', 'Overall'].map((label, i) => (
                <span key={label} className={`text-[10px] transition-colors ${i + 1 <= step ? 'text-blue-400' : 'text-gray-700'}`}>{label}</span>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              STEP 1 — About You
              ═══════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">About you</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name <span className="text-red-400">*</span></label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Work email <span className="text-red-400">*</span></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@company.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                      <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company"
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                      <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Compliance Officer"
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">How long did you trial the platform?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Less than 1 week', '1\u20132 weeks', '2\u20134 weeks', 'Over 1 month'].map(opt => (
                        <button key={opt} type="button" onClick={() => setTrialDuration(opt)}
                          className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                            trialDuration === opt ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 2 — UI & Regulatory Monitoring
              ═══════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500">Rate each area you used — skip what you didn&apos;t try</p>
              </div>

              {/* UI Section */}
              <SectionCard
                icon="🖥️" title="User Interface & Experience"
                sectionKey="ui" usedLabel="the platform interface"
                ratingItems={UI_RATINGS}
                feedbackPrompt="How could we improve the interface?"
              />

              {/* Regulatory Monitoring Section */}
              <SectionCard
                icon="📡" title="Regulatory Monitoring"
                sectionKey="reg" usedLabel="regulatory monitoring features"
                ratingItems={REG_RATINGS}
                detailSection="reg" detailLabel="Level of Detail in Updates"
                feedbackPrompt="How could we improve regulatory monitoring?"
              />
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 3 — Country Reports & Integrations
              ═══════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500">Rate each area you used — skip what you didn&apos;t try</p>
              </div>

              {/* Country Reports Section */}
              <SectionCard
                icon="🌍" title="Country Reports"
                sectionKey="cr" usedLabel="country reports"
                ratingItems={CR_RATINGS}
                detailSection="cr" detailLabel="Level of Detail in Reports"
                feedbackPrompt="How could we improve country reports?"
              />

              {/* Integrations Section */}
              <SectionCard
                icon="🔗" title="Integrations"
                sectionKey="int" usedLabel="any integrations"
                ratingItems={INT_RATINGS}
                feedbackPrompt="How could we improve integrations?"
              />
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 4 — Upcoming Features
              ═══════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-white">Coming Soon</h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">Preview</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">We&apos;re building new capabilities. How interested are you in each?</p>

                <div className="space-y-3">
                  {UPCOMING_FEATURES.map((feature) => (
                    <div key={feature.key} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white mb-0.5">{feature.label}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          {[
                            { val: 1, label: 'Not interested' },
                            { val: 2, label: 'Slightly' },
                            { val: 3, label: 'Moderate' },
                            { val: 4, label: 'Very' },
                            { val: 5, label: 'Must-have' },
                          ].map(({ val, label }) => (
                            <button key={val} type="button" onClick={() => setUpcoming(feature.key, val)} title={label}
                              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                                upcomingInterest[feature.key] === val
                                  ? val >= 3 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'bg-gray-600 text-white'
                                  : 'bg-white/10 text-gray-500 hover:bg-white/20 hover:text-gray-300'
                              }`}
                            >{val}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-end">
                  <p className="text-[11px] text-gray-600">1 = Not interested &nbsp;·&nbsp; 5 = Must-have</p>
                </div>
              </div>

              {/* Keep in touch */}
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h3 className="text-base font-semibold text-white mb-2">Stay in the loop?</h3>
                <p className="text-sm text-gray-400 mb-4">Would you like us to keep you updated as these features launch?</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Yes please', 'Maybe later', 'No thanks'].map(opt => (
                    <button key={opt} type="button" onClick={() => setKeepInTouch(opt)}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                        keepInTouch === opt ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 5 — Overall Experience
              ═══════════════════════════════════════════ */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Overall experience</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">How would you rate your overall experience?</label>
                  <StarRating value={overallRating} onChange={setOverallRating} />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Did the platform meet your expectations?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Exceeded expectations', 'Met expectations', 'Below expectations'].map(opt => (
                      <button key={opt} type="button" onClick={() => setMeetExpectations(opt)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          meetExpectations === opt ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}>{opt}</button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Would you recommend Pimlico XHS™ to a colleague?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Yes', 'Maybe', 'No'].map(opt => (
                      <button key={opt} type="button" onClick={() => setWouldRecommend(opt)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          wouldRecommend === opt ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h3 className="text-base font-semibold text-white mb-4">Final thoughts</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Which feature did you find most valuable?</label>
                    <input type="text" value={mostValuable} onChange={e => setMostValuable(e.target.value)}
                      placeholder="The feature that stood out most..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Any features you felt were missing?</label>
                    <textarea value={missingFeatures} onChange={e => setMissingFeatures(e.target.value)} rows={2}
                      placeholder="Features you expected or wished were available..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Anything else you&apos;d like us to know?</label>
                    <textarea value={additionalFeedback} onChange={e => setAdditionalFeedback(e.target.value)} rows={3}
                      placeholder="Open feedback — anything goes..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)}
                className="px-5 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors">← Back</button>
            ) : <div />}

            {step < TOTAL_STEPS ? (
              <button type="button" onClick={() => setStep(step + 1)} disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                  canProceed() ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}>Continue →</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit feedback'}
              </button>
            )}
          </div>

          <div className="text-center mt-6">
            <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Skip and return to site</a>
          </div>
        </div>
      </div>
    </div>
  );
}
