"use client";

import Image from "next/image";
import { useState } from "react";

// Features to rate — each with a label and description
const FEATURE_RATINGS = [
  { key: 'regulatoryMonitoring', label: 'Regulatory Monitoring', desc: 'Tracking regulatory developments across jurisdictions' },
  { key: 'feed', label: 'Regulatory Feed', desc: 'The main feed of regulatory updates and intelligence' },
  { key: 'updateFrequency', label: 'Frequency of Updates', desc: 'How often new regulatory content is published' },
  { key: 'updateDetail', label: 'Detail of Updates', desc: 'Depth and quality of regulatory analysis provided' },
  { key: 'integrations', label: 'Integrations', desc: 'Connections with your existing tools and workflows' },
  { key: 'easeOfUse', label: 'Ease of Use', desc: 'Overall simplicity and intuitiveness of the platform' },
  { key: 'navigation', label: 'Ease of Navigation', desc: 'Finding what you need quickly and efficiently' },
  { key: 'statusSystem', label: 'Status System', desc: 'Tracking regulatory lifecycle stages and progress' },
  { key: 'filters', label: 'Filters & Search', desc: 'Ability to narrow down content by jurisdiction, topic, etc.' },
  { key: 'alerts', label: 'Alerts & Notifications', desc: 'Staying informed about relevant regulatory changes' },
  { key: 'crossBorder', label: 'Cross-Border Comparison', desc: 'Comparing regulatory approaches across jurisdictions' },
  { key: 'reporting', label: 'Reporting & Dashboards', desc: 'Visualising compliance status and regulatory landscape' },
];

const IMPROVEMENT_AREAS = [
  'More jurisdictions covered',
  'More granular topic filtering',
  'Better AI-powered summaries',
  'Faster update turnaround',
  'More integration options',
  'Better team collaboration features',
  'Improved mobile experience',
  'More customisable alerts',
  'API access / developer tools',
  'Compliance calendar improvements',
];

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

  // Step 2 — Feature ratings
  const [ratings, setRatings] = useState({});

  // Step 3 — Improvements & missing
  const [selectedImprovements, setSelectedImprovements] = useState([]);
  const [missingFeatures, setMissingFeatures] = useState('');
  const [mostValuable, setMostValuable] = useState('');

  // Step 4 — Overall + future
  const [overallRating, setOverallRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [meetExpectations, setMeetExpectations] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const TOTAL_STEPS = 4;

  const setFeatureRating = (key, value) => {
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const toggleImprovement = (item) => {
    setSelectedImprovements(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const canProceed = () => {
    if (step === 1) return name.trim() && email.trim();
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Map ratings keys back to labels for the email
      const featureRatings = {};
      FEATURE_RATINGS.forEach(f => {
        if (ratings[f.key]) featureRatings[f.label] = ratings[f.key];
      });

      const res = await fetch('/api/offboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, company, role, trialDuration,
          featureRatings,
          selectedImprovements,
          missingFeatures,
          mostValuable,
          overallRating,
          wouldRecommend,
          meetExpectations,
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
  const StarRating = ({ value, onChange, size = 'text-2xl' }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`${size} transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
            n <= value ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
          }`}
        >
          ★
        </button>
      ))}
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
              Your insights help us make Pimlico XHS™ better for everyone. We genuinely appreciate you taking the time.
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
              Trial Completion Survey
            </h1>
            <p className="text-base text-gray-400">
              Help us understand how we did — rate the features you experienced
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
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">About you</h2>
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <input
                      type="text" value={role} onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Compliance Officer, Head of Legal..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">How long did you trial the platform?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Less than 1 week', '1–2 weeks', '2–4 weeks', 'Over 1 month'].map(opt => (
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

          {/* Step 2 — Feature ratings */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-1">Rate our features</h2>
                <p className="text-sm text-gray-400 mb-6">How would you rate each feature you experienced? Skip any you didn&apos;t use.</p>

                <div className="space-y-1">
                  {FEATURE_RATINGS.map((feature, i) => (
                    <div
                      key={feature.key}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-4 py-3 rounded-lg ${
                        i % 2 === 0 ? 'bg-white/[0.03]' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{feature.label}</p>
                        <p className="text-xs text-gray-500">{feature.desc}</p>
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n} type="button"
                            onClick={() => setFeatureRating(feature.key, n)}
                            className={`text-lg min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors ${
                              n <= (ratings[feature.key] || 0) ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                        {ratings[feature.key] && (
                          <button
                            type="button"
                            onClick={() => setFeatureRating(feature.key, 0)}
                            className="text-xs text-gray-600 hover:text-gray-400 ml-1 min-w-[28px]"
                            title="Clear"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Improvements & most valuable */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-1">Improvements</h2>
                <p className="text-sm text-gray-400 mb-5">What would make the platform more valuable to you?</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Areas for improvement</label>
                  <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {IMPROVEMENT_AREAS.map(item => (
                      <button
                        key={item} type="button"
                        onClick={() => toggleImprovement(item)}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium text-left transition-all ${
                          selectedImprovements.includes(item)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Which feature did you find most valuable?</label>
                    <input
                      type="text" value={mostValuable} onChange={e => setMostValuable(e.target.value)}
                      placeholder="The feature that stood out most..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Any features you felt were missing?</label>
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

          {/* Step 4 — Overall experience */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Overall experience</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    How would you rate your overall experience?
                  </label>
                  <StarRating value={overallRating} onChange={setOverallRating} />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Did the platform meet your expectations?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Exceeded expectations', 'Met expectations', 'Below expectations'].map(opt => (
                      <button
                        key={opt} type="button"
                        onClick={() => setMeetExpectations(opt)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          meetExpectations === opt
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Any other feedback?</label>
                  <textarea
                    value={additionalFeedback} onChange={e => setAdditionalFeedback(e.target.value)}
                    rows={4}
                    placeholder="Anything else you'd like us to know..."
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
              Skip and return to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
