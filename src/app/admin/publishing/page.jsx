"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { useArticles } from '../ArticlesContext';
import { useWorkflow } from '../WorkflowContext';

const PLATFORMS = {
  linkedin: { label: 'LinkedIn', icon: '💼', color: '#0A66C2', maxChars: 3000, cta: 'Post on LinkedIn', tips: ['Professional tone', 'Tag companies with @', '3-5 relevant hashtags', 'Include line breaks for readability', 'First line is your hook — make it count'] },
  twitter: { label: 'Twitter / X', icon: '🐦', color: '#1DA1F2', maxChars: 280, cta: 'Post on X', tips: ['Under 280 chars', 'Use 1-2 hashtags max', 'Hook in first sentence', 'Add a call to action'] },
  instagram: { label: 'Instagram', icon: '📸', color: '#E4405F', maxChars: 2200, cta: 'Post on Instagram', tips: ['Visual-first platform', 'Use 5-10 relevant hashtags', 'Story-telling format works', 'End with a question'] },
  facebook: { label: 'Facebook', icon: '📘', color: '#1877F2', maxChars: 63206, cta: 'Post on Facebook', tips: ['Conversational tone', 'Questions drive engagement', '1-3 hashtags at most'] },
  newsletter: { label: 'Newsletter', icon: '📰', color: '#8B5CF6', maxChars: null, cta: 'Send Newsletter', tips: ['Clear subject line', 'Value in first paragraph', 'One clear CTA', 'Mobile-friendly'] },
};

const POST_STATUSES = {
  draft: { label: 'Draft', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: '📝' },
  ready: { label: 'Ready to Publish', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '🟡' },
  scheduled: { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '📅' },
  published: { label: 'Published', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: '✅' },
};

const TIME_SLOTS = ['07:00','08:00','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

const LINKEDIN_POST_FORMATS = {
  hook: { label: '🎣 Hook + Value', build: (a) => `${a.title}\n\nHere's what you need to know:\n\n→ Key insight from our latest analysis\n→ What this means for your firm\n→ How to prepare now\n\nThe regulatory landscape doesn't wait. Neither should you.\n\n🔗 Full article: pimlicosolutions.com/insights/${a.slug || 'article'}\n\n#RegTech #Compliance #${(a.category||'Regulation').replace(/\s+/g,'')}` },
  storytelling: { label: '📖 Storytelling', build: (a) => `Last week, a client asked me:\n\n"How do we stay ahead of ${a.category?.toLowerCase() || 'regulatory'} changes?"\n\nMy answer surprised them.\n\nIn our latest piece, "${a.title}", we break down:\n\n1️⃣ The key shifts happening right now\n2️⃣ What firms are getting wrong\n3️⃣ The 3-step framework that works\n\nThe firms that adapt first will lead.\n\n🔗 pimlicosolutions.com/insights/${a.slug || 'article'}\n\n#${(a.category||'Regulation').replace(/\s+/g,'')} #RegulatoryCompliance #Pimlico` },
  dataPoint: { label: '📊 Data-Led', build: (a) => `📊 New analysis from Pimlico:\n\n"${a.title}"\n\nThe data tells an important story about ${a.category?.toLowerCase() || 'regulatory compliance'} trends.\n\nKey finding: Firms that act proactively see significantly better outcomes.\n\nDive into the full analysis 👇\n\n🔗 pimlicosolutions.com/insights/${a.slug || 'article'}\n\n#Data #${(a.category||'Compliance').replace(/\s+/g,'')} #Insights` },
  question: { label: '❓ Question Hook', build: (a) => `Is your firm ready for what's coming in ${a.category?.toLowerCase() || 'regulatory compliance'}?\n\nMost aren't.\n\nOur new analysis "${a.title}" reveals what the best-prepared firms are doing differently.\n\n→ Read the full breakdown: pimlicosolutions.com/insights/${a.slug || 'article'}\n\nWhat's your firm's biggest regulatory challenge right now? 👇\n\n#${(a.category||'Regulation').replace(/\s+/g,'')} #Compliance #RegTech` },
  announcement: { label: '📢 Announcement', build: (a) => `🚀 New from Pimlico XHS™\n\n"${a.title}"\n\nWe've just published our latest analysis on ${a.category?.toLowerCase() || 'the regulatory landscape'}.\n\n${a.excerpt || 'Read our comprehensive breakdown of what this means for your business.'}\n\n🔗 pimlicosolutions.com/insights/${a.slug || 'article'}\n\n#Pimlico #XHS #${(a.category||'Compliance').replace(/\s+/g,'')}` },
};

export default function PublishingPage() {
  const { articles } = useArticles();
  const { items, addItem, updateItem, moveToStage } = useWorkflow();

  const [posts, setPosts] = useState(() => {
    try { const s = localStorage.getItem('xhs-publishing-posts-v2'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [view, setView] = useState('composer');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activePlatform, setActivePlatform] = useState('linkedin');
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const textareaRef = useRef(null);

  useEffect(() => { try { localStorage.setItem('xhs-publishing-posts-v2', JSON.stringify(posts)); } catch {} }, [posts]);

  // Pull copy drafts from localStorage
  const getCopyDraft = (articleId, platform) => {
    try {
      const drafts = JSON.parse(localStorage.getItem('xhs-copy-drafts') || '{}');
      return drafts[`${articleId}-${platform}`] || drafts[`${articleId}-linkedin`] || '';
    } catch { return ''; }
  };

  const copyItems = items.filter(i => i.stage === 'copy');
  const filteredArticles = articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.category?.toLowerCase().includes(search.toLowerCase()));

  const selectArticle = (article) => {
    setSelectedArticle(article);
    const existingCopy = getCopyDraft(article.id, activePlatform);
    if (existingCopy) {
      setPostText(existingCopy);
    } else {
      setPostText(LINKEDIN_POST_FORMATS.hook.build(article));
    }
    if (article.image) setPostImage(article.image);
  };

  const applyFormat = (formatKey) => {
    if (!selectedArticle) return;
    const fmt = LINKEDIN_POST_FORMATS[formatKey];
    if (fmt) setPostText(fmt.build(selectedArticle));
  };

  const savePost = (status = 'draft') => {
    if (!postText.trim()) return;
    const post = {
      id: editingPostId || Date.now(),
      text: postText,
      platform: activePlatform,
      articleId: selectedArticle?.id || null,
      articleTitle: selectedArticle?.title || '',
      imageUrl: postImage,
      scheduledDate,
      scheduledTime,
      status: scheduledDate ? 'scheduled' : status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (editingPostId) {
      setPosts(prev => prev.map(p => p.id === editingPostId ? { ...p, ...post } : p));
      setEditingPostId(null);
    } else {
      setPosts(prev => [post, ...prev]);
    }
    setPostText(''); setPostImage(''); setScheduledDate(''); setEditingPostId(null);
  };

  const editPost = (post) => {
    setPostText(post.text);
    setPostImage(post.imageUrl || '');
    setActivePlatform(post.platform || 'linkedin');
    setScheduledDate(post.scheduledDate || '');
    setScheduledTime(post.scheduledTime || '10:00');
    setEditingPostId(post.id);
    if (post.articleId) {
      const art = articles.find(a => a.id === post.articleId);
      if (art) setSelectedArticle(art);
    }
    setView('composer');
  };

  const deletePost = (id) => setPosts(prev => prev.filter(p => p.id !== id));
  const markPublished = (id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'published', publishedAt: new Date().toISOString() } : p));

  const copyToClipboard = async (text, id) => {
    try { await navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); } catch {}
  };

  const copyGrabAndGo = async (post) => {
    let text = post.text;
    if (post.imageUrl && !post.imageUrl.startsWith('data:')) {
      text += `\n\n📎 Image: ${post.imageUrl.startsWith('http') ? post.imageUrl : window.location.origin + post.imageUrl}`;
    }
    await copyToClipboard(text, `grab-${post.id}`);
  };

  const charCount = postText.length;
  const maxChars = PLATFORMS[activePlatform]?.maxChars;
  const isOverLimit = maxChars && charCount > maxChars;

  const stats = useMemo(() => ({
    draft: posts.filter(p => p.status === 'draft').length,
    ready: posts.filter(p => p.status === 'ready').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length,
  }), [posts]);

  const calendarData = useMemo(() => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      days.push({ day: d, date: dateStr, posts: posts.filter(p => p.scheduledDate === dateStr) });
    }
    return days;
  }, [posts, calMonth, calYear]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">🚀 Publishing Hub</h1>
          <p className="text-sm text-gray-400 mt-0.5">Compose, preview & grab-and-go — like Buffer, built for Pimlico</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-gray-700 text-gray-300 text-[11px] font-medium rounded-full">{posts.length} posts</span>
          <span className="px-2.5 py-1 bg-green-500/15 text-green-300 text-[11px] font-medium rounded-full">{stats.published} published</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Drafts', value: stats.draft, icon: '📝', bg: 'bg-gray-700/30' },
          { label: 'Ready', value: stats.ready, icon: '🟡', bg: 'bg-amber-500/10' },
          { label: 'Scheduled', value: stats.scheduled, icon: '📅', bg: 'bg-blue-500/10' },
          { label: 'Published', value: stats.published, icon: '✅', bg: 'bg-green-500/10' },
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

      {/* View Tabs */}
      <div className="flex gap-1 bg-gray-800/80 rounded-xl p-1 mb-5 border border-gray-700/50 w-fit">
        {[
          { key: 'composer', label: '✍️ Composer' },
          { key: 'queue', label: '📋 Queue & Grab-Go' },
          { key: 'calendar', label: '📅 Calendar' },
          { key: 'published', label: '✅ Published' },
        ].map(v => (
          <button key={v.key} type="button" onClick={() => setView(v.key)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${view === v.key ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:text-white'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ==================== COMPOSER VIEW ==================== */}
      {view === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Article Selector */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-white mb-2">📰 Select Article</h3>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500 mb-2" />
              <div className="space-y-1 max-h-[350px] overflow-y-auto">
                {filteredArticles.map(a => (
                  <button key={a.id} type="button" onClick={() => selectArticle(a)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedArticle?.id === a.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}>
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{a.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Import from Copy Stage */}
            {copyItems.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-white mb-2">📥 Import from Copy</h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {copyItems.map(item => (
                    <button key={item.id} type="button" onClick={() => {
                      setPostText(item.content || item.title);
                      const art = articles.find(a => a.id === item.articleId);
                      if (art) setSelectedArticle(art);
                    }}
                      className="w-full text-left px-2 py-1.5 bg-gray-700/40 rounded-lg text-[11px] text-gray-300 hover:bg-gray-700/60 truncate transition-colors">
                      {PLATFORMS[item.platform]?.icon || '📌'} {item.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LinkedIn Post Formats */}
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-white mb-2">📋 Quick Formats</h3>
              <p className="text-[10px] text-gray-500 mb-2">Auto-generate LinkedIn-ready post formats</p>
              <div className="space-y-1">
                {Object.entries(LINKEDIN_POST_FORMATS).map(([key, fmt]) => (
                  <button key={key} type="button" onClick={() => applyFormat(key)} disabled={!selectedArticle}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle: Post Composer */}
          <div className="lg:col-span-5 space-y-3">
            {/* Platform Tabs */}
            <div className="flex gap-1.5 bg-gray-800/80 rounded-xl p-1.5 border border-gray-700/50">
              {Object.entries(PLATFORMS).map(([key, plat]) => (
                <button key={key} type="button" onClick={() => setActivePlatform(key)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${activePlatform === key ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}>
                  <span>{plat.icon}</span> <span className="hidden sm:inline">{plat.label}</span>
                </button>
              ))}
            </div>

            {/* Char count bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] text-gray-500">{editingPostId ? '✏️ Editing post' : selectedArticle ? `Article: ${selectedArticle.title.slice(0,40)}...` : 'Select an article or start writing'}</span>
              <span className={`text-[11px] font-medium ${isOverLimit ? 'text-red-400' : maxChars && charCount > maxChars * 0.9 ? 'text-yellow-400' : 'text-gray-500'}`}>
                {charCount}{maxChars ? ` / ${maxChars}` : ''} chars
              </span>
            </div>

            {/* Textarea */}
            <div className="bg-gray-800 rounded-xl border border-gray-700/50">
              <textarea ref={textareaRef} value={postText} onChange={e => setPostText(e.target.value)}
                rows={14} placeholder={`Compose your ${PLATFORMS[activePlatform]?.label || ''} post...\n\nTip: Select an article, then use Quick Formats to auto-generate.`}
                className={`w-full px-4 py-3 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none resize-none rounded-xl font-sans leading-relaxed ${isOverLimit ? 'border-2 border-red-500/50' : ''}`}
              />
            </div>

            {/* Image Attachment */}
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-semibold text-gray-400">🖼️ Image Attachment</h4>
                {postImage && <button type="button" onClick={() => setPostImage('')} className="text-[10px] text-red-400 hover:text-red-300">Remove</button>}
              </div>
              {postImage ? (
                <img
                  src={postImage.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(postImage)}` : postImage}
                  alt="Post image"
                  className="w-full max-h-32 object-cover rounded-lg border border-gray-700/50"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="flex gap-2">
                  {selectedArticle?.image && (
                    <button type="button" onClick={() => setPostImage(selectedArticle.image)}
                      className="flex-1 py-2 text-[11px] text-indigo-400 hover:text-indigo-300 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors text-center">
                      📸 Use Article Image
                    </button>
                  )}
                  <button type="button" onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) setPostImage(url);
                  }} className="flex-1 py-2 text-[11px] text-gray-400 hover:text-gray-300 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors text-center">
                    🔗 Paste URL
                  </button>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">📅 Schedule Date (optional)</label>
                <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">⏰ Time</label>
                <select value={scheduledTime} onChange={e => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500">
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button type="button" onClick={() => copyToClipboard(postText, 'composer')} disabled={!postText}
                className="px-4 py-2 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 disabled:opacity-40 flex items-center gap-1 transition-colors">
                {copiedId === 'composer' ? '✓ Copied!' : '📋 Copy Text'}
              </button>
              <button type="button" onClick={() => savePost('draft')} disabled={!postText}
                className="px-4 py-2 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 disabled:opacity-40 flex items-center gap-1 transition-colors">
                💾 Save Draft
              </button>
              <div className="flex-1" />
              <button type="button" onClick={() => savePost('ready')} disabled={!postText}
                className="px-5 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-500 disabled:opacity-40 flex items-center gap-1 transition-colors">
                🟡 Mark Ready
              </button>
              <button type="button" onClick={() => {
                savePost('published');
                copyToClipboard(postText, 'publish-copy');
              }} disabled={!postText}
                className="px-5 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-500 disabled:opacity-40 flex items-center gap-1 transition-colors">
                ✅ Publish & Copy
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">👁️ Live Preview</h3>
              <button type="button" onClick={() => setShowPreview(!showPreview)} className="text-[10px] text-gray-500 hover:text-gray-300">
                {showPreview ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {showPreview && (
              <>
                {/* LinkedIn-style preview card */}
                {activePlatform === 'linkedin' && (
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                    <div className="px-4 pt-3 pb-2 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-lg font-bold shadow-sm">P</div>
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900">Pimlico XHS™</div>
                        <div className="text-[11px] text-gray-500">Cross-border Regulatory Compliance • 1,200 followers</div>
                        <div className="text-[10px] text-gray-400">Just now • 🌐</div>
                      </div>
                    </div>
                    <div className="px-4 pb-2">
                      <p className="text-[13px] text-gray-800 whitespace-pre-wrap leading-[1.4]" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>
                        {postText ? (postText.length > 500 ? postText.slice(0, 500) + '...see more' : postText) : <span className="text-gray-400 italic">Your post preview will appear here...</span>}
                      </p>
                    </div>
                    {postImage && (
                      <div className="border-t border-gray-100">
                        <img src={postImage.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(postImage)}` : postImage}
                          alt="Post" className="w-full max-h-64 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
                        <span>👍💡</span> <span>Andrew Leming and 23 others</span>
                      </div>
                      <div className="flex justify-around border-t border-gray-100 pt-1.5">
                        {['👍 Like', '💬 Comment', '🔄 Repost', '✈️ Send'].map(a => (
                          <span key={a} className="text-[11px] text-gray-500 font-medium px-2 py-1">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Twitter/X preview */}
                {activePlatform === 'twitter' && (
                  <div className="bg-black rounded-xl overflow-hidden border border-gray-700 shadow-lg p-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">P</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white">Pimlico XHS™</span>
                          <span className="text-[11px] text-gray-500">@PimlicoXHS · now</span>
                        </div>
                        <p className="text-[14px] text-white whitespace-pre-wrap leading-[1.3] mt-1">
                          {postText || <span className="text-gray-600 italic">Your tweet preview...</span>}
                        </p>
                        {postImage && (
                          <img src={postImage.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(postImage)}` : postImage}
                            alt="Post" className="w-full max-h-48 object-cover rounded-xl mt-2 border border-gray-700" onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                        <div className="flex justify-between mt-3 text-gray-500 text-[12px] max-w-[280px]">
                          {['💬 3', '🔄 12', '❤️ 47', '📊 1.2K'].map(a => <span key={a}>{a}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generic preview for other platforms */}
                {!['linkedin', 'twitter'].includes(activePlatform) && (
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{PLATFORMS[activePlatform]?.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-white">Pimlico XHS™</div>
                        <div className="text-[10px] text-gray-500">{PLATFORMS[activePlatform]?.label} Preview</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {postText || <span className="text-gray-500 italic">Preview will appear here...</span>}
                    </p>
                    {postImage && (
                      <img src={postImage.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(postImage)}` : postImage}
                        alt="Post" className="w-full max-h-48 object-cover rounded-lg mt-3 border border-gray-700/50" onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                  </div>
                )}
              </>
            )}

            {/* Platform Tips */}
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/30">
              <h4 className="text-[11px] font-semibold text-gray-400 mb-2">💡 {PLATFORMS[activePlatform]?.label} Tips</h4>
              <ul className="space-y-1">
                {PLATFORMS[activePlatform]?.tips?.map((tip, i) => (
                  <li key={i} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                    <span className="text-gray-600 mt-0.5">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ==================== QUEUE & GRAB-GO VIEW ==================== */}
      {view === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">📋 Post Queue — Grab & Go</h3>
            <p className="text-[11px] text-gray-500">Click &quot;Copy &amp; Go&quot; to copy the full post, then paste directly into LinkedIn / X / Instagram</p>
          </div>

          {posts.filter(p => p.status !== 'published').length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-sm text-gray-400">No posts in queue</p>
              <p className="text-xs text-gray-500 mt-1">Use the Composer to create posts</p>
              <button type="button" onClick={() => setView('composer')} className="mt-3 px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500">Go to Composer</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {posts.filter(p => p.status !== 'published').sort((a, b) => {
                const order = { ready: 0, scheduled: 1, draft: 2 };
                return (order[a.status] ?? 3) - (order[b.status] ?? 3);
              }).map(post => (
                <div key={post.id} className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-colors">
                  <div className="px-4 py-2 border-b border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${POST_STATUSES[post.status]?.color}`}>
                        {POST_STATUSES[post.status]?.icon} {POST_STATUSES[post.status]?.label}
                      </span>
                      <span className="text-xs">{PLATFORMS[post.platform]?.icon}</span>
                      <span className="text-[10px] text-gray-500">{PLATFORMS[post.platform]?.label}</span>
                    </div>
                    {post.scheduledDate && (
                      <span className="text-[10px] text-blue-400">📅 {new Date(post.scheduledDate+'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} {post.scheduledTime}</span>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    {post.articleTitle && <div className="text-[10px] text-indigo-400 mb-1.5">📰 {post.articleTitle}</div>}
                    <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-6 leading-relaxed">{post.text}</p>
                    {post.imageUrl && (
                      <div className="mt-2">
                        <img src={post.imageUrl.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(post.imageUrl)}` : post.imageUrl}
                          alt="" className="w-full max-h-32 object-cover rounded-lg border border-gray-700/50" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2.5 border-t border-gray-700/50 flex items-center gap-2 bg-gray-800/60">
                    <button type="button" onClick={() => copyGrabAndGo(post)}
                      className="flex-1 py-2 bg-green-600/90 text-white text-xs font-semibold rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-1.5">
                      {copiedId === `grab-${post.id}` ? '✓ Copied! Go paste it →' : '📋 Copy & Go'}
                    </button>
                    <button type="button" onClick={() => editPost(post)}
                      className="px-3 py-2 bg-gray-700 text-gray-300 text-xs rounded-lg hover:bg-gray-600 transition-colors" title="Edit">✏️</button>
                    <button type="button" onClick={() => markPublished(post.id)}
                      className="px-3 py-2 bg-gray-700 text-gray-300 text-xs rounded-lg hover:bg-gray-600 transition-colors" title="Mark Published">✅</button>
                    <button type="button" onClick={() => { if (confirm('Delete this post?')) deletePost(post.id); }}
                      className="px-3 py-2 bg-gray-700 text-red-400/60 text-xs rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Delete">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick LinkedIn Guide */}
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl p-4 border border-blue-500/20 mt-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💼</span>
              <div>
                <h3 className="text-sm font-semibold text-white">Quick LinkedIn Publish Guide</h3>
                <p className="text-[11px] text-gray-400">Fastest way to get your posts live</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { step: '1', label: 'Click "Copy & Go"', desc: 'Copies full post text' },
                { step: '2', label: 'Open LinkedIn', desc: 'linkedin.com → Start a post' },
                { step: '3', label: 'Paste & add image', desc: 'Ctrl+V, attach your image' },
                { step: '4', label: 'Post!', desc: 'Review, then hit Post' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-[11px] font-bold text-blue-300 flex-shrink-0">{s.step}</div>
                  <div>
                    <div className="text-[11px] font-medium text-white">{s.label}</div>
                    <div className="text-[10px] text-gray-500">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600/80 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors">
                💼 Open LinkedIn →
              </a>
              <a href="https://twitter.com/compose/tweet" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 flex items-center gap-1.5 transition-colors">
                🐦 Open X/Twitter →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CALENDAR VIEW ==================== */}
      {view === 'calendar' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <button type="button" onClick={() => { if (calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }} className="text-gray-400 hover:text-white text-sm px-2">←</button>
            <h3 className="text-sm font-semibold text-white">{new Date(calYear, calMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
            <button type="button" onClick={() => { if (calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }} className="text-gray-400 hover:text-white text-sm px-2">→</button>
          </div>
          <div className="grid grid-cols-7">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="px-2 py-2 text-center text-[10px] font-semibold text-gray-500 border-b border-gray-700">{d}</div>
            ))}
            {calendarData.map((day, i) => (
              <div key={i} className={`min-h-[80px] p-1.5 border-b border-r border-gray-700/50 ${day?.date===today?'bg-indigo-600/10':''} ${!day?'bg-gray-800/30':''}`}>
                {day && (
                  <>
                    <div className={`text-[11px] font-medium mb-1 ${day.date===today?'text-indigo-300':'text-gray-400'}`}>{day.day}</div>
                    {day.posts.slice(0,3).map(p => (
                      <div key={p.id} className={`text-[9px] px-1 py-0.5 rounded mb-0.5 truncate cursor-pointer hover:opacity-80 ${POST_STATUSES[p.status]?.color?.split(' ').slice(0,2).join(' ') || 'bg-gray-700 text-gray-400'}`}
                        onClick={() => editPost(p)}>
                        {PLATFORMS[p.platform]?.icon} {p.text?.slice(0,20)}
                      </div>
                    ))}
                    {day.posts.length>3 && <div className="text-[9px] text-gray-500">+{day.posts.length-3} more</div>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== PUBLISHED VIEW ==================== */}
      {view === 'published' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">✅ Published Posts</h3>
            <span className="text-[11px] text-gray-500">{stats.published} total</span>
          </div>
          {posts.filter(p => p.status === 'published').length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <span className="text-3xl mb-2">📜</span>
              <p className="text-sm text-gray-400">No published posts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.filter(p => p.status === 'published').sort((a,b) => (b.publishedAt||b.createdAt).localeCompare(a.publishedAt||a.createdAt)).map(post => (
                <div key={post.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-300 border border-green-500/30">✅ Published</span>
                      <span className="text-xs">{PLATFORMS[post.platform]?.icon}</span>
                      <span className="text-[10px] text-gray-500">{PLATFORMS[post.platform]?.label}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  {post.articleTitle && <div className="text-[10px] text-indigo-400 mb-1">📰 {post.articleTitle}</div>}
                  <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-4">{post.text}</p>
                  <div className="flex gap-2 mt-3">
                    <button type="button" onClick={() => copyToClipboard(post.text, `pub-${post.id}`)}
                      className="px-3 py-1 text-[10px] text-gray-400 hover:text-white bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      {copiedId === `pub-${post.id}` ? '✓ Copied' : '📋 Re-copy'}
                    </button>
                    <button type="button" onClick={() => { editPost(post); setPosts(prev => prev.map(p => p.id === post.id ? {...p, status: 'draft'} : p)); }}
                      className="px-3 py-1 text-[10px] text-gray-400 hover:text-white bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      🔄 Re-use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
