"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [usingCompetitors, setUsingCompetitors] = useState('');
  const router = useRouter();

  const topicDropdownRef = useRef(null);

  // Top 5 jurisdictions as radio chips
  const topJurisdictions = [
    'European Union',
    'United Kingdom', 
    'United States',
    'Canada',
    'Australia'
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

  // Compliance challenges - reduced list
  const complianceChallenges = [
    'Keeping up with regulatory changes',
    'Multi-jurisdiction compliance',
    'Resource constraints',
    'Lack of regulatory visibility',
    'Manual monitoring processes',
    'Siloed information across teams'
  ];

  // Simplified workspace options
  const workspaceOptions = ['Yes', 'No', 'Not sure'];

  // Get available topics based on selected focus areas (combine all selected)
  const availableTopics = selectedFocusAreas.length > 0 
    ? selectedFocusAreas.flatMap(area => regulatoryTopics[area] || [])
    : [];
  const filteredTopics = availableTopics.filter(t =>
    t.toLowerCase().includes(topicSearch.toLowerCase()) &&
    !selectedTopics.includes(t)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(event.target)) {
        setShowTopicDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleJurisdiction = (jurisdiction) => {
    if (selectedJurisdictions.includes(jurisdiction)) {
      setSelectedJurisdictions(selectedJurisdictions.filter(j => j !== jurisdiction));
    } else {
      if (selectedJurisdictions.length < 5) {
        setSelectedJurisdictions([...selectedJurisdictions, jurisdiction]);
      }
    }
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
      focusAreas: selectedFocusAreas,
      topJurisdictions: selectedJurisdictions,
      topTopics: selectedTopics,
      challenges: selectedChallenges,
      timeline: formData.get('timeline'),
      hasSharedWorkspace: formData.get('shared-workspace'),
      usingCompetitors: formData.get('using-competitors'),
      competitorVendors: formData.get('competitor-vendors') || ''
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

      // Mark survey as completed in localStorage
      localStorage.setItem('surveyCompleted', 'true');
      
      // Redirect back to thank you page
      router.push('/contact/thank-you');
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
              ⏱️ Takes 1 minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Primary Focus Areas - AI, Payments, Gambling */}
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

            {/* Top 5 Jurisdictions - Radio chips */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">
                Top 5 jurisdictions you're monitoring <span className="text-red-400">*</span>
              </h2>
              <p className="text-sm text-gray-400 mb-4">Select up to 5</p>
              
              <div className="flex flex-wrap gap-3">
                {topJurisdictions.map((jurisdiction) => (
                  <button
                    key={jurisdiction}
                    type="button"
                    onClick={() => toggleJurisdiction(jurisdiction)}
                    className={`py-2 px-4 rounded-full text-sm transition-all ${
                      selectedJurisdictions.includes(jurisdiction)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {jurisdiction}
                  </button>
                ))}
              </div>
              {selectedJurisdictions.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">Please select at least one jurisdiction</p>
              )}
            </div>

            {/* Top 5 Regulatory Topics - Conditional on focus areas */}
            {selectedFocusAreas.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Top 5 regulatory topics in {selectedFocusAreas.join(', ')}
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

            {/* When do you need our services */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="timeline" className="block text-xl font-semibold text-white mb-4">
                When do you need our services? <span className="text-red-400">*</span>
              </label>
              <select
                id="timeline"
                name="timeline"
                required
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              >
                <option value="" className="bg-gray-800">Select timeframe...</option>
                <option value="Now" className="bg-gray-800">Now</option>
                <option value="Next 1-3 months" className="bg-gray-800">Next 1-3 months</option>
                <option value="Next 3-6 months" className="bg-gray-800">Next 3-6 months</option>
                <option value="Next 6-12 months" className="bg-gray-800">Next 6-12 months</option>
                <option value="Just exploring" className="bg-gray-800">Just exploring</option>
              </select>
            </div>

            {/* Using Competitors - No suggestions */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-xl font-semibold text-white mb-4">
                Are you using other regulatory monitoring vendors? <span className="text-red-400">*</span>
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
              
              {/* Conditional text box for vendor names */}
              {usingCompetitors === 'Yes' && (
                <div className="mt-4">
                  <label htmlFor="competitor-vendors" className="block text-sm font-medium text-gray-300 mb-2">
                    Which vendor(s)?
                  </label>
                  <input
                    type="text"
                    id="competitor-vendors"
                    name="competitor-vendors"
                    placeholder="Enter vendor name(s)"
                    className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white placeholder-gray-500 outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Shared Workspace - Simplified */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-xl font-semibold text-white mb-4">
                Does your team collaborate in a shared regulatory workspace? <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-4">
                {workspaceOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shared-workspace"
                      value={option}
                      required
                      className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || selectedJurisdictions.length === 0 || selectedFocusAreas.length === 0}
                className="flex-1 rounded-md bg-blue-600 px-3.5 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
