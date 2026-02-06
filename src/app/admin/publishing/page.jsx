"use client";
import { useState, useEffect, useMemo } from 'react';
import { useArticles } from '../ArticlesContext';
import { useWorkflow } from '../WorkflowContext';

const SOCIAL_PLATFORMS = {
  linkedin: { label: 'LinkedIn', icon: '💼', color: '#0A66C2', connected: false, handle: '' },
  twitter: { label: 'Twitter / X', icon: '🐦', color: '#1DA1F2', connected: false, handle: '' },
  instagram: { label: 'Instagram', icon: '📸', color: '#E4405F', connected: false, handle: '' },
  facebook: { label: 'Facebook', icon: '📘', color: '#1877F2', connected: false, handle: '' },
  threads: { label: 'Threads', icon: '🧵', color: '#000000', connected: false, handle: '' },
};

const POST_STATUSES = {
  draft: { label: 'Draft', color: 'bg-gray-500/20 text-gray-300', icon: '📝' },
  scheduled: { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-300', icon: '📅' },
  queued: { label: 'Queued', color: 'bg-yellow-500/20 text-yellow-300', icon: '⏳' },
  published: { label: 'Published', color: 'bg-green-500/20 text-green-300', icon: '✅' },
  failed: { label: 'Failed', color: 'bg-red-500/20 text-red-300', icon: '❌' },
};

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function PublishingPage() {
  const { articles } = useArticles();
  const { items, addItem, updateItem, moveToStage } = useWorkflow();

  const [platforms, setPlatforms] = useState(() => {
    try { const s = localStorage.getItem('xhs-publishing-platforms'); return s ? JSON.parse(s) : { ...SOCIAL_PLATFORMS }; } catch { return { ...SOCIAL_PLATFORMS }; }
  });
  const [posts, setPosts] = useState(() => {
    try { const s = localStorage.getItem('xhs-publishing-posts'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [view, setView] = useState('queue');
  const [showNewPost, setShowNewPost] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  // New post form
  const [newPost, setNewPost] = useState({ text: '', platforms: [], scheduledDate: '', scheduledTime: '10:00', articleId: '', status: 'draft', imageUrl: '' });

  useEffect(() => { try { localStorage.setItem('xhs-publishing-platforms', JSON.stringify(platforms)); } catch {} }, [platforms]);
  useEffect(() => { try { localStorage.setItem('xhs-publishing-posts', JSON.stringify(posts)); } catch {} }, [posts]);

  const connectedPlatforms = Object.entries(platforms).filter(([, p]) => p.connected);

  const toggleConnection = (key) => {
    setPlatforms(prev => ({ ...prev, [key]: { ...prev[key], connected: !prev[key].connected, handle: prev[key].connected ? '' : `@pimlico_${key}` } }));
  };

  const createPost = () => {
    if (!newPost.text || newPost.platforms.length === 0) return;
    const post = { id: Date.now(), ...newPost, createdAt: new Date().toISOString(), status: newPost.scheduledDate ? 'scheduled' : 'draft' };
    setPosts(prev => [post, ...prev]);
    setNewPost({ text: '', platforms: [], scheduledDate: '', scheduledTime: '10:00', articleId: '', status: 'draft', imageUrl: '' });
    setShowNewPost(false);
  };

  const updatePost = (id, updates) => setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deletePost = (id) => setPosts(prev => prev.filter(p => p.id !== id));

  const publishNow = (id) => {
    updatePost(id, { status: 'published', publishedAt: new Date().toISOString() });
  };

  // Calendar data
  const calendarData = useMemo(() => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayPosts = posts.filter(p => p.scheduledDate === dateStr);
      days.push({ day: d, date: dateStr, posts: dayPosts });
    }
    return days;
  }, [posts, calMonth, calYear]);

  const stats = useMemo(() => ({
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    queued: posts.filter(p => p.status === 'queued').length,
    published: posts.filter(p => p.status === 'published').length,
    total: posts.length,
  }), [posts]);

  const publishingWorkflowItems = items.filter(i => i.stage === 'publishing');
  const copyItems = items.filter(i => i.stage === 'copy');
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">🚀 Publishing</h1>
          <p className="text-sm text-gray-400 mt-0.5">Schedule and publish across your social channels — Buffer-style</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowConnect(true)} className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 flex items-center gap-1">🔗 Connections ({connectedPlatforms.length})</button>
          <button type="button" onClick={() => setShowNewPost(true)} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 flex items-center gap-1">+ New Post</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Drafts', value: stats.draft, icon: '📝', bg: 'bg-gray-700/30' },
          { label: 'Scheduled', value: stats.scheduled, icon: '📅', bg: 'bg-blue-500/10' },
          { label: 'Queued', value: stats.queued, icon: '⏳', bg: 'bg-yellow-500/10' },
          { label: 'Published', value: stats.published, icon: '✅', bg: 'bg-green-500/10' },
          { label: 'Connected', value: connectedPlatforms.length, icon: '🔗', bg: 'bg-purple-500/10' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-gray-700/50`}>
            <div className="flex items-center justify-between">
              <span className="text-lg">{s.icon}</span>
              <span className="text-xl font-bold text-white">{s.value}</span>
            </div>
            <span className="text-[11px] text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 bg-gray-800/80 rounded-xl p-1 mb-5 border border-gray-700/50 w-fit">
        {[
          { key: 'queue', label: '📋 Queue', },
          { key: 'calendar', label: '📅 Calendar' },
          { key: 'history', label: '📜 History' },
        ].map(v => (
          <button key={v.key} type="button" onClick={() => setView(v.key)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${view === v.key ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:text-white'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Queue View */}
      {view === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Queue */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-white">Post Queue</h3>
            {posts.filter(p => p.status !== 'published').length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 bg-gray-800/50 rounded-xl border border-gray-700/30">
                <span className="text-4xl mb-3">📭</span>
                <p className="text-sm text-gray-400">No posts in queue</p>
                <button type="button" onClick={() => setShowNewPost(true)} className="mt-3 px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500">Create First Post</button>
              </div>
            ) : (
              posts.filter(p => p.status !== 'published').sort((a, b) => {
                if (a.scheduledDate && b.scheduledDate) return a.scheduledDate.localeCompare(b.scheduledDate);
                if (a.scheduledDate) return -1; return 1;
              }).map(post => (
                <div key={post.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${POST_STATUSES[post.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                        {POST_STATUSES[post.status]?.icon} {POST_STATUSES[post.status]?.label}
                      </span>
                      <div className="flex gap-1">
                        {post.platforms?.map(p => <span key={p} className="text-xs">{SOCIAL_PLATFORMS[p]?.icon || '📌'}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => publishNow(post.id)} className="px-2 py-1 text-[10px] font-medium text-green-400 hover:bg-green-500/10 rounded">Publish Now</button>
                      <button type="button" onClick={() => deletePost(post.id)} className="px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/10 rounded">Delete</button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-4">{post.text}</p>
                  {post.scheduledDate && (
                    <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                      📅 {new Date(post.scheduledDate + 'T' + (post.scheduledTime || '10:00')).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {post.scheduledTime || '10:00'}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Right: Pipeline + Quick Actions */}
          <div className="space-y-3">
            {/* Import from Copy stage */}
            {copyItems.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-white mb-2">📥 From Copy Stage</h3>
                <p className="text-[11px] text-gray-500 mb-2">Import items completed in Copy stage</p>
                <div className="space-y-1">
                  {copyItems.slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center justify-between px-2 py-1.5 bg-gray-700/40 rounded-lg">
                      <span className="text-[11px] text-gray-300 truncate flex-1">{item.title}</span>
                      <button type="button" onClick={() => { moveToStage(item.id, 'publishing'); setNewPost(prev => ({ ...prev, text: item.content || item.title })); setShowNewPost(true); }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 ml-2">→ Import</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connected Platforms */}
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-white mb-2">🔗 Connected Channels</h3>
              {connectedPlatforms.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500 mb-2">No platforms connected</p>
                  <button type="button" onClick={() => setShowConnect(true)} className="text-xs text-indigo-400 hover:text-indigo-300">Connect platforms →</button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {connectedPlatforms.map(([key, plat]) => (
                    <div key={key} className="flex items-center gap-2 px-2 py-1.5 bg-gray-700/40 rounded-lg">
                      <span>{plat.icon}</span>
                      <span className="text-xs text-gray-300 flex-1">{plat.label}</span>
                      <span className="text-[10px] text-gray-500">{plat.handle}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Best Times */}
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/30">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">⏰ Best Post Times</h3>
              <ul className="space-y-1 text-[11px] text-gray-500">
                <li>💼 LinkedIn: Tue-Thu, 9-10 AM</li>
                <li>🐦 Twitter/X: Mon-Fri, 12-1 PM</li>
                <li>📸 Instagram: Mon-Wed, 11 AM-1 PM</li>
                <li>📧 Email: Tue-Thu, 10 AM</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <button type="button" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }} className="text-gray-400 hover:text-white text-sm">←</button>
            <h3 className="text-sm font-semibold text-white">{new Date(calYear, calMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
            <button type="button" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }} className="text-gray-400 hover:text-white text-sm">→</button>
          </div>
          <div className="grid grid-cols-7">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="px-2 py-2 text-center text-[10px] font-semibold text-gray-500 border-b border-gray-700">{d}</div>
            ))}
            {calendarData.map((day, i) => (
              <div key={i} className={`min-h-[80px] p-1.5 border-b border-r border-gray-700/50 ${day?.date === today ? 'bg-indigo-600/10' : ''} ${!day ? 'bg-gray-800/30' : ''}`}>
                {day && (
                  <>
                    <div className={`text-[11px] font-medium mb-1 ${day.date === today ? 'text-indigo-300' : 'text-gray-400'}`}>{day.day}</div>
                    {day.posts.slice(0, 3).map(p => (
                      <div key={p.id} className={`text-[9px] px-1 py-0.5 rounded mb-0.5 truncate ${POST_STATUSES[p.status]?.color || 'bg-gray-700 text-gray-400'}`}>
                        {p.platforms?.map(pl => SOCIAL_PLATFORMS[pl]?.icon).join('')} {p.text?.slice(0, 20)}
                      </div>
                    ))}
                    {day.posts.length > 3 && <div className="text-[9px] text-gray-500">+{day.posts.length - 3} more</div>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History View */}
      {view === 'history' && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">Published Posts</h3>
          {posts.filter(p => p.status === 'published').length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <span className="text-3xl mb-2">📜</span>
              <p className="text-sm text-gray-400">No published posts yet</p>
            </div>
          ) : (
            posts.filter(p => p.status === 'published').map(post => (
              <div key={post.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-300">✅ Published</span>
                    {post.platforms?.map(p => <span key={p} className="text-xs">{SOCIAL_PLATFORMS[p]?.icon}</span>)}
                  </div>
                  <span className="text-[11px] text-gray-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{post.text}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowNewPost(false)}>
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">📝 Create Post</h3>
              <button type="button" onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {/* Platforms */}
              <div>
                <label className="text-[11px] text-gray-400 mb-1.5 block">Platforms</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(platforms).map(([key, plat]) => (
                    <button key={key} type="button"
                      onClick={() => setNewPost(prev => ({ ...prev, platforms: prev.platforms.includes(key) ? prev.platforms.filter(p => p !== key) : [...prev.platforms, key] }))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 ${newPost.platforms.includes(key) ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : plat.connected ? 'text-gray-400 border-gray-600 hover:text-white' : 'text-gray-600 border-gray-700 opacity-50 cursor-not-allowed'}`}
                      disabled={!plat.connected}>
                      {plat.icon} {plat.label} {!plat.connected && '🔒'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Text */}
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">Post Content</label>
                <textarea value={newPost.text} onChange={e => setNewPost(prev => ({ ...prev, text: e.target.value }))}
                  rows={5} placeholder="What do you want to share?" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none" />
                <div className="text-right text-[10px] text-gray-500 mt-1">{newPost.text.length} chars</div>
              </div>
              {/* Link article */}
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">Link Article (optional)</label>
                <select value={newPost.articleId} onChange={e => setNewPost(prev => ({ ...prev, articleId: e.target.value }))} className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500">
                  <option value="">None</option>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>
              {/* Schedule */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-400 mb-1 block">Schedule Date</label>
                  <input type="date" value={newPost.scheduledDate} onChange={e => setNewPost(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 mb-1 block">Time</label>
                  <select value={newPost.scheduledTime} onChange={e => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500">
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-700 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowNewPost(false)} className="px-4 py-2 text-xs text-gray-400 hover:text-white">Cancel</button>
              <button type="button" onClick={createPost} disabled={!newPost.text || newPost.platforms.length === 0}
                className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 disabled:opacity-40">
                {newPost.scheduledDate ? '📅 Schedule' : '💾 Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Platforms Modal */}
      {showConnect && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowConnect(false)}>
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">🔗 Platform Connections</h3>
              <button type="button" onClick={() => setShowConnect(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-5 space-y-2">
              <p className="text-[11px] text-gray-500 mb-3">Toggle connections to enable publishing. In production, these would use OAuth for real API access.</p>
              {Object.entries(SOCIAL_PLATFORMS).map(([key, plat]) => (
                <div key={key} className="flex items-center justify-between px-3 py-3 bg-gray-700/40 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{plat.icon}</span>
                    <div>
                      <span className="text-sm text-white font-medium">{plat.label}</span>
                      {platforms[key].connected && <span className="text-[10px] text-gray-500 block">{platforms[key].handle}</span>}
                    </div>
                  </div>
                  <button type="button" onClick={() => toggleConnection(key)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${platforms[key].connected ? 'bg-green-500/20 text-green-300 hover:bg-red-500/10 hover:text-red-300' : 'bg-gray-600 text-gray-300 hover:bg-indigo-600/30 hover:text-indigo-300'}`}>
                    {platforms[key].connected ? '✓ Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-700 flex justify-end">
              <button type="button" onClick={() => setShowConnect(false)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
