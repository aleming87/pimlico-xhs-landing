"use client";
import { useState, useEffect, useMemo } from 'react';

/* ─── Helpers ───────────────────────────────────────────────────── */
function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stars(n) {
  return '★'.repeat(n || 0) + '☆'.repeat(5 - (n || 0));
}

function countField(responses, path) {
  const counts = {};
  responses.forEach(r => {
    const val = path.split('.').reduce((o, k) => o?.[k], r);
    if (val) counts[val] = (counts[val] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

/* ─── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-500/15 text-blue-300',
    green: 'bg-green-500/15 text-green-300',
    amber: 'bg-amber-500/15 text-amber-300',
    red: 'bg-red-500/15 text-red-300',
    indigo: 'bg-indigo-500/15 text-indigo-300',
    purple: 'bg-purple-500/15 text-purple-300',
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

/* ─── HBar ──────────────────────────────────────────────────────── */
function HBar({ items, color = '#3b82f6' }) {
  if (!items.length) return <p className="text-xs text-gray-500">No data</p>;
  const mx = Math.max(...items.map(i => i.count), 1);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-gray-300 truncate mr-2">{item.label}</span>
            <span className="text-gray-500 shrink-0">{item.count}</span>
          </div>
          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.count / mx) * 100}%`, backgroundColor: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Rating badge helper ─────────────────────────────────────── */
function RatingBadge({ value, max = 5 }) {
  if (!value) return <span className="text-gray-600 text-xs">-</span>;
  const v = Number(value);
  const color = v >= 4 ? 'text-green-400' : v >= 3 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`text-sm font-semibold ${color}`}>{stars(v)}</span>;
}

/* ─── Section Ratings Inline ──────────────────────────────────── */
function SectionRatingsInline({ section, label }) {
  if (!section?.ratings || !Object.keys(section.ratings).length) return null;
  const entries = Object.entries(section.ratings);
  const sAvg = entries.length > 0 ? avg(entries.map(([, v]) => v)).toFixed(1) : null;
  return (
    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</h4>
        {sAvg && <span className="text-xs text-yellow-400 font-medium">{sAvg}/5 avg</span>}
      </div>
      <div className="space-y-1">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400 truncate">{k}</span>
            <RatingBadge value={v} />
          </div>
        ))}
      </div>
      {section.detailLevel && (
        <div className="mt-2 pt-2 border-t border-gray-700/30">
          <span className="text-[10px] text-gray-500">Detail level: </span>
          <span className={`text-xs font-medium ${section.detailLevel === 3 ? 'text-green-400' : section.detailLevel < 3 ? 'text-yellow-400' : 'text-amber-400'}`}>
            {['', 'Far too little', 'A bit too little', 'Just right', 'A bit too much', 'Far too much'][section.detailLevel] || 'N/A'}
          </span>
        </div>
      )}
      {section.detailAreasNeedingMore?.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-700/30">
          <span className="text-[10px] text-gray-500 block mb-1">Areas needing more detail:</span>
          <div className="flex flex-wrap gap-1">
            {section.detailAreasNeedingMore.map(a => (
              <span key={a} className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-[10px] rounded-full">{a}</span>
            ))}
          </div>
        </div>
      )}
      {section.watchlistSetup && (
        <div className="mt-2 pt-2 border-t border-gray-700/30">
          <span className="text-[10px] text-gray-500">Watchlist: </span>
          <span className={`text-xs font-medium ${section.watchlistSetup === 'Yes' ? 'text-green-400' : 'text-red-400'}`}>{section.watchlistSetup}</span>
        </div>
      )}
      {section.feedback && (
        <div className="mt-2 pt-2 border-t border-gray-700/30">
          <span className="text-[10px] text-gray-500 block mb-0.5">Feedback:</span>
          <p className="text-xs text-gray-300 leading-relaxed">{section.feedback}</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Dashboard
   ═══════════════════════════════════════════════════════════════════ */
export default function SurveyDashboard() {
  const [trialResponses, setTrialResponses] = useState([]);
  const [copilotResponses, setCopilotResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('trial'); // 'trial' | 'copilot'
  const [view, setView] = useState('responses'); // 'overview' | 'responses'
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [trialRes, copilotRes] = await Promise.all([
          fetch('/api/offboarding', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ responses: [] })),
          fetch('/api/xhs-monitoring-survey', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ responses: [] })),
        ]);
        setTrialResponses(trialRes.responses || []);
        setCopilotResponses(copilotRes.responses || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const responses = source === 'trial' ? trialResponses : copilotResponses;

  /* ── Trial analytics ──────────────────────────────────────────── */
  const trialAnalytics = useMemo(() => {
    if (!trialResponses.length) return null;
    // Collect all section ratings
    const allRatings = [];
    const sectionAverages = {};
    const sectionMeta = [
      { key: 'ui', label: 'UI & Experience' },
      { key: 'regulatory', label: 'Regulatory Monitoring' },
      { key: 'countryReports', label: 'Country Reports' },
      { key: 'integrations', label: 'Slack Integration' },
    ];

    sectionMeta.forEach(({ key, label }) => {
      const vals = [];
      trialResponses.forEach(r => {
        const sec = r.sections?.[key];
        if (sec?.ratings) Object.values(sec.ratings).forEach(v => { if (v > 0) { vals.push(v); allRatings.push(v); } });
      });
      sectionAverages[label] = vals.length ? +avg(vals).toFixed(1) : null;
    });

    const overallRatings = trialResponses.map(r => r.overallRating).filter(v => v > 0);
    const onboardingRatings = trialResponses.map(r => r.onboarding?.rating).filter(v => v > 0);
    const recommendCounts = countField(trialResponses, 'wouldRecommend');
    const expectationsCounts = countField(trialResponses, 'meetExpectations');
    const trialDurations = countField(trialResponses, 'trialDuration');
    const signUpEase = countField(trialResponses, 'onboarding.signUpEase');
    const accessIssues = countField(trialResponses, 'onboarding.accessIssues');
    const videoHelp = countField(trialResponses, 'onboarding.videoWouldHelp');
    const usedGuide = countField(trialResponses, 'onboarding.usedOnboardingGuide');

    // Upcoming features
    const upcomingTotals = {};
    trialResponses.forEach(r => {
      if (r.upcomingFeatureInterest) {
        Object.entries(r.upcomingFeatureInterest).forEach(([label, val]) => {
          if (!upcomingTotals[label]) upcomingTotals[label] = [];
          upcomingTotals[label].push(val);
        });
      }
    });
    const upcomingAvg = Object.entries(upcomingTotals)
      .map(([label, vals]) => ({ label, count: +avg(vals).toFixed(1) }))
      .sort((a, b) => b.count - a.count);

    return {
      total: trialResponses.length,
      avgOverall: overallRatings.length ? avg(overallRatings).toFixed(1) : 'N/A',
      avgFeature: allRatings.length ? avg(allRatings).toFixed(1) : 'N/A',
      avgOnboarding: onboardingRatings.length ? avg(onboardingRatings).toFixed(1) : 'N/A',
      sectionAverages,
      recommendCounts,
      expectationsCounts,
      trialDurations,
      signUpEase,
      accessIssues,
      videoHelp,
      usedGuide,
      upcomingAvg,
    };
  }, [trialResponses]);

  /* ── Loading / Error ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-400">Loading survey responses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 font-medium">Failed to load responses</p>
          <p className="text-red-400/70 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">📋 Survey Results</h1>
          <p className="text-sm text-gray-400 mt-1">
            {trialResponses.length} trial completion{trialResponses.length !== 1 ? 's' : ''}
            {copilotResponses.length > 0 && ` · ${copilotResponses.length} copilot feedback`}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Source toggle */}
          <div className="flex gap-1 bg-gray-800/60 rounded-lg p-1 border border-gray-700/50">
            <button onClick={() => { setSource('trial'); setExpandedId(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${source === 'trial' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
              Trial Completion ({trialResponses.length})
            </button>
            <button onClick={() => { setSource('copilot'); setExpandedId(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${source === 'copilot' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
              Copilot Feedback ({copilotResponses.length})
            </button>
          </div>
          {/* View toggle */}
          {source === 'trial' && trialResponses.length > 0 && (
            <div className="flex gap-1 bg-gray-800/60 rounded-lg p-1 border border-gray-700/50">
              <button onClick={() => setView('responses')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'responses' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                📝 Responses
              </button>
              <button onClick={() => setView('overview')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                📊 Overview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {responses.length === 0 && (
        <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-12 text-center">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-gray-400 font-medium">No responses yet</p>
          <p className="text-gray-500 text-sm mt-1">
            {source === 'trial'
              ? 'Responses will appear here once users complete the trial survey at /offboarding'
              : 'Responses will appear here once users complete the copilot feedback survey'}
          </p>
        </div>
      )}

      {/* ═══ TRIAL COMPLETION - OVERVIEW ═══════════════════════════ */}
      {source === 'trial' && view === 'overview' && trialAnalytics && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon="📋" label="Total Responses" value={trialAnalytics.total} color="blue" />
            <StatCard icon="⭐" label="Avg Overall Rating" value={`${trialAnalytics.avgOverall}/5`} color="amber" />
            <StatCard icon="📊" label="Avg Feature Rating" value={`${trialAnalytics.avgFeature}/5`} color="green" />
            <StatCard icon="🎓" label="Avg Onboarding" value={`${trialAnalytics.avgOnboarding}/5`} color="indigo" />
          </div>

          {/* Section averages */}
          <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Section Averages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(trialAnalytics.sectionAverages).map(([label, val]) => (
                <div key={label} className="bg-gray-900/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className={`text-xl font-bold ${val >= 4 ? 'text-green-400' : val >= 3 ? 'text-yellow-400' : val ? 'text-red-400' : 'text-gray-600'}`}>
                    {val ? `${val}/5` : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Would Recommend</h3>
              <HBar items={trialAnalytics.recommendCounts} color="#3b82f6" />
            </div>
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Met Expectations</h3>
              <HBar items={trialAnalytics.expectationsCounts} color="#8b5cf6" />
            </div>
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Trial Duration</h3>
              <HBar items={trialAnalytics.trialDurations} color="#14b8a6" />
            </div>
          </div>

          {/* Onboarding row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Sign-up Ease</h3>
              <HBar items={trialAnalytics.signUpEase} color="#22c55e" />
            </div>
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Access Issues</h3>
              <HBar items={trialAnalytics.accessIssues} color="#ef4444" />
            </div>
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Video Would Help</h3>
              <HBar items={trialAnalytics.videoHelp} color="#f59e0b" />
            </div>
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Used Onboarding Guide</h3>
              <HBar items={trialAnalytics.usedGuide} color="#6366f1" />
            </div>
          </div>

          {/* Upcoming features interest */}
          {trialAnalytics.upcomingAvg.length > 0 && (
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Upcoming Features Interest (avg)</h3>
              <div className="space-y-2">
                {trialAnalytics.upcomingAvg.map(({ label, count }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-300">{label}</span>
                      <span className="text-gray-500">{count}/5</span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500 bg-blue-500" style={{ width: `${(count / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ TRIAL COMPLETION - RESPONSES ══════════════════════════ */}
      {source === 'trial' && view === 'responses' && trialResponses.length > 0 && (
        <div className="space-y-3">
          {trialResponses.map((r) => {
            const isExpanded = expandedId === (r.id || r.submittedAt);
            const ratingVal = r.overallRating || r.avgRating;
            const ratingColor = ratingVal >= 4 ? 'text-green-400' : ratingVal >= 3 ? 'text-yellow-400' : ratingVal > 0 ? 'text-red-400' : 'text-gray-500';

            return (
              <div key={r.id || r.submittedAt} className="bg-gray-800/60 rounded-xl border border-gray-700/50 overflow-hidden">
                {/* Summary Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : (r.id || r.submittedAt))}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {r.name || 'Anonymous'}
                      {r.company && <span className="text-gray-500 font-normal ml-2">{r.company}</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.role && `${r.role} · `}{r.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Overall</p>
                      <p className={`text-lg font-bold ${ratingColor}`}>{ratingVal || '-'}/5</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Recommend</p>
                      <p className="text-sm font-medium text-white">{r.wouldRecommend || '-'}</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Date</p>
                      <p className="text-xs text-gray-400">
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                    <span className={`transition-transform text-gray-500 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-700/50 pt-4 space-y-4">
                    {/* Identity & Overall */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-gray-500 text-xs block">Trial Duration</span><span className="text-gray-300">{r.trialDuration || 'N/A'}</span></div>
                      <div><span className="text-gray-500 text-xs block">Overall Rating</span><span className={ratingColor}>{stars(r.overallRating)}</span></div>
                      <div><span className="text-gray-500 text-xs block">Met Expectations</span><span className="text-gray-300">{r.meetExpectations || 'N/A'}</span></div>
                      <div><span className="text-gray-500 text-xs block">Keep in Touch</span><span className="text-gray-300">{r.keepInTouch || 'N/A'}</span></div>
                    </div>

                    {/* Onboarding */}
                    {r.onboarding && (
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">🎓 Onboarding</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                          <div><span className="text-gray-500 block">Rating</span><RatingBadge value={r.onboarding.rating} /></div>
                          <div><span className="text-gray-500 block">Sign-up</span><span className="text-gray-300">{r.onboarding.signUpEase || '-'}</span></div>
                          <div><span className="text-gray-500 block">Access</span><span className={`${r.onboarding.accessIssues === 'No issues' ? 'text-green-400' : r.onboarding.accessIssues === 'Significant issues' ? 'text-red-400' : 'text-yellow-400'}`}>{r.onboarding.accessIssues || '-'}</span></div>
                          <div><span className="text-gray-500 block">Video</span><span className="text-gray-300">{r.onboarding.videoWouldHelp || '-'}</span></div>
                          <div><span className="text-gray-500 block">Guide</span><span className="text-gray-300">{r.onboarding.usedOnboardingGuide || '-'}</span></div>
                        </div>
                      </div>
                    )}

                    {/* Section Ratings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <SectionRatingsInline section={r.sections?.ui} label="🖥️ UI & Experience" />
                      <SectionRatingsInline section={r.sections?.regulatory} label="📡 Regulatory Monitoring" />
                      <SectionRatingsInline section={r.sections?.countryReports} label="🌍 Country Reports" />
                      <SectionRatingsInline section={r.sections?.integrations} label="💬 Slack Integration" />
                    </div>

                    {/* Upcoming Features */}
                    {r.upcomingFeatureInterest && Object.keys(r.upcomingFeatureInterest).length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">🚀 Upcoming Features Interest</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {Object.entries(r.upcomingFeatureInterest).map(([label, val]) => (
                            <div key={label}>
                              <span className="text-gray-500 block">{label}</span>
                              <span className={`font-medium ${val >= 4 ? 'text-blue-400' : val >= 3 ? 'text-gray-300' : 'text-gray-500'}`}>
                                {val}/5 {val >= 4 ? '- Very interested' : val >= 3 ? '- Moderate' : val >= 2 ? '- Slight' : '- Not interested'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Open-ended */}
                    {(r.mostValuable || r.missingFeatures || r.additionalFeedback) && (
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">💬 Open Feedback</h4>
                        <div className="space-y-2 text-xs">
                          {r.mostValuable && <div><span className="text-gray-500">Most valuable: </span><span className="text-gray-300">{r.mostValuable}</span></div>}
                          {r.missingFeatures && <div><span className="text-gray-500">Missing features: </span><span className="text-gray-300">{r.missingFeatures}</span></div>}
                          {r.additionalFeedback && <div><span className="text-gray-500">Additional: </span><span className="text-gray-300">{r.additionalFeedback}</span></div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ COPILOT FEEDBACK - RESPONSES ═════════════════════════ */}
      {source === 'copilot' && copilotResponses.length > 0 && (
        <div className="space-y-3">
          {copilotResponses.map((r) => {
            const isExpanded = expandedId === r.id;
            const satisfaction = Number(r.overallSatisfaction) || 0;
            const satColor = satisfaction >= 4 ? 'text-green-400' : satisfaction >= 3 ? 'text-yellow-400' : 'text-red-400';

            return (
              <div key={r.id} className="bg-gray-800/60 rounded-xl border border-gray-700/50 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {r.firstName} {r.lastName}
                      {r.company && <span className="text-gray-500 font-normal ml-2">{r.company}</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.jobTitle && `${r.jobTitle} · `}{r.email}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Satisfaction</p>
                      <p className={`text-lg font-bold ${satColor}`}>{satisfaction}/5</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">NPS</p>
                      <p className="text-lg font-bold text-white">{r.npsScore || '-'}/10</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Date</p>
                      <p className="text-xs text-gray-400">
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                    <span className={`transition-transform text-gray-500 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-700/50 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">⭐ Ratings</h4>
                        <div className="space-y-1">
                          {[
                            ['Overall', r.overallSatisfaction],
                            ['Coverage', r.coverageRating],
                            ['Depth', r.depthRating],
                            ['Timeliness', r.timelinessRating],
                            ['Ease of Use', r.easeOfUseRating],
                          ].map(([label, v]) => (
                            <div key={label} className="flex justify-between">
                              <span className="text-xs text-gray-500">{label}</span>
                              <RatingBadge value={v} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">🤖 AI & Tools</h4>
                        <div className="space-y-1 text-xs">
                          <div><span className="text-gray-500">AI Tools: </span><span className="text-gray-300">{Array.isArray(r.aiToolsUsed) ? r.aiToolsUsed.join(', ') : r.aiToolsUsed || 'N/A'}</span></div>
                          <div><span className="text-gray-500">Trust: </span><span className="text-gray-300">{r.aiTrustLevel || 'N/A'}</span></div>
                          <div><span className="text-gray-500">Interest: </span><span className="text-gray-300">{r.aiFeatureInterest || 'N/A'}</span></div>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">💬 Feedback</h4>
                        <div className="space-y-1 text-xs">
                          <div><span className="text-gray-500">Most Valuable: </span><span className="text-gray-300">{r.mostValuableFeature || 'N/A'}</span></div>
                          <div><span className="text-gray-500">Would Change: </span><span className="text-gray-300">{r.whatWouldChange || 'N/A'}</span></div>
                          <div><span className="text-gray-500">Beta: </span><span className="text-gray-300">{r.betaInterest || 'N/A'}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
