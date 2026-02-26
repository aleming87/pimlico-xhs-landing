"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function XHSMonitoringSurveyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [validFields, setValidFields] = useState({
    firstName: false,
    lastName: false,
    company: false,
    email: false
  });

  // Ratings
  const [overallSatisfaction, setOverallSatisfaction] = useState(0);
  const [coverageRating, setCoverageRating] = useState(0);
  const [depthRating, setDepthRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [easeOfUseRating, setEaseOfUseRating] = useState(0);
  const [integrationRating, setIntegrationRating] = useState(0);
  const [countryReportsRating, setCountryReportsRating] = useState(0);
  const [npsScore, setNpsScore] = useState(null);

  // Toggles
  const [recommendSources, setRecommendSources] = useState('');
  const [usedIntegrations, setUsedIntegrations] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState([]);
  const [usedCountryReports, setUsedCountryReports] = useState('');
  const [newsCoverageBeneficial, setNewsCoverageBeneficial] = useState('');
  const [selectedNewsTopics, setSelectedNewsTopics] = useState([]);
  const [selectedDesiredFeatures, setSelectedDesiredFeatures] = useState([]);

  // Email validation
  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
    'gmx.com', 'live.com', 'msn.com', 'inbox.com', 'tutanota.com'
  ];

  const validateBusinessEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    if (freeEmailProviders.includes(domain)) {
      setEmailError('Please use your business email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleFieldChange = (field, value) => {
    let isValid = false;
    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'company':
        isValid = value.trim().length > 0;
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value) && validateBusinessEmail(value);
        break;
    }
    setValidFields(prev => ({ ...prev, [field]: isValid }));
  };

  // Data
  const integrationOptions = [
    'Slack',
    'Microsoft Teams',
    'Google Workspace',
    'Salesforce',
    'Hubspot',
    'Jira',
    'Asana',
    'OneTrust (GRC)',
    'ServiceNow (GRC)',
    'API / Custom Integration',
    'Email Alerts',
    'Other'
  ];

  const newsTopicOptions = [
    'Regulatory enforcement actions',
    'Policy changes & consultations',
    'Industry commentary & analysis',
    'Government announcements',
    'International regulatory developments',
    'Compliance best practices',
    'Technology & RegTech news',
    'Other'
  ];

  const desiredFeatureOptions = [
    'Advanced search & filtering',
    'Custom alert rules',
    'Regulatory change timeline / tracker',
    'AI-powered regulatory summaries',
    'Comparative jurisdiction analysis',
    'Regulatory impact assessments',
    'Collaboration & annotation tools',
    'Exportable compliance reports',
    'Dashboard customisation',
    'Mobile app',
    'Regulatory horizon scanning',
    'Automated compliance gap analysis',
    'Other'
  ];

  const toggleSelection = (item, selected, setSelected) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  // Star rating component
  const StarRating = ({ value, onChange, label, required }) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-white mb-3">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="group relative"
          >
            <svg
              className={`h-9 w-9 transition-colors ${
                star <= value ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {star}
            </span>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-3 text-sm text-gray-400 self-center">{value}/5</span>
        )}
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    const data = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      company: formData.get('company'),
      email: formData.get('email'),
      agreedToPolicy: formData.get('privacy-policy') === 'on',
      marketingConsent: formData.get('marketing-consent') === 'on',

      // Ratings
      overallSatisfaction,
      coverageRating,
      depthRating,
      timelinessRating,
      easeOfUseRating,
      npsScore,

      // Coverage
      coverageComments: formData.get('coverage-comments'),
      missedJurisdictions: formData.get('missed-jurisdictions'),
      missedTopics: formData.get('missed-topics'),
      recommendSources,
      suggestedSources: formData.get('suggested-sources'),

      // Integrations
      usedIntegrations,
      integrationsUsed: selectedIntegrations,
      integrationRating: usedIntegrations === 'Yes' ? integrationRating : null,
      integrationFeedback: formData.get('integration-feedback'),

      // Country Reports
      usedCountryReports,
      countryReportsRating: usedCountryReports === 'Yes' ? countryReportsRating : null,
      countryReportsFeedback: formData.get('country-reports-feedback'),
      mostUsefulCountryReports: formData.get('most-useful-country-reports'),

      // News Coverage
      newsCoverageBeneficial,
      newsCoverageComments: formData.get('news-coverage-comments'),
      preferredNewsTopics: selectedNewsTopics,

      // Improvements
      whatWouldChange: formData.get('what-would-change'),
      mostValuableFeature: formData.get('most-valuable-feature'),
      desiredFeatures: selectedDesiredFeatures,
      otherFeatureSuggestions: formData.get('other-feature-suggestions'),
      additionalComments: formData.get('additional-comments'),
    };

    try {
      const response = await fetch('/api/xhs-monitoring-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      alert('Thank you! Your feedback has been received.');
      router.push('/');
    } catch (error) {
      console.error('Survey submission error:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your survey. Please try again.');
    }
  };

  const isFormValid = validFields.email && overallSatisfaction > 0 && npsScore !== null;

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

      {/* Form */}
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12 pt-12">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
              XHS Monitoring Feedback
            </h1>
            <p className="text-lg text-gray-300">
              Help us understand how you're finding the platform so we can continue to improve it for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

            {/* CONTACT INFORMATION */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-semibold text-white">
                    First name <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      required
                      autoComplete="given-name"
                      onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-semibold text-white">
                    Last name <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      required
                      autoComplete="family-name"
                      onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-semibold text-white">
                    Company <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      autoComplete="organization"
                      onChange={(e) => handleFieldChange('company', e.target.value)}
                      className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-white">
                    Business Email <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                    />
                    {emailError && (
                      <p className="mt-2 text-sm text-red-400">{emailError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* OVERALL PLATFORM RATINGS */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-2">Platform Ratings</h2>
              <p className="text-sm text-gray-400 mb-6">Rate the following aspects of XHS monitoring on a scale of 1-5</p>

              <StarRating
                value={overallSatisfaction}
                onChange={setOverallSatisfaction}
                label="Overall satisfaction with XHS monitoring"
                required
              />
              <StarRating
                value={coverageRating}
                onChange={setCoverageRating}
                label="Breadth of regulatory coverage (jurisdictions & topics)"
                required
              />
              <StarRating
                value={depthRating}
                onChange={setDepthRating}
                label="Depth & detail of regulatory intelligence"
                required
              />
              <StarRating
                value={timelinessRating}
                onChange={setTimelinessRating}
                label="Timeliness of regulatory updates"
                required
              />
              <StarRating
                value={easeOfUseRating}
                onChange={setEaseOfUseRating}
                label="Ease of use & navigation"
                required
              />
            </div>

            {/* COVERAGE & SOURCES */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-2">Coverage & Sources</h2>
              <p className="text-sm text-gray-400 mb-6">Help us understand if we're covering the right ground</p>

              <div className="mb-6">
                <label htmlFor="coverage-comments" className="block text-sm font-semibold text-white mb-2">
                  How are you finding the regulatory coverage overall?
                </label>
                <textarea
                  id="coverage-comments"
                  name="coverage-comments"
                  rows={3}
                  placeholder="e.g. Good breadth across EU but could use more APAC coverage..."
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="missed-jurisdictions" className="block text-sm font-semibold text-white mb-2">
                  Are there any jurisdictions we've missed or you'd like us to add?
                </label>
                <textarea
                  id="missed-jurisdictions"
                  name="missed-jurisdictions"
                  rows={2}
                  placeholder="e.g. Would like to see more coverage of South-East Asian markets..."
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="missed-topics" className="block text-sm font-semibold text-white mb-2">
                  Are there any regulatory topics or areas we've missed?
                </label>
                <textarea
                  id="missed-topics"
                  name="missed-topics"
                  rows={2}
                  placeholder="e.g. Would like more granular coverage of crypto custody regulations..."
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Would you recommend we add additional regulatory sources?
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No', 'Not sure'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="recommend-sources-radio"
                        value={option}
                        checked={recommendSources === option}
                        onChange={(e) => setRecommendSources(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {recommendSources === 'Yes' && (
                <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/5">
                  <label htmlFor="suggested-sources" className="block text-sm font-semibold text-white mb-2">
                    Which sources would you like us to add?
                  </label>
                  <textarea
                    id="suggested-sources"
                    name="suggested-sources"
                    rows={2}
                    placeholder="e.g. Specific regulatory bodies, gazettes, publications..."
                    className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                  />
                </div>
              )}
            </div>

            {/* INTEGRATIONS */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-2">Integrations</h2>
              <p className="text-sm text-gray-400 mb-6">Tell us about your experience with XHS integrations</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Have you used any of the XHS integrations? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No', 'Not aware of them'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="used-integrations-radio"
                        value={option}
                        checked={usedIntegrations === option}
                        onChange={(e) => {
                          setUsedIntegrations(e.target.value);
                          if (e.target.value !== 'Yes') {
                            setSelectedIntegrations([]);
                            setIntegrationRating(0);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {usedIntegrations === 'Yes' && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-white mb-3">
                      Which integrations have you used?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {integrationOptions.map((integration) => (
                        <button
                          key={integration}
                          type="button"
                          onClick={() => toggleSelection(integration, selectedIntegrations, setSelectedIntegrations)}
                          className={`px-4 py-2.5 rounded-full text-sm transition-all min-h-[44px] flex items-center ${
                            selectedIntegrations.includes(integration)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {integration}
                        </button>
                      ))}
                    </div>
                  </div>

                  <StarRating
                    value={integrationRating}
                    onChange={setIntegrationRating}
                    label="How well are the integrations working for you?"
                  />

                  <div>
                    <label htmlFor="integration-feedback" className="block text-sm font-semibold text-white mb-2">
                      Any specific feedback on the integrations?
                    </label>
                    <textarea
                      id="integration-feedback"
                      name="integration-feedback"
                      rows={2}
                      placeholder="e.g. Slack alerts are great but would like more filtering options..."
                      className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* COUNTRY REPORTS */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-2">Country Reports</h2>
              <p className="text-sm text-gray-400 mb-6">Share your thoughts on the XHS country reports</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Have you used the country reports? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No', 'Not aware of them'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="used-country-reports-radio"
                        value={option}
                        checked={usedCountryReports === option}
                        onChange={(e) => {
                          setUsedCountryReports(e.target.value);
                          if (e.target.value !== 'Yes') {
                            setCountryReportsRating(0);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {usedCountryReports === 'Yes' && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
                  <StarRating
                    value={countryReportsRating}
                    onChange={setCountryReportsRating}
                    label="How would you rate the country reports?"
                  />

                  <div className="mb-6">
                    <label htmlFor="country-reports-feedback" className="block text-sm font-semibold text-white mb-2">
                      What do you think of the country reports? What would you change?
                    </label>
                    <textarea
                      id="country-reports-feedback"
                      name="country-reports-feedback"
                      rows={3}
                      placeholder="e.g. Comprehensive but could include more practical compliance guidance..."
                      className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="most-useful-country-reports" className="block text-sm font-semibold text-white mb-2">
                      Which country reports have been most useful to you?
                    </label>
                    <input
                      id="most-useful-country-reports"
                      name="most-useful-country-reports"
                      type="text"
                      placeholder="e.g. UK, EU, Singapore..."
                      className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* NEWS COVERAGE */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-2">News Coverage</h2>
              <p className="text-sm text-gray-400 mb-6">We're exploring adding integrated news coverage to the platform</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Would you find integrated regulatory news coverage beneficial? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4 flex-wrap">
                  {['Very beneficial', 'Somewhat beneficial', 'Not needed', 'Not sure'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="news-coverage-radio"
                        value={option}
                        checked={newsCoverageBeneficial === option}
                        onChange={(e) => setNewsCoverageBeneficial(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(newsCoverageBeneficial === 'Very beneficial' || newsCoverageBeneficial === 'Somewhat beneficial') && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-white mb-3">
                      What type of news coverage would be most valuable?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {newsTopicOptions.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleSelection(topic, selectedNewsTopics, setSelectedNewsTopics)}
                          className={`px-4 py-2.5 rounded-full text-sm transition-all min-h-[44px] flex items-center ${
                            selectedNewsTopics.includes(topic)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="news-coverage-comments" className="block text-sm font-semibold text-white mb-2">
                      Any other thoughts on what news coverage should look like?
                    </label>
                    <textarea
                      id="news-coverage-comments"
                      name="news-coverage-comments"
                      rows={2}
                      placeholder="e.g. Daily digest format would be useful, or real-time alerts for major changes..."
                      className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* IMPROVEMENTS & FUTURE FEATURES */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-2">Improvements & Future Features</h2>
              <p className="text-sm text-gray-400 mb-6">Tell us what you'd like to see next</p>

              <div className="mb-6">
                <label htmlFor="most-valuable-feature" className="block text-sm font-semibold text-white mb-2">
                  What's the single most valuable feature of XHS monitoring for you?
                </label>
                <textarea
                  id="most-valuable-feature"
                  name="most-valuable-feature"
                  rows={2}
                  placeholder="e.g. The jurisdiction-level filtering saves me hours each week..."
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="what-would-change" className="block text-sm font-semibold text-white mb-2">
                  If you could change one thing about the platform, what would it be?
                </label>
                <textarea
                  id="what-would-change"
                  name="what-would-change"
                  rows={2}
                  placeholder="e.g. Better notification filtering so I only see changes relevant to my jurisdictions..."
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Which features would you most like to see added? <span className="text-gray-400 font-normal text-xs">(Select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {desiredFeatureOptions.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleSelection(feature, selectedDesiredFeatures, setSelectedDesiredFeatures)}
                      className={`px-4 py-2.5 rounded-full text-sm transition-all min-h-[44px] flex items-center ${
                        selectedDesiredFeatures.includes(feature)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="other-feature-suggestions" className="block text-sm font-semibold text-white mb-2">
                  Any other feature ideas or suggestions?
                </label>
                <textarea
                  id="other-feature-suggestions"
                  name="other-feature-suggestions"
                  rows={2}
                  placeholder="We'd love to hear any ideas you have..."
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>

              <div>
                <label htmlFor="additional-comments" className="block text-sm font-semibold text-white mb-2">
                  Anything else you'd like to share?
                </label>
                <textarea
                  id="additional-comments"
                  name="additional-comments"
                  rows={3}
                  placeholder="Any additional feedback, comments, or suggestions..."
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>
            </div>

            {/* NPS SCORE */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-2">Recommendation</h2>
              <p className="text-sm text-gray-400 mb-6">One last question</p>

              <div>
                <label className="block text-sm font-semibold text-white mb-4">
                  How likely are you to recommend XHS monitoring to a colleague? <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setNpsScore(score)}
                      className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all flex items-center justify-center ${
                        npsScore === score
                          ? score <= 6
                            ? 'bg-red-600 text-white'
                            : score <= 8
                            ? 'bg-yellow-600 text-white'
                            : 'bg-green-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 px-1">
                  <span>Not at all likely</span>
                  <span>Extremely likely</span>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="flex gap-x-4">
              <div className="flex h-6 items-center">
                <input
                  id="privacy-policy"
                  name="privacy-policy"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="privacy-policy" className="font-medium text-white">
                  I agree to the <a href="/privacy" className="text-blue-400 hover:text-blue-300">privacy policy</a> <span className="text-red-400">*</span>
                </label>
              </div>
            </div>

            <div className="flex gap-x-4">
              <div className="flex h-6 items-center">
                <input
                  id="marketing-consent"
                  name="marketing-consent"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="marketing-consent" className="text-gray-300">
                  I would like to receive marketing communications about Pimlico XHS products and services
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="flex-1 rounded-md bg-blue-600 px-3.5 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
