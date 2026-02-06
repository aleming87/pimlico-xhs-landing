"use client";
import { useState, useEffect } from 'react';
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

// Simple calendar component
function MiniCalendar({ items }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Build scheduled dates map
  const scheduledDates = {};
  items.filter(i => i.scheduledDate).forEach(i => {
    const d = i.scheduledDate.split('T')[0];
    if (!scheduledDates[d]) scheduledDates[d] = [];
    scheduledDates[d].push(i);
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
          const hasItems = scheduledDates[dateStr];
          return (
            <div key={i} className={`relative py-1.5 text-[11px] rounded-md transition-colors ${
              isToday ? 'bg-indigo-600 text-white font-bold' :
              hasItems ? 'bg-gray-700/60 text-white font-medium' : 'text-gray-500'
            }`}>
              {d}
              {hasItems && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {hasItems.slice(0, 3).map((item, j) => (
                    <div key={j} className={`w-1 h-1 rounded-full ${STAGE_COLORS[item.stage]?.bar || 'bg-gray-400'}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { items, stats, getByStage } = useWorkflow();
  const { articles } = useArticles();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Recent activity = last 10 updated items
    const sorted = [...items].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setRecentActivity(sorted.slice(0, 8));
  }, [items]);

  const totalPipeline = stats.total;
  const completionPct = totalPipeline > 0
    ? Math.round((stats.byStage.publishing / totalPipeline) * 100)
    : 0;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Content workflow overview · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {STAGES.map(stage => {
          const count = stats.byStage[stage.key] || 0;
          const c = STAGE_COLORS[stage.key];
          return (
            <Link key={stage.key} href={STAGE_HREFS[stage.key]}
              className={`${c.bg} ${c.border} border rounded-xl p-4 hover:brightness-125 transition-all group`}>
              <div className="flex items-center justify-between">
                <span className="text-lg">{stage.icon}</span>
                <span className={`text-2xl font-bold ${c.text}`}>{count}</span>
              </div>
              <p className={`text-xs font-semibold ${c.text} mt-1`}>{stage.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 group-hover:text-gray-400 transition-colors">View all →</p>
            </Link>
          );
        })}
      </div>

      {/* Process Flow Visualization */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">📋 Process Flow</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">⚡ Recent Activity</h2>
            <span className="text-[10px] text-gray-500">{stats.thisWeek} items this week</span>
          </div>
          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.map(item => {
                const c = STAGE_COLORS[item.stage];
                return (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-700/30 rounded-lg px-3 py-2.5">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${c.bg} ${c.text} ${c.border} border`}>
                      {STAGES.find(s => s.key === item.stage)?.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.title || 'Untitled'}</p>
                      <p className="text-[10px] text-gray-500">{new Date(item.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {item.priority}</p>
                    </div>
                    {item.scheduledDate && (
                      <span className="text-[10px] text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                        📅 {new Date(item.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">No items yet</p>
              <Link href="/admin/ideas" className="text-indigo-400 text-sm hover:text-indigo-300 mt-2 inline-block">
                + Start with an idea →
              </Link>
            </div>
          )}
        </div>

        {/* Calendar + Quick Stats */}
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <h2 className="text-sm font-semibold text-white mb-3">📅 Calendar</h2>
            <MiniCalendar items={items} />
          </div>

          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <h2 className="text-sm font-semibold text-white mb-3">📈 Quick Stats</h2>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Total Articles</span>
                <span className="text-sm font-semibold text-white">{articles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Pipeline Items</span>
                <span className="text-sm font-semibold text-white">{totalPipeline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Scheduled</span>
                <span className="text-sm font-semibold text-white">{stats.scheduled}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Published Rate</span>
                <span className="text-sm font-semibold text-green-400">{completionPct}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 mt-1">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <h2 className="text-sm font-semibold text-white mb-3">⚡ Quick Actions</h2>
            <div className="space-y-1.5">
              <Link href="/admin/ideas" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-300 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
                💡 Capture new idea
              </Link>
              <Link href="/admin/drafting" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-300 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors">
                ✏️ Draft an article
              </Link>
              <Link href="/admin/collateral" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-indigo-300 bg-indigo-500/10 rounded-lg hover:bg-indigo-500/20 transition-colors">
                🎨 Create marketing asset
              </Link>
              <Link href="/admin/publishing" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-300 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors">
                🚀 Schedule a post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
