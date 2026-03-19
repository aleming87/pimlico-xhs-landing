"use client";

import Image from "next/image";
import { useState } from "react";

/* -----------------------------------------------
   Jurisdiction Data - grouped by region
   ----------------------------------------------- */
const JURISDICTION_GROUPS = {
  'Europe': {
    _subgroups: {
      'Northern Europe': [
        'United Kingdom', 'Ireland', 'Denmark', 'Sweden', 'Finland', 'Norway',
        'Iceland', 'Estonia', 'Latvia', 'Lithuania', 'Guernsey', 'Isle of Man',
        'Jersey', 'Alderney', 'Gibraltar',
      ],
      'Western Europe': [
        'France', 'Germany', 'Netherlands', 'Belgium', 'Luxembourg', 'Austria',
        'Switzerland', 'Liechtenstein',
      ],
      'Southern Europe': [
        'Spain', 'Portugal', 'Italy', 'Malta', 'Greece', 'Cyprus', 'Slovenia',
        'Croatia', 'Albania', 'Montenegro', 'North Macedonia',
        'Bosnia and Herzegovina',
      ],
      'Central & Eastern Europe': [
        'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria',
        'Serbia', 'Moldova', 'Ukraine', 'Belarus', 'Russia', 'Turkey',
        'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan',
      ],
      'European Union': [
        'European Union',
      ],
    },
  },
  'North America': [
    'United States', 'Canada', 'Mexico',
    'Ontario', 'Quebec', 'British Columbia', 'Tobique First Nation', 'Kahnawake',
  ],
  'US States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia (US)', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico',
  ],
  'Latin America': [
    'Antigua and Barbuda', 'Anguilla', 'Argentina', 'Aruba', 'Bahamas', 'Barbados',
    'Belize', 'Bermuda', 'Bolivia', 'Brazil', 'British Virgin Islands', 'Cayman Islands',
    'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Curacao', 'Dominica',
    'Dominican Republic', 'Ecuador', 'El Salvador', 'Guatemala', 'Guyana', 'Haiti',
    'Honduras', 'Jamaica', 'Montserrat', 'Nicaragua', 'Panama', 'Paraguay', 'Peru',
    'Saint Kitts', 'Saint Vincent and the Grenadines', 'Suriname',
    'Trinidad and Tobago', 'Turks & Caicos Islands', 'Uruguay', 'US Virgin Islands',
    'Venezuela',
  ],
  'Middle East': [
    'United Arab Emirates', 'Abu Dhabi', 'Dubai', 'Saudi Arabia', 'Israel', 'Qatar', 'Bahrain',
    'Kuwait', 'Iran', 'Iraq', 'Jordan', 'Lebanon', 'Syria', 'Yemen',
  ],
  'Africa': [
    'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Algeria', 'Angola', 'Anjouan',
    'Burkina Faso', 'Cameroon', 'Cape Verde', 'Chad', "Cote d'Ivoire", 'DR Congo', 'Ethiopia',
    'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Lesotho', 'Liberia', 'Libya',
    'Madagascar', 'Malawi', 'Mali', 'Mauritius', 'Mozambique', 'Namibia', 'Niger', 'Rwanda',
    'Senegal', 'Seychelles', 'Somalia', 'South Sudan', 'Sudan', 'Tanzania', 'Tunisia',
    'Uganda', 'Zambia', 'Zimbabwe',
  ],
  'Asia-Pacific': [
    'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'China',
    'India', 'Philippines', 'Malaysia', 'Thailand', 'Vietnam', 'Indonesia', 'Taiwan',
    'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'Kyrgyzstan', 'Laos', 'Macau', 'Maldives',
    'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Pakistan', 'Sri Lanka', 'Tajikistan',
    'Timor-Leste', 'Turkmenistan', 'Uzbekistan', 'Afghanistan',
    'American Samoa', 'Fiji', 'Guam', 'Northern Marianas', 'Palau', 'Papua New Guinea',
    'Samoa', 'Solomon Islands', 'Vanuatu', 'The Republic of The Marshall Islands',
    'Federated States of Micronesia',
  ],
};

const PRODUCTS = [
  { key: 'projects',    label: 'Projects\u2122',     desc: 'Organise regulatory items into workstreams and track progress against compliance objectives' },
  { key: 'blocklists',  label: 'Blocklists\u2122',   desc: 'Monitor blocked URLs and enforcement actions across jurisdictions in real time' },
  { key: 'competitors', label: 'Competitors\u2122',  desc: 'Track competitor licences, enforcements, deals and products across jurisdictions' },
  { key: 'lens',        label: 'Lens\u2122',         desc: 'Drill down into the technical standards and regulatory trends impacting your business' },
  { key: 'technical',   label: 'Technical\u2122',    desc: 'Access and compare technical standards, testing requirements and certification frameworks' },
  { key: 'partners',    label: 'Partners\u2122',     desc: 'Connect with vetted legal, compliance and advisory partners across your key jurisdictions' },
];

const VERTICALS = ['Gambling', 'Payments', 'Crypto', 'AI'];

/* ----------------------------------------------- */

export default function OnboardingPage() {
  return <OnboardingForm orgSlug="general" />;
}

export function OnboardingForm({ orgSlug = 'general', orgConfig = null }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 - Company & Team
  const [company, setCompany] = useState(orgConfig?.name || '');
  const [teamMembers, setTeamMembers] = useState([{ name: '', email: '', role: '' }]);

  // Step 2 - Verticals & Jurisdictions
  const [selectedVerticals, setSelectedVerticals] = useState([]);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState({});
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');

  // Step 3 - Preferences
  const [scheduleTraining, setScheduleTraining] = useState(false);
  const [preferredTrainingDate, setPreferredTrainingDate] = useState('');
  const [wantOnboardingGuide, setWantOnboardingGuide] = useState(false);
  const [participateInReviews, setParticipateInReviews] = useState(false);
  const [participateInSurveys, setParticipateInSurveys] = useState(false);
  const [participateInInterviews, setParticipateInInterviews] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const maxJurisdictions = orgConfig?.maxJurisdictions || 50;
  const maxSeats = orgConfig?.maxSeats || 50;
  const availableVerticals = orgConfig?.verticals || VERTICALS;
  const allowedDomains = orgConfig?.allowedDomains || [];

  const totalSteps = 3;
  const progress = Math.round((step / totalSteps) * 100);

  /* -- Team member handlers -- */
  const addTeamMember = () => {
    if (teamMembers.length < maxSeats) {
      setTeamMembers([...teamMembers, { name: '', email: '', role: '' }]);
    }
  };

  const removeTeamMember = (index) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  /* -- Jurisdiction handlers -- */
  const getRegionJurisdictions = (region) => {
    const val = JURISDICTION_GROUPS[region];
    if (Array.isArray(val)) return val;
    if (val?._subgroups) return Object.values(val._subgroups).flat();
    return [];
  };

  const toggleRegion = (region) => {
    setExpandedRegions(prev => ({ ...prev, [region]: !prev[region] }));
  };

  const toggleJurisdiction = (j) => {
    if (selectedJurisdictions.includes(j)) {
      setSelectedJurisdictions(selectedJurisdictions.filter(x => x !== j));
    } else if (selectedJurisdictions.length < maxJurisdictions) {
      setSelectedJurisdictions([...selectedJurisdictions, j]);
    }
  };

  const selectAllInRegion = (region) => {
    const regionJurisdictions = getRegionJurisdictions(region);
    const notYetSelected = regionJurisdictions.filter(j => !selectedJurisdictions.includes(j));
    const canAdd = maxJurisdictions - selectedJurisdictions.length;
    const toAdd = notYetSelected.slice(0, canAdd);
    setSelectedJurisdictions([...selectedJurisdictions, ...toAdd]);
  };

  const selectAllInSubgroup = (subJurisdictions) => {
    const notYetSelected = subJurisdictions.filter(j => !selectedJurisdictions.includes(j));
    const canAdd = maxJurisdictions - selectedJurisdictions.length;
    const toAdd = notYetSelected.slice(0, canAdd);
    setSelectedJurisdictions([...selectedJurisdictions, ...toAdd]);
  };

  const deselectAllInRegion = (region) => {
    const regionJurisdictions = getRegionJurisdictions(region);
    setSelectedJurisdictions(selectedJurisdictions.filter(j => !regionJurisdictions.includes(j)));
  };

  const deselectAllInSubgroup = (subJurisdictions) => {
    setSelectedJurisdictions(selectedJurisdictions.filter(j => !subJurisdictions.includes(j)));
  };

  const isRegionFullySelected = (region) => {
    return getRegionJurisdictions(region).every(j => selectedJurisdictions.includes(j));
  };

  const isSubgroupFullySelected = (subJurisdictions) => {
    return subJurisdictions.every(j => selectedJurisdictions.includes(j));
  };

  // Flatten for search filtering
  const getFilteredRegions = () => {
    if (!jurisdictionSearch) return JURISDICTION_GROUPS;
    const q = jurisdictionSearch.toLowerCase();
    const result = {};
    for (const [region, val] of Object.entries(JURISDICTION_GROUPS)) {
      if (Array.isArray(val)) {
        const filtered = val.filter(j => j.toLowerCase().includes(q));
        if (filtered.length > 0) result[region] = filtered;
      } else if (val?._subgroups) {
        const filteredSubs = {};
        for (const [sub, jurisdictions] of Object.entries(val._subgroups)) {
          const filtered = jurisdictions.filter(j => j.toLowerCase().includes(q));
          if (filtered.length > 0) filteredSubs[sub] = filtered;
        }
        if (Object.keys(filteredSubs).length > 0) result[region] = { _subgroups: filteredSubs };
      }
    }
    return result;
  };

  const filteredGroups = getFilteredRegions();

  /* -- Vertical toggle -- */
  const toggleVertical = (v) => {
    setSelectedVerticals(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  };

  /* -- Validation -- */
  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  ];

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    if (freeEmailProviders.includes(domain)) return false;
    return true;
  };

  const isDomainAllowed = (email) => {
    if (!allowedDomains.length) return true;
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.some(d => domain === d.toLowerCase());
  };

  const getEmailError = (email) => {
    if (!email) return null;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return 'Invalid email format';
    const domain = email.split('@')[1]?.toLowerCase();
    if (freeEmailProviders.includes(domain)) return 'Please use a business email';
    if (allowedDomains.length && !isDomainAllowed(email)) {
      return `Email must use one of: ${allowedDomains.join(', ')}`;
    }
    return null;
  };

  const canProceedStep1 = company.trim() &&
    teamMembers.length > 0 &&
    teamMembers[0].name.trim() &&
    teamMembers[0].email.trim() &&
    isValidEmail(teamMembers[0].email) &&
    isDomainAllowed(teamMembers[0].email);

  const canProceedStep2 = selectedVerticals.length > 0 && selectedJurisdictions.length > 0;

  /* -- Submit -- */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          orgSlug,
          company,
          teamMembers: teamMembers.filter(m => m.name.trim() && m.email.trim()),
          jurisdictions: selectedJurisdictions,
          verticals: selectedVerticals,
          scheduleTraining,
          preferredTrainingDate,
          wantOnboardingGuide,
          participateInReviews,
          participateInSurveys,
          participateInInterviews,
          additionalNotes,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -- Thank You Screen -- */
  if (submitted) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-200">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome Aboard!</h1>
          <p className="text-slate-600 text-lg mb-2">Your onboarding form has been submitted successfully.</p>
          <p className="text-slate-500 mb-8">
            {"We'll review your team details and jurisdiction selections, then reach out with next steps"}
            {scheduleTraining ? ' and schedule your training call' : ''}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              Back to Pimlico
            </a>
            <a href="/onboarding/guide" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
              View Onboarding Guide
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between px-6 py-4 lg:px-8 max-w-5xl mx-auto">
          <a href="/" className="flex items-center gap-3">
            <Image src="/Pimlico_Logo.png" alt="Pimlico" width={110} height={30} className="h-7 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <Image src="/XHS Logo BLUE on WHITE.png" alt="XHS" width={80} height={32} className="h-8 w-auto" />
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ONBOARDING</span>
          </div>
        </nav>
      </header>

      {/* Progress Bar */}
      <div className="sticky top-[57px] z-50 h-1 bg-slate-200">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-3">
              {orgConfig ? `${orgConfig.name} \u2014 Onboarding` : 'XHS\u2122 Platform Onboarding'}
            </h1>
            <p className="text-base text-slate-500">
              {"Set up your team and configure your Pimlico XHS\u2122 workspace"}
            </p>
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8">
              {[
                { n: 1, label: 'Team' },
                { n: 2, label: 'Jurisdictions' },
                { n: 3, label: 'Preferences' },
              ].map(({ n, label }) => (
                <div key={n} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (n < step) setStep(n);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      n < step
                        ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                        : n === step
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-slate-200 text-slate-400 cursor-default'
                    }`}
                  >
                    {n < step ? '\u2713' : n}
                  </button>
                  <span className={`text-sm hidden sm:inline font-medium ${
                    n === step ? 'text-slate-900' : n < step ? 'text-blue-700' : 'text-slate-400'
                  }`}>
                    {label}
                  </span>
                  {n < 3 && <div className={`w-8 h-px hidden sm:block ${n < step ? 'bg-blue-400' : 'bg-slate-300'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: Company & Team */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Company */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-5">Company Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Mozzartbet"
                    disabled={!!orgConfig?.name}
                    className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>

                {/* Allowed domains notice */}
                {allowedDomains.length > 0 && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      Team member emails must match: <strong>{allowedDomains.join(', ')}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Team Members */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Team Members</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Add the people who will use the platform ({teamMembers.length}/{maxSeats} seats)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    disabled={teamMembers.length >= maxSeats}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    + Add Member
                  </button>
                </div>

                <div className="space-y-3">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-700">
                          {i === 0 ? 'Primary Contact' : `Team Member ${i + 1}`}
                        </span>
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(i)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">
                            Full Name {i === 0 && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={e => updateTeamMember(i, 'name', e.target.value)}
                            placeholder="Jane Smith"
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">
                            Business Email {i === 0 && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={e => updateTeamMember(i, 'email', e.target.value)}
                            placeholder="jane@company.com"
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {member.email && getEmailError(member.email) && (
                            <p className="mt-1 text-xs text-red-500">{getEmailError(member.email)}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Role / Title</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={e => updateTeamMember(i, 'role', e.target.value)}
                            placeholder="e.g. Compliance Manager"
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {"Continue \u2192"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Verticals & Jurisdictions */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Verticals */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Focus Areas</h2>
                <p className="text-sm text-slate-500 mb-4">Which regulatory verticals are relevant to your organisation?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableVerticals.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleVertical(v)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all border ${
                        selectedVerticals.includes(v)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jurisdictions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-slate-900">Jurisdictions</h2>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    selectedJurisdictions.length >= maxJurisdictions
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {selectedJurisdictions.length} / {maxJurisdictions}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4">Select the jurisdictions your team needs to monitor</p>

                {/* Search */}
                <div className="mb-4 relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={jurisdictionSearch}
                    onChange={e => setJurisdictionSearch(e.target.value)}
                    placeholder="Search jurisdictions..."
                    className="block w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Selected chips */}
                {selectedJurisdictions.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {selectedJurisdictions.map(j => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs text-blue-800 font-medium"
                      >
                        {j}
                        <button type="button" onClick={() => toggleJurisdiction(j)} className="hover:text-blue-600 ml-0.5 text-blue-400">{'\u00D7'}</button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedJurisdictions([])}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Region accordion */}
                <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                  {Object.entries(filteredGroups).map(([region, val]) => {
                    const isExpanded = expandedRegions[region] || !!jurisdictionSearch;
                    const hasSubgroups = !Array.isArray(val) && val?._subgroups;
                    const allJurisdictionsFlat = hasSubgroups
                      ? Object.values(val._subgroups).flat()
                      : val;
                    const totalCount = allJurisdictionsFlat.length;
                    const selectedCount = allJurisdictionsFlat.filter(j => selectedJurisdictions.includes(j)).length;
                    const allSelected = isRegionFullySelected(region) && !jurisdictionSearch;

                    return (
                      <div key={region} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleRegion(region)}
                          className="w-full flex items-center justify-between p-3 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              isExpanded ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'
                            }`}>
                              {isExpanded ? '\u2212' : '+'}
                            </span>
                            <span className="text-sm font-medium text-slate-800">{region}</span>
                            {selectedCount > 0 && (
                              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                {selectedCount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{totalCount}</span>
                            {!jurisdictionSearch && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  allSelected ? deselectAllInRegion(region) : selectAllInRegion(region);
                                }}
                                className={`text-xs px-2 py-0.5 rounded font-medium transition-colors ${
                                  allSelected
                                    ? 'text-red-500 hover:text-red-700'
                                    : 'text-blue-600 hover:text-blue-800'
                                }`}
                              >
                                {allSelected ? 'Deselect all' : 'Select all'}
                              </button>
                            )}
                          </div>
                        </button>

                        {isExpanded && hasSubgroups && (
                          <div className="px-3 pb-3 space-y-1.5">
                            {Object.entries(val._subgroups).map(([sub, subJurisdictions]) => {
                              const subExpanded = expandedRegions[sub] || !!jurisdictionSearch;
                              const subSelectedCount = subJurisdictions.filter(j => selectedJurisdictions.includes(j)).length;
                              const subAllSelected = isSubgroupFullySelected(subJurisdictions) && !jurisdictionSearch;

                              return (
                                <div key={sub} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => toggleRegion(sub)}
                                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold border transition-colors ${
                                        subExpanded ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                                      }`}>
                                        {subExpanded ? '\u2212' : '+'}
                                      </span>
                                      <span className="text-xs font-medium text-slate-700">{sub}</span>
                                      {subSelectedCount > 0 && (
                                        <span className="bg-blue-50 text-blue-600 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                                          {subSelectedCount}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-slate-400">{subJurisdictions.length}</span>
                                      {!jurisdictionSearch && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            subAllSelected ? deselectAllInSubgroup(subJurisdictions) : selectAllInSubgroup(subJurisdictions);
                                          }}
                                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                                            subAllSelected
                                              ? 'text-red-500 hover:text-red-700'
                                              : 'text-blue-600 hover:text-blue-800'
                                          }`}
                                        >
                                          {subAllSelected ? 'Deselect' : 'Select all'}
                                        </button>
                                      )}
                                    </div>
                                  </button>

                                  {subExpanded && (
                                    <div className="px-3 pb-2.5">
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                                        {subJurisdictions.map(j => {
                                          const isSelected = selectedJurisdictions.includes(j);
                                          const isDisabled = !isSelected && selectedJurisdictions.length >= maxJurisdictions;
                                          return (
                                            <button
                                              key={j}
                                              type="button"
                                              onClick={() => !isDisabled && toggleJurisdiction(j)}
                                              disabled={isDisabled}
                                              className={`text-left text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                                                isSelected
                                                  ? 'bg-blue-100 text-blue-800 font-medium border border-blue-300'
                                                  : isDisabled
                                                  ? 'text-slate-300 cursor-not-allowed'
                                                  : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-300'
                                              }`}
                                            >
                                              <span className="mr-1.5">{isSelected ? '\u2611' : '\u2610'}</span>
                                              {j}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {isExpanded && !hasSubgroups && (
                          <div className="px-3 pb-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                              {val.map(j => {
                                const isSelected = selectedJurisdictions.includes(j);
                                const isDisabled = !isSelected && selectedJurisdictions.length >= maxJurisdictions;
                                return (
                                  <button
                                    key={j}
                                    type="button"
                                    onClick={() => !isDisabled && toggleJurisdiction(j)}
                                    disabled={isDisabled}
                                    className={`text-left text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                                      isSelected
                                        ? 'bg-blue-100 text-blue-800 font-medium border border-blue-300'
                                        : isDisabled
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-300'
                                    }`}
                                  >
                                    <span className="mr-1.5">{isSelected ? '\u2611' : '\u2610'}</span>
                                    {j}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-slate-500 hover:text-slate-800 font-medium transition-colors"
                >
                  {"\u2190 Back"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {"Continue \u2192"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {/* Training */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-5">Training & Support</h2>

                <div className="space-y-5">
                  {/* Video call training */}
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setScheduleTraining(!scheduleTraining)}
                      className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors border ${
                        scheduleTraining ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {scheduleTraining && <span className="text-xs">{'\u2713'}</span>}
                    </button>
                    <div className="flex-1">
                      <p className="text-slate-800 font-medium text-sm">Schedule a video call training with our team</p>
                      <p className="text-xs text-slate-500 mt-0.5">{"We'll walk your team through the platform features and best practices"}</p>
                      {scheduleTraining && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Preferred date/time (optional)</label>
                          <input
                            type="text"
                            value={preferredTrainingDate}
                            onChange={e => setPreferredTrainingDate(e.target.value)}
                            placeholder="e.g. Next Tuesday afternoon, or any weekday morning"
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Onboarding guide */}
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setWantOnboardingGuide(!wantOnboardingGuide)}
                      className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors border ${
                        wantOnboardingGuide ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {wantOnboardingGuide && <span className="text-xs">{'\u2713'}</span>}
                    </button>
                    <div>
                      <p className="text-slate-800 font-medium text-sm">Send us an onboarding guide</p>
                      <p className="text-xs text-slate-500 mt-0.5">Get a comprehensive PDF guide with setup instructions and tips</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback & Engagement */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Feedback & Engagement</h2>
                <p className="text-sm text-slate-500 mb-5">{"We'll check in regularly during onboarding. Let us know how you'd like to contribute beyond that."}</p>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setParticipateInReviews(!participateInReviews)}
                      className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors border ${
                        participateInReviews ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {participateInReviews && <span className="text-xs">{'\u2713'}</span>}
                    </button>
                    <div>
                      <p className="text-slate-800 font-medium text-sm">{"Participate in XHS\u2122 product reviews"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">In-depth feedback sessions on specific products after your first few weeks</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setParticipateInSurveys(!participateInSurveys)}
                      className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors border ${
                        participateInSurveys ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {participateInSurveys && <span className="text-xs">{'\u2713'}</span>}
                    </button>
                    <div>
                      <p className="text-slate-800 font-medium text-sm">{"Participate in XHS\u2122 product surveys"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Quick periodic surveys to help us track satisfaction and prioritise improvements</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setParticipateInInterviews(!participateInInterviews)}
                      className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors border ${
                        participateInInterviews ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {participateInInterviews && <span className="text-xs">{'\u2713'}</span>}
                    </button>
                    <div>
                      <p className="text-slate-800 font-medium text-sm">Open to user interviews</p>
                      <p className="text-xs text-slate-500 mt-0.5">Occasional 30-minute calls to discuss your experience and needs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Onboarding Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Your Onboarding Journey</h2>
                <p className="text-xs text-slate-500 mb-5">{"What to expect over the first 3 weeks"}</p>

                <div className="flex items-start gap-0">
                  {[
                    { week: 'W1', title: 'Setup & Access', desc: 'Account activation, team invites, configuration' },
                    { week: 'W2', title: 'Explore & Configure', desc: 'Start using tools, initial survey, dedicated support' },
                    { week: 'W3', title: 'Review & Optimise', desc: 'Check-in call, feedback review, workspace tuning' },
                  ].map((step, i) => (
                    <div key={step.week} className="flex-1 flex flex-col items-center text-center relative">
                      {i < 2 && <div className="absolute top-4 left-[calc(50%+16px)] right-0 h-px bg-blue-200 z-0" />}
                      <div className={`relative z-10 w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-blue-500' : 'bg-blue-400'
                      }`}>{step.week}</div>
                      <p className="text-xs font-semibold text-slate-800 mt-2">{step.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 px-2 leading-snug">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800"><strong>Feedback commitment:</strong> {"As part of onboarding, we'll send short surveys and schedule check-ins to make sure the platform is working for your team. Your input directly shapes the product."}</p>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Additional Notes</h2>
                <textarea
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  rows={4}
                  placeholder="Anything else you'd like us to know about your team's needs..."
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Summary panel */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-base font-semibold text-blue-900 mb-4">Submission Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 text-xs font-medium">Company</span>
                    <p className="text-blue-900 font-medium">{company}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 text-xs font-medium">Team Members</span>
                    <p className="text-blue-900 font-medium">{teamMembers.filter(m => m.name.trim()).length}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 text-xs font-medium">Verticals</span>
                    <p className="text-blue-900 font-medium">{selectedVerticals.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 text-xs font-medium">Jurisdictions</span>
                    <p className="text-blue-900 font-medium">{selectedJurisdictions.length}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 text-xs font-medium">Training Call</span>
                    <p className="text-blue-900 font-medium">{scheduleTraining ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 text-xs font-medium">Onboarding Guide</span>
                    <p className="text-blue-900 font-medium">{wantOnboardingGuide ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-slate-500 hover:text-slate-800 font-medium transition-colors"
                >
                  {"\u2190 Back"}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Onboarding \u2192"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
