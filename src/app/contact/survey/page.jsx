"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
  // Separate topic selections for each focus area
  const [selectedTopicsAI, setSelectedTopicsAI] = useState([]);
  const [selectedTopicsPayments, setSelectedTopicsPayments] = useState([]);
  const [selectedTopicsGambling, setSelectedTopicsGambling] = useState([]);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([]);
  const [selectedProductivityApps, setSelectedProductivityApps] = useState([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  // Separate search states for each focus area
  const [topicSearchAI, setTopicSearchAI] = useState('');
  const [topicSearchPayments, setTopicSearchPayments] = useState('');
  const [topicSearchGambling, setTopicSearchGambling] = useState('');
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');
  const [productivitySearch, setProductivitySearch] = useState('');
  const [competitorSearch, setCompetitorSearch] = useState('');
  // Separate dropdown states for each focus area
  const [showTopicDropdownAI, setShowTopicDropdownAI] = useState(false);
  const [showTopicDropdownPayments, setShowTopicDropdownPayments] = useState(false);
  const [showTopicDropdownGambling, setShowTopicDropdownGambling] = useState(false);
  const [showJurisdictionDropdown, setShowJurisdictionDropdown] = useState(false);
  const [showProductivityDropdown, setShowProductivityDropdown] = useState(false);
  const [showCompetitorDropdown, setShowCompetitorDropdown] = useState(false);
  const [usingCompetitors, setUsingCompetitors] = useState('');
  const router = useRouter();

  // Separate refs for each focus area
  const topicDropdownRefAI = useRef(null);
  const topicDropdownRefPayments = useRef(null);
  const topicDropdownRefGambling = useRef(null);
  const jurisdictionDropdownRef = useRef(null);
  const productivityDropdownRef = useRef(null);
  const competitorDropdownRef = useRef(null);

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

  // Competitor vendors - specific to each focus area
  const competitorVendors = {
    AI: [
      'LexisNexis',
      'Thomson Reuters',
      'Vixio',
      'Qube',
      'Other'
    ],
    Payments: [
      'LexisNexis',
      'Thomson Reuters',
      'Vixio',
      'Regology',
      'Other'
    ],
    Gambling: [
      'LexisNexis',
      'Thomson Reuters',
      'Vixio',
      'Regology',
      'Other'
    ]
  };

  // Single vendor list for all focus areas
  const allCompetitorVendors = [
    'LexisNexis',
    'Thomson Reuters',
    'Vixio',
    'Qube',
    'Regology',
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

  // Filter competitors - using single vendor list
  const filteredCompetitors = allCompetitorVendors.filter(vendor =>
    vendor.toLowerCase().includes(competitorSearch.toLowerCase()) &&
    !selectedCompetitors.includes(vendor)
  );

  // Filter topics for each focus area separately
  const filteredTopicsAI = regulatoryTopics.AI.filter(t =>
    t.toLowerCase().includes(topicSearchAI.toLowerCase()) &&
    !selectedTopicsAI.includes(t)
  );

  const filteredTopicsPayments = regulatoryTopics.Payments.filter(t =>
    t.toLowerCase().includes(topicSearchPayments.toLowerCase()) &&
    !selectedTopicsPayments.includes(t)
  );

  const filteredTopicsGambling = regulatoryTopics.Gambling.filter(t =>
    t.toLowerCase().includes(topicSearchGambling.toLowerCase()) &&
    !selectedTopicsGambling.includes(t)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (topicDropdownRefAI.current && !topicDropdownRefAI.current.contains(event.target)) {
        setShowTopicDropdownAI(false);
      }
      if (topicDropdownRefPayments.current && !topicDropdownRefPayments.current.contains(event.target)) {
        setShowTopicDropdownPayments(false);
      }
      if (topicDropdownRefGambling.current && !topicDropdownRefGambling.current.contains(event.target)) {
        setShowTopicDropdownGambling(false);
      }
      if (jurisdictionDropdownRef.current && !jurisdictionDropdownRef.current.contains(event.target)) {
        setShowJurisdictionDropdown(false);
      }
      if (productivityDropdownRef.current && !productivityDropdownRef.current.contains(event.target)) {
        setShowProductivityDropdown(false);
      }
      if (competitorDropdownRef.current && !competitorDropdownRef.current.contains(event.target)) {
        setShowCompetitorDropdown(false);
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

  const handleProductivityAppAdd = (app) => {
    setSelectedProductivityApps([...selectedProductivityApps, app]);
    setProductivitySearch('');
  };

  const handleProductivityAppRemove = (app) => {
    setSelectedProductivityApps(selectedProductivityApps.filter(a => a !== app));
  };

  const handleCompetitorAdd = (vendor) => {
    setSelectedCompetitors([...selectedCompetitors, vendor]);
    setCompetitorSearch('');
  };

  const handleCompetitorRemove = (vendor) => {
    setSelectedCompetitors(selectedCompetitors.filter(v => v !== vendor));
  };

  // Handlers for AI topics
  const handleTopicAddAI = (topic) => {
    if (selectedTopicsAI.length < 3) {
      setSelectedTopicsAI([...selectedTopicsAI, topic]);
      setTopicSearchAI('');
    }
  };

  const handleTopicRemoveAI = (topic) => {
    setSelectedTopicsAI(selectedTopicsAI.filter(t => t !== topic));
  };

  // Handlers for Payments topics
  const handleTopicAddPayments = (topic) => {
    if (selectedTopicsPayments.length < 3) {
      setSelectedTopicsPayments([...selectedTopicsPayments, topic]);
      setTopicSearchPayments('');
    }
  };

  const handleTopicRemovePayments = (topic) => {
    setSelectedTopicsPayments(selectedTopicsPayments.filter(t => t !== topic));
  };

  // Handlers for Gambling topics
  const handleTopicAddGambling = (topic) => {
    if (selectedTopicsGambling.length < 3) {
      setSelectedTopicsGambling([...selectedTopicsGambling, topic]);
      setTopicSearchGambling('');
    }
  };

  const handleTopicRemoveGambling = (topic) => {
    setSelectedTopicsGambling(selectedTopicsGambling.filter(t => t !== topic));
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
      // Clear topics for the deselected area
      if (area === 'AI') setSelectedTopicsAI([]);
      if (area === 'Payments') setSelectedTopicsPayments([]);
      if (area === 'Gambling') setSelectedTopicsGambling([]);
    } else {
      setSelectedFocusAreas([...selectedFocusAreas, area]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    
    // Combine all selected topics from all focus areas
    const allSelectedTopics = [
      ...selectedTopicsAI,
      ...selectedTopicsPayments,
      ...selectedTopicsGambling
    ];
    
    // Get contact data from localStorage
    const contactDataStr = localStorage.getItem('contactFormData');
    const contactData = contactDataStr ? JSON.parse(contactDataStr) : null;
    
    const data = {
      // Include contact form data for combined email
      contactData: contactData,
      // Survey data
      focusAreas: selectedFocusAreas,
      topJurisdictions: selectedJurisdictions,
      topTopics: allSelectedTopics,
      topTopicsAI: selectedTopicsAI,
      topTopicsPayments: selectedTopicsPayments,
      topTopicsGambling: selectedTopicsGambling,
      challenges: selectedChallenges,
      timeline: formData.get('timeline'),
      hasSharedWorkspace: formData.get('shared-workspace'),
      usingCompetitors: formData.get('using-competitors'),
      competitorVendors: selectedCompetitors.join(', '),
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
              Two Minute Survey
            </h1>
            <p className="text-lg text-gray-300">
              Tell us about your needs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Primary Focus Areas - AI, Payments, Gambling */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <label className="block text-lg sm:text-xl font-semibold text-white mb-2">
                Primary focus areas <span className="text-red-400">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {focusAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all min-h-[44px] ${
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

            {/* AI Regulatory Topics - Only show if AI is selected */}
            {selectedFocusAreas.includes('AI') && (
              <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  Top 3 regulatory topics in AI <span className="text-red-400">*</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">Rank your top 3 priorities for AI</p>
                
                <div ref={topicDropdownRefAI} className="relative">
                  <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[48px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                    <div className="flex flex-wrap gap-2 items-center">
                      {/* Selected chips inside input */}
                      {selectedTopicsAI.map((topic, index) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white min-h-[36px]"
                        >
                          <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{index + 1}.</span>
                          {topic}
                          <button
                            type="button"
                            onClick={() => handleTopicRemoveAI(topic)}
                            className="hover:text-gray-200 ml-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Input field */}
                      {selectedTopicsAI.length < 3 && (
                        <input
                          type="text"
                          value={topicSearchAI}
                          onChange={(e) => {
                            setTopicSearchAI(e.target.value);
                            setShowTopicDropdownAI(true);
                          }}
                          onFocus={() => setShowTopicDropdownAI(true)}
                          placeholder={selectedTopicsAI.length === 0 ? "Search AI topics..." : ""}
                          className="flex-1 min-w-[120px] bg-transparent border-none text-base text-white placeholder:text-gray-500 focus:outline-none"
                          autoComplete="on"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Dropdown */}
                  {showTopicDropdownAI && filteredTopicsAI.length > 0 && selectedTopicsAI.length < 3 && (
                    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredTopicsAI.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicAddAI(topic)}
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

            {/* Payments Regulatory Topics - Only show if Payments is selected */}
            {selectedFocusAreas.includes('Payments') && (
              <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  Top 3 regulatory topics in Payments <span className="text-red-400">*</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">Rank your top 3 priorities for Payments</p>
                
                <div ref={topicDropdownRefPayments} className="relative">
                  <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[48px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                    <div className="flex flex-wrap gap-2 items-center">
                      {/* Selected chips inside input */}
                      {selectedTopicsPayments.map((topic, index) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white min-h-[36px]"
                        >
                          <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{index + 1}.</span>
                          {topic}
                          <button
                            type="button"
                            onClick={() => handleTopicRemovePayments(topic)}
                            className="hover:text-gray-200 ml-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Input field */}
                      {selectedTopicsPayments.length < 3 && (
                        <input
                          type="text"
                          value={topicSearchPayments}
                          onChange={(e) => {
                            setTopicSearchPayments(e.target.value);
                            setShowTopicDropdownPayments(true);
                          }}
                          onFocus={() => setShowTopicDropdownPayments(true)}
                          placeholder={selectedTopicsPayments.length === 0 ? "Search Payments topics..." : ""}
                          className="flex-1 min-w-[120px] bg-transparent border-none text-base text-white placeholder:text-gray-500 focus:outline-none"
                          autoComplete="on"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Dropdown */}
                  {showTopicDropdownPayments && filteredTopicsPayments.length > 0 && selectedTopicsPayments.length < 3 && (
                    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredTopicsPayments.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicAddPayments(topic)}
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

            {/* Gambling Regulatory Topics - Only show if Gambling is selected */}
            {selectedFocusAreas.includes('Gambling') && (
              <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  Top 3 regulatory topics in Gambling <span className="text-red-400">*</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">Rank your top 3 priorities for Gambling</p>
                
                <div ref={topicDropdownRefGambling} className="relative">
                  <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[48px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                    <div className="flex flex-wrap gap-2 items-center">
                      {/* Selected chips inside input */}
                      {selectedTopicsGambling.map((topic, index) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white min-h-[36px]"
                        >
                          <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{index + 1}.</span>
                          {topic}
                          <button
                            type="button"
                            onClick={() => handleTopicRemoveGambling(topic)}
                            className="hover:text-gray-200 ml-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Input field */}
                      {selectedTopicsGambling.length < 3 && (
                        <input
                          type="text"
                          value={topicSearchGambling}
                          onChange={(e) => {
                            setTopicSearchGambling(e.target.value);
                            setShowTopicDropdownGambling(true);
                          }}
                          onFocus={() => setShowTopicDropdownGambling(true)}
                          placeholder={selectedTopicsGambling.length === 0 ? "Search Gambling topics..." : ""}
                          className="flex-1 min-w-[120px] bg-transparent border-none text-base text-white placeholder:text-gray-500 focus:outline-none"
                          autoComplete="on"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Dropdown */}
                  {showTopicDropdownGambling && filteredTopicsGambling.length > 0 && selectedTopicsGambling.length < 3 && (
                    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredTopicsGambling.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicAddGambling(topic)}
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

            {/* Top 5 Jurisdictions - Searchable with inline chips */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Top 5 jurisdictions you're monitoring <span className="text-red-400">*</span>
              </h2>
              <p className="text-sm text-gray-400 mb-4">Type to search and select up to 5 jurisdictions</p>
              
              <div ref={jurisdictionDropdownRef} className="relative">
                <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[48px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Selected chips inside input */}
                    {selectedJurisdictions.map((jurisdiction, index) => (
                      <span
                        key={jurisdiction}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white min-h-[36px]"
                      >
                        <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{index + 1}.</span>
                        {jurisdiction}
                        <button
                          type="button"
                          onClick={() => handleJurisdictionRemove(jurisdiction)}
                          className="hover:text-gray-200 ml-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {/* Input field */}
                    {selectedJurisdictions.length < 5 && (
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

              {selectedJurisdictions.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">Please select at least one jurisdiction</p>
              )}
            </div>

            {/* Compliance Challenges - Multi-select chips */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
                Current compliance challenges
              </h2>
              <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {complianceChallenges.map((challenge) => (
                  <button
                    key={challenge}
                    type="button"
                    onClick={() => toggleChallenge(challenge)}
                    className={`px-4 py-2.5 rounded-full text-sm transition-all min-h-[44px] flex items-center ${
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
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <label htmlFor="timeline" className="block text-lg sm:text-xl font-semibold text-white mb-4">
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

            {/* Using Competitors - Chip-based search with focus area specific vendors */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <label className="block text-lg sm:text-xl font-semibold text-white mb-4">
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
                    onChange={(e) => {
                      setUsingCompetitors(e.target.value);
                      setSelectedCompetitors([]);
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-gray-300">No</span>
                </label>
              </div>
              
              {/* Conditional chip-based search for vendor names */}
              {usingCompetitors === 'Yes' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Which vendor(s)?
                  </label>
                  
                  <div ref={competitorDropdownRef} className="relative">
                    <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[48px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                      <div className="flex flex-wrap gap-2 items-center">
                        {/* Selected chips inside input */}
                        {selectedCompetitors.map((vendor) => (
                          <span
                            key={vendor}
                            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white min-h-[36px]"
                          >
                            <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                              {vendor}
                              <button
                                type="button"
                                onClick={() => handleCompetitorRemove(vendor)}
                                className="hover:text-gray-200 ml-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          {/* Input field */}
                          <input
                            type="text"
                            value={competitorSearch}
                            onChange={(e) => {
                              setCompetitorSearch(e.target.value);
                              setShowCompetitorDropdown(true);
                            }}
                            onFocus={() => setShowCompetitorDropdown(true)}
                            placeholder={selectedCompetitors.length === 0 ? "Search vendors..." : ""}
                            className="flex-1 min-w-[120px] bg-transparent border-none text-base text-white placeholder:text-gray-500 focus:outline-none"
                            autoComplete="on"
                          />
                        </div>
                      </div>
                      
                      {/* Dropdown */}
                      {showCompetitorDropdown && filteredCompetitors.length > 0 && (
                        <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredCompetitors.map((vendor) => (
                            <button
                              key={vendor}
                              type="button"
                              onClick={() => handleCompetitorAdd(vendor)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                              {vendor}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                </div>
              )}
            </div>

            {/* Shared Workspace - Simplified */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <label className="block text-lg sm:text-xl font-semibold text-white mb-4">
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
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                What productivity and communication apps do you or your team use?
              </h2>
              <p className="text-sm text-gray-400 mb-4">Type to search and select</p>
              
              <div ref={productivityDropdownRef} className="relative">
                <div className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 min-h-[48px] outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-500">
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Selected chips inside input */}
                    {selectedProductivityApps.map((app) => (
                      <span
                        key={app}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white min-h-[36px]"
                      >
                        <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        {app}
                        <button
                          type="button"
                          onClick={() => handleProductivityAppRemove(app)}
                          className="hover:text-gray-200 ml-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
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
