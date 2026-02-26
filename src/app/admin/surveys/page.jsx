"use client";
import { useState, useEffect, useMemo } from 'react';

// ─── Mini Bar Chart ────────────────────────────────────────────────
function BarChart({ data }) {
  if (!data.length) return null;
  const mx = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <span className="text-[10px] text-gray-400 font-medium">{d.value}</span>
          <div
            className="w-full rounded-t transition-all"
            style={{ height: `${(d.value / mx) * 100}%`, minHeight: d.value > 0 ? 4 : 0, backgroundColor: d.color || '#6366f1' }}
          />
          <span className="text-[9px] text-gray-500 truncate max-w-full text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Horizontal Bar Chart ──────────────────────────────────────────
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
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(item.count / mx) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-500/15 text-indigo-300',
    green:  'bg-green-500/15 text-green-300',
    blue:   'bg-blue-500/15 text-blue-300',
    amber:  'bg-amber-500/15 text-amber-300',
    purple: 'bg-purple-500/15 text-purple-300',
    red:    'bg-red-500/15 text-red-300',
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

// ─── Helpers ───────────────────────────────────────────────────────
function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function countItems(responses, key) {
  const counts = {};
  responses.forEach(r => {
    const val = r[key];
    if (Array.isArray(val)) {
      val.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    } else if (val) {
      counts[val] = (counts[val] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function npsCategory(score) {
  if (score >= 9) return 'promoter';
  if (score >= 7) return 'passive';
  return 'detractor';
}

// ─── Main Dashboard ────────────────────────────────────────────────
export default function SurveyDashboard() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [tab, setTab] = useState('overview'); // overview | responses

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/xhs-monitoring-survey', { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          setResponses(json.responses || []);
        } else {
          setError(json.error || 'Failed to load');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ─── Computed Analytics ────────────────────────────────────────
  const analytics = useMemo(() => {
    if (!responses.length) return null;

    const npsScores = responses.map(r => Number(r.npsScore)).filter(n => !isNaN(n));
    const promoters = npsScores.filter(s => s >= 9).length;
    const detractors = npsScores.filter(s => s <= 6).length;
    const nps = npsScores.length
      ? Math.round(((promoters - detractors) / npsScores.length) * 100)
      : null;

    const ratingKeys = [
      { key: 'overallSatisfaction', label: 'Overall Satisfaction' },
      { key: 'coverageRating', label: 'Coverage' },
      { key: 'depthRating', label: 'Depth' },
      { key: 'timelinessRating', label: 'Timeliness' },
      { key: 'easeOfUseRating', label: 'Ease of Use' },
    ];
    const avgRatings = ratingKeys.map(({ key, label }) => {
      const vals = responses.map(r => Number(r[key])).filter(n => !isNaN(n) && n > 0);
      return { label, value: vals.length ? +(avg(vals).toFixed(1)) : 0 };
    });

    const npsDistribution = [0,1,2,3,4,5,6,7,8,9,10].map(score => ({
      label: String(score),
      value: npsScores.filter(s => s === score).length,
      color: score >= 9 ? '#22c55e' : score >= 7 ? '#eab308' : '#ef4444',
    }));

    const usageFreqs = countItems(responses, 'usageFrequency');
    const aiTools = countItems(responses, 'aiToolsUsed');
    const aiTrust = countItems(responses, 'aiTrustLevel');
    const aiInterest = countItems(responses, 'aiFeatureInterest');
    const aiFeatures = countItems(responses, 'desiredAiFeatures');
    const desiredFeatures = countItems(responses, 'desiredFeatures');
    const otherSources = countItems(responses, 'otherRegSources');
    const supportChannels = countItems(responses, 'supportChannelsUsed');
    const betaInterest = countItems(responses, 'betaInterest');

    const avgSatisfaction = responses.map(r => Number(r.overallSatisfaction)).filter(n => !isNaN(n) && n > 0);

    return {
      total: responses.length,
      nps,
      npsDistribution,
      avgSatisfaction: avgSatisfaction.length ? avg(avgSatisfaction).toFixed(1) : 'N/A',
      avgRatings,
      usageFreqs,
      aiTools,
      aiTrust,
      aiInterest,
      aiFeatures,
      desiredFeatures,
      otherSources,
      supportChannels,
      betaInterest,
      promoters,
      detractors,
      passives: npsScores.length - promoters - detractors,
    };
  }, [responses]);

  // ─── Loading / Error ───────────────────────────────────────────
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            📋 XHS™ Copilot Feedback
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {responses.length} response{responses.length !== 1 ? 's' : ''} collected
          </p>
        </div>
        <div className="flex gap-1 bg-gray-800/60 rounded-lg p-1 border border-gray-700/50">
          {['overview', 'responses'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t === 'overview' ? '📊 Overview' : '📝 Responses'}
            </button>
          ))}
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-12 text-center">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-gray-400 font-medium">No responses yet</p>
          <p className="text-gray-500 text-sm mt-1">Responses will appear here once users complete the survey.</p>
        </div>
      ) : tab === 'overview' ? (
        /* ─── OVERVIEW TAB ──────────────────────────────────── */
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <StatCard icon="📋" label="Total Responses" value={analytics.total} color="indigo" />
            <StatCard
              icon="📈" label="NPS Score" color={analytics.nps >= 50 ? 'green' : analytics.nps >= 0 ? 'amber' : 'red'}
              value={analytics.nps !== null ? analytics.nps : 'N/A'}
              sub={`${analytics.promoters}P / ${analytics.passives}N / ${analytics.detractors}D`}
            />
            <StatCard icon="⭐" label="Avg Satisfaction" value={`${analytics.avgSatisfaction}/5`} color="amber" />
            <StatCard icon="🤖" label="Use AI Tools" value={`${analytics.aiTools.filter(t => t.label !== 'None — I don\'t use AI tools').reduce((s, t) => s + t.count, 0)}/${analytics.total}`} color="purple" />
            <StatCard icon="🚀" label="Beta Interest" value={analytics.betaInterest.find(b => b.label === 'Yes')?.count || 0} color="blue" sub={`of ${analytics.total}`} />
            <StatCard icon="💬" label="Usage Freq" value={analytics.usageFreqs[0]?.label || 'N/A'} color="green" sub={`${analytics.usageFreqs[0]?.count || 0} users`} />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* NPS Distribution */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">NPS Distribution</h3>
              <BarChart data={analytics.npsDistribution} />
            </div>

            {/* Average Ratings */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Average Ratings</h3>
              <BarChart data={analytics.avgRatings.map(r => ({
                ...r,
                color: r.value >= 4 ? '#22c55e' : r.value >= 3 ? '#eab308' : '#ef4444',
              }))} />
            </div>

            {/* AI Trust Levels */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">AI Trust for Compliance</h3>
              <HBar items={analytics.aiTrust} color="#8b5cf6" />
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* AI Tools Used */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">AI Tools Used</h3>
              <HBar items={analytics.aiTools} color="#6366f1" />
            </div>

            {/* Desired AI Capabilities */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Desired AI Capabilities</h3>
              <HBar items={analytics.aiFeatures} color="#a855f7" />
            </div>

            {/* AI Feature Interest */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">AI Feature Interest</h3>
              <HBar items={analytics.aiInterest} color="#ec4899" />
            </div>
          </div>

          {/* Charts Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Desired Features */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Most Requested Features</h3>
              <HBar items={analytics.desiredFeatures.slice(0, 8)} color="#3b82f6" />
            </div>

            {/* Other Sources */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Other Regulatory Sources Used</h3>
              <HBar items={analytics.otherSources.slice(0, 8)} color="#14b8a6" />
            </div>

            {/* Support Channels & Beta */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Support Channels Used</h3>
              <HBar items={analytics.supportChannels} color="#f59e0b" />
            </div>
          </div>
        </div>
      ) : (
        /* ─── RESPONSES TAB ─────────────────────────────────── */
        <div className="space-y-3">
          {responses.map((r) => {
            const isExpanded = expandedId === r.id;
            const nps = Number(r.npsScore);
            const cat = npsCategory(nps);
            const catColors = { promoter: 'text-green-400', passive: 'text-yellow-400', detractor: 'text-red-400' };

            return (
              <div key={r.id} className="bg-gray-800/60 rounded-xl border border-gray-700/50 overflow-hidden">
                {/* Summary Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {r.firstName} {r.lastName}
                      <span className="text-gray-500 font-normal ml-2">{r.company}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.jobTitle} • {r.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">NPS</p>
                      <p className={`text-lg font-bold ${catColors[cat]}`}>{nps}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Satisfaction</p>
                      <p className="text-lg font-bold text-white">{r.overallSatisfaction}/5</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Date</p>
                      <p className="text-xs text-gray-400">{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                    </div>
                    <span className={`transition-transform text-gray-500 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-700/50 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {/* Ratings */}
                      <DetailSection title="⭐ Ratings">
                        <DetailRow label="Overall Satisfaction" value={`${r.overallSatisfaction}/5`} />
                        <DetailRow label="Coverage" value={`${r.coverageRating}/5`} />
                        <DetailRow label="Depth" value={`${r.depthRating}/5`} />
                        <DetailRow label="Timeliness" value={`${r.timelinessRating}/5`} />
                        <DetailRow label="Ease of Use" value={`${r.easeOfUseRating}/5`} />
                        <DetailRow label="Usage Frequency" value={r.usageFrequency} />
                      </DetailSection>

                      {/* Coverage */}
                      <DetailSection title="🌍 Coverage">
                        <DetailRow label="Other Sources" value={Array.isArray(r.otherRegSources) ? r.otherRegSources.join(', ') : r.otherRegSources} />
                        <DetailRow label="Source Specifics" value={r.otherRegSourcesSpecifics} />
                        <DetailRow label="Missing Items" value={r.coverageMissedItems} />
                        <DetailRow label="Missed Updates" value={r.missedUpdates} />
                      </DetailSection>

                      {/* AI & Compliance */}
                      <DetailSection title="🤖 AI & Compliance">
                        <DetailRow label="AI Tools Used" value={Array.isArray(r.aiToolsUsed) ? r.aiToolsUsed.join(', ') : r.aiToolsUsed} />
                        <DetailRow label="AI Trust Level" value={r.aiTrustLevel} />
                        <DetailRow label="AI Feature Interest" value={r.aiFeatureInterest} />
                        <DetailRow label="Desired AI Features" value={Array.isArray(r.desiredAiFeatures) ? r.desiredAiFeatures.join(', ') : r.desiredAiFeatures} />
                      </DetailSection>

                      {/* Integration */}
                      <DetailSection title="🔗 Integrations">
                        <DetailRow label="Uses Slack" value={r.usedSlackIntegration} />
                        <DetailRow label="Integration Rating" value={r.integrationRating ? `${r.integrationRating}/5` : null} />
                        <DetailRow label="Integration Feedback" value={r.integrationFeedback} />
                        <DetailRow label="Desired Integrations" value={Array.isArray(r.desiredIntegrations) ? r.desiredIntegrations.join(', ') : r.desiredIntegrations} />
                      </DetailSection>

                      {/* Support */}
                      <DetailSection title="💬 Support">
                        <DetailRow label="Channels Used" value={Array.isArray(r.supportChannelsUsed) ? r.supportChannelsUsed.join(', ') : r.supportChannelsUsed} />
                        <DetailRow label="Support Rating" value={r.supportRating ? `${r.supportRating}/5` : null} />
                        <DetailRow label="Support Feedback" value={r.supportFeedback} />
                      </DetailSection>

                      {/* Country Reports & News */}
                      <DetailSection title="📄 Reports & News">
                        <DetailRow label="Uses Country Reports" value={r.usedCountryReports} />
                        <DetailRow label="Reports Rating" value={r.countryReportsRating ? `${r.countryReportsRating}/5` : null} />
                        <DetailRow label="Reports Feedback" value={r.countryReportsFeedback} />
                        <DetailRow label="News Beneficial" value={r.newsCoverageBeneficial} />
                        <DetailRow label="News Comments" value={r.newsCoverageComments} />
                      </DetailSection>

                      {/* Features & Improvements */}
                      <DetailSection title="🔮 Features & Improvements">
                        <DetailRow label="Most Valuable Feature" value={r.mostValuableFeature} />
                        <DetailRow label="What Would Change" value={r.whatWouldChange} />
                        <DetailRow label="Desired Features" value={Array.isArray(r.desiredFeatures) ? r.desiredFeatures.join(', ') : r.desiredFeatures} />
                        <DetailRow label="Additional Comments" value={r.additionalComments} />
                      </DetailSection>

                      {/* Beta & Contact */}
                      <DetailSection title="🚀 Beta & Contact">
                        <DetailRow label="Beta Interest" value={r.betaInterest} />
                        <DetailRow label="Contact Methods" value={Array.isArray(r.preferredContactMethods) ? r.preferredContactMethods.join(', ') : r.preferredContactMethods} />
                      </DetailSection>
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

// ─── Detail Components ──────────────────────────────────────────────
function DetailSection({ title, children }) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
      <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  const display = value || 'N/A';
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 text-xs shrink-0 w-28">{label}:</span>
      <span className={`text-xs ${display === 'N/A' ? 'text-gray-600' : 'text-gray-300'}`}>{display}</span>
    </div>
  );
}
