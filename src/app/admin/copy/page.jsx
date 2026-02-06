"use client";
import { useState, useEffect } from 'react';
import { useArticles } from '../ArticlesContext';
import { useWorkflow } from '../WorkflowContext';

const PLATFORMS = {
  linkedin: { label: 'LinkedIn', icon: '💼', maxChars: 3000, tone: 'Professional, authoritative', hashtags: 4 },
  twitter: { label: 'Twitter / X', icon: '🐦', maxChars: 280, tone: 'Concise, punchy', hashtags: 3 },
  instagram: { label: 'Instagram', icon: '📸', maxChars: 2200, tone: 'Engaging, visual', hashtags: 10 },
  email: { label: 'Email', icon: '📧', maxChars: null, tone: 'Informative, direct', hashtags: 0 },
  newsletter: { label: 'Newsletter', icon: '📰', maxChars: null, tone: 'Insightful, authoritative', hashtags: 0 },
};

const COPY_TEMPLATES = {
  announcement: { label: '📢 Announcement', template: (a) => `We're excited to share our latest insight on ${a.category?.toLowerCase() || 'regulatory compliance'}:\n\n"${a.title}"\n\n${a.excerpt || 'Read our latest analysis.'}\n\n🔗 Read the full article on pimlicosolutions.com` },
  thoughtLeadership: { label: '💡 Thought Leadership', template: (a) => `The ${a.category?.toLowerCase() || 'regulatory'} landscape is evolving rapidly.\n\nIn our latest piece, we explore "${a.title}" and what it means for the industry.\n\nKey takeaway: Firms that adapt proactively will gain a competitive edge.\n\n🔗 pimlicosolutions.com/insights/${a.slug}` },
  question: { label: '❓ Question Hook', template: (a) => `Are you prepared for the latest changes in ${a.category?.toLowerCase() || 'regulation'}?\n\nOur new article "${a.title}" breaks down what you need to know.\n\n🔗 pimlicosolutions.com/insights/${a.slug}` },
  dataPoint: { label: '📊 Data Point', template: (a) => `${a.category || 'Regulatory compliance'} is changing fast.\n\n"${a.title}"\n\nDive into the data and analysis in our latest article.\n\n🔗 pimlicosolutions.com/insights/${a.slug}` },
  storytelling: { label: '📖 Story Hook', template: (a) => `The story behind ${a.category?.toLowerCase() || 'this regulatory shift'} is more nuanced than it appears.\n\nIn "${a.title}", we uncover the key insights that matter for your business.\n\n🔗 Read more on pimlicosolutions.com` },
};

export default function CopyPage() {
  const { articles } = useArticles();
  const { items, addItem, updateItem } = useWorkflow();

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activePlatform, setActivePlatform] = useState('linkedin');
  const [copies, setCopies] = useState(() => {
    try { const s = localStorage.getItem('xhs-copy-drafts'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [history, setHistory] = useState(() => {
    try { const s = localStorage.getItem('xhs-copy-history'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [variationCount, setVariationCount] = useState(0);
  const [showImagePreview, setShowImagePreview] = useState(true);

  // Custom templates
  const [customTemplates, setCustomTemplates] = useState(() => {
    try { const s = localStorage.getItem('xhs-copy-custom-templates'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const LLM_PROMPT = `You are helping me create social media and email copy for Pimlico XHS, a cross-border regulatory intelligence platform.

I will give you an article title, excerpt, and category. Generate copy for each platform:

PLATFORMS:
1. LinkedIn (max 3000 chars) — Professional, authoritative. Use 🔹 bullet emoji markers. 3-4 hashtags.
2. Twitter/X (max 280 chars) — Concise, punchy. Lead with hook. 2-3 hashtags.
3. Instagram (max 2200 chars) — Engaging, emoji-rich. "Link in bio" CTA. 8-10 hashtags.
4. Email — Subject line + body. Bullet takeaways. Clear CTA.
5. Newsletter — Longer, analytical. Cross-references. Forward outlook.

FORMAT each as:
--- LINKEDIN ---
[Copy text with line breaks and hashtags]

--- TWITTER ---
[280 char max copy]

--- INSTAGRAM ---
[Engaging copy with emojis and hashtags]

--- EMAIL ---
SUBJECT: [Subject line]
[Body with bullet points]

--- NEWSLETTER ---
[Analytical copy]

STYLE RULES:
- Never open with "We're excited to share..." — lead with insight
- LinkedIn: bold statement + bullets + link + hashtags
- Twitter: hook question or bold claim + link
- Use pimlicosolutions.com/insights/[slug] for links
- Hashtags: #CamelCase format, relevant to topic`;

  useEffect(() => {
    try { localStorage.setItem('xhs-copy-custom-templates', JSON.stringify(customTemplates)); } catch {}
  }, [customTemplates]);

  useEffect(() => {
    try { localStorage.setItem('xhs-copy-drafts', JSON.stringify(copies)); } catch {}
  }, [copies]);
  useEffect(() => {
    try { localStorage.setItem('xhs-copy-history', JSON.stringify(history.slice(0, 50))); } catch {}
  }, [history]);

  const getCopyKey = (articleId, platform) => `${articleId}-${platform}`;

  const currentCopy = selectedArticle ? (copies[getCopyKey(selectedArticle.id, activePlatform)] || '') : '';

  const updateCopy = (text) => {
    if (!selectedArticle) return;
    setCopies(prev => ({ ...prev, [getCopyKey(selectedArticle.id, activePlatform)]: text }));
  };

  const applyTemplate = (tKey) => {
    if (!selectedArticle) return;
    const tmpl = COPY_TEMPLATES[tKey];
    if (!tmpl) return;
    const text = tmpl.template(selectedArticle);
    const platform = PLATFORMS[activePlatform];
    const hashtags = selectedArticle.tags?.slice(0, platform.hashtags).map(t => `#${t.replace(/[\s-]+/g, '')}`).join(' ') || '';
    const fullText = hashtags ? `${text}\n\n${hashtags}` : text;
    updateCopy(fullText);
    setActiveTemplate(tKey);
  };

  const generateVariation = () => {
    if (!selectedArticle || !currentCopy) return;
    const count = variationCount + 1;
    setVariationCount(count);
    const variations = [
      `🔍 ${selectedArticle.title}\n\n${selectedArticle.excerpt || 'Read our latest insight.'}\n\n→ pimlicosolutions.com/insights/${selectedArticle.slug}`,
      `New from Pimlico: "${selectedArticle.title}"\n\nStay ahead of the curve in ${selectedArticle.category?.toLowerCase() || 'regulatory compliance'}.\n\n🔗 pimlicosolutions.com`,
      `📌 Must-read: ${selectedArticle.title}\n\n${selectedArticle.category || 'Industry'} professionals - this one's for you.\n\n🔗 pimlicosolutions.com/insights/${selectedArticle.slug}`,
    ];
    updateCopy(variations[count % variations.length]);
  };

  const saveToPipeline = () => {
    if (!selectedArticle || !currentCopy) return;
    const existing = items.find(i => i.articleId === selectedArticle.id && i.stage === 'copy');
    if (existing) {
      updateItem(existing.id, { content: currentCopy, platform: activePlatform, updatedAt: new Date().toISOString() });
    } else {
      addItem({ title: `Copy: ${selectedArticle.title} (${PLATFORMS[activePlatform].label})`, stage: 'copy', priority: 'medium', articleId: selectedArticle.id, platform: activePlatform, content: currentCopy });
    }
    setHistory(prev => [{ id: Date.now(), articleId: selectedArticle.id, platform: activePlatform, text: currentCopy, timestamp: new Date().toISOString() }, ...prev]);
  };

  // Save current copy as a custom reusable template
  const saveCustomTemplate = () => {
    if (!newTemplateName.trim() || !currentCopy) return;
    const updated = {
      ...customTemplates,
      [newTemplateName.trim()]: {
        label: `✨ ${newTemplateName.trim()}`,
        text: currentCopy,
        platform: activePlatform,
        savedAt: new Date().toISOString(),
      }
    };
    setCustomTemplates(updated);
    setNewTemplateName('');
    setShowSaveTemplate(false);
  };

  const deleteCustomTemplate = (name) => {
    const updated = { ...customTemplates };
    delete updated[name];
    setCustomTemplates(updated);
  };

  const applyCustomTemplate = (name) => {
    const tmpl = customTemplates[name];
    if (!tmpl) return;
    // Replace article-specific tokens
    let text = tmpl.text;
    if (selectedArticle) {
      text = text.replace(/pimlicosolutions\.com\/insights\/[\w-]+/g, `pimlicosolutions.com/insights/${selectedArticle.slug || 'article'}`);
    }
    updateCopy(text);
    setActiveTemplate(`custom:${name}`);
  };

  const charCount = currentCopy.length;
  const maxChars = PLATFORMS[activePlatform].maxChars;
  const isOverLimit = maxChars && charCount > maxChars;

  const filteredArticles = articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.category?.toLowerCase().includes(search.toLowerCase()));

  const copyItemsInPipeline = items.filter(i => i.stage === 'copy');

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">✍️ Copy Creation</h1>
          <p className="text-sm text-gray-400 mt-0.5">Craft platform-specific social & email copy for your articles</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPrompt(p => !p)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${showPrompt ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🤖 LLM Prompt
          </button>
          <span className="px-2.5 py-1 bg-purple-500/15 text-purple-300 text-[11px] font-medium rounded-full">{copyItemsInPipeline.length} in pipeline</span>
          <span className="px-2.5 py-1 bg-gray-700 text-gray-300 text-[11px] font-medium rounded-full">{history.length} saved</span>
        </div>
      </div>

      {/* LLM Prompt Panel */}
      {showPrompt && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">🤖 LLM Prompt — Generate multi-platform copy</h3>
            <button onClick={() => {
                const articleInfo = selectedArticle ? `\n\nARTICLE:\nTitle: ${selectedArticle.title}\nExcerpt: ${selectedArticle.excerpt || 'N/A'}\nCategory: ${selectedArticle.category || 'N/A'}\nSlug: ${selectedArticle.slug || 'N/A'}` : '';
                navigator.clipboard.writeText(LLM_PROMPT + articleInfo);
              }}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-lg hover:bg-amber-500/30 transition-colors">
              📋 {selectedArticle ? 'Copy Prompt + Article' : 'Copy Prompt'}
            </button>
          </div>
          <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-[350px] overflow-y-auto border border-gray-700/50">{LLM_PROMPT}</pre>
          {selectedArticle && (
            <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-400 border border-gray-700/30">
              <span className="text-amber-300/80 font-semibold">Selected article included in copy:</span> {selectedArticle.title} ({selectedArticle.category})
            </div>
          )}
          <p className="text-[11px] text-amber-400/60">Paste into your LLM. If an article is selected, "Copy Prompt + Article" includes the article details automatically.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article Selector */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-white mb-2">Select Article</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500 mb-2" />
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredArticles.map(a => (
                <button key={a.id} type="button" onClick={() => { setSelectedArticle(a); setActiveTemplate(null); setVariationCount(0); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedArticle?.id === a.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}>
                  <div className="font-medium truncate">{a.title}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-gray-500">{a.category}</span>
                    {/* Show platforms with existing copy */}
                    {Object.keys(PLATFORMS).filter(p => copies[getCopyKey(a.id, p)]).map(p => (
                      <span key={p} className="text-[10px]">{PLATFORMS[p].icon}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Article Image Preview */}
          {selectedArticle?.image && (
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">🖼️ Article Image</h3>
                <button type="button" onClick={() => setShowImagePreview(!showImagePreview)} className="text-[10px] text-gray-500 hover:text-gray-300">
                  {showImagePreview ? 'Hide' : 'Show'}
                </button>
              </div>
              {showImagePreview && (
                <div className="space-y-2">
                  <img
                    src={selectedArticle.image.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(selectedArticle.image)}` : selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full rounded-lg border border-gray-700/50 object-cover max-h-48"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <button type="button" onClick={() => {
                    const imgUrl = selectedArticle.image.startsWith('http') ? selectedArticle.image : `${window.location.origin}${selectedArticle.image}`;
                    navigator.clipboard.writeText(imgUrl);
                    setCopiedId('image'); setTimeout(() => setCopiedId(null), 2000);
                  }} className="w-full py-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors text-center">
                    {copiedId === 'image' ? '✓ URL Copied' : '📋 Copy Image URL'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pipeline Items */}
          {copyItemsInPipeline.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-white mb-2">📋 In Pipeline</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {copyItemsInPipeline.map(item => (
                  <div key={item.id} className="px-2 py-1.5 bg-gray-700/50 rounded-lg text-[11px] text-gray-300 truncate">
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle: Editor */}
        <div className="lg:col-span-6">
          {selectedArticle ? (
            <div className="space-y-3">
              {/* Platform tabs */}
              <div className="flex gap-1.5 bg-gray-800/80 rounded-xl p-1.5 border border-gray-700/50">
                {Object.entries(PLATFORMS).map(([key, plat]) => (
                  <button key={key} type="button" onClick={() => setActivePlatform(key)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${activePlatform === key ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}>
                    <span>{plat.icon}</span> {plat.label}
                  </button>
                ))}
              </div>

              {/* Info bar */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-gray-500">Tone: {PLATFORMS[activePlatform].tone}</span>
                <span className={`text-[11px] font-medium ${isOverLimit ? 'text-red-400' : maxChars && charCount > maxChars * 0.9 ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {charCount}{maxChars ? ` / ${maxChars}` : ''} chars
                </span>
              </div>

              {/* Text editor */}
              <div className="bg-gray-800 rounded-xl border border-gray-700/50">
                <textarea value={currentCopy} onChange={e => updateCopy(e.target.value)}
                  rows={12} placeholder={`Write ${PLATFORMS[activePlatform].label} copy for "${selectedArticle.title}"...`}
                  className={`w-full px-4 py-3 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none resize-none rounded-xl ${isOverLimit ? 'border-2 border-red-500/50' : ''}`} />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button type="button" onClick={generateVariation} disabled={!currentCopy}
                  className="px-4 py-2 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 disabled:opacity-40 flex items-center gap-1">
                  🔄 Variation
                </button>
                <button type="button" onClick={() => { if (currentCopy) { navigator.clipboard.writeText(currentCopy); setCopiedId(activePlatform); setTimeout(() => setCopiedId(null), 2000); } }}
                  className="px-4 py-2 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 flex items-center gap-1">
                  {copiedId === activePlatform ? '✓ Copied' : '📋 Copy'}
                </button>
                <button type="button" onClick={() => setShowSaveTemplate(!showSaveTemplate)} disabled={!currentCopy}
                  className="px-4 py-2 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 disabled:opacity-40 flex items-center gap-1">
                  📝 Save Template
                </button>
                <div className="flex-1" />
                <button type="button" onClick={saveToPipeline} disabled={!currentCopy}
                  className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 disabled:opacity-40 flex items-center gap-1">
                  💾 Save to Pipeline
                </button>
              </div>

              {/* Save as Template inline */}
              {showSaveTemplate && (
                <div className="flex gap-2 bg-gray-800/80 rounded-xl p-3 border border-indigo-500/30">
                  <input
                    type="text" value={newTemplateName} onChange={e => setNewTemplateName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveCustomTemplate(); }}
                    placeholder="Template name..." autoFocus
                    className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                  <button type="button" onClick={saveCustomTemplate} disabled={!newTemplateName.trim()}
                    className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 disabled:opacity-40">Save</button>
                  <button type="button" onClick={() => { setShowSaveTemplate(false); setNewTemplateName(''); }}
                    className="px-2 py-1.5 text-gray-400 hover:text-white text-xs">✕</button>
                </div>
              )}

              {/* Quick preview of all platforms */}
              <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/30">
                <h4 className="text-[11px] font-semibold text-gray-400 mb-2">All Platform Copies</h4>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(PLATFORMS).map(([key, plat]) => {
                    const txt = copies[getCopyKey(selectedArticle.id, key)] || '';
                    return (
                      <div key={key} className={`p-2 rounded-lg text-[10px] border ${txt ? 'bg-gray-700/40 border-green-500/20 text-gray-300' : 'bg-gray-800/30 border-gray-700/30 text-gray-500'}`}>
                        <div className="text-center mb-1 text-sm">{plat.icon}</div>
                        <div className="truncate">{txt ? `${txt.slice(0, 60)}...` : 'Empty'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <span className="text-5xl mb-4">✍️</span>
              <h3 className="text-lg font-semibold text-white mb-1">Select an Article</h3>
              <p className="text-sm text-gray-400">Choose an article from the left to start writing copy</p>
            </div>
          )}
        </div>

        {/* Right: Templates */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-white mb-3">📝 Templates</h3>
            <div className="space-y-1.5">
              {Object.entries(COPY_TEMPLATES).map(([key, tmpl]) => (
                <button key={key} type="button" onClick={() => applyTemplate(key)} disabled={!selectedArticle}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors disabled:opacity-40 ${activeTemplate === key ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border border-transparent'}`}>
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Saved Templates */}
          {Object.keys(customTemplates).length > 0 && (
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-white mb-2">✨ Your Templates</h3>
              <div className="space-y-1.5">
                {Object.entries(customTemplates).map(([name, tmpl]) => (
                  <div key={name} className={`flex items-center gap-1.5 rounded-lg transition-colors ${activeTemplate === `custom:${name}` ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-gray-700/50'}`}>
                    <button type="button" onClick={() => applyCustomTemplate(name)} disabled={!selectedArticle}
                      className="flex-1 text-left px-3 py-2 text-xs text-gray-300 hover:text-white disabled:opacity-40 truncate">
                      {tmpl.label}
                      <span className="block text-[9px] text-gray-500">{tmpl.platform ? PLATFORMS[tmpl.platform]?.icon : ''} {tmpl.savedAt ? new Date(tmpl.savedAt).toLocaleDateString() : ''}</span>
                    </button>
                    <button type="button" onClick={() => { if (confirm(`Delete template "${name}"?`)) deleteCustomTemplate(name); }}
                      className="px-1.5 py-1 text-red-400/60 hover:text-red-400 text-[10px] mr-1">🗑</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">📜 History</h3>
                <button type="button" onClick={() => setHistory([])} className="text-[10px] text-red-400 hover:text-red-300">Clear</button>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {history.slice(0, 10).map(h => (
                  <button key={h.id} type="button" onClick={() => {
                    const art = articles.find(a => a.id === h.articleId);
                    if (art) { setSelectedArticle(art); setActivePlatform(h.platform); updateCopy(h.text); }
                  }} className="w-full text-left px-2 py-1.5 rounded-lg text-[10px] text-gray-400 hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-1">
                      <span>{PLATFORMS[h.platform]?.icon}</span>
                      <span className="truncate flex-1">{h.text.slice(0, 50)}...</span>
                    </div>
                    <div className="text-[9px] text-gray-600">{new Date(h.timestamp).toLocaleDateString()}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/30">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">💡 Tips</h3>
            <ul className="space-y-1.5 text-[11px] text-gray-500">
              <li>• LinkedIn: Professional tone, 1-3 paragraphs</li>
              <li>• Twitter: Under 280 chars, punchy hook</li>
              <li>• Instagram: Engaging caption, 5-10 hashtags</li>
              <li>• Email: Clear subject line, value proposition</li>
              <li>• Use templates as starting points</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
