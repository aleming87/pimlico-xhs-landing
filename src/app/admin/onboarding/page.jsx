"use client";
import { useState, useEffect, useMemo } from 'react';

/* ─── Helpers ─── */
function StatCard({ icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-500/15 text-blue-300',
    green: 'bg-green-500/15 text-green-300',
    amber: 'bg-amber-500/15 text-amber-300',
    purple: 'bg-purple-500/15 text-purple-300',
    indigo: 'bg-indigo-500/15 text-indigo-300',
  };
  return (
    <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${colors[color]}`}>{icon}</span>
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminOnboardingPage() {
  const [orgs, setOrgs] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview | orgs | submissions | create
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Create org form
  const [newOrg, setNewOrg] = useState({ name: '', slug: '', maxSeats: 10, maxJurisdictions: 20, verticals: ['Gambling', 'Payments', 'Crypto', 'AI'], notes: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const res = await fetch('/api/onboarding');
      const data = await res.json();
      if (data.success) {
        setOrgs(data.orgs || []);
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to load onboarding data:', err);
    } finally {
      setLoading(false);
    }
  }

  /* ─── Create organisation ─── */
  async function handleCreateOrg(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-org', ...newOrg }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setOrgs([...orgs, data.org]);
      setCreateSuccess(`Organisation created! Link: pimlicosolutions.com/onboarding/${data.org.slug}`);
      setNewOrg({ name: '', slug: '', maxSeats: 10, maxJurisdictions: 20, verticals: ['Gambling', 'Payments', 'Crypto', 'AI'], notes: '' });
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  /* ─── Toggle org active state ─── */
  async function toggleOrgActive(org) {
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-org', slug: org.slug, updates: { active: !org.active } }),
      });
      const data = await res.json();
      if (data.success) {
        setOrgs(orgs.map(o => o.slug === org.slug ? data.org : o));
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  }

  /* ─── Download CSV ─── */
  function downloadCSV(data, filename) {
    if (!data.length) return;
    const headers = Object.keys(flattenSubmission(data[0]));
    const rows = data.map(s => {
      const flat = flattenSubmission(s);
      return headers.map(h => {
        const val = flat[h] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function flattenSubmission(s) {
    return {
      id: s.id,
      orgSlug: s.orgSlug,
      company: s.company,
      teamMemberCount: s.teamMembers?.length || 0,
      teamMembers: (s.teamMembers || []).map(m => `${m.name} <${m.email}>${m.role ? ` (${m.role})` : ''}`).join('; '),
      jurisdictions: (s.jurisdictions || []).join('; '),
      jurisdictionCount: s.jurisdictions?.length || 0,
      verticals: (s.verticals || []).join('; '),
      scheduleTraining: s.scheduleTraining ? 'Yes' : 'No',
      preferredTrainingDate: s.preferredTrainingDate || '',
      wantOnboardingGuide: s.wantOnboardingGuide ? 'Yes' : 'No',
      participateInSurveys: s.participateInSurveys ? 'Yes' : 'No',
      participateInInterviews: s.participateInInterviews ? 'Yes' : 'No',
      tryNewProducts: s.tryNewProducts ? 'Yes' : 'No',
      productsOfInterest: (s.productsOfInterest || []).join('; '),
      additionalNotes: s.additionalNotes || '',
      submittedAt: s.submittedAt,
    };
  }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ─── Filtered submissions ─── */
  const filteredSubmissions = useMemo(() => {
    if (!selectedOrg) return submissions;
    return submissions.filter(s => s.orgSlug === selectedOrg);
  }, [submissions, selectedOrg]);

  /* ─── Stats ─── */
  const totalUsers = submissions.reduce((sum, s) => sum + (s.teamMembers?.length || 0), 0);
  const wantTraining = submissions.filter(s => s.scheduleTraining).length;
  const allJurisdictions = [...new Set(submissions.flatMap(s => s.jurisdictions || []))];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Onboarding Management</h1>
        <p className="text-gray-400 text-sm">Create organisations, manage onboarding links, and review submissions</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon="🏢" label="Organisations" value={orgs.length} color="blue" />
        <StatCard icon="📋" label="Submissions" value={submissions.length} color="green" />
        <StatCard icon="👥" label="Total Users" value={totalUsers} color="purple" />
        <StatCard icon="📞" label="Training Requested" value={wantTraining} color="amber" />
        <StatCard icon="🌍" label="Unique Jurisdictions" value={allJurisdictions.length} color="indigo" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-800/50 rounded-xl p-1 w-fit">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'orgs', label: 'Organisations' },
          { key: 'submissions', label: 'Submissions' },
          { key: 'create', label: '+ Create Org' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════ OVERVIEW TAB ════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Submissions */}
          <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Submissions</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadCSV(submissions, 'onboarding-submissions.csv')}
                  className="px-3 py-1.5 bg-green-600/20 text-green-300 text-xs font-medium rounded-lg hover:bg-green-600/30 transition-colors"
                >
                  📥 CSV
                </button>
                <button
                  onClick={() => downloadJSON(submissions, 'onboarding-submissions.json')}
                  className="px-3 py-1.5 bg-blue-600/20 text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-600/30 transition-colors"
                >
                  📥 JSON
                </button>
              </div>
            </div>

            {submissions.length === 0 ? (
              <p className="text-gray-500 text-sm">No submissions yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs border-b border-gray-700/50">
                      <th className="text-left pb-3 pr-4">Company</th>
                      <th className="text-left pb-3 pr-4">Org Link</th>
                      <th className="text-center pb-3 pr-4">Team</th>
                      <th className="text-center pb-3 pr-4">Jurisdictions</th>
                      <th className="text-center pb-3 pr-4">Training</th>
                      <th className="text-left pb-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {submissions.slice().reverse().slice(0, 10).map(s => (
                      <tr key={s.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 pr-4 text-white font-medium">{s.company}</td>
                        <td className="py-3 pr-4">
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-mono">{s.orgSlug}</span>
                        </td>
                        <td className="py-3 pr-4 text-center text-gray-300">{s.teamMembers?.length || 0}</td>
                        <td className="py-3 pr-4 text-center text-gray-300">{s.jurisdictions?.length || 0}</td>
                        <td className="py-3 pr-4 text-center">
                          {s.scheduleTraining ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="py-3 text-gray-400 text-xs">
                          {new Date(s.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Org Links */}
          <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Active Onboarding Links</h2>
            {orgs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-3">No organisations created yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  + Create Organisation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {orgs.map(org => {
                  const orgSubs = submissions.filter(s => s.orgSlug === org.slug);
                  return (
                    <div key={org.id} className={`p-4 rounded-xl border transition-colors ${
                      org.active ? 'bg-white/5 border-white/10' : 'bg-gray-800/30 border-gray-700/30 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{org.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          org.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {org.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-blue-400 font-mono mb-2">pimlicosolutions.com/onboarding/{org.slug}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>👥 {org.maxSeats} seats</span>
                        <span>🌍 {org.maxJurisdictions} jurisdictions</span>
                        <span>📋 {orgSubs.length} submissions</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ ORGANISATIONS TAB ════ */}
      {activeTab === 'orgs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">All Organisations</h2>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
            >
              + Create New
            </button>
          </div>

          {orgs.length === 0 ? (
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-12 text-center">
              <span className="text-4xl mb-4 block">🏢</span>
              <h3 className="text-white font-semibold mb-2">No organisations yet</h3>
              <p className="text-gray-400 text-sm mb-4">Create your first organisation to generate a custom onboarding link</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
              >
                + Create Organisation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orgs.map(org => {
                const orgSubs = submissions.filter(s => s.orgSlug === org.slug);
                const orgUsers = orgSubs.reduce((sum, s) => sum + (s.teamMembers?.length || 0), 0);
                const orgJurisdictions = [...new Set(orgSubs.flatMap(s => s.jurisdictions || []))];

                return (
                  <div key={org.id} className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{org.name}</h3>
                        <p className="text-blue-400 text-sm font-mono">pimlicosolutions.com/onboarding/{org.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://pimlicosolutions.com/onboarding/${org.slug}`);
                          }}
                          className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          📋 Copy Link
                        </button>
                        <button
                          onClick={() => toggleOrgActive(org)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            org.active
                              ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30'
                              : 'bg-green-600/20 text-green-300 hover:bg-green-600/30'
                          }`}
                        >
                          {org.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <span className="text-xs text-gray-400">Max Seats</span>
                        <p className="text-white font-bold">{org.maxSeats}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <span className="text-xs text-gray-400">Max Jurisdictions</span>
                        <p className="text-white font-bold">{org.maxJurisdictions}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <span className="text-xs text-gray-400">Submissions</span>
                        <p className="text-white font-bold">{orgSubs.length}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <span className="text-xs text-gray-400">Users Onboarded</span>
                        <p className="text-white font-bold">{orgUsers}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <span className="text-xs text-gray-400">Jurisdictions Used</span>
                        <p className="text-white font-bold">{orgJurisdictions.length}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-gray-500">Verticals:</span>
                      {(org.verticals || []).map(v => (
                        <span key={v} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{v}</span>
                      ))}
                    </div>

                    {org.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">Notes: {org.notes}</p>
                    )}

                    {orgSubs.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 font-medium">Submissions for {org.name}</span>
                          <button
                            onClick={() => downloadCSV(orgSubs, `onboarding-${org.slug}.csv`)}
                            className="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded hover:bg-green-600/30 transition-colors"
                          >
                            📥 Download CSV
                          </button>
                        </div>
                        <div className="space-y-2">
                          {orgSubs.map(s => (
                            <div key={s.id} className="bg-white/[0.03] rounded-lg p-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{s.company}</span>
                                <span className="text-gray-500">{new Date(s.submittedAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex gap-4 mt-1 text-gray-400">
                                <span>👥 {s.teamMembers?.length || 0} members</span>
                                <span>🌍 {s.jurisdictions?.length || 0} jurisdictions</span>
                                <span>📊 {s.verticals?.join(', ')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-600 mt-3">Created: {new Date(org.createdAt).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════ SUBMISSIONS TAB ════ */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Submissions</h2>
              <select
                value={selectedOrg || ''}
                onChange={e => setSelectedOrg(e.target.value || null)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="">All organisations</option>
                {orgs.map(o => (
                  <option key={o.slug} value={o.slug}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCSV(filteredSubmissions, `onboarding-${selectedOrg || 'all'}.csv`)}
                disabled={!filteredSubmissions.length}
                className="px-3 py-1.5 bg-green-600/20 text-green-300 text-xs font-medium rounded-lg hover:bg-green-600/30 disabled:opacity-40 transition-colors"
              >
                📥 Export CSV
              </button>
              <button
                onClick={() => downloadJSON(filteredSubmissions, `onboarding-${selectedOrg || 'all'}.json`)}
                disabled={!filteredSubmissions.length}
                className="px-3 py-1.5 bg-blue-600/20 text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-600/30 disabled:opacity-40 transition-colors"
              >
                📥 Export JSON
              </button>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-12 text-center">
              <span className="text-4xl mb-4 block">📋</span>
              <h3 className="text-white font-semibold mb-2">No submissions yet</h3>
              <p className="text-gray-400 text-sm">Submissions will appear here once users complete their onboarding forms</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.slice().reverse().map(s => (
                <SubmissionCard key={s.id} submission={s} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════ CREATE ORG TAB ════ */}
      {activeTab === 'create' && (
        <div className="max-w-2xl">
          <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Create Organisation</h2>

            <form onSubmit={handleCreateOrg} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Organisation Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={newOrg.name}
                    onChange={e => {
                      setNewOrg({ ...newOrg, name: e.target.value });
                      // Auto-generate slug from name
                      if (!newOrg.slug || newOrg.slug === slugify(newOrg.name)) {
                        setNewOrg(prev => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }));
                      } else {
                        setNewOrg(prev => ({ ...prev, name: e.target.value }));
                      }
                    }}
                    placeholder="e.g. Mozzartbet"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">URL Slug <span className="text-red-400">*</span></label>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">/onboarding/</span>
                    <input
                      type="text"
                      value={newOrg.slug}
                      onChange={e => setNewOrg({ ...newOrg, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      placeholder="mozzartbet"
                      required
                      className="flex-1 px-3.5 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Seats (Team Members)</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={newOrg.maxSeats}
                    onChange={e => setNewOrg({ ...newOrg, maxSeats: parseInt(e.target.value) || 10 })}
                    className="w-full px-3.5 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Jurisdictions</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={newOrg.maxJurisdictions}
                    onChange={e => setNewOrg({ ...newOrg, maxJurisdictions: parseInt(e.target.value) || 20 })}
                    className="w-full px-3.5 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Verticals toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Available Verticals</label>
                <div className="flex gap-2">
                  {['Gambling', 'Payments', 'Crypto', 'AI'].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setNewOrg(prev => ({
                          ...prev,
                          verticals: prev.verticals.includes(v)
                            ? prev.verticals.filter(x => x !== v)
                            : [...prev.verticals, v]
                        }));
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newOrg.verticals.includes(v)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Internal Notes</label>
                <textarea
                  value={newOrg.notes}
                  onChange={e => setNewOrg({ ...newOrg, notes: e.target.value })}
                  rows={3}
                  placeholder="Any internal notes about this client..."
                  className="w-full px-3.5 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Preview */}
              <div className="bg-blue-950/40 rounded-xl p-4 border border-blue-500/20">
                <h3 className="text-sm font-medium text-blue-300 mb-2">Preview</h3>
                <p className="text-white text-sm font-mono">pimlicosolutions.com/onboarding/{newOrg.slug || '...'}</p>
                <p className="text-xs text-gray-400 mt-1">{newOrg.maxSeats} seats · {newOrg.maxJurisdictions} jurisdictions · {newOrg.verticals.join(', ')}</p>
              </div>

              {createError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{createError}</p>
                </div>
              )}
              {createSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">{createSuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={creating || !newOrg.name.trim() || !newOrg.slug.trim()}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 disabled:opacity-40 transition-colors"
              >
                {creating ? 'Creating...' : 'Create Organisation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Submission Detail Card ─── */
function SubmissionCard({ submission: s }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">{s.company}</h3>
            <span className="text-xs text-gray-500 font-mono">{s.orgSlug}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>👥 {s.teamMembers?.length || 0}</span>
            <span>🌍 {s.jurisdictions?.length || 0}</span>
            <span className="text-xs">{new Date(s.submittedAt).toLocaleDateString()}</span>
            <span className={`text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-700/40 pt-4 space-y-4">
          {/* Team Members */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Team Members</h4>
            <div className="space-y-1.5">
              {(s.teamMembers || []).map((m, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.03] rounded-lg p-2.5 text-sm">
                  <span className="text-gray-500 text-xs w-5">{i + 1}.</span>
                  <span className="text-white font-medium">{m.name}</span>
                  <span className="text-blue-400">{m.email}</span>
                  {m.role && <span className="text-gray-500 text-xs">— {m.role}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Verticals */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Verticals</h4>
            <div className="flex gap-2">
              {(s.verticals || []).map(v => (
                <span key={v} className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">{v}</span>
              ))}
            </div>
          </div>

          {/* Jurisdictions */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Jurisdictions ({s.jurisdictions?.length || 0})</h4>
            <div className="flex flex-wrap gap-1.5">
              {(s.jurisdictions || []).map(j => (
                <span key={j} className="text-xs bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded">{j}</span>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Preferences</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className={`p-2.5 rounded-lg ${s.scheduleTraining ? 'bg-green-500/10 text-green-300' : 'bg-white/[0.03] text-gray-500'}`}>
                📞 Training: {s.scheduleTraining ? `Yes${s.preferredTrainingDate ? ` (${s.preferredTrainingDate})` : ''}` : 'No'}
              </div>
              <div className={`p-2.5 rounded-lg ${s.wantOnboardingGuide ? 'bg-green-500/10 text-green-300' : 'bg-white/[0.03] text-gray-500'}`}>
                📖 Guide: {s.wantOnboardingGuide ? 'Yes' : 'No'}
              </div>
              <div className={`p-2.5 rounded-lg ${s.participateInSurveys ? 'bg-green-500/10 text-green-300' : 'bg-white/[0.03] text-gray-500'}`}>
                📊 Surveys: {s.participateInSurveys ? 'Yes' : 'No'}
              </div>
              <div className={`p-2.5 rounded-lg ${s.participateInInterviews ? 'bg-green-500/10 text-green-300' : 'bg-white/[0.03] text-gray-500'}`}>
                🎤 Interviews: {s.participateInInterviews ? 'Yes' : 'No'}
              </div>
              <div className={`p-2.5 rounded-lg ${s.tryNewProducts ? 'bg-green-500/10 text-green-300' : 'bg-white/[0.03] text-gray-500'}`}>
                🧪 New Products: {s.tryNewProducts ? 'Yes' : 'No'}
              </div>
              {s.productsOfInterest?.length > 0 && (
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-300">
                  Products: {s.productsOfInterest.join(', ')}
                </div>
              )}
            </div>
          </div>

          {s.additionalNotes && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Notes</h4>
              <p className="text-sm text-gray-400 bg-white/[0.03] rounded-lg p-3">{s.additionalNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Slug helper ─── */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
