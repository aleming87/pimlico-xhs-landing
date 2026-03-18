"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

/* ───────────────────────────────────────
   Jurisdiction Data — grouped by region
   ─────────────────────────────────────── */
const JURISDICTION_GROUPS = {
  'European Union': [
    'European Union', 'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland',
    'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal',
    'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
  ],
  'Europe (Non-EU)': [
    'United Kingdom', 'Switzerland', 'Norway', 'Iceland', 'Liechtenstein', 'Albania',
    'Armenia', 'Azerbaijan', 'Belarus', 'Bosnia and Herzegovina', 'Georgia', 'Gibraltar',
    'Guernsey', 'Isle of Man', 'Jersey', 'Alderney', 'Kazakhstan', 'Moldova', 'Montenegro',
    'North Macedonia', 'Russia', 'Serbia', 'Turkey', 'Ukraine',
  ],
  'North America': [
    'United States', 'Canada', 'Mexico',
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
  'Canadian Provinces': [
    'Ontario', 'Quebec', 'British Columbia', 'Tobique First Nation', 'Kahnawake',
  ],
  'Central America & Caribbean': [
    'Antigua and Barbuda', 'Anguilla', 'Aruba', 'Bahamas', 'Barbados', 'Belize', 'Bermuda',
    'British Virgin Islands', 'Cayman Islands', 'Costa Rica', 'Cuba', 'Curaçao', 'Dominica',
    'Dominican Republic', 'El Salvador', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica',
    'Montserrat', 'Nicaragua', 'Panama', 'Saint Kitts', 'Saint Vincent and the Grenadines',
    'Trinidad and Tobago', 'Turks & Caicos Islands', 'US Virgin Islands',
  ],
  'South America': [
    'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay',
    'Peru', 'Suriname', 'Uruguay', 'Venezuela',
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
  ],
  'Pacific Islands': [
    'American Samoa', 'Fiji', 'Guam', 'Northern Marianas', 'Palau', 'Papua New Guinea',
    'Samoa', 'Solomon Islands', 'Vanuatu', 'The Republic of The Marshall Islands',
    'Federated States of Micronesia',
  ],
};

const PRODUCTS = [
  { key: 'xhs', label: 'XHS™ Horizon Scanner', desc: 'Real-time regulatory monitoring across jurisdictions' },
  { key: 'projects', label: 'Projects™', desc: 'Organise regulatory items into workstreams and track compliance' },
  { key: 'lens', label: 'Lens™', desc: 'Deep-dive into technical standards and regulatory trends' },
  { key: 'competitors', label: 'Competitors™', desc: 'Track competitor licences, enforcements, and market activity' },
  { key: 'blocklists', label: 'Blocklists™', desc: 'Monitor blocked URLs and enforcement actions across jurisdictions' },
  { key: 'countryReports', label: 'Country Reports', desc: 'Comprehensive regulatory landscape reports by jurisdiction' },
];

const VERTICALS = ['Gambling', 'Payments', 'Crypto', 'AI'];

/* ─────────────────────────────────────── */

export default function OnboardingPage() {
  return <OnboardingForm orgSlug="general" />;
}

export function OnboardingForm({ orgSlug = 'general', orgConfig = null }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Company & Team
  const [company, setCompany] = useState(orgConfig?.name || '');
  const [teamMembers, setTeamMembers] = useState([{ name: '', email: '', role: '' }]);

  // Step 2 — Verticals & Jurisdictions
  const [selectedVerticals, setSelectedVerticals] = useState([]);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState({});
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');

  // Step 3 — Preferences
  const [scheduleTraining, setScheduleTraining] = useState(false);
  const [preferredTrainingDate, setPreferredTrainingDate] = useState('');
  const [wantOnboardingGuide, setWantOnboardingGuide] = useState(false);
  const [participateInSurveys, setParticipateInSurveys] = useState(false);
  const [participateInInterviews, setParticipateInInterviews] = useState(false);
  const [tryNewProducts, setTryNewProducts] = useState(false);
  const [productsOfInterest, setProductsOfInterest] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const maxJurisdictions = orgConfig?.maxJurisdictions || 50;
  const maxSeats = orgConfig?.maxSeats || 50;
  const availableVerticals = orgConfig?.verticals || VERTICALS;

  const totalSteps = 3;
  const progress = Math.round((step / totalSteps) * 100);

  /* ── Team member handlers ── */
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

  /* ── Jurisdiction handlers ── */
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
    const regionJurisdictions = JURISDICTION_GROUPS[region];
    const notYetSelected = regionJurisdictions.filter(j => !selectedJurisdictions.includes(j));
    const canAdd = maxJurisdictions - selectedJurisdictions.length;
    const toAdd = notYetSelected.slice(0, canAdd);
    setSelectedJurisdictions([...selectedJurisdictions, ...toAdd]);
  };

  const deselectAllInRegion = (region) => {
    const regionJurisdictions = JURISDICTION_GROUPS[region];
    setSelectedJurisdictions(selectedJurisdictions.filter(j => !regionJurisdictions.includes(j)));
  };

  const isRegionFullySelected = (region) => {
    return JURISDICTION_GROUPS[region].every(j => selectedJurisdictions.includes(j));
  };

  const isRegionPartiallySelected = (region) => {
    return JURISDICTION_GROUPS[region].some(j => selectedJurisdictions.includes(j));
  };

  const filteredGroups = jurisdictionSearch
    ? Object.fromEntries(
        Object.entries(JURISDICTION_GROUPS).map(([region, jurisdictions]) => [
          region,
          jurisdictions.filter(j => j.toLowerCase().includes(jurisdictionSearch.toLowerCase())),
        ]).filter(([, jurisdictions]) => jurisdictions.length > 0)
      )
    : JURISDICTION_GROUPS;

  /* ── Product toggle ── */
  const toggleProduct = (key) => {
    setProductsOfInterest(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  /* ── Vertical toggle ── */
  const toggleVertical = (v) => {
    setSelectedVerticals(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  };

  /* ── Validation ── */
  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  ];

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return !freeEmailProviders.includes(domain);
  };

  const canProceedStep1 = company.trim() &&
    teamMembers.length > 0 &&
    teamMembers[0].name.trim() &&
    teamMembers[0].email.trim() &&
    isValidEmail(teamMembers[0].email);

  const canProceedStep2 = selectedVerticals.length > 0 && selectedJurisdictions.length > 0;

  /* ── Submit ── */
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
          participateInSurveys,
          participateInInterviews,
          tryNewProducts,
          productsOfInterest,
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

  /* ── Thank You Screen ── */
  if (submitted) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Welcome Aboard!</h1>
          <p className="text-gray-300 text-lg mb-2">Your onboarding form has been submitted successfully.</p>
          <p className="text-gray-400 mb-8">
            We'll review your team details and jurisdiction selections, then reach out with next steps
            {scheduleTraining ? ' and schedule your training call' : ''}.
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors">
            ← Back to Pimlico
          </a>
        </div>
      </div>
    );
  }

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

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-gray-800">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12 pt-12">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
              {orgConfig ? `${orgConfig.name} — Onboarding` : 'Platform Onboarding'}
            </h1>
            <p className="text-lg text-gray-300">
              Set up your team and configure your Pimlico XHS™ workspace
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    s < step ? 'bg-green-500 text-white' :
                    s === step ? 'bg-blue-600 text-white' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {s < step ? '✓' : s}
                  </div>
                  <span className={`text-sm hidden sm:inline ${
                    s === step ? 'text-white font-medium' : 'text-gray-500'
                  }`}>
                    {s === 1 ? 'Team' : s === 2 ? 'Jurisdictions' : 'Preferences'}
                  </span>
                  {s < 3 && <div className="w-8 h-px bg-gray-700 hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>

          {/* ════════════ STEP 1: Company & Team ════════════ */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Company */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6">Company Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-white">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Mozzartbet"
                    disabled={!!orgConfig?.name}
                    className="mt-2.5 block w-full rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Team Members</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Add the people who will use the platform ({teamMembers.length}/{maxSeats} seats)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    disabled={teamMembers.length >= maxSeats}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    + Add Member
                  </button>
                </div>

                <div className="space-y-4">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-300">
                          {i === 0 ? '👑 Primary Contact' : `Team Member ${i + 1}`}
                        </span>
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(i)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Full Name {i === 0 && <span className="text-red-400">*</span>}
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={e => updateTeamMember(i, 'name', e.target.value)}
                            placeholder="Jane Smith"
                            className="block w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Business Email {i === 0 && <span className="text-red-400">*</span>}
                          </label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={e => updateTeamMember(i, 'email', e.target.value)}
                            placeholder="jane@company.com"
                            className="block w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                          />
                          {member.email && !isValidEmail(member.email) && (
                            <p className="mt-1 text-xs text-red-400">Please use a business email</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Role / Title</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={e => updateTeamMember(i, 'role', e.target.value)}
                            placeholder="e.g. Compliance Manager"
                            className="block w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ════════════ STEP 2: Verticals & Jurisdictions ════════════ */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Verticals */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-2">Focus Areas</h2>
                <p className="text-sm text-gray-400 mb-4">Which regulatory verticals are relevant to your organisation?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableVerticals.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleVertical(v)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        selectedVerticals.includes(v)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jurisdictions */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-semibold text-white">Jurisdictions</h2>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    selectedJurisdictions.length >= maxJurisdictions
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {selectedJurisdictions.length} / {maxJurisdictions}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">Select the jurisdictions your team needs to monitor</p>

                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={jurisdictionSearch}
                    onChange={e => setJurisdictionSearch(e.target.value)}
                    placeholder="Search jurisdictions..."
                    className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                  />
                </div>

                {/* Selected chips */}
                {selectedJurisdictions.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {selectedJurisdictions.map(j => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs text-white"
                      >
                        {j}
                        <button type="button" onClick={() => toggleJurisdiction(j)} className="hover:text-gray-200 ml-0.5">×</button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedJurisdictions([])}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Region accordion */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {Object.entries(filteredGroups).map(([region, jurisdictions]) => {
                    const isExpanded = expandedRegions[region] || !!jurisdictionSearch;
                    const selectedCount = jurisdictions.filter(j => selectedJurisdictions.includes(j)).length;
                    const allSelected = isRegionFullySelected(region) && !jurisdictionSearch;
                    const partialSelected = isRegionPartiallySelected(region);

                    return (
                      <div key={region} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                        {/* Region header */}
                        <button
                          type="button"
                          onClick={() => toggleRegion(region)}
                          className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                            <span className="text-sm font-medium text-white">{region}</span>
                            {selectedCount > 0 && (
                              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                                {selectedCount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{jurisdictions.length} jurisdictions</span>
                            {!jurisdictionSearch && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  allSelected ? deselectAllInRegion(region) : selectAllInRegion(region);
                                }}
                                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                                  allSelected
                                    ? 'text-red-400 hover:text-red-300'
                                    : 'text-blue-400 hover:text-blue-300'
                                }`}
                              >
                                {allSelected ? 'Deselect all' : 'Select all'}
                              </button>
                            )}
                          </div>
                        </button>

                        {/* Jurisdiction checkboxes */}
                        {isExpanded && (
                          <div className="px-3 pb-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                              {jurisdictions.map(j => {
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
                                        ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40'
                                        : isDisabled
                                        ? 'text-gray-600 cursor-not-allowed'
                                        : 'text-gray-300 hover:bg-white/10 border border-transparent'
                                    }`}
                                  >
                                    <span className="mr-1.5">{isSelected ? '☑' : '☐'}</span>
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

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ════════════ STEP 3: Preferences ════════════ */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {/* Training */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6">Training & Support</h2>

                <div className="space-y-5">
                  {/* Video call training */}
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setScheduleTraining(!scheduleTraining)}
                      className={`mt-0.5 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-colors ${
                        scheduleTraining ? 'bg-blue-600 text-white' : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      {scheduleTraining && <span className="text-sm">✓</span>}
                    </button>
                    <div className="flex-1">
                      <p className="text-white font-medium">Schedule a video call training with our team</p>
                      <p className="text-sm text-gray-400">We'll walk your team through the platform features and best practices</p>
                      {scheduleTraining && (
                        <div className="mt-3">
                          <label className="block text-xs text-gray-400 mb-1">Preferred date/time (optional)</label>
                          <input
                            type="text"
                            value={preferredTrainingDate}
                            onChange={e => setPreferredTrainingDate(e.target.value)}
                            placeholder="e.g. Next Tuesday afternoon, or any weekday morning"
                            className="block w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
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
                      className={`mt-0.5 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-colors ${
                        wantOnboardingGuide ? 'bg-blue-600 text-white' : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      {wantOnboardingGuide && <span className="text-sm">✓</span>}
                    </button>
                    <div>
                      <p className="text-white font-medium">Send us an onboarding guide</p>
                      <p className="text-sm text-gray-400">Get a comprehensive PDF guide with setup instructions and tips</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-2">Engagement Preferences</h2>
                <p className="text-sm text-gray-400 mb-6">Let us know how you'd like to engage with us beyond the platform</p>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setParticipateInSurveys(!participateInSurveys)}
                      className={`mt-0.5 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-colors ${
                        participateInSurveys ? 'bg-blue-600 text-white' : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      {participateInSurveys && <span className="text-sm">✓</span>}
                    </button>
                    <div>
                      <p className="text-white font-medium">Participate in product surveys</p>
                      <p className="text-sm text-gray-400">Help us improve by sharing feedback on features and workflows</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setParticipateInInterviews(!participateInInterviews)}
                      className={`mt-0.5 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-colors ${
                        participateInInterviews ? 'bg-blue-600 text-white' : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      {participateInInterviews && <span className="text-sm">✓</span>}
                    </button>
                    <div>
                      <p className="text-white font-medium">Open to user interviews</p>
                      <p className="text-sm text-gray-400">Occasional 30-minute calls to discuss your experience and needs</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setTryNewProducts(!tryNewProducts);
                        if (tryNewProducts) setProductsOfInterest([]);
                      }}
                      className={`mt-0.5 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-colors ${
                        tryNewProducts ? 'bg-blue-600 text-white' : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      {tryNewProducts && <span className="text-sm">✓</span>}
                    </button>
                    <div className="flex-1">
                      <p className="text-white font-medium">Interested in trying new products</p>
                      <p className="text-sm text-gray-400">Be among the first to access new features and tools</p>
                    </div>
                  </div>
                </div>

                {/* Products of Interest */}
                {tryNewProducts && (
                  <div className="mt-5 ml-10 space-y-2">
                    <p className="text-sm text-gray-300 font-medium mb-3">Which products interest you?</p>
                    {PRODUCTS.map(p => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => toggleProduct(p.key)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          productsOfInterest.includes(p.key)
                            ? 'bg-blue-600/20 border-blue-500/40 text-white'
                            : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{productsOfInterest.includes(p.key) ? '☑' : '☐'}</span>
                          <span className="font-medium text-sm">{p.label}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 ml-6">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Additional Notes</h2>
                <textarea
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  rows={4}
                  placeholder="Anything else you'd like us to know about your team's needs..."
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>

              {/* Summary panel */}
              <div className="bg-blue-950/40 rounded-2xl p-6 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-white mb-4">📋 Submission Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Company</span>
                    <p className="text-white font-medium">{company}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Team Members</span>
                    <p className="text-white font-medium">{teamMembers.filter(m => m.name.trim()).length}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Verticals</span>
                    <p className="text-white font-medium">{selectedVerticals.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Jurisdictions</span>
                    <p className="text-white font-medium">{selectedJurisdictions.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Training Call</span>
                    <p className="text-white font-medium">{scheduleTraining ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Onboarding Guide</span>
                    <p className="text-white font-medium">{wantOnboardingGuide ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 disabled:opacity-60 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span> Submitting...
                    </>
                  ) : (
                    'Submit Onboarding →'
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
