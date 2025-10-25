"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([]);
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');
  const [topicSearch, setTopicSearch] = useState('');
  const [showJurisdictionDropdown, setShowJurisdictionDropdown] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [usingCompetitors, setUsingCompetitors] = useState('');
  const router = useRouter();

  const jurisdictionDropdownRef = useRef(null);
  const topicDropdownRef = useRef(null);

  // All available jurisdictions (90+)
  const allJurisdictions = [
    'European Union', 'United Kingdom', 'United States', 'Canada',
    'Australia', 'Singapore', 'Hong Kong', 'Japan',
    'South Korea', 'China', 'India', 'UAE',
    'Brazil', 'Mexico', 'Switzerland', 'Norway', 'Iceland',
    'Germany', 'France', 'Italy', 'Spain', 'Netherlands',
    'Belgium', 'Sweden', 'Denmark', 'Finland', 'Ireland', 'Other'
  ];

  // Focus areas - AI, Payments, Gambling
  const focusAreas = ['AI', 'Payments', 'Gambling'];

  // Regulatory topics aligned with site categories - improved clarity
  const regulatoryTopics = {
    AI: [
      'EU AI Act Compliance', 'AI Governance Frameworks', 'Algorithmic Transparency Requirements',
      'High-Risk AI Systems Classification', 'AI Safety Testing & Validation', 'Foundation Model Regulations',
      'General Purpose AI Oversight', 'AI System Licensing & Registration', 'AI Impact Assessments',
      'Automated Decision-Making Rules', 'AI in Healthcare Regulation', 'AI in Financial Services',
      'Generative AI Content Rules', 'AI Copyright & Intellectual Property', 'AI Data Protection & Privacy'
    ],
    Payments: [
      'PSD3 & Payment Services Regulation', 'Open Banking & API Standards', 'Crypto Asset Regulations',
      'Stablecoin Requirements', 'MiCA Compliance', 'AML & Counter-Terrorist Financing',
      'Consumer Protection in Payments', 'Strong Customer Authentication (SCA)', 
      'Payment Institution Licensing', 'E-Money Directive Compliance',
      'Cross-Border Payment Rules', 'Payment Security Standards', 'Buy Now Pay Later Regulation',
      'Interchange Fee Regulation', 'Payment Innovation Frameworks'
    ],
    Gambling: [
      'Online Gambling Licensing Requirements', 'Responsible Gambling Obligations', 'AML for Gambling Operators',
      'Gambling Advertising & Marketing Restrictions', 'Player Protection Measures', 'Age Verification Systems',
      'Gambling Taxes & Regulatory Levies', 'Sports Betting Regulations',
      'Casino & iGaming Compliance', 'Lottery & Gaming Licenses', 'Safer Gambling Tools',
      'Problem Gambling Prevention Programs', 'Gambling Technology Standards'
    ]
  };

  // Compliance challenges
  const complianceChallenges = [
    'Keeping up with regulatory changes',
    'Multi-jurisdiction compliance',
    'Resource constraints',
    'Lack of regulatory visibility',
    'Manual monitoring processes',
    'Siloed information across teams',
    'Interpreting complex regulations',
    'Compliance reporting',
    'Risk assessment',
    'Regulatory horizon scanning'
  ];

  // Horizon scanning vendors
  const competitorVendors = [
    'Thomson Reuters Regulatory Intelligence',
    'LexisNexis Regulatory Tracker',
    'Bloomberg Regulatory & Compliance',
    'Compliance.ai',
    'RegTech Associates',
    'Corlytics',
    'Ascent RegTech',
    'Fenergo',
    'ComplyAdvantage',
    'Other'
  ];

  // Productivity, communication, and GRC apps
  const productivityApps = [
    'Google Workspace',
    'Microsoft Teams', 
    'Slack',
    'Asana',
    'Hubspot',
    'OneTrust (GRC)',
    'MetricStream (GRC)',
    'LogicManager (GRC)',
    'ServiceNow (GRC)',
    'Archer (RSA)',
    'iManage',
    'NetDocuments',
    'Workday',
    'Salesforce',
    'Other'
  ];

  // Filter jurisdictions based on search
  const filteredJurisdictions = allJurisdictions.filter(j =>
    j.toLowerCase().includes(jurisdictionSearch.toLowerCase()) &&
    !selectedJurisdictions.includes(j)
  );

  // Get available topics based on selected focus areas (combine all selected)
  const availableTopics = selectedFocusAreas.length > 0 
    ? selectedFocusAreas.flatMap(area => regulatoryTopics[area] || [])
    : [];
  const filteredTopics = availableTopics.filter(t =>
    t.toLowerCase().includes(topicSearch.toLowerCase()) &&
    !selectedTopics.includes(t)
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jurisdictionDropdownRef.current && !jurisdictionDropdownRef.current.contains(event.target)) {
        setShowJurisdictionDropdown(false);
      }
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(event.target)) {
        setShowTopicDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleJurisdictionAdd = (jurisdiction) => {
    if (selectedJurisdictions.length < 5) {
      setSelectedJurisdictions([...selectedJurisdictions, jurisdiction]);
      setJurisdictionSearch('');
    }
  };

  const handleJurisdictionRemove = (jurisdiction) => {
    setSelectedJurisdictions(selectedJurisdictions.filter(j => j !== jurisdiction));
  };

  const handleTopicAdd = (topic) => {
    if (selectedTopics.length < 5) {
      setSelectedTopics([...selectedTopics, topic]);
      setTopicSearch('');
    }
  };

  const handleTopicRemove = (topic) => {
    setSelectedTopics(selectedTopics.filter(t => t !== topic));
  };

  const toggleChallenge = (challenge) => {
    if (selectedChallenges.includes(challenge)) {
      setSelectedChallenges(selectedChallenges.filter(c => c !== challenge));
    } else {
      setSelectedChallenges([...selectedChallenges, challenge]);
    }
  };

  const toggleIntegration = (integration) => {
    if (selectedIntegrations.includes(integration)) {
      setSelectedIntegrations(selectedIntegrations.filter(i => i !== integration));
    } else {
      setSelectedIntegrations([...selectedIntegrations, integration]);
    }
  };

  const toggleFocusArea = (area) => {
    if (selectedFocusAreas.includes(area)) {
      setSelectedFocusAreas(selectedFocusAreas.filter(a => a !== area));
      // Remove topics from deselected area
      const topicsToRemove = regulatoryTopics[area] || [];
      setSelectedTopics(selectedTopics.filter(t => !topicsToRemove.includes(t)));
    } else {
      setSelectedFocusAreas([...selectedFocusAreas, area]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      topJurisdictions: selectedJurisdictions,
      focusAreas: selectedFocusAreas,
      topTopics: selectedTopics,
      role: formData.get('role'),
      companySize: formData.get('company-size'),
      challenges: selectedChallenges,
      timeline: formData.get('timeline'),
      usingCompetitors: formData.get('using-competitors'),
      competitorVendors: formData.get('competitor-vendors') ? [formData.get('competitor-vendors')] : [],
      hasSharedWorkspace: formData.get('shared-workspace'),
      interestedInXHS: formData.get('interested-xhs'),
      productivityApps: selectedIntegrations,
      additionalInfo: formData.get('additional-info')
    };

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      router.push('/?survey=complete');
    } catch (error) {
      console.error('Survey submission error:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your survey. Please try again.');
    }
  };

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

      {/* Survey Form */}
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12 pt-12">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
              Tell us about your needs
            </h1>
            <p className="text-sm text-blue-400 font-medium">
              ⏱️ Takes 2 minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top 5 Jurisdictions - Searchable dropdown with chips */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">
                Top 5 jurisdictions you're monitoring <span className="text-red-400">*</span>
              </h2>
              <p className="text-sm text-gray-400 mb-4">Type to search and select up to 5 jurisdictions</p>
              
              <div ref={jurisdictionDropdownRef} className="relative">
                <input
                  type="text"
                  value={jurisdictionSearch}
                  onChange={(e) => {
                    setJurisdictionSearch(e.target.value);
                    setShowJurisdictionDropdown(true);
                  }}
                  onFocus={() => setShowJurisdictionDropdown(true)}
                  placeholder="Search jurisdictions..."
                  disabled={selectedJurisdictions.length >= 5}
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 disabled:opacity-50"
                />
                
                {/* Dropdown */}
                {showJurisdictionDropdown && filteredJurisdictions.length > 0 && selectedJurisdictions.length < 5 && (
                  <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredJurisdictions.map((jurisdiction) => (
                      <button
                        key={jurisdiction}
                        type="button"
                        onClick={() => handleJurisdictionAdd(jurisdiction)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {jurisdiction}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedJurisdictions.map((jurisdiction, index) => (
                  <span
                    key={jurisdiction}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                  >
                    <span className="font-medium">{index + 1}.</span>
                    {jurisdiction}
                    <button
                      type="button"
                      onClick={() => handleJurisdictionRemove(jurisdiction)}
                      className="hover:text-gray-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {selectedJurisdictions.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">Please select at least one jurisdiction</p>
              )}
            </div>

            {/* Focus Areas - AI, Payments, Gambling - Multi-select */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-xl font-semibold text-white mb-2">
                Primary focus areas <span className="text-red-400">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
              <div className="grid grid-cols-3 gap-3">
                {focusAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      selectedFocusAreas.includes(area)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Top 5 Regulatory Topics - Conditional on focus areas */}
            {selectedFocusAreas.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Top 5 regulatory topics in {selectedFocusAreas.join(', ')} <span className="text-red-400">*</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">Rank your top 5 priorities</p>
                
                <div ref={topicDropdownRef} className="relative">
                  <input
                    type="text"
                    value={topicSearch}
                    onChange={(e) => {
                      setTopicSearch(e.target.value);
                      setShowTopicDropdown(true);
                    }}
                    onFocus={() => setShowTopicDropdown(true)}
                    placeholder="Search topics..."
                    disabled={selectedTopics.length >= 5}
                    className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 disabled:opacity-50"
                  />
                  
                  {/* Dropdown */}
                  {showTopicDropdown && filteredTopics.length > 0 && selectedTopics.length < 5 && (
                    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredTopics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicAdd(topic)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected chips with ranking */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedTopics.map((topic, index) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                    >
                      <span className="font-medium">{index + 1}.</span>
                      {topic}
                      <button
                        type="button"
                        onClick={() => handleTopicRemove(topic)}
                        className="hover:text-gray-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Role */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="role" className="block text-xl font-semibold text-white mb-4">
                Your role <span className="text-red-400">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              >
                <option value="" className="bg-gray-800">Select your role...</option>
                <option value="Chief Compliance Officer" className="bg-gray-800">Chief Compliance Officer</option>
                <option value="Compliance Manager/Director" className="bg-gray-800">Compliance Manager/Director</option>
                <option value="Legal Counsel/General Counsel" className="bg-gray-800">Legal Counsel/General Counsel</option>
                <option value="Risk Manager" className="bg-gray-800">Risk Manager</option>
                <option value="Regulatory Affairs" className="bg-gray-800">Regulatory Affairs</option>
                <option value="Policy Manager" className="bg-gray-800">Policy Manager</option>
                <option value="C-Suite Executive" className="bg-gray-800">C-Suite Executive</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            {/* Company Size */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="company-size" className="block text-xl font-semibold text-white mb-4">
                Company size <span className="text-red-400">*</span>
              </label>
              <select
                id="company-size"
                name="company-size"
                required
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              >
                <option value="" className="bg-gray-800">Select company size...</option>
                <option value="1-10" className="bg-gray-800">1-10 employees</option>
                <option value="11-50" className="bg-gray-800">11-50 employees</option>
                <option value="51-200" className="bg-gray-800">51-200 employees</option>
                <option value="201-500" className="bg-gray-800">201-500 employees</option>
                <option value="501-1000" className="bg-gray-800">501-1,000 employees</option>
                <option value="1001-5000" className="bg-gray-800">1,001-5,000 employees</option>
                <option value="5001+" className="bg-gray-800">5,001+ employees</option>
              </select>
            </div>

            {/* Compliance Challenges - Multi-select chips */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                Current compliance challenges
              </h2>
              <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {complianceChallenges.map((challenge) => (
                  <button
                    key={challenge}
                    type="button"
                    onClick={() => toggleChallenge(challenge)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedChallenges.includes(challenge)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {challenge}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="timeline" className="block text-xl font-semibold text-white mb-4">
                Implementation timeline <span className="text-red-400">*</span>
              </label>
              <select
                id="timeline"
                name="timeline"
                required
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              >
                <option value="" className="bg-gray-800">Select timeline...</option>
                <option value="Immediate (within 1 month)" className="bg-gray-800">Immediate (within 1 month)</option>
                <option value="Short-term (1-3 months)" className="bg-gray-800">Short-term (1-3 months)</option>
                <option value="Medium-term (3-6 months)" className="bg-gray-800">Medium-term (3-6 months)</option>
                <option value="Long-term (6-12 months)" className="bg-gray-800">Long-term (6-12 months)</option>
                <option value="Exploring options (12+ months)" className="bg-gray-800">Exploring options (12+ months)</option>
              </select>
            </div>

            {/* Using Competitors */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-xl font-semibold text-white mb-4">
                Are you purchasing from other horizon scanning or regulatory monitoring vendors? <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="using-competitors"
                    value="Yes"
                    required
                    onChange={(e) => setUsingCompetitors(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-gray-300">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="using-competitors"
                    value="No"
                    onChange={(e) => setUsingCompetitors(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-gray-300">No</span>
                </label>
              </div>
              
              {/* Conditional dropdown for vendor selection */}
              {usingCompetitors === 'Yes' && (
                <div className="mt-4">
                  <label htmlFor="competitor-vendors" className="block text-sm font-medium text-gray-300 mb-2">
                    Which vendor(s)?
                  </label>
                  <select
                    id="competitor-vendors"
                    name="competitor-vendors"
                    className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                  >
                    <option value="" className="bg-gray-800">Select vendor...</option>
                    {competitorVendors.map((vendor) => (
                      <option key={vendor} value={vendor} className="bg-gray-800">{vendor}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Shared Workspace Questions */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
              <div>
                <label className="block text-xl font-semibold text-white mb-4">
                  Does your team collaborate in a shared regulatory workspace? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shared-workspace"
                      value="Yes"
                      required
                      className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shared-workspace"
                      value="No"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-gray-300">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xl font-semibold text-white mb-4">
                  Are you interested in exploring XHS™ workspace functionalities? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interested-xhs"
                      value="Yes"
                      required
                      className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interested-xhs"
                      value="No"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-gray-300">No</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interested-xhs"
                      value="Maybe"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-gray-300">Maybe</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Productivity and GRC Apps - Multi-select chips */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                What productivity and communication apps does your team use?
              </h2>
              <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {productivityApps.map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => toggleIntegration(app)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedIntegrations.includes(app)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Information - Optional */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="additional-info" className="block text-xl font-semibold text-white mb-4">
                Anything else you'd like us to know?
              </label>
              <textarea
                id="additional-info"
                name="additional-info"
                rows={3}
                placeholder="Optional: Share any additional context that might help us..."
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || selectedJurisdictions.length === 0 || selectedFocusAreas.length === 0 || selectedTopics.length === 0}
                className="flex-1 rounded-md bg-blue-600 px-3.5 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
              <a
                href="/"
                className="px-6 py-3 text-sm font-semibold text-gray-400 hover:text-white"
              >
                Skip for now
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
