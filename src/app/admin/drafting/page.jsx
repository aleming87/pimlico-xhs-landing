"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useArticles } from '../ArticlesContext';
import { useWorkflow } from '../WorkflowContext';

// Pimlico Taxonomy Tags
const PIMLICO_TAXONOMY = {
  vertical: ['Gambling', 'Payments', 'Crypto', 'AI'],
  topic: ['Online Licensing', 'Land Licensing', 'Age Verification', 'Affordability', 'Self Exclusion', 'Slot Design', 'Ad Content', 'Financial Promotions', 'Open Banking', 'VASP Licensing', 'Stablecoins', 'AI Frameworks', 'AI Risk Tiers', 'AI Governance Controls', 'GenAI Labelling', 'Enforcement Actions', 'MiCA Implementation', 'PSD2 Implementation', 'DORA Implementation'],
  jurisdiction: ['European Union', 'United Kingdom', 'United States', 'Germany', 'France', 'Italy', 'Spain', 'Malta', 'Gibraltar', 'Isle of Man', 'Netherlands', 'Sweden', 'Australia', 'Singapore', 'Hong Kong', 'United Arab Emirates'],
  type: ['Primary Law', 'Secondary Law', 'Guideline', 'Consultation', 'Enforcement Decision', 'Press Release'],
  stage: ['Proposal', 'Consultation Open', 'Adoption', 'Entry Into Force', 'Application', 'Review'],
};

export default function DraftingPage() {
  const { articles, setArticles } = useArticles();
  const { items, addItem, updateItem } = useWorkflow();
  const editorRef = useRef(null);

  const [meta, setMeta] = useState({
    title: '', slug: '', excerpt: '', category: 'AI Regulation',
    author: 'Pimlico XHS™ Team', readTime: '5 min read', featured: false, image: '',
  });
  const [content, setContent] = useState('');
  const [editorMode, setEditorMode] = useState('markdown');
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedTagCat, setSelectedTagCat] = useState('topic');
  const [publicationDate, setPublicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumCutoff, setPremiumCutoff] = useState(10);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [draftItems, setDraftItems] = useState([]);

  useEffect(() => {
    setDraftItems(items.filter(i => i.stage === 'drafting'));
  }, [items]);

  const slugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const shouldAutoSlug = !meta.slug || meta.slug === slugify(meta.title);
    setMeta(prev => ({ ...prev, title, ...(shouldAutoSlug ? { slug: slugify(title) } : {}) }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setMeta(prev => ({ ...prev, image: data.url }));
        setOgImageUrl(data.url);
      } else {
        // Fallback to base64
        const reader = new FileReader();
        reader.onload = () => { setMeta(prev => ({ ...prev, image: reader.result })); };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => { setMeta(prev => ({ ...prev, image: reader.result })); };
      reader.readAsDataURL(file);
    }
    setIsUploading(false);
  };

  const CATEGORIES = ['AI Regulation', 'Payments', 'Crypto', 'Gambling'];

  // Smart MD upload: auto-fills title, excerpt, category, tags, and content
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const lines = text.split('\n');

      // --- Extract Title: first # heading or first non-empty line ---
      let extractedTitle = '';
      let titleLineIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (/^#{1,2}\s+/.test(trimmed)) {
          extractedTitle = trimmed.replace(/^#{1,2}\s+/, '').trim();
          titleLineIdx = i;
          break;
        }
      }
      if (!extractedTitle) {
        // Fallback: first non-empty line
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim()) {
            extractedTitle = lines[i].trim().replace(/^#+\s*/, '');
            titleLineIdx = i;
            break;
          }
        }
      }

      // --- Extract Excerpt: first paragraph of body text (non-heading, non-empty) ---
      let extractedExcerpt = '';
      let excerptEndIdx = titleLineIdx;
      for (let i = titleLineIdx + 1; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!trimmed) continue; // skip blank lines
        if (/^#{1,3}\s+/.test(trimmed)) break; // stop at next heading
        if (/^[-*_]{3,}$/.test(trimmed)) continue; // skip dividers
        // Collect paragraph text
        let para = '';
        for (let j = i; j < lines.length; j++) {
          const l = lines[j].trim();
          if (!l || /^#{1,3}\s+/.test(l)) { excerptEndIdx = j; break; }
          para += (para ? ' ' : '') + l.replace(/^[-*+]\s+/, '');
          excerptEndIdx = j + 1;
        }
        extractedExcerpt = para.slice(0, 280);
        break;
      }

      // --- Detect Category from content ---
      const lowerText = text.toLowerCase();
      const categoryScores = {};
      const CATEGORY_KEYWORDS = {
        'AI Regulation': ['ai regulation', 'artificial intelligence', 'ai act', 'ai framework', 'machine learning', 'ai governance', 'ai risk', 'genai', 'foundation model'],
        'Payments': ['payment', 'psd2', 'psd3', 'open banking', 'financial promotion', 'fintech', 'dora', 'emi', 'psp', 'iban'],
        'Crypto': ['crypto', 'mica', 'vasp', 'stablecoin', 'digital asset', 'token', 'blockchain', 'defi', 'web3'],
        'Gambling': ['gambling', 'gaming', 'betting', 'casino', 'slot', 'lottery', 'igaming', 'age verification', 'self exclusion', 'affordability', 'ukgc'],
      };
      for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        categoryScores[cat] = keywords.reduce((score, kw) => score + (lowerText.includes(kw) ? 1 : 0), 0);
      }
      const bestCat = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0];
      const detectedCategory = bestCat && bestCat[1] > 0 ? bestCat[0] : 'AI Regulation';

      // --- Extract Tags from taxonomy ---
      const detectedTags = [];
      const allTaxTags = Object.values(PIMLICO_TAXONOMY).flat();
      for (const tag of allTaxTags) {
        if (lowerText.includes(tag.toLowerCase()) && !detectedTags.includes(tag)) {
          detectedTags.push(tag);
        }
      }
      // Also grab any #hashtags from the markdown
      const hashTags = text.match(/#(\w{3,})/g);
      if (hashTags) {
        for (const ht of hashTags) {
          const clean = ht.replace('#', '');
          // Match against taxonomy
          const match = allTaxTags.find(t => t.toLowerCase() === clean.toLowerCase());
          if (match && !detectedTags.includes(match)) detectedTags.push(match);
        }
      }

      // --- Extract Content: everything after title/excerpt ---
      let contentBody = '';
      const contentStartIdx = Math.max(titleLineIdx + 1, 0);
      contentBody = lines.slice(contentStartIdx).join('\n').trim();

      // --- Calculate read time ---
      const wordCount = contentBody.split(/\s+/).filter(w => w).length;
      const readMins = Math.max(1, Math.ceil(wordCount / 200));

      // --- Auto-fill all fields ---
      setMeta(prev => ({
        ...prev,
        title: extractedTitle || prev.title,
        slug: extractedTitle ? slugify(extractedTitle) : prev.slug,
        excerpt: extractedExcerpt || prev.excerpt,
        category: detectedCategory,
        readTime: `${readMins} min read`,
      }));
      setContent(contentBody);
      setTags(detectedTags.slice(0, 12)); // Cap at 12 tags

      // Show success feedback
      setSuccessMsg(`Imported "${extractedTitle}" — ${detectedTags.length} tags detected, ${wordCount} words`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetForm = () => {
    setMeta({ title: '', slug: '', excerpt: '', category: 'AI Regulation', author: 'Pimlico XHS™ Team', readTime: '5 min read', featured: false, image: '' });
    setContent(''); setHtmlContent(''); setTags([]); setTagInput('');
    setPublicationDate(new Date().toISOString().split('T')[0]);
    setIsPremium(false); setPremiumCutoff(10); setScheduleEnabled(false); setScheduledDate('');
    setOgImageUrl(''); setEditingArticle(null);
  };

  const handlePublish = () => {
    if (!meta.title || !(content || htmlContent)) {
      alert('Please fill in the title and content.'); return;
    }
    const articleContent = editorMode === 'visual' ? htmlContent : content;
    const article = {
      id: editingArticle?.id || Date.now(),
      ...meta, date: publicationDate, tags,
      content: articleContent, isPremium, premiumCutoff: isPremium ? premiumCutoff : null,
      ogImage: ogImageUrl || meta.image, status: scheduleEnabled ? 'scheduled' : 'published',
      ...(scheduleEnabled && scheduledDate ? { scheduledAt: scheduledDate } : {}),
    };

    let updated;
    if (editingArticle) {
      updated = articles.map(a => a.id === editingArticle.id ? { ...a, ...article } : a);
    } else {
      updated = [article, ...articles];
    }
    setArticles(updated);
    setSuccessMsg(editingArticle ? 'Article updated!' : scheduleEnabled ? 'Article scheduled!' : 'Article published!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    resetForm();
  };

  const handleSaveDraft = () => {
    if (!meta.title) { alert('Please add a title.'); return; }
    const article = {
      id: editingArticle?.id || Date.now(), ...meta, date: publicationDate, tags,
      content: editorMode === 'visual' ? htmlContent : content,
      isPremium, premiumCutoff: isPremium ? premiumCutoff : null,
      ogImage: ogImageUrl || meta.image, status: 'draft', lastSaved: new Date().toISOString(),
    };
    let updated;
    if (editingArticle) {
      updated = articles.map(a => a.id === editingArticle.id ? { ...a, ...article } : a);
    } else {
      updated = [article, ...articles];
    }
    setArticles(updated);
    setSuccessMsg('Draft saved!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tagSuggestions = tagInput.trim() ? Object.values(PIMLICO_TAXONOMY).flat().filter(t =>
    t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t)
  ).slice(0, 10) : [];

  const wordCount = (editorMode === 'visual' ? htmlContent.replace(/<[^>]+>/g, ' ') : content).trim().split(/\s+/).filter(w => w).length;

  // Simple markdown → HTML renderer for preview
  const renderMarkdown = (md) => {
    if (!md) return '<p style="color:#6b7280;">Nothing to preview yet. Start writing above.</p>';
    let html = md
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:#1e293b;padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>')
      .replace(/^\> (.+)$/gm, '<blockquote style="border-left:3px solid #6366f1;padding-left:12px;color:#94a3b8;margin:12px 0;">$1</blockquote>')
      .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#818cf8;text-decoration:underline;">$1</a>')
      .replace(/^---$/gm, '<hr style="border-color:#334155;margin:20px 0;"/>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>.*?<\/li>(\s*<br\/>)?)+/gs, (match) => '<ul style="padding-left:20px;margin:8px 0;">' + match.replace(/<br\/>/g, '') + '</ul>');
    return '<p>' + html + '</p>';
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-pulse">
          ✓ {successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">✏️ Drafting</h1>
          <p className="text-sm text-gray-400 mt-0.5">{editingArticle ? `Editing: ${editingArticle.title}` : 'Create and publish articles'}</p>
        </div>
        {editingArticle && (
          <button onClick={resetForm} className="text-sm text-gray-400 hover:text-white">✕ Cancel Edit</button>
        )}
      </div>

      {/* Workflow items from Ideas */}
      {draftItems.length > 0 && !editingArticle && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-blue-300 mb-2">📥 Ideas ready for drafting ({draftItems.length})</h3>
          <div className="space-y-1.5">
            {draftItems.slice(0, 8).map(item => {
              const priColor = item.priority === 'high' ? 'text-red-400 bg-red-500/15' : item.priority === 'low' ? 'text-gray-400 bg-gray-500/15' : 'text-yellow-400 bg-yellow-500/15';
              return (
                <div key={item.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2.5 group hover:bg-gray-800/80 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${priColor}`}>{(item.priority || 'med').slice(0,3).toUpperCase()}</span>
                    <span className="text-xs text-white truncate">{item.title}</span>
                    {item.tags?.length > 0 && <span className="text-[9px] text-purple-400/60 hidden group-hover:inline">({item.tags.slice(0,2).join(', ')})</span>}
                  </div>
                  <button onClick={() => {
                      // Auto-fill ALL fields from the idea
                      const detectedCategory = (item.tags || []).find(t => ['AI Regulation', 'Payments', 'Crypto', 'Gambling'].includes(t)) || 'AI Regulation';
                      setMeta(prev => ({
                        ...prev,
                        title: item.title,
                        slug: slugify(item.title),
                        excerpt: item.description || '',
                        category: detectedCategory,
                      }));
                      // Set tags (filter out category-level tags, keep specific ones)
                      if (item.tags?.length) setTags(item.tags);
                      // Pre-populate content body with a structured markdown skeleton
                      const skeleton = `# ${item.title}\n\n${item.description || ''}\n\n## Background\n\n[Provide regulatory context and history here]\n\n## Key Developments\n\n[Main analysis and findings]\n\n## Implications for Firms\n\n1. [Practical takeaway 1]\n2. [Practical takeaway 2]\n3. [Practical takeaway 3]\n\n## What Comes Next\n\n[Forward-looking outlook]\n\n---\n\n*This analysis is provided by Pimlico XHS™ for informational purposes. It does not constitute legal advice.*`;
                      setContent(skeleton);
                      // Calculate read time for the skeleton
                      const wc = skeleton.split(/\s+/).filter(w => w).length;
                      setMeta(prev => ({ ...prev, readTime: `${Math.max(1, Math.ceil(wc / 200))} min read` }));
                      // Show success
                      setSuccessMsg(`Loaded "${item.title}" — edit the skeleton and publish`);
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 3000);
                    }}
                    className="px-2.5 py-1 text-[10px] font-semibold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/25 rounded-md transition-colors ml-2 whitespace-nowrap">
                    Load → Auto-fill
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Title + Slug */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
            <input type="text" value={meta.title} onChange={handleTitleChange} placeholder="Enter article title..."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">URL Slug</label>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-1">/insights/</span>
              <input type="text" value={meta.slug} onChange={e => setMeta(p => ({ ...p, slug: e.target.value }))} placeholder="article-slug"
                className="flex-1 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Excerpt</label>
          <textarea value={meta.excerpt} onChange={e => setMeta(p => ({ ...p, excerpt: e.target.value }))} placeholder="Brief description..."
            rows={2} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none" />
        </div>

        {/* Category / Read Time / Date */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
            <select value={meta.category} onChange={e => setMeta(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
              <option>AI Regulation</option><option>Payments</option><option>Crypto</option><option>Gambling</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Read Time</label>
            <input type="text" value={meta.readTime} onChange={e => setMeta(p => ({ ...p, readTime: e.target.value }))}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Publication Date</label>
            <input type="date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-4">
          <label className={`inline-flex items-center gap-2 px-4 py-2 ${isUploading ? 'bg-gray-600 cursor-wait' : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'} text-white text-sm rounded-lg transition-colors`}>
            {isUploading ? '⏳ Uploading...' : '🖼️ Cover Image'}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
          </label>
          {meta.image && (
            <div className="relative">
              <img src={meta.image} alt="" className="h-14 w-24 object-cover rounded-lg" />
              <button onClick={() => setMeta(p => ({ ...p, image: '' }))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs">×</button>
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" checked={meta.featured} onChange={e => setMeta(p => ({ ...p, featured: e.target.checked }))} className="rounded bg-gray-800 border-gray-700 text-indigo-500" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-amber-400/80">
              <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} className="rounded bg-gray-800 border-amber-700 text-amber-500" />
              ⭐ Premium
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-900/50 text-indigo-300 rounded-full text-xs">
                {tag} <button onClick={() => setTags(t => t.filter(x => x !== tag))} className="hover:text-white">×</button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Search taxonomy tags..."
              onKeyDown={e => { if (e.key === 'Enter' && tagInput.trim()) { setTags(t => [...t, tagInput.trim()]); setTagInput(''); e.preventDefault(); } }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            {tagSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                {tagSuggestions.map(s => (
                  <button key={s} type="button" onMouseDown={e => { e.preventDefault(); setTags(t => [...t, s]); setTagInput(''); }}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-indigo-900/50">{s}</button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <select value={selectedTagCat} onChange={e => setSelectedTagCat(e.target.value)}
              className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs">
              {Object.keys(PIMLICO_TAXONOMY).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {PIMLICO_TAXONOMY[selectedTagCat].filter(t => !tags.includes(t)).slice(0, 15).map(t => (
                <button key={t} onClick={() => setTags(prev => [...prev, t])}
                  className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded text-[10px]">+ {t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-400">Content</label>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-700 rounded-lg p-0.5">
                <button onClick={() => { setEditorMode('markdown'); setShowPreview(false); }}
                  className={`px-3 py-1 text-xs rounded-md ${editorMode === 'markdown' && !showPreview ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>Markdown</button>
                <button onClick={() => { if (editorMode === 'markdown' && content) { setHtmlContent(content); } setEditorMode('visual'); setShowPreview(false); }}
                  className={`px-3 py-1 text-xs rounded-md ${editorMode === 'visual' && !showPreview ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>Visual</button>
                <button onClick={() => setShowPreview(p => !p)}
                  className={`px-3 py-1 text-xs rounded-md ${showPreview ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>👁 Preview</button>
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/80 text-white text-xs rounded-lg hover:bg-emerald-500 cursor-pointer font-medium transition-colors">
                📄 Import .md → Auto-fill
                <input type="file" accept=".md,.markdown,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {showPreview ? (
            /* Article Preview */
            <div className="bg-white rounded-lg border border-gray-300 p-8 min-h-[400px] overflow-y-auto max-h-[700px]">
              {/* Preview Header */}
              <div className="border-b border-gray-200 pb-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {meta.category && <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[11px] font-semibold rounded-full">{meta.category}</span>}
                  {meta.featured && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full">★ Featured</span>}
                  {isPremium && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full">⭐ Premium</span>}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{meta.title || 'Untitled Article'}</h1>
                {meta.excerpt && <p className="text-gray-500 mt-2 text-sm italic border-l-3 border-indigo-400 pl-3">{meta.excerpt}</p>}
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span>{meta.author}</span>
                  <span>·</span>
                  <span>{publicationDate ? new Date(publicationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No date'}</span>
                  <span>·</span>
                  <span>{meta.readTime}</span>
                </div>
                {meta.image && <img src={meta.image} alt="" className="w-full h-48 object-cover rounded-lg mt-4" />}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">{t}</span>)}
                  </div>
                )}
              </div>
              {/* Preview Body */}
              <div
                className="prose prose-sm max-w-none text-gray-800"
                style={{ lineHeight: 1.75, fontSize: '15px' }}
                dangerouslySetInnerHTML={{ __html: editorMode === 'visual' ? (htmlContent || '<p style="color:#9ca3af;">No content yet.</p>') : renderMarkdown(content) }}
              />
              {/* Preview Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 text-center text-[11px] text-gray-400">
                © {new Date().getFullYear()} Pimlico XHS™ — Cross-Border Regulatory Intelligence
              </div>
            </div>
          ) : editorMode === 'visual' ? (
            <div ref={editorRef} contentEditable suppressContentEditableWarning
              onInput={e => setHtmlContent(e.currentTarget.innerHTML)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 prose max-w-none min-h-[400px] overflow-y-auto focus:outline-none"
              dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color:#9ca3af;">Start writing...</p>' }}
              onFocus={e => { if (e.currentTarget.innerHTML.includes('Start writing...')) e.currentTarget.innerHTML = '<p></p>'; }} />
          ) : (
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={20}
              placeholder="## Introduction&#10;&#10;Start writing your article here..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono resize-y min-h-[400px]" />
          )}
          <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800/50 rounded-b-lg text-[10px] text-gray-500 -mt-1">
            <span>{wordCount} words · ~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
            <span>{editorMode === 'visual' ? 'Visual' : 'Markdown'}</span>
          </div>
        </div>

        {/* Schedule */}
        {scheduleEnabled && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <label className="block text-xs text-gray-400 mb-2">Publish date & time</label>
            <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
          <button onClick={handleSaveDraft}
            className="px-5 py-2.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors font-medium">
            💾 Save Draft
          </button>
          <button onClick={handlePublish}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors font-semibold">
            {editingArticle ? '✓ Update' : scheduleEnabled ? '📅 Schedule' : '🚀 Publish'}
          </button>
          <label className="flex items-center gap-2 text-xs text-gray-400 ml-2">
            <input type="checkbox" checked={scheduleEnabled} onChange={e => setScheduleEnabled(e.target.checked)} className="rounded bg-gray-800 border-gray-700 text-indigo-500" />
            Schedule
          </label>
          <button onClick={resetForm} className="ml-auto px-4 py-2 text-sm text-gray-500 hover:text-white transition-colors">Clear</button>
        </div>
      </div>
    </div>
  );
}
