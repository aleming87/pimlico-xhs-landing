"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useWorkflow, STAGES } from './WorkflowContext';
import { useArticles } from './ArticlesContext';

const STAGE_COLORS = {
  ideas: { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-300', bar: 'bg-purple-500' },
  drafting: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-300', bar: 'bg-blue-500' },
  collateral: { bg: 'bg-indigo-500/15', border: 'border-indigo-500/30', text: 'text-indigo-300', bar: 'bg-indigo-500' },
  copy: { bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', text: 'text-cyan-300', bar: 'bg-cyan-500' },
  publishing: { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-300', bar: 'bg-green-500' },
};

const STAGE_HREFS = {
  ideas: '/admin/ideas',
  drafting: '/admin/drafting',
  collateral: '/admin/collateral',
  copy: '/admin/copy',
  publishing: '/admin/publishing',
};

const CATEGORY_COLORS = {
  'Gambling':      { bg: 'bg-red-500/15', text: 'text-red-300', bar: 'bg-red-500', ring: 'ring-red-500/30' },
  'AI Regulation': { bg: 'bg-violet-500/15', text: 'text-violet-300', bar: 'bg-violet-500', ring: 'ring-violet-500/30' },
  'Payments':      { bg: 'bg-emerald-500/15', text: 'text-emerald-300', bar: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
  'Crypto':        { bg: 'bg-amber-500/15', text: 'text-amber-300', bar: 'bg-amber-500', ring: 'ring-amber-500/30' },
};
const DEFAULT_CAT_COLOR = { bg: 'bg-gray-500/15', text: 'text-gray-300', bar: 'bg-gray-500', ring: 'ring-gray-500/30' };

// ─── Mini Bar Chart (pure CSS) ─────────────────────────────────────
function MiniBarChart({ data }) {
  if (!data.length) return null;
  const mx = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t transition-all" style={{ height: `${(d.value / mx) * 100}%`, minHeight: d.value > 0 ? 4 : 0, backgroundColor: d.color || '#6366f1' }} />
          <span className="text-[8px] text-gray-500 truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut/Ring Chart (SVG) ────────────────────────────────────────
function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return <div className="flex items-center justify-center" style={{ width: size, height: size }}><span className="text-gray-600 text-xs">No data</span></div>;
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dashLen = pct * circumference;
        const dashOffset = offset * circumference;
        offset += pct;
        return (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={seg.color} strokeWidth={12}
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={-dashOffset}
            className="transition-all duration-500"
          />
        );
      })}
      <circle cx={size / 2} cy={size / 2} r={radius - 14} fill="#1f2937" />
    </svg>
  );
}

// ─── Content Health Gauge (half-arc SVG) ───────────────────────────
function HealthGauge({ score, label }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';
  const radius = 36;
  const circumference = Math.PI * radius;
  const dashLen = (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width={88} height={52} viewBox="0 0 88 52">
        <path d="M 8 48 A 36 36 0 0 1 80 48" fill="none" stroke="#374151" strokeWidth={7} strokeLinecap="round" />
        <path d="M 8 48 A 36 36 0 0 1 80 48" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={`${dashLen} ${circumference}`} className="transition-all duration-700" />
        <text x="44" y="42" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" className="rotate-0" transform="">{score}</text>
      </svg>
      <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}

// ─── Mini Calendar ─────────────────────────────────────────────────
function MiniCalendar({ items, articles }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const activityDates = useMemo(() => {
    const map = {};
    items.filter(i => i.scheduledDate).forEach(i => {
      const d = i.scheduledDate.split('T')[0];
      if (!map[d]) map[d] = { workflow: [], articles: [] };
      map[d].workflow.push(i);
    });
    articles.forEach(a => {
      if (a.date) {
        const d = a.date.split('T')[0];
        if (!map[d]) map[d] = { workflow: [], articles: [] };
        map[d].articles.push(a);
      }
    });
    return map;
  }, [items, articles]);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-1 text-gray-400 hover:text-white rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-semibold text-white">{monthNames[month]} {year}</span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-1 text-gray-400 hover:text-white rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px text-center">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-[10px] text-gray-500 font-medium py-1">{d}</div>
        ))}
        {days.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const activity = activityDates[dateStr];
          const hasArticle = activity?.articles?.length > 0;
          const hasWorkflow = activity?.workflow?.length > 0;
          return (
            <div key={i} className={`relative py-1.5 text-[11px] rounded-md transition-colors cursor-default ${
              isToday ? 'bg-indigo-600 text-white font-bold' :
              hasArticle ? 'bg-green-500/15 text-green-300 font-medium' :
              hasWorkflow ? 'bg-gray-700/60 text-white font-medium' : 'text-gray-500'
            }`} title={activity ? `${(activity.articles || []).map(a => a.title).join(', ')}${activity.workflow?.length ? ` + ${activity.workflow.length} pipeline` : ''}` : ''}>
              {d}
              {activity && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {hasArticle && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                  {hasWorkflow && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-2 px-1">
        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><span className="text-[9px] text-gray-500">Published article</span></div>
        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /><span className="text-[9px] text-gray-500">Pipeline item</span></div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { items, stats, getByStage } = useWorkflow();
  const { articles } = useArticles();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const sorted = [...items].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setRecentActivity(sorted.slice(0, 8));
  }, [items]);

  const totalPipeline = stats.total;
  const completionPct = totalPipeline > 0
    ? Math.round((stats.byStage.publishing / totalPipeline) * 100)
    : 0;

  // ─── Article Analytics ──────────────────────────────────────
  const analytics = useMemo(() => {
    const cats = {};
    const tagMap = {};
    let premiumCount = 0;
    let featuredCount = 0;
    let totalWords = 0;
    let articlesWithImage = 0;
    let articlesWithExcerpt = 0;
    let articlesWithTags = 0;
    let articlesWithOgImage = 0;

    articles.forEach(a => {
      const cat = a.category || 'Uncategorised';
      cats[cat] = (cats[cat] || 0) + 1;
      (a.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; });
      if (a.isPremium) premiumCount++;
      if (a.featured) featuredCount++;
      const wc = a.content ? a.content.split(/\s+/).length : 0;
      totalWords += wc;
      if (a.image) articlesWithImage++;
      if (a.excerpt && a.excerpt.length > 20) articlesWithExcerpt++;
      if (a.tags && a.tags.length > 0) articlesWithTags++;
      if (a.ogImage) articlesWithOgImage++;
    });

    const totalArticles = articles.length || 1;
    const healthScore = Math.round(
      (articlesWithImage / totalArticles) * 25 +
      (articlesWithExcerpt / totalArticles) * 25 +
      (articlesWithTags / totalArticles) * 25 +
      (articlesWithOgImage / totalArticles) * 25
    );

    const seoScores = articles.map(a => {
      let score = 0;
      if (a.title && a.title.length >= 20 && a.title.length <= 70) score += 25;
      else if (a.title) score += 10;
      if (a.excerpt && a.excerpt.length >= 50 && a.excerpt.length <= 160) score += 25;
      else if (a.excerpt) score += 10;
      if (a.image) score += 25;
      if (a.ogImage) score += 15;
      if (a.tags && a.tags.length >= 2) score += 10;
      else if (a.tags?.length) score += 5;
      return { ...a, seoScore: Math.min(score, 100) };
    });
    const avgSeo = seoScores.length > 0 ? Math.round(seoScores.reduce((s, a) => s + a.seoScore, 0) / seoScores.length) : 0;

    // Publishing cadence — last 6 months
    const now = new Date();
    const monthLabels = [];
    const monthCounts = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthLabels.push(d.toLocaleDateString('en-GB', { month: 'short' }));
      monthCounts.push(articles.filter(a => a.date && a.date.startsWith(key)).length);
    }

    const topTags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 15);
    const articlesByLength = [...articles].map(a => ({
      ...a,
      wordCount: a.content ? a.content.split(/\s+/).length : 0,
    })).sort((a, b) => b.wordCount - a.wordCount);

    const needsAttention = seoScores.filter(a => a.seoScore < 60).sort((a, b) => a.seoScore - b.seoScore).slice(0, 5);

    const avgReadTime = articles.length > 0
      ? Math.round(articles.reduce((s, a) => s + (parseInt(a.readTime) || 0), 0) / articles.length)
      : 0;

    return { categories: cats, topTags, premiumCount, featuredCount, totalWords, avgWords: Math.round(totalWords / totalArticles), avgReadTime, healthScore, avgSeo, seoScores, needsAttention, articlesByLength, monthLabels, monthCounts, articlesWithImage, articlesWithExcerpt, articlesWithTags, articlesWithOgImage };
  }, [articles]);

  // Social posts stats from localStorage
  const publishingPosts = useMemo(() => {
    try { const s = localStorage.getItem('xhs-publishing-posts-v2'); return s ? JSON.parse(s) : []; } catch { return []; }
  }, []);
  const publishedPosts = publishingPosts.filter(p => p.status === 'published').length;
  const scheduledPosts = publishingPosts.filter(p => p.status === 'scheduled').length;

  // Donut segments
  const catSegments = useMemo(() => {
    const catColors = { 'Gambling': '#ef4444', 'AI Regulation': '#8b5cf6', 'Payments': '#10b981', 'Crypto': '#f59e0b' };
    return Object.entries(analytics.categories).map(([cat, count]) => ({
      label: cat, value: count, color: catColors[cat] || '#6b7280',
    }));
  }, [analytics.categories]);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Content analytics & workflow overview · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs font-medium rounded-full border border-gray-700/50">{articles.length} articles</span>
          <span className="px-3 py-1.5 bg-indigo-600/15 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/30">{totalPipeline} in pipeline</span>
        </div>
      </div>

      {/* ─── Top KPI Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Articles', value: articles.length, icon: '📰', color: 'text-white', sub: `${analytics.avgWords.toLocaleString()} avg words` },
          { label: 'Premium', value: analytics.premiumCount, icon: '⭐', color: 'text-amber-300', sub: `${articles.length > 0 ? Math.round((analytics.premiumCount / articles.length) * 100) : 0}% of library` },
          { label: 'Pipeline Items', value: totalPipeline, icon: '📋', color: 'text-indigo-300', sub: `${stats.thisWeek} active this week` },
          { label: 'Published Rate', value: `${completionPct}%`, icon: '✅', color: 'text-green-300', sub: `${stats.byStage.publishing || 0} at finish line` },
          { label: 'Social Posts', value: publishedPosts, icon: '📢', color: 'text-cyan-300', sub: `${scheduledPosts} scheduled` },
          { label: 'Content Health', value: `${analytics.healthScore}`, icon: '💚', color: analytics.healthScore >= 80 ? 'text-green-300' : analytics.healthScore >= 60 ? 'text-yellow-300' : 'text-red-300', sub: `SEO avg: ${analytics.avgSeo}%` },
        ].map(kpi => (
          <div key={kpi.label} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{kpi.icon}</span>
              <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
            </div>
            <p className="text-xs font-semibold text-gray-300">{kpi.label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ─── Pipeline Flow ────────────────────────────────── */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">📋 Pipeline Flow</h2>
        <div className="flex items-center gap-2">
          {STAGES.map((stage, i) => {
            const count = stats.byStage[stage.key] || 0;
            const c = STAGE_COLORS[stage.key];
            const pct = totalPipeline > 0 ? Math.round((count / totalPipeline) * 100) : 0;
            return (
              <div key={stage.key} className="flex items-center gap-2 flex-1">
                <Link href={STAGE_HREFS[stage.key]} className={`flex-1 ${c.bg} ${c.border} border rounded-lg p-3 text-center hover:brightness-125 transition-all`}>
                  <div className="text-lg mb-1">{stage.icon}</div>
                  <div className={`text-xs font-semibold ${c.text}`}>{stage.label}</div>
                  <div className={`text-lg font-bold ${c.text} mt-1`}>{count}</div>
                  <div className="w-full bg-gray-700/50 rounded-full h-1 mt-2">
                    <div className={`${c.bar} h-1 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </Link>
                {i < STAGES.length - 1 && (
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Main Analytics Grid ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Category Breakdown */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-4">📊 Category Breakdown</h2>
            <div className="flex items-center gap-4">
              <DonutChart segments={catSegments} size={110} />
              <div className="flex-1 space-y-2">
                {Object.entries(analytics.categories).map(([cat, count]) => {
                  const cc = CATEGORY_COLORS[cat] || DEFAULT_CAT_COLOR;
                  const pct = Math.round((count / articles.length) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs font-medium ${cc.text}`}>{cat}</span>
                        <span className="text-xs text-gray-400">{count} <span className="text-gray-600">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-700/40 rounded-full h-1.5">
                        <div className={`${cc.bar} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Publishing Cadence */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">📈 Publishing Cadence</h2>
              <span className="text-[10px] text-gray-500">Last 6 months</span>
            </div>
            <MiniBarChart
              data={analytics.monthLabels.map((label, i) => ({
                label, value: analytics.monthCounts[i],
                color: analytics.monthCounts[i] > 0 ? '#6366f1' : '#374151',
              }))}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/40">
              <div>
                <span className="text-[10px] text-gray-500">Total published</span>
                <p className="text-sm font-bold text-white">{analytics.monthCounts.reduce((a, b) => a + b, 0)}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500">Avg/month</span>
                <p className="text-sm font-bold text-white">{(analytics.monthCounts.reduce((a, b) => a + b, 0) / 6).toFixed(1)}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500">Avg read time</span>
                <p className="text-sm font-bold text-white">{analytics.avgReadTime} min</p>
              </div>
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-3">🏷️ Top Tags</h2>
            <div className="flex flex-wrap gap-1.5">
              {analytics.topTags.map(([tag, count]) => (
                <span key={tag}
                  className="px-2.5 py-1 bg-gray-700/60 text-gray-300 rounded-full text-[10px] font-medium border border-gray-600/30 hover:bg-gray-700 transition-colors"
                  style={{ fontSize: `${Math.min(12, 9 + count)}px` }}>
                  {tag} <span className="text-gray-500 ml-0.5">×{count}</span>
                </span>
              ))}
              {analytics.topTags.length === 0 && <span className="text-gray-500 text-xs">No tags yet</span>}
            </div>
          </div>
        </div>

        {/* Middle column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Content Health */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-4">💚 Content Health</h2>
            <div className="flex justify-around mb-4">
              <HealthGauge score={analytics.healthScore} label="Overall" />
              <HealthGauge score={analytics.avgSeo} label="SEO Score" />
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Has featured image', count: analytics.articlesWithImage, icon: '🖼️' },
                { label: 'Has excerpt (50+ chars)', count: analytics.articlesWithExcerpt, icon: '📝' },
                { label: 'Has tags', count: analytics.articlesWithTags, icon: '🏷️' },
                { label: 'Has OG image', count: analytics.articlesWithOgImage, icon: '📸' },
              ].map(item => {
                const pct = articles.length > 0 ? Math.round((item.count / articles.length) * 100) : 0;
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xs">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] text-gray-400">{item.label}</span>
                        <span className="text-[11px] text-gray-300 font-medium">{item.count}/{articles.length}</span>
                      </div>
                      <div className="w-full bg-gray-700/40 rounded-full h-1">
                        <div className={`h-1 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-3">⚠️ Needs Attention</h2>
            <p className="text-[10px] text-gray-500 mb-3">Articles with low SEO scores — missing images, excerpts, or tags</p>
            {analytics.needsAttention.length > 0 ? (
              <div className="space-y-2">
                {analytics.needsAttention.map(a => {
                  const cc = CATEGORY_COLORS[a.category] || DEFAULT_CAT_COLOR;
                  return (
                    <div key={a.id} className="flex items-center gap-2 bg-gray-700/30 rounded-lg px-3 py-2">
                      <div className={`w-8 h-8 rounded-lg ${cc.bg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-sm font-bold ${a.seoScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{a.seoScore}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{a.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {!a.image && <span className="text-[9px] text-red-400">❌ No image</span>}
                          {(!a.excerpt || a.excerpt.length < 50) && <span className="text-[9px] text-red-400">❌ Short excerpt</span>}
                          {(!a.tags || a.tags.length === 0) && <span className="text-[9px] text-red-400">❌ No tags</span>}
                          {!a.ogImage && <span className="text-[9px] text-yellow-500">⚠ No OG image</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="text-2xl mb-2 block">🎉</span>
                <p className="text-sm text-green-400 font-medium">All articles look healthy!</p>
                <p className="text-[10px] text-gray-500 mt-1">Every article has good SEO coverage</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <h2 className="text-sm font-semibold text-white mb-3">⚡ Quick Actions</h2>
            <div className="space-y-1.5">
              <Link href="/admin/ideas" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-300 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">💡 Capture new idea</Link>
              <Link href="/admin/drafting" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-300 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors">✏️ Draft an article</Link>
              <Link href="/admin/collateral" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-indigo-300 bg-indigo-500/10 rounded-lg hover:bg-blue-500/20 transition-colors">🎨 Create marketing asset</Link>
              <Link href="/admin/publishing" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-300 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors">🚀 Schedule a post</Link>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Calendar */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <h2 className="text-sm font-semibold text-white mb-3">📅 Content Calendar</h2>
            <MiniCalendar items={items} articles={articles} />
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">⚡ Recent Activity</h2>
              <span className="text-[10px] text-gray-500">{stats.thisWeek} this week</span>
            </div>
            {recentActivity.length > 0 ? (
              <div className="space-y-1.5">
                {recentActivity.map(item => {
                  const c = STAGE_COLORS[item.stage];
                  return (
                    <Link key={item.id} href={STAGE_HREFS[item.stage]} className="flex items-center gap-2.5 bg-gray-700/30 rounded-lg px-3 py-2 hover:bg-gray-700/50 transition-colors group">
                      <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-full ${c.bg} ${c.text} ${c.border} border`}>
                        {STAGES.find(s => s.key === item.stage)?.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate group-hover:text-indigo-300 transition-colors">{item.title || 'Untitled'}</p>
                        <p className="text-[9px] text-gray-500">{new Date(item.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {item.priority}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-xs">No pipeline items yet</p>
                <Link href="/admin/ideas" className="text-indigo-400 text-xs hover:text-indigo-300 mt-1 inline-block">+ Start with an idea →</Link>
              </div>
            )}
          </div>

          {/* Top Articles by Depth */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-3">📏 Longest Articles</h2>
            <p className="text-[10px] text-gray-500 mb-3">Deepest content by word count</p>
            <div className="space-y-2">
              {analytics.articlesByLength.slice(0, 5).map((a, i) => {
                const cc = CATEGORY_COLORS[a.category] || DEFAULT_CAT_COLOR;
                const maxW = analytics.articlesByLength[0]?.wordCount || 1;
                return (
                  <div key={a.id} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-4 text-right font-mono">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{a.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 bg-gray-700/40 rounded-full h-1">
                          <div className={`${cc.bar} h-1 rounded-full`} style={{ width: `${(a.wordCount / maxW) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 w-14 text-right">{a.wordCount.toLocaleString()} w</span>
                      </div>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${cc.bg} ${cc.text} flex-shrink-0`}>{a.category}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
