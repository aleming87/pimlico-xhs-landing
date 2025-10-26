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
  const [selectedProductivityApps, setSelectedProductivityApps] = useState([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');
  const [productivitySearch, setProductivitySearch] = useState('');
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showJurisdictionDropdown, setShowJurisdictionDropdown] = useState(false);
  const [showProductivityDropdown, setShowProductivityDropdown] = useState(false);
  const [usingCompetitors, setUsingCompetitors] = useState('');
  const router = useRouter();

  const topicDropdownRef = useRef(null);
  const jurisdictionDropdownRef = useRef(null);
  const productivityDropdownRef = useRef(null);

  // All available jurisdictions - comprehensive alphabetical list
  const allJurisdictions = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'European Union',
    'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hong Kong', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar',
    'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen',
    'Zambia', 'Zimbabwe'
  ];

  // Focus areas - AI, Payments, Gambling
  const focusAreas = ['AI', 'Payments', 'Gambling'];

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

  // Regulatory topics aligned with site categories - improved clarity
  const regulatoryTopics = {
    AI: [
      'AI Copyright & Intellectual Property', 'AI Data Protection & Privacy', 'AI Governance Frameworks', 
      'AI Impact Assessments', 'AI in Financial Services', 'AI in Healthcare Regulation', 
      'AI Safety Testing & Validation', 'AI System Licensing & Registration', 
      'Algorithmic Transparency Requirements', 'Automated Decision-Making Rules', 
      'EU AI Act Compliance', 'Foundation Model Regulations', 
      'General Purpose AI Oversight', 'Generative AI Content Rules', 
      'High-Risk AI Systems Classification'
    ],
    Payments: [
      'AML & Counter-Terrorist Financing', 'Buy Now Pay Later Regulation', 
      'Consumer Protection in Payments', 'Cross-Border Payment Rules', 
      'Crypto Asset Regulations', 'E-Money Directive Compliance', 
      'Interchange Fee Regulation', 'MiCA Compliance', 
      'Open Banking & API Standards', 'Payment Innovation Frameworks', 
      'Payment Institution Licensing', 'Payment Security Standards', 
      'PSD3 & Payment Services Regulation', 'Stablecoin Requirements', 
      'Strong Customer Authentication (SCA)'
    ],
    Gambling: [
      'Age Verification Systems', 'AML for Gambling Operators', 
      'Casino & iGaming Compliance', 'Gambling Advertising & Marketing Restrictions', 
      'Gambling Taxes & Regulatory Levies', 'Gambling Technology Standards', 
      'Lottery & Gaming Licenses', 'Online Gambling Licensing Requirements', 
      'Player Protection Measures', 'Problem Gambling Prevention Programs', 
      'Responsible Gambling Obligations', 'Safer Gambling Tools', 
      'Sports Betting Regulations'
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

  // Filter jurisdictions based on search
  const filteredJurisdictions = allJurisdictions.filter(j =>
    j.toLowerCase().includes(jurisdictionSearch.toLowerCase()) &&
    !selectedJurisdictions.includes(j)
  );

  // Filter productivity apps based on search
  const filteredProductivityApps = productivityApps.filter(app =>
    app.toLowerCase().includes(productivitySearch.toLowerCase()) &&
    !selectedProductivityApps.includes(app)
  );

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
      if (jurisdictionDropdownRef.current && !jurisdictionDropdownRef.current.contains(event.target)) {
        setShowJurisdictionDropdown(false);
      }
      if (productivityDropdownRef.current && !productivityDropdownRef.current.contains(event.target)) {
        setShowProductivityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleJurisdictionAdd = (jurisdiction) => {
    if (selectedJurisdictions.length < 3) {
      setSelectedJurisdictions([...selectedJurisdictions, jurisdiction]);
      setJurisdictionSearch('');
    }
  };

  const handleJurisdictionRemove = (jurisdiction) => {
    setSelectedJurisdictions(selectedJurisdictions.filter(j => j !== jurisdiction));
  };

  const handleProductivityAppAdd = (app) => {
    setSelectedProductivityApps([...selectedProductivityApps, app]);
    setProductivitySearch('');
  };

  const handleProductivityAppRemove = (app) => {
    setSelectedProductivityApps(selectedProductivityApps.filter(a => a !== app));
  };

  const handleTopicAdd = (topic) => {
    if (selectedTopics.length < 3) {
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
      competitorVendors: formData.get('competitor-vendors') || '',
      productivityApps: selectedProductivityApps
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
              ⏱️ Takes 2 minutes
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

            {/* Top 3 Regulatory Topics - Conditional on focus areas */}
            {selectedFocusAreas.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Top 3 regulatory topics in {selectedFocusAreas.join(', ')}
                </h2>
                <p className="text-sm text-gray-400 mb-4">Rank your top 3 priorities</p>
                
                <div ref={topicDropdownRef} className="relative">
                  <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[42px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                    <div className="flex flex-wrap gap-2 items-center">
                      {/* Selected chips inside input */}
                      {selectedTopics.map((topic, index) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-sm text-white"
                        >
                          <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{index + 1}.</span>
                          {topic}
                          <button
                            type="button"
                            onClick={() => handleTopicRemove(topic)}
                            className="hover:text-gray-200 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Input field */}
                      {selectedTopics.length < 3 && (
                        <input
                          type="text"
                          value={topicSearch}
                          onChange={(e) => {
                            setTopicSearch(e.target.value);
                            setShowTopicDropdown(true);
                          }}
                          onFocus={() => setShowTopicDropdown(true)}
                          placeholder={selectedTopics.length === 0 ? "Search topics..." : ""}
                          className="flex-1 min-w-[120px] bg-transparent border-none text-base text-white placeholder:text-gray-500 focus:outline-none"
                          autoComplete="on"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Dropdown */}
                  {showTopicDropdown && filteredTopics.length > 0 && selectedTopics.length < 3 && (
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
              </div>
            )}

            {/* Top 3 Jurisdictions - Searchable with inline chips */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">
                Top 3 jurisdictions you're monitoring <span className="text-red-400">*</span>
              </h2>
              <p className="text-sm text-gray-400 mb-4">Type to search and select up to 3 jurisdictions</p>
              
              <div ref={jurisdictionDropdownRef} className="relative">
                <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[42px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Selected chips inside input */}
                    {selectedJurisdictions.map((jurisdiction, index) => (
                      <span
                        key={jurisdiction}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-sm text-white"
                      >
                        <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{index + 1}.</span>
                        {jurisdiction}
                        <button
                          type="button"
                          onClick={() => handleJurisdictionRemove(jurisdiction)}
                          className="hover:text-gray-200 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {/* Input field */}
                    {selectedJurisdictions.length < 3 && (
                      <input
                        type="text"
                        value={jurisdictionSearch}
                        onChange={(e) => {
                          setJurisdictionSearch(e.target.value);
                          setShowJurisdictionDropdown(true);
                        }}
                        onFocus={() => setShowJurisdictionDropdown(true)}
                        placeholder={selectedJurisdictions.length === 0 ? "Search jurisdictions..." : ""}
                        className="flex-1 min-w-[120px] bg-transparent border-none text-base text-white placeholder:text-gray-500 focus:outline-none"
                        autoComplete="on"
                      />
                    )}
                  </div>
                </div>
                
                {/* Dropdown */}
                {showJurisdictionDropdown && filteredJurisdictions.length > 0 && selectedJurisdictions.length < 3 && (
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

              {selectedJurisdictions.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">Please select at least one jurisdiction</p>
              )}
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

            {/* What brings you here today - More neutral question */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="timeline" className="block text-xl font-semibold text-white mb-4">
                What brings you here today? <span className="text-red-400">*</span>
              </label>
              <select
                id="timeline"
                name="timeline"
                required
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                autoComplete="on"
              >
                <option value="" className="bg-gray-800">Select one...</option>
                <option value="Immediate compliance need" className="bg-gray-800">Immediate compliance need</option>
                <option value="Planning for upcoming requirements" className="bg-gray-800">Planning for upcoming requirements</option>
                <option value="Evaluating monitoring solutions" className="bg-gray-800">Evaluating monitoring solutions</option>
                <option value="Looking to improve current processes" className="bg-gray-800">Looking to improve current processes</option>
                <option value="Just exploring options" className="bg-gray-800">Just exploring options</option>
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
                    autoComplete="on"
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

            {/* Productivity and Communication Apps - Searchable with inline chips */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">
                What productivity and communication apps do you or your team use?
              </h2>
              <p className="text-sm text-gray-400 mb-4">Type to search and select</p>
              
              <div ref={productivityDropdownRef} className="relative">
                <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[42px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Selected chips inside input */}
                    {selectedProductivityApps.map((app) => (
                      <span
                        key={app}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-sm text-white"
                      >
                        <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        {app}
                        <button
                          type="button"
                          onClick={() => handleProductivityAppRemove(app)}
                          className="hover:text-gray-200 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {/* Input field */}
                    <input
                      type="text"
                      value={productivitySearch}
                      onChange={(e) => {
                        setProductivitySearch(e.target.value);
                        setShowProductivityDropdown(true);
                      }}
                      onFocus={() => setShowProductivityDropdown(true)}
                      placeholder={selectedProductivityApps.length === 0 ? "Search apps..." : ""}
                      className="flex-1 min-w-[120px] bg-transparent border-none text-base text-white placeholder:text-gray-500 focus:outline-none"
                      autoComplete="on"
                    />
                  </div>
                </div>
                
                {/* Dropdown */}
                {showProductivityDropdown && filteredProductivityApps.length > 0 && (
                  <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredProductivityApps.map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => handleProductivityAppAdd(app)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                )}
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
