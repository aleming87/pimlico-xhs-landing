"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useWorkflow, STAGES } from './WorkflowContext';
import { useArticles } from './ArticlesContext';
import { readJsonStorage, writeJsonStorage } from './storage';

const STAGE_HREFS = {
  ideas: '/admin/ideas',
  drafting: '/admin/drafting',
  collateral: '/admin/collateral',
  copy: '/admin/copy',
  publishing: '/admin/publishing',
};

const CATEGORY_COLORS = {
  'Gambling':      { bg: 'bg-red-500/10', text: 'text-red-400', bar: 'bg-red-500' },
  'AI Regulation': { bg: 'bg-violet-500/10', text: 'text-violet-400', bar: 'bg-violet-500' },
  'Payments':      { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  'Crypto':        { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500' },
};
const DEFAULT_CAT_COLOR = { bg: 'bg-gray-500/10', text: 'text-gray-400', bar: 'bg-gray-500' };

const IDEA_CATEGORIES = [
  'AI Regulation', 'Payments', 'Gambling', 'Crypto', 'Cross-sector',
  'Enforcement Action', 'New Legislation', 'Consultation', 'Market Trend', 'Opinion Piece',
];

// Donut Chart
function DonutChart({ segments, size = 100 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return <div className="flex items-center justify-center" style={{ width: size, height: size }}><span className="text-gray-600 text-xs">No data</span></div>;
  const radius = (size / 2) - 6;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dashLen = pct * circumference;
        const dashOffset = offset * circumference;
        offset += pct;
        return <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={seg.color} strokeWidth={10} strokeDasharray={`${dashLen} ${circumference - dashLen}`} strokeDashoffset={-dashOffset} className="transition-all duration-500" />;
      })}
      <circle cx={size / 2} cy={size / 2} r={radius - 12} fill="#1f2937" />
    </svg>
  );
}

// Ideas Repository Widget — full-width centrepiece
function IdeasWidget() {
  const { items, addItem, moveToStage, getByStage } = useWorkflow();
  const ideas = getByStage('ideas');
  const [drafts, setDrafts] = useState([]);
  const [importMsg, setImportMsg] = useState('');
  const [storageReady, setStorageReady] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedId, setExpandedId] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setDrafts(readJsonStorage('xhs-idea-drafts', []));
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (storageReady) writeJsonStorage('xhs-idea-drafts', drafts);
  }, [drafts, storageReady]);

  const parseMd = async (file) => {
    const text = await file.text();
    const lines = text.split('\n');
    let title = file.name.replace(/\.(md|markdown|txt)$/i, '');
    for (const line of lines) {
      const t = line.trim();
      if (/^#{1,3}\s+/.test(t)) { title = t.replace(/^#{1,3}\s+/, ''); break; }
      if (t) { title = t; break; }
    }
    const lower = text.toLowerCase();
    const tags = IDEA_CATEGORIES.filter(c => lower.includes(c.toLowerCase()));
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const bodyLines = [];
    let pastTitle = false;
    for (const line of lines) {
      const t = line.trim();
      if (!pastTitle && (/^#{1,3}\s+/.test(t) || t === title)) { pastTitle = true; continue; }
      if (pastTitle && t && !/^[-*_]{3,}$/.test(t)) bodyLines.push(t);
      if (bodyLines.length >= 5) break;
    }
    // Count headings for structure indicator
    const headings = lines.filter(l => /^#{1,4}\s+/.test(l.trim())).length;
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: title.slice(0, 140),
      excerpt: bodyLines.join(' ').slice(0, 500),
      content: text,
      fileName: file.name,
      tags,
      wordCount,
      headings,
      uploadedAt: new Date().toISOString(),
    };
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const parsed = await Promise.all(files.map(parseMd));
    setDrafts(prev => [...parsed, ...prev]);
    setImportMsg(`${parsed.length} file${parsed.length > 1 ? 's' : ''} uploaded`);
    setTimeout(() => setImportMsg(''), 3000);
    e.target.value = '';
  };

  const removeDraft = (id) => {
    setDrafts(prev => {
      const updated = prev.filter(d => d.id !== id);
      writeJsonStorage('xhs-idea-drafts', updated);
      return updated;
    });
    if (expandedId === id) setExpandedId(null);
  };

  const sendToDrafting = (draft) => {
    addItem({
      title: draft.title,
      description: draft.excerpt,
      notes: draft.content,
      tags: draft.tags,
      stage: 'drafting',
      priority: 'medium',
      sourceFile: draft.fileName,
    });
    removeDraft(draft.id);
  };

  // Merge uploaded drafts + pipeline ideas into a unified list
  const allIdeas = useMemo(() => {
    const uploaded = drafts.map(d => ({ ...d, source: 'upload' }));
    const pipeline = ideas.map(i => ({
      id: i.id, title: i.title, excerpt: i.description || '', content: i.notes || '',
      tags: i.tags || [], fileName: null, wordCount: (i.notes || '').split(/\s+/).filter(Boolean).length,
      headings: 0, uploadedAt: i.createdAt || i.updatedAt, source: 'pipeline',
    }));
    return [...uploaded, ...pipeline];
  }, [drafts, ideas]);

  // Filter & sort
  const filtered = useMemo(() => {
    let list = allIdeas;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q) || (i.tags || []).some(t => t.toLowerCase().includes(q)));
    }
    if (catFilter !== 'all') {
      list = list.filter(i => (i.tags || []).some(t => t === catFilter));
    }
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    else if (sortBy === 'oldest') list.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
    else if (sortBy === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'longest') list.sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
    return list;
  }, [allIdeas, search, catFilter, sortBy]);

  // Tag stats for the filter chips
  const tagCounts = useMemo(() => {
    const map = {};
    allIdeas.forEach(i => (i.tags || []).forEach(t => { map[t] = (map[t] || 0) + 1; }));
    return map;
  }, [allIdeas]);

  const activeTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const uploadCount = drafts.length;
  const pipelineCount = ideas.length;
  const totalWords = allIdeas.reduce((s, i) => s + (i.wordCount || 0), 0);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const formatWords = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Article Ideas</h2>
            <p className="text-[11px] text-gray-500">{allIdeas.length} idea{allIdeas.length !== 1 ? 's' : ''} · {formatWords(totalWords)} words total</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {importMsg && <span className="text-xs text-green-400 animate-pulse">{importMsg}</span>}
          <label className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer shadow-lg shadow-indigo-500/20">
            Upload .md
            <input ref={fileRef} type="file" accept=".md,.markdown,.txt" multiple onChange={handleUpload} className="hidden" />
          </label>
          <Link href="/admin/ideas" className="px-4 py-2 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors">
            Manage Ideas
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-px bg-gray-700/30 border-b border-gray-700/40">
        {[
          { label: 'Uploaded', value: uploadCount, icon: '📄' },
          { label: 'Pipeline', value: pipelineCount, icon: '🔄' },
          { label: 'Total Ideas', value: allIdeas.length, icon: '💡' },
          { label: 'Total Words', value: formatWords(totalWords), icon: '📝' },
        ].map(s => (
          <div key={s.label} className="bg-gray-800/30 px-4 py-3 text-center">
            <span className="text-xs">{s.icon}</span>
            <p className="text-lg font-bold text-white mt-0.5">{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="px-6 py-3 border-b border-gray-700/40 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search ideas by title, content, or tag..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-700/40 border border-gray-600/40 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="bg-gray-700/40 border border-gray-600/40 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="alpha">A → Z</option>
            <option value="longest">Longest first</option>
          </select>
        </div>
        {activeTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setCatFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${catFilter === 'all' ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40' : 'bg-gray-700/40 text-gray-400 border border-gray-600/30 hover:text-gray-300'}`}>
              All ({allIdeas.length})
            </button>
            {activeTags.map(([tag, count]) => (
              <button key={tag} onClick={() => setCatFilter(catFilter === tag ? 'all' : tag)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${catFilter === tag ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40' : 'bg-gray-700/40 text-gray-400 border border-gray-600/30 hover:text-gray-300'}`}>
                {tag} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ideas list */}
      <div className="divide-y divide-gray-700/30 max-h-[600px] overflow-y-auto">
        {filtered.length > 0 ? filtered.map(idea => {
          const isExpanded = expandedId === idea.id;
          const isUpload = idea.source === 'upload';
          const catColor = idea.tags?.[0] ? (CATEGORY_COLORS[idea.tags[0]] || DEFAULT_CAT_COLOR) : DEFAULT_CAT_COLOR;
          return (
            <div key={idea.id} className="group">
              <div className="flex items-start gap-4 px-6 py-4 hover:bg-gray-700/20 transition-colors cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : idea.id)}>
                {/* Source badge */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isUpload ? 'bg-indigo-500/15' : 'bg-purple-500/15'}`}>
                  <span className="text-lg">{isUpload ? '📄' : '💡'}</span>
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{idea.title}</h3>
                    <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-full ${isUpload ? 'bg-indigo-500/15 text-indigo-400' : 'bg-purple-500/15 text-purple-400'}`}>
                      {isUpload ? 'Uploaded' : 'Pipeline'}
                    </span>
                  </div>
                  {idea.excerpt && (
                    <p className={`text-xs text-gray-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>{idea.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {idea.tags?.map(t => {
                      const tc = CATEGORY_COLORS[t] || DEFAULT_CAT_COLOR;
                      return (
                        <span key={t} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tc.bg} ${tc.text}`}>{t}</span>
                      );
                    })}
                    {idea.wordCount > 0 && (
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {idea.wordCount.toLocaleString()} words
                      </span>
                    )}
                    {idea.headings > 0 && (
                      <span className="text-[10px] text-gray-500">{idea.headings} section{idea.headings !== 1 ? 's' : ''}</span>
                    )}
                    {idea.fileName && (
                      <span className="text-[10px] text-gray-600">{idea.fileName}</span>
                    )}
                    {idea.uploadedAt && (
                      <span className="text-[10px] text-gray-600">{formatDate(idea.uploadedAt)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  <button onClick={(e) => { e.stopPropagation(); isUpload ? sendToDrafting(idea) : moveToStage(idea.id, 'drafting'); }} title="Send to Drafting"
                    className="px-3 py-1.5 text-[11px] font-semibold text-indigo-300 bg-indigo-500/15 rounded-lg hover:bg-indigo-500/25 transition-colors whitespace-nowrap">
                    Draft →
                  </button>
                  {isUpload && (
                    <button onClick={(e) => { e.stopPropagation(); removeDraft(idea.id); }} title="Remove"
                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded content preview */}
              {isExpanded && idea.content && (
                <div className="px-6 pb-4 pt-0">
                  <div className="ml-14 bg-gray-900/60 border border-gray-700/40 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Content Preview</span>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        {idea.wordCount > 0 && <span>{idea.wordCount.toLocaleString()} words</span>}
                        {idea.wordCount > 0 && <span>~{Math.ceil(idea.wordCount / 250)} min read</span>}
                      </div>
                    </div>
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">{idea.content.slice(0, 3000)}{idea.content.length > 3000 ? '\n\n… (truncated)' : ''}</pre>
                  </div>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-700/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💡</span>
            </div>
            {search || catFilter !== 'all' ? (
              <>
                <p className="text-gray-400 text-sm font-medium">No ideas match your filters</p>
                <button onClick={() => { setSearch(''); setCatFilter('all'); }} className="mt-2 text-indigo-400 text-xs hover:text-indigo-300">Clear filters</button>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-sm font-medium">No article ideas yet</p>
                <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">Upload markdown files to build your ideas repository. Each file will be parsed for title, tags, and content preview.</p>
                <button onClick={() => fileRef.current?.click()} className="mt-4 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                  Upload your first .md file →
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer with count */}
      {filtered.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-700/40 flex items-center justify-between">
          <p className="text-[11px] text-gray-500">
            Showing {filtered.length} of {allIdeas.length} idea{allIdeas.length !== 1 ? 's' : ''}
            {search || catFilter !== 'all' ? ' (filtered)' : ''}
          </p>
          <p className="text-[11px] text-gray-600">Click an idea to preview content</p>
        </div>
      )}
    </div>
  );
}


export default function DashboardPage() {
  const { stats } = useWorkflow();
  const { articles } = useArticles();

  const totalPipeline = stats.total;

  const categories = useMemo(() => {
    const cats = {};
    articles.forEach(a => {
      const cat = a.category || 'Uncategorised';
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return cats;
  }, [articles]);

  const catSegments = useMemo(() => {
    const catColors = { 'Gambling': '#ef4444', 'AI Regulation': '#8b5cf6', 'Payments': '#10b981', 'Crypto': '#f59e0b' };
    return Object.entries(categories).map(([cat, count]) => ({
      label: cat, value: count, color: catColors[cat] || '#6b7280',
    }));
  }, [categories]);

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs font-medium rounded-full border border-gray-700/50">{articles.length} articles</span>
          <span className="px-3 py-1.5 bg-indigo-600/15 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/30">{totalPipeline} in pipeline</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Articles', value: articles.length, icon: '📰' },
          { label: 'Pipeline', value: totalPipeline, icon: '📋' },
          { label: 'Drafting', value: stats.byStage.drafting || 0, icon: '✏️' },
          { label: 'Publishing', value: stats.byStage.publishing || 0, icon: '🚀' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">{kpi.icon}</span>
              <span className="text-2xl font-bold text-white">{kpi.value}</span>
            </div>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Flow */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Pipeline</h2>
        <div className="flex items-center gap-2">
          {STAGES.map((stage, i) => {
            const count = stats.byStage[stage.key] || 0;
            const pct = totalPipeline > 0 ? Math.round((count / totalPipeline) * 100) : 0;
            return (
              <div key={stage.key} className="flex items-center gap-2 flex-1">
                <Link href={STAGE_HREFS[stage.key] || '/admin'} className="flex-1 bg-gray-700/30 border border-gray-700/40 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-all">
                  <div className="text-lg mb-1">{stage.icon}</div>
                  <div className="text-xs text-gray-400 font-medium">{stage.label}</div>
                  <div className="text-lg font-bold text-white mt-1">{count}</div>
                  <div className="w-full bg-gray-600/30 rounded-full h-1 mt-2">
                    <div className="bg-indigo-500 h-1 rounded-full transition-all" style={{ width: `${pct}%` }} />
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

      {/* Ideas Widget — centrepiece */}
      <IdeasWidget />

      {/* Bottom row: Category + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          {/* Category Breakdown */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Category Breakdown</h2>
            <div className="flex items-center gap-4">
              <DonutChart segments={catSegments} size={100} />
              <div className="flex-1 space-y-2.5">
                {Object.entries(categories).map(([cat, count]) => {
                  const cc = CATEGORY_COLORS[cat] || DEFAULT_CAT_COLOR;
                  const pct = articles.length > 0 ? Math.round((count / articles.length) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs font-medium ${cc.text}`}>{cat}</span>
                        <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                        <div className={`${cc.bar} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          {/* Quick Actions */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 h-full">
            <h2 className="text-sm font-semibold text-white mb-3">Quick Actions</h2>
            <div className="space-y-1.5">
              <Link href="/admin/drafting" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors">✏️ Start a draft</Link>
              <Link href="/admin/collateral" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors">🎨 Create collateral</Link>
              <Link href="/admin/publishing" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors">🚀 Schedule a post</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
