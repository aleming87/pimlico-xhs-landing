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
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [showDrafts, setShowDrafts] = useState(false);
  const autoSaveTimerRef = useRef(null);

  const AUTOSAVE_KEY = 'xhs-drafting-autosave';

  const LLM_PROMPT = `You are helping me draft an article for Pimlico XHS, a cross-border regulatory intelligence platform.

Generate a complete article in Markdown format that I can upload directly. The system auto-detects all fields.

ARTICLE STRUCTURE:
# [Title — clear, SEO-friendly, 50-80 chars]

[Opening paragraph — the hook. State the key development and why it matters. This becomes the excerpt.]

## Background
[Regulatory context and history — 2-3 paragraphs]

## Key Developments
### [Subheading 1]
[Analysis with bullet points where appropriate]

### [Subheading 2]
[More detail, data, quotes]

## Implications for Firms
1. [Practical, actionable takeaway]
2. [Second takeaway]
3. [Third takeaway]

## What Comes Next
[Forward-looking outlook — 1-2 paragraphs]

---
*This analysis is provided by Pimlico XHS™ for informational purposes. It does not constitute legal advice.*

CATEGORIES (pick one): AI Regulation | Payments | Crypto | Gambling

TAXONOMY TAGS (include relevant ones in content for auto-detection):
Verticals: Gambling, Payments, Crypto, AI
Topics: Online Licensing, Age Verification, Affordability, Financial Promotions, Open Banking, VASP Licensing, Stablecoins, AI Frameworks, AI Risk Tiers, AI Governance Controls, GenAI Labelling, Enforcement Actions, MiCA Implementation, PSD2 Implementation, DORA Implementation
Jurisdictions: European Union, United Kingdom, United States, Germany, France, Malta, Gibraltar, Singapore
Types: Primary Law, Secondary Law, Guideline, Consultation, Enforcement Decision
Stages: Proposal, Consultation Open, Adoption, Entry Into Force, Application, Review

Write professionally but accessibly. Target 800-1200 words. Include specific dates, regulation names, and practical implications.`;

  useEffect(() => {
    setDraftItems(items.filter(i => i.stage === 'drafting'));
  }, [items]);

  // Saved article drafts (articles with status='draft')
  const savedDrafts = articles.filter(a => a.status === 'draft');

  // ─── Auto-save: persist form state to localStorage every 30s ─────
  const getFormSnapshot = () => ({
    meta, content, htmlContent, editorMode, tags, publicationDate,
    isPremium, premiumCutoff, scheduleEnabled, scheduledDate, ogImageUrl,
    editingArticleId: editingArticle?.id || null,
    savedAt: new Date().toISOString(),
  });

  const restoreFromSnapshot = (snap) => {
    if (!snap) return;
    if (snap.meta) setMeta(snap.meta);
    if (snap.content) setContent(snap.content);
    if (snap.htmlContent) setHtmlContent(snap.htmlContent);
    if (snap.editorMode) setEditorMode(snap.editorMode);
    if (snap.tags) setTags(snap.tags);
    if (snap.publicationDate) setPublicationDate(snap.publicationDate);
    if (snap.isPremium !== undefined) setIsPremium(snap.isPremium);
    if (snap.premiumCutoff !== undefined) setPremiumCutoff(snap.premiumCutoff);
    if (snap.scheduleEnabled !== undefined) setScheduleEnabled(snap.scheduleEnabled);
    if (snap.scheduledDate) setScheduledDate(snap.scheduledDate);
    if (snap.ogImageUrl) setOgImageUrl(snap.ogImageUrl);
    if (snap.editingArticleId) {
      const art = articles.find(a => a.id === snap.editingArticleId);
      if (art) setEditingArticle(art);
    }
    if (snap.savedAt) setLastSavedAt(snap.savedAt);
  };

  // Recover auto-saved draft on mount (only if no editingArticle and form is empty)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved && !meta.title && !content) {
        const snap = JSON.parse(saved);
        // Only restore if it has meaningful content
        if (snap.meta?.title || snap.content) {
          restoreFromSnapshot(snap);
          setSuccessMsg(`Draft recovered from ${new Date(snap.savedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }
      }
    } catch {}
  }, [articles.length]); // re-run when articles load so editingArticle can be resolved

  // Auto-save timer: save to localStorage every 30 seconds if there's content
  useEffect(() => {
    if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setInterval(() => {
      if (meta.title || content || htmlContent) {
        try {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(getFormSnapshot()));
          setLastSavedAt(new Date().toISOString());
        } catch {}
      }
    }, 30000);
    return () => { if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current); };
  }, [meta, content, htmlContent, editorMode, tags, publicationDate, isPremium, premiumCutoff, scheduleEnabled, scheduledDate, ogImageUrl, editingArticle]);

  // Also save on unmount
  useEffect(() => {
    return () => {
      try {
        const snap = {
          meta, content, htmlContent, editorMode, tags, publicationDate,
          isPremium, premiumCutoff, scheduleEnabled, scheduledDate, ogImageUrl,
          editingArticleId: editingArticle?.id || null,
          savedAt: new Date().toISOString(),
        };
        if (snap.meta?.title || snap.content || snap.htmlContent) {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(snap));
        }
      } catch {}
    };
  }, []);

  // Load a saved draft article into the editor
  const loadDraft = (article) => {
    setEditingArticle(article);
    setMeta({
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      category: article.category || 'AI Regulation',
      author: article.author || 'Pimlico XHS™ Team',
      readTime: article.readTime || '5 min read',
      featured: article.featured || false,
      image: article.image || '',
    });
    // Detect if content is HTML or markdown
    const isHtml = article.content && /<[a-z][\s\S]*>/i.test(article.content);
    if (isHtml) {
      setEditorMode('visual');
      setHtmlContent(article.content || '');
      setContent('');
    } else {
      setEditorMode('markdown');
      setContent(article.content || '');
      setHtmlContent('');
    }
    setTags(article.tags || []);
    setPublicationDate(article.date || new Date().toISOString().split('T')[0]);
    setIsPremium(article.isPremium || false);
    setPremiumCutoff(article.premiumCutoff || 10);
    setOgImageUrl(article.ogImage || '');
    setShowDrafts(false);
    setSuccessMsg(`Loaded draft: "${article.title}"`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

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

      // --- Extract Content: everything after title + excerpt paragraph ---
      let contentBody = '';
      const contentStartIdx = Math.max(excerptEndIdx, titleLineIdx + 1);
      contentBody = lines.slice(contentStartIdx).join('\n').trim();
      // Strip leading blank lines
      contentBody = contentBody.replace(/^\n+/, '');

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
    setOgImageUrl(''); setEditingArticle(null); setLastSavedAt(null);
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch {}
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
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch {}
    resetForm();
  };

  const handleSaveDraft = () => {
    if (!meta.title) { alert('Please add a title.'); return; }
    const articleId = editingArticle?.id || Date.now();
    const article = {
      id: articleId, ...meta, date: publicationDate, tags,
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
    // Set editingArticle so subsequent saves update instead of duplicating
    setEditingArticle(article);
    setLastSavedAt(new Date().toISOString());
    // Clear auto-save since we just did a real save
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch {}
    setSuccessMsg('Draft saved!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tagSuggestions = tagInput.trim() ? Object.values(PIMLICO_TAXONOMY).flat().filter(t =>
    t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t)
  ).slice(0, 10) : [];

  const wordCount = (editorMode === 'visual' ? htmlContent.replace(/<[^>]+>/g, ' ') : content).trim().split(/\s+/).filter(w => w).length;

  // Comprehensive markdown → HTML renderer for preview & visual editor
  const renderMarkdown = (md) => {
    if (!md) return '<p style="color:#6b7280;">Nothing to preview yet. Start writing above.</p>';

    const lines = md.split('\n');
    const out = [];
    let inCodeBlock = false, codeLang = '', codeLines = [];
    let listStack = []; // 'ul' or 'ol'

    const closeAllLists = () => {
      while (listStack.length) out.push(`</${listStack.pop()}>`);
    };

    const inlineFormat = (text) => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;color:#4338ca;">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#4f46e5;text-decoration:underline;">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:8px 0;"/>');
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Fenced code blocks
      if (/^```/.test(line)) {
        if (!inCodeBlock) {
          closeAllLists();
          inCodeBlock = true;
          codeLang = line.replace('```', '').trim();
          codeLines = [];
        } else {
          out.push(`<pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;line-height:1.6;margin:12px 0;"><code>${codeLines.join('\n').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`);
          inCodeBlock = false;
        }
        continue;
      }
      if (inCodeBlock) { codeLines.push(line); continue; }

      const trimmed = line.trim();

      // Blank line
      if (!trimmed) {
        closeAllLists();
        continue;
      }

      // Horizontal rule
      if (/^[-*_]{3,}$/.test(trimmed)) {
        closeAllLists();
        out.push('<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>');
        continue;
      }

      // Headings
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        closeAllLists();
        const level = headingMatch[1].length;
        const text = inlineFormat(headingMatch[2]);
        const styles = {
          1: 'font-size:28px;font-weight:800;color:#111827;margin:28px 0 12px;line-height:1.3;',
          2: 'font-size:22px;font-weight:700;color:#111827;margin:24px 0 10px;line-height:1.35;',
          3: 'font-size:18px;font-weight:600;color:#1f2937;margin:20px 0 8px;line-height:1.4;',
          4: 'font-size:16px;font-weight:600;color:#374151;margin:16px 0 6px;line-height:1.4;',
        };
        out.push(`<h${level} style="${styles[level]}">${text}</h${level}>`);
        continue;
      }

      // Blockquote
      if (/^>\s?/.test(trimmed)) {
        closeAllLists();
        const quoteText = inlineFormat(trimmed.replace(/^>\s?/, ''));
        out.push(`<blockquote style="border-left:4px solid #6366f1;padding:8px 16px;color:#6b7280;margin:12px 0;background:#f8fafc;border-radius:0 6px 6px 0;font-style:italic;">${quoteText}</blockquote>`);
        continue;
      }

      // Ordered list item (1. 2. 3. etc)
      const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (olMatch) {
        if (!listStack.length || listStack[listStack.length - 1] !== 'ol') {
          closeAllLists();
          out.push('<ol style="padding-left:24px;margin:8px 0;list-style-type:decimal;">');
          listStack.push('ol');
        }
        out.push(`<li style="color:#374151;margin:4px 0;line-height:1.7;">${inlineFormat(olMatch[2])}</li>`);
        continue;
      }

      // Unordered list item (- or * or +)
      const ulMatch = trimmed.match(/^[-*+]\s+(.+)$/);
      if (ulMatch) {
        if (!listStack.length || listStack[listStack.length - 1] !== 'ul') {
          closeAllLists();
          out.push('<ul style="padding-left:24px;margin:8px 0;list-style-type:disc;">');
          listStack.push('ul');
        }
        out.push(`<li style="color:#374151;margin:4px 0;line-height:1.7;">${inlineFormat(ulMatch[1])}</li>`);
        continue;
      }

      // Table row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Check if this is a separator row (|---|---|)
        if (/^\|[\s-:|]+\|$/.test(trimmed)) continue;
        closeAllLists();
        const cells = trimmed.split('|').filter(c => c.trim()).map(c => inlineFormat(c.trim()));
        // Peek ahead: if next row is separator, this is a header row
        const nextLine = (lines[i + 1] || '').trim();
        const isHeader = /^\|[\s-:|]+\|$/.test(nextLine);
        if (isHeader) {
          out.push('<table style="width:100%;border-collapse:collapse;margin:12px 0;"><thead><tr>');
          cells.forEach(c => out.push(`<th style="border:1px solid #e5e7eb;padding:8px 12px;background:#f9fafb;color:#111827;text-align:left;font-weight:600;font-size:13px;">${c}</th>`));
          out.push('</tr></thead><tbody>');
        } else {
          out.push('<tr>');
          cells.forEach(c => out.push(`<td style="border:1px solid #e5e7eb;padding:8px 12px;color:#4b5563;font-size:14px;">${c}</td>`));
          out.push('</tr>');
          // Check if next line is not a table row — close table
          const next = (lines[i + 1] || '').trim();
          if (!next.startsWith('|')) out.push('</tbody></table>');
        }
        continue;
      }

      // Regular paragraph
      closeAllLists();
      out.push(`<p style="color:#374151;margin:8px 0;line-height:1.8;font-size:15px;">${inlineFormat(trimmed)}</p>`);
    }

    // Close any remaining open tags
    closeAllLists();
    if (inCodeBlock) {
      out.push(`<pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;"><code>${codeLines.join('\n').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`);
    }

    return out.join('\n');
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
        <div className="flex items-center gap-2">
          {savedDrafts.length > 0 && (
            <button onClick={() => setShowDrafts(p => !p)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${showDrafts ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              📂 Drafts ({savedDrafts.length})
            </button>
          )}
          <button onClick={() => setShowPrompt(p => !p)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${showPrompt ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🤖 LLM Prompt
          </button>
          {lastSavedAt && (
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              💾 {new Date(lastSavedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {editingArticle && (
            <button onClick={resetForm} className="text-sm text-gray-400 hover:text-white">✕ Cancel Edit</button>
          )}
        </div>
      </div>

      {/* LLM Prompt Panel */}
      {showPrompt && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">🤖 LLM Prompt — Generate a full article</h3>
            <button onClick={() => { navigator.clipboard.writeText(LLM_PROMPT); }}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-lg hover:bg-amber-500/30 transition-colors">
              📋 Copy Prompt
            </button>
          </div>
          <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto border border-gray-700/50">{LLM_PROMPT}</pre>
          <p className="text-[11px] text-amber-400/60">Paste this into your LLM with your topic. Save the output as a .md file, then use "Import .md → Auto-fill" to populate all fields instantly.</p>
        </div>
      )}

      {/* Saved Drafts Panel */}
      {showDrafts && savedDrafts.length > 0 && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-300 flex items-center gap-2">📂 Your Saved Drafts</h3>
            <button onClick={() => setShowDrafts(false)} className="text-xs text-gray-500 hover:text-white">✕ Close</button>
          </div>
          <div className="space-y-2">
            {savedDrafts.map(draft => (
              <div key={draft.id} className="flex items-center justify-between bg-gray-800/60 rounded-lg px-4 py-3 group hover:bg-gray-800/80 transition-colors border border-gray-700/40">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium truncate">{draft.title}</p>
                    {editingArticle?.id === draft.id && (
                      <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-bold rounded">EDITING</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {draft.category && <span className="text-[10px] text-indigo-400">{draft.category}</span>}
                    {draft.lastSaved && <span className="text-[10px] text-gray-500">Saved {new Date(draft.lastSaved).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {new Date(draft.lastSaved).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>}
                    {draft.tags?.length > 0 && <span className="text-[10px] text-gray-500">{draft.tags.length} tags</span>}
                    <span className="text-[10px] text-gray-600">{draft.content ? `${draft.content.split(/\s+/).length} words` : 'Empty'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => loadDraft(draft)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/25 rounded-lg transition-colors">
                    ✏️ Edit
                  </button>
                  <button onClick={() => {
                    if (confirm(`Delete draft "${draft.title}"?`)) {
                      setArticles(articles.filter(a => a.id !== draft.id));
                      if (editingArticle?.id === draft.id) resetForm();
                    }
                  }}
                    className="px-2 py-1.5 text-xs text-red-400/50 hover:text-red-400 bg-gray-700/30 hover:bg-red-500/10 rounded-lg transition-colors">
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-2">💡 Drafts auto-save every 30 seconds. Your work is safe even if you navigate away.</p>
        </div>
      )}

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
                <button onClick={() => { if (editorMode === 'markdown' && content) { setHtmlContent(renderMarkdown(content)); } setEditorMode('visual'); setShowPreview(false); }}
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
            <div>
              {/* Formatting Toolbar */}
              <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-100 border border-gray-300 rounded-t-lg border-b-0 flex-wrap">
                {[
                  { label: 'B', cmd: 'bold', title: 'Bold (Ctrl+B)', style: 'font-bold' },
                  { label: 'I', cmd: 'italic', title: 'Italic (Ctrl+I)', style: 'italic' },
                  { label: 'H2', cmd: 'formatBlock', arg: 'h2', title: 'Heading 2' },
                  { label: 'H3', cmd: 'formatBlock', arg: 'h3', title: 'Heading 3' },
                  { label: '¶', cmd: 'formatBlock', arg: 'p', title: 'Paragraph' },
                ].map(btn => (
                  <button key={btn.label} type="button" title={btn.title}
                    onClick={() => { document.execCommand(btn.cmd, false, btn.arg || null); editorRef.current && setHtmlContent(editorRef.current.innerHTML); }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded hover:bg-gray-200 text-gray-700 ${btn.style || ''}`}>
                    {btn.label}
                  </button>
                ))}
                <span className="w-px h-5 bg-gray-300 mx-1" />
                {[
                  { label: '• List', cmd: 'insertUnorderedList', title: 'Bullet list' },
                  { label: '1. List', cmd: 'insertOrderedList', title: 'Numbered list' },
                  { label: '"', cmd: 'formatBlock', arg: 'blockquote', title: 'Blockquote', style: 'italic' },
                ].map(btn => (
                  <button key={btn.label} type="button" title={btn.title}
                    onClick={() => { document.execCommand(btn.cmd, false, btn.arg || null); editorRef.current && setHtmlContent(editorRef.current.innerHTML); }}
                    className={`px-2.5 py-1 text-xs font-medium rounded hover:bg-gray-200 text-gray-700 ${btn.style || ''}`}>
                    {btn.label}
                  </button>
                ))}
                <span className="w-px h-5 bg-gray-300 mx-1" />
                <button type="button" title="Insert link"
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) { document.execCommand('createLink', false, url); editorRef.current && setHtmlContent(editorRef.current.innerHTML); }
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded hover:bg-gray-200 text-gray-700">🔗 Link</button>
                <button type="button" title="Insert horizontal rule"
                  onClick={() => { document.execCommand('insertHorizontalRule', false, null); editorRef.current && setHtmlContent(editorRef.current.innerHTML); }}
                  className="px-2.5 py-1 text-xs font-medium rounded hover:bg-gray-200 text-gray-700">— HR</button>
                <button type="button" title="Remove formatting"
                  onClick={() => { document.execCommand('removeFormat', false, null); editorRef.current && setHtmlContent(editorRef.current.innerHTML); }}
                  className="px-2.5 py-1 text-xs font-medium rounded hover:bg-gray-200 text-gray-500 ml-auto">✕ Clear</button>
              </div>
              <div ref={editorRef} contentEditable suppressContentEditableWarning
                onInput={e => setHtmlContent(e.currentTarget.innerHTML)}
                className="w-full px-6 py-4 bg-white border border-gray-300 rounded-b-lg text-gray-900 prose prose-sm max-w-none min-h-[400px] max-h-[700px] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-indigo-300"
                style={{ lineHeight: 1.75, fontSize: '15px' }}
                dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color:#9ca3af;">Start writing or switch from Markdown to import content...</p>' }}
                onFocus={e => { if (e.currentTarget.innerHTML.includes('Start writing')) e.currentTarget.innerHTML = '<p><br></p>'; }} />
            </div>
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
