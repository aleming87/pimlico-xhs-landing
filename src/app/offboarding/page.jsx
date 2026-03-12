"use client";

import Image from "next/image";
import { useState } from "react";

const PLATFORM_FEATURES = [
  'Regulatory Intelligence Feed',
  'Jurisdiction Tracker',
  'AI-Powered Summaries',
  'Cross-Border Comparison',
  'Compliance Calendar / Deadlines',
  'Alerts & Notifications',
  'Document Library',
  'Team Collaboration / Workspace',
  'Reporting / Dashboards',
  'API / Integrations',
];

const LEAVING_REASONS = [
  'Too expensive / budget constraints',
  'Missing features I need',
  'Data quality or coverage issues',
  'Difficult to use / poor UX',
  'Not enough time to evaluate properly',
  'Chose a competitor product',
  'No longer need this type of solution',
  'Internal priorities changed',
  'Poor onboarding / support experience',
  'Other',
];

const COMPETITOR_OPTIONS = [
  'LexisNexis',
  'Thomson Reuters',
  'Vixio',
  'Regology',
  'Qube',
  'Built in-house',
  'None — going without',
  'Other',
];

export default function OffboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Identity
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [trialDuration, setTrialDuration] = useState('');

  // Step 2 — Overall + reason
  const [overallRating, setOverallRating] = useState(0);
  const [primaryReason, setPrimaryReason] = useState('');
  const [reasonDetail, setReasonDetail] = useState('');

  // Step 3 — Features
  const [featuresUsed, setFeaturesUsed] = useState([]);
  const [featureRatings, setFeatureRatings] = useState({});
  const [mostValuable, setMostValuable] = useState('');
  const [leastValuable, setLeastValuable] = useState('');
  const [missingFeatures, setMissingFeatures] = useState('');

  // Step 4 — Data & UX
  const [dataQuality, setDataQuality] = useState(0);
  const [coverageGaps, setCoverageGaps] = useState('');
  const [easeOfUse, setEaseOfUse] = useState(0);
  const [uiImprovements, setUiImprovements] = useState('');

  // Step 5 — Future intent
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [switchingTo, setSwitchingTo] = useState('');
  const [switchingReason, setSwitchingReason] = useState('');
  const [comeback, setComeback] = useState('');
  const [comebackConditions, setComebackConditions] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const TOTAL_STEPS = 5;

  const toggleFeature = (f) => {
    setFeaturesUsed(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const setFeatureRating = (feature, rating) => {
    setFeatureRatings(prev => ({ ...prev, [feature]: rating }));
  };

  const canProceed = () => {
    if (step === 1) return name.trim() && email.trim();
    if (step === 2) return overallRating > 0 && primaryReason;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/offboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, company, trialDuration,
          overallRating, primaryReason, reasonDetail,
          featuresUsed, featureRatings,
          mostValuable, leastValuable, missingFeatures,
          dataQuality, coverageGaps,
          easeOfUse, uiImprovements,
          wouldRecommend, switchingTo, switchingReason,
          comeback, comebackConditions,
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

  // Star rating component
  const StarRating = ({ value, onChange, label }) => (
    <div>
      {label && <p className="text-sm text-gray-400 mb-2">{label}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`text-2xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              n <= value ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

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
              Your insights are invaluable to us. We take every piece of feedback seriously and use it to improve Pimlico XHS™ for everyone.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              If you change your mind, you&apos;re always welcome back. Your data will be retained for 30 days.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              Back to homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Nav */}
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
              We&apos;re sorry to see you go
            </h1>
            <p className="text-base text-gray-400">
              Help us understand your experience so we can do better
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Step {step} of {TOTAL_STEPS}</span>
              <span className="text-xs text-gray-500">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1 — Your details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Your details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name <span className="text-red-400">*</span></label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email <span className="text-red-400">*</span></label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                    <input
                      type="text" value={company} onChange={e => setCompany(e.target.value)}
                      placeholder="Your company"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">How long was your trial?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Less than 1 week', '1-2 weeks', '2-4 weeks', 'Over 1 month'].map(opt => (
                        <button
                          key={opt} type="button"
                          onClick={() => setTrialDuration(opt)}
                          className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                            trialDuration === opt
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Overall experience + reason */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Overall experience</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    How would you rate your overall experience? <span className="text-red-400">*</span>
                  </label>
                  <StarRating value={overallRating} onChange={setOverallRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What is the main reason you&apos;re leaving? <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    {LEAVING_REASONS.map(reason => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setPrimaryReason(reason)}
                        className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          primaryReason === reason
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  {primaryReason && (
                    <div className="mt-4">
                      <label className="block text-sm text-gray-400 mb-1">Tell us more (optional)</label>
                      <textarea
                        value={reasonDetail}
                        onChange={e => setReasonDetail(e.target.value)}
                        rows={3}
                        placeholder="Any additional detail..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Feature feedback */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Feature feedback</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Which features did you use?</label>
                  <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PLATFORM_FEATURES.map(f => (
                      <button
                        key={f} type="button"
                        onClick={() => toggleFeature(f)}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium text-left transition-all ${
                          featuresUsed.includes(f)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {featuresUsed.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Rate the features you used</label>
                    <div className="space-y-3">
                      {featuresUsed.map(f => (
                        <div key={f} className="flex items-center justify-between gap-3 bg-white/5 rounded-lg px-4 py-2">
                          <span className="text-sm text-gray-300 truncate">{f}</span>
                          <div className="flex gap-0.5 flex-shrink-0">
                            {[1, 2, 3, 4, 5].map(n => (
                              <button
                                key={n} type="button"
                                onClick={() => setFeatureRating(f, n)}
                                className={`text-lg min-w-[32px] min-h-[32px] flex items-center justify-center ${
                                  n <= (featureRatings[f] || 0) ? 'text-yellow-400' : 'text-gray-600'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">What was the most valuable feature?</label>
                    <input
                      type="text" value={mostValuable} onChange={e => setMostValuable(e.target.value)}
                      placeholder="The feature you found most useful..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">What was the least valuable feature?</label>
                    <input
                      type="text" value={leastValuable} onChange={e => setLeastValuable(e.target.value)}
                      placeholder="The feature you found least useful..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">What features were missing?</label>
                    <textarea
                      value={missingFeatures} onChange={e => setMissingFeatures(e.target.value)}
                      rows={3}
                      placeholder="Features you expected or wished were available..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Data quality & UX */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Data & usability</h2>

                <div className="mb-6">
                  <StarRating value={dataQuality} onChange={setDataQuality} label="How would you rate the quality of our regulatory data?" />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-1">Were there any coverage gaps? (jurisdictions, topics, etc.)</label>
                  <textarea
                    value={coverageGaps} onChange={e => setCoverageGaps(e.target.value)}
                    rows={3}
                    placeholder="E.g. Missing coverage for a specific jurisdiction or topic area..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="mb-6">
                  <StarRating value={easeOfUse} onChange={setEaseOfUse} label="How easy was the platform to use?" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Any suggestions for improving the interface?</label>
                  <textarea
                    value={uiImprovements} onChange={e => setUiImprovements(e.target.value)}
                    rows={3}
                    placeholder="What would have made the platform easier or more intuitive..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Future intent */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Looking ahead</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Would you recommend Pimlico XHS™ to a colleague?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Yes', 'Maybe', 'No'].map(opt => (
                      <button
                        key={opt} type="button"
                        onClick={() => setWouldRecommend(opt)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          wouldRecommend === opt
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Are you switching to another solution?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {COMPETITOR_OPTIONS.map(opt => (
                      <button
                        key={opt} type="button"
                        onClick={() => setSwitchingTo(switchingTo === opt ? '' : opt)}
                        className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all text-left ${
                          switchingTo === opt
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {switchingTo && switchingTo !== 'None — going without' && (
                    <div className="mt-3">
                      <label className="block text-sm text-gray-400 mb-1">What made you choose them?</label>
                      <input
                        type="text" value={switchingReason} onChange={e => setSwitchingReason(e.target.value)}
                        placeholder="e.g. Better pricing, specific feature, existing relationship..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Would you consider coming back in the future?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Yes', 'Maybe', 'No'].map(opt => (
                      <button
                        key={opt} type="button"
                        onClick={() => setComeback(opt)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          comeback === opt
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {(comeback === 'Yes' || comeback === 'Maybe') && (
                    <div className="mt-3">
                      <label className="block text-sm text-gray-400 mb-1">What would bring you back?</label>
                      <input
                        type="text" value={comebackConditions} onChange={e => setComebackConditions(e.target.value)}
                        placeholder="e.g. Lower pricing, specific feature, broader coverage..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Anything else you&apos;d like to share?</label>
                  <textarea
                    value={additionalFeedback} onChange={e => setAdditionalFeedback(e.target.value)}
                    rows={4}
                    placeholder="Any additional thoughts, suggestions, or feedback..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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

          {/* Skip link */}
          <div className="text-center mt-6">
            <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Skip survey and return to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
