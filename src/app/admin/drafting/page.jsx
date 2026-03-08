"use client";
import { useState, useRef, useEffect } from 'react';
import { useArticles } from '../ArticlesContext';
import { DRAFT_FLOW_STEPS, DRAFT_SERIES } from './draft-flow-config';

// Pimlico Taxonomy Tags
const PIMLICO_TAXONOMY = {
  vertical: ['Gambling', 'Payments', 'Crypto', 'AI'],
  topic: ['Online Licensing', 'Land Licensing', 'Age Verification', 'Affordability', 'Self Exclusion', 'Slot Design', 'Ad Content', 'Financial Promotions', 'Open Banking', 'VASP Licensing', 'Stablecoins', 'AI Frameworks', 'AI Risk Tiers', 'AI Governance Controls', 'GenAI Labelling', 'Enforcement Actions', 'MiCA Implementation', 'PSD2 Implementation', 'DORA Implementation'],
  jurisdiction: ['European Union', 'United Kingdom', 'United States', 'Germany', 'France', 'Italy', 'Spain', 'Malta', 'Gibraltar', 'Isle of Man', 'Netherlands', 'Sweden', 'Australia', 'Singapore', 'Hong Kong', 'United Arab Emirates'],
  type: ['Primary Law', 'Secondary Law', 'Guideline', 'Consultation', 'Enforcement Decision', 'Press Release'],
  stage: ['Proposal', 'Consultation Open', 'Adoption', 'Entry Into Force', 'Application', 'Review'],
};

const CATEGORY_OPTIONS = ['AI Regulation', 'Payments', 'Crypto', 'Gambling'];
const DEFAULT_SERIES_KEY = DRAFT_SERIES[0].key;
const DEFAULT_ENGAGEMENTS = {
  newsletterLine: '',
  linkedinTeaser: '',
  coverImagePrompt: '',
  internalNotes: '',
};

const CATEGORY_KEYWORDS = {
  'AI Regulation': ['ai regulation', 'artificial intelligence', 'ai act', 'ai framework', 'machine learning', 'ai governance', 'ai risk', 'genai', 'foundation model'],
  'Payments': ['payment', 'psd2', 'psd3', 'open banking', 'financial promotion', 'fintech', 'dora', 'emi', 'psp', 'iban'],
  'Crypto': ['crypto', 'mica', 'vasp', 'stablecoin', 'digital asset', 'token', 'blockchain', 'defi', 'web3'],
  'Gambling': ['gambling', 'gaming', 'betting', 'casino', 'slot', 'lottery', 'igaming', 'age verification', 'self exclusion', 'affordability', 'ukgc'],
};

const SERIES_KEYWORDS = {
  'what-matters-brief': ['week', 'weekly', 'roundup', 'digest', 'brief', 'what matters'],
  'regulatory-influencer': ['bigger picture', 'flagship', 'market impact', 'trend', 'influencer', 'landscape'],
  'implementation-note': ['implementation', 'practical', 'operational', 'product team', 'legal team', 'compliance team'],
  'cross-border-lens': ['cross-border', 'jurisdiction', 'compare', 'comparison', 'divergence', 'multi-country'],
  'supervisory-signal': ['authority', 'supervisor', 'enforcement', 'investigation', 'fine', 'licensing action'],
  'compliance-horizon': ['deadline', 'timeline', 'milestone', 'horizon', 'upcoming dates', 'commencement'],
};

const slugifyText = (text = '') => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

const uniqueStrings = (values = []) => Array.from(new Set(values.map(v => String(v || '').trim()).filter(Boolean)));

const normaliseCategory = (value) => {
  if (!value) return 'AI Regulation';
  const cleaned = String(value).trim();
  if (/^ai$/i.test(cleaned)) return 'AI Regulation';
  const exact = CATEGORY_OPTIONS.find(option => option.toLowerCase() === cleaned.toLowerCase());
  return exact || 'AI Regulation';
};

const detectCategoryFromText = (text = '') => {
  const lowerText = text.toLowerCase();
  const best = Object.entries(CATEGORY_KEYWORDS)
    .map(([category, keywords]) => [category, keywords.reduce((score, keyword) => score + (lowerText.includes(keyword) ? 1 : 0), 0)])
    .sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : 'AI Regulation';
};

const detectTagsFromText = (text = '') => {
  const lowerText = text.toLowerCase();
  const allTags = Object.values(PIMLICO_TAXONOMY).flat();
  const detected = allTags.filter(tag => lowerText.includes(tag.toLowerCase()));
  const hashTags = text.match(/#([\w-]{3,})/g) || [];

  hashTags.forEach((hashTag) => {
    const cleaned = hashTag.replace('#', '').toLowerCase();
    const match = allTags.find(tag => tag.toLowerCase().replace(/[\s-]+/g, '') === cleaned.replace(/[\s-]+/g, ''));
    if (match) detected.push(match);
  });

  return uniqueStrings(detected).slice(0, 12);
};

const extractTitleAndExcerpt = (text = '', fallbackName = 'untitled-draft') => {
  const lines = text.split('\n');
  let title = '';
  let titleLineIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^#{1,2}\s+/.test(trimmed)) {
      title = trimmed.replace(/^#{1,2}\s+/, '').trim();
      titleLineIdx = i;
      break;
    }
  }

  if (!title) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        title = lines[i].trim().replace(/^#+\s*/, '');
        titleLineIdx = i;
        break;
      }
    }
  }

  let excerpt = '';
  let excerptEndIdx = titleLineIdx;
  for (let i = titleLineIdx + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || /^[-*_]{3,}$/.test(trimmed)) continue;
    if (/^#{1,3}\s+/.test(trimmed)) break;

    let paragraph = '';
    for (let j = i; j < lines.length; j++) {
      const current = lines[j].trim();
      if (!current || /^#{1,3}\s+/.test(current)) {
        excerptEndIdx = j;
        break;
      }
      paragraph += `${paragraph ? ' ' : ''}${current.replace(/^[-*+]\s+/, '')}`;
      excerptEndIdx = j + 1;
    }
    excerpt = paragraph.slice(0, 280);
    break;
  }

  return {
    title: title || fallbackName.replace(/\.(md|markdown|txt|pdf)$/i, ''),
    excerpt,
    titleLineIdx,
    excerptEndIdx,
  };
};

const buildSeriesDraft = ({ seriesKey, title, excerpt, officialSources = [] }) => {
  const series = DRAFT_SERIES.find(item => item.key === seriesKey) || DRAFT_SERIES[0];
  const sourceLines = officialSources.length > 0
    ? officialSources.map(source => `- ${source}`).join('\n')
    : '- [Add official source]';

  const sections = series.headings
    .filter(heading => heading !== 'Intro')
    .map((heading) => {
      if (heading === 'Sources') {
        return `## ${heading}\n\n${sourceLines}`;
      }
      return `## ${heading}\n\n[Add ${heading.toLowerCase()}]`;
    })
    .join('\n\n');

  return `# ${title || series.label}\n\n${excerpt || '[Lead with the development, why it matters, and who should care.]'}\n\n${sections}\n\n---\n\n*This analysis is provided by Pimlico XHS™ for informational purposes. It does not constitute legal advice.*`;
};

const suggestSeriesKey = (text = '') => {
  const lowerText = text.toLowerCase();
  const best = Object.entries(SERIES_KEYWORDS)
    .map(([seriesKey, keywords]) => [seriesKey, keywords.reduce((score, keyword) => score + (lowerText.includes(keyword) ? 1 : 0), 0)])
    .sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : DEFAULT_SERIES_KEY;
};

const parseBooleanValue = (value = '') => /^(true|yes|1)$/i.test(String(value).trim());

const parseListValue = (value = '') => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return uniqueStrings(trimmed.slice(1, -1).split(',').map(item => item.replace(/^['"]|['"]$/g, '').trim()));
  }
  return uniqueStrings(trimmed.split(',').map(item => item.trim()));
};

const parseFrontmatter = (text = '') => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;

  lines.forEach((line) => {
    const keyMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const rawValue = keyMatch[2].trim();
      if (!rawValue) {
        frontmatter[currentKey] = [];
      } else {
        frontmatter[currentKey] = rawValue.replace(/^['"]|['"]$/g, '');
      }
      return;
    }

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(frontmatter[currentKey])) frontmatter[currentKey] = [];
      frontmatter[currentKey].push(listMatch[1].trim().replace(/^['"]|['"]$/g, ''));
    }
  });

  return {
    frontmatter,
    body: text.slice(match[0].length),
  };
};

export default function DraftingPage() {
  const { articles, setArticles } = useArticles();
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
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [showDrafts, setShowDrafts] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(DEFAULT_SERIES_KEY);
  const [officialSources, setOfficialSources] = useState([]);
  const [sourceInput, setSourceInput] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [sourceFileName, setSourceFileName] = useState('');
  const [engagements, setEngagements] = useState(DEFAULT_ENGAGEMENTS);
  const [showEngagements, setShowEngagements] = useState(false);
  const autoSaveTimerRef = useRef(null);

  const AUTOSAVE_KEY = 'xhs-drafting-autosave';

  const activeSeries = DRAFT_SERIES.find(series => series.key === selectedSeries) || DRAFT_SERIES[0];

  const LLM_PROMPT = `You are helping me draft a ${activeSeries.label} for Pimlico XHS, a cross-border regulatory intelligence platform.

SERIES:
- ${activeSeries.label}
- ${activeSeries.description}
- Short command: ${activeSeries.shortCommand}

Generate a complete draft package in Markdown format that I can import directly.

INCLUDE:
- Title
- Excerpt
- Category (${CATEGORY_OPTIONS.join(' | ')})
- Tags
- Official sources
- Body using this structure:

# [Title]

[Opening paragraph / excerpt]

${activeSeries.headings.filter(heading => heading !== 'Intro').map(heading => `## ${heading}`).join('\n')}

Keep it clean and publication-ready. Use specific dates, named authorities, and practical implications.`;

  // Saved article drafts (articles with status='draft')
  const savedDrafts = articles.filter(a => a.status === 'draft');

  // ─── Auto-save: persist form state to localStorage every 30s ─────
  const getFormSnapshot = () => ({
    meta, content, htmlContent, editorMode, tags, publicationDate,
    isPremium, premiumCutoff, scheduleEnabled, scheduledDate, ogImageUrl, selectedSeries,
    officialSources, sourceInput, sourceText, sourceFileName, engagements,
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
    if (snap.selectedSeries) setSelectedSeries(snap.selectedSeries);
    if (snap.officialSources) setOfficialSources(snap.officialSources);
    if (snap.sourceInput) setSourceInput(snap.sourceInput);
    if (snap.sourceText) setSourceText(snap.sourceText);
    if (snap.sourceFileName) setSourceFileName(snap.sourceFileName);
    if (snap.engagements) setEngagements({ ...DEFAULT_ENGAGEMENTS, ...snap.engagements });
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
          isPremium, premiumCutoff, scheduleEnabled, scheduledDate, ogImageUrl, selectedSeries,
          officialSources, sourceInput, sourceText, sourceFileName, engagements,
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
    setSelectedSeries(article.series || DEFAULT_SERIES_KEY);
    setOfficialSources(article.officialSources || []);
    setEngagements({
      newsletterLine: article.newsletterLine || '',
      linkedinTeaser: article.linkedinTeaser || '',
      coverImagePrompt: article.coverImagePrompt || '',
      internalNotes: article.internalNotes || '',
    });
    setSourceInput('');
    setSourceText('');
    setSourceFileName(article.sourceFileName || '');
    setShowDrafts(false);
    setSuccessMsg(`Loaded draft: "${article.title}"`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const shouldAutoSlug = !meta.slug || meta.slug === slugifyText(meta.title);
    setMeta(prev => ({ ...prev, title, ...(shouldAutoSlug ? { slug: slugifyText(title) } : {}) }));
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

  const applyDraftPayload = (payload, { replaceMetadata = true, replaceContent = true, toast } = {}) => {
    const nextSeriesKey = payload.series || selectedSeries || DEFAULT_SERIES_KEY;
    const nextSeries = DRAFT_SERIES.find(series => series.key === nextSeriesKey) || DRAFT_SERIES[0];
    const nextSources = uniqueStrings(replaceMetadata ? (payload.officialSources || []) : [...officialSources, ...(payload.officialSources || [])]);

    setSelectedSeries(nextSeriesKey);
    setMeta(prev => ({
      ...prev,
      title: replaceMetadata ? (payload.title || prev.title) : (prev.title || payload.title || ''),
      slug: replaceMetadata
        ? (payload.slug || (payload.title ? slugifyText(payload.title) : prev.slug))
        : (prev.slug || payload.slug || (payload.title ? slugifyText(payload.title) : '')),
      excerpt: replaceMetadata ? (payload.excerpt || prev.excerpt) : (prev.excerpt || payload.excerpt || ''),
      category: replaceMetadata ? normaliseCategory(payload.category || prev.category) : (prev.category || normaliseCategory(payload.category)),
      readTime: replaceMetadata ? (payload.readTime || prev.readTime || nextSeries.defaultReadTime) : (prev.readTime || payload.readTime || nextSeries.defaultReadTime),
    }));
    setTags(replaceMetadata ? (payload.tags || []) : uniqueStrings([...tags, ...(payload.tags || [])]));
    setPublicationDate(payload.publicationDate || publicationDate);
    setOfficialSources(nextSources);
    setIsPremium(replaceMetadata ? (payload.premium ?? nextSeries.defaultPremium) : isPremium);
    setSourceText(payload.sourceText || sourceText);
    setSourceFileName(payload.sourceFileName || sourceFileName);
    setEngagements(prev => ({
      ...prev,
      ...(replaceMetadata ? payload.engagements : Object.fromEntries(Object.entries(payload.engagements || {}).filter(([, value]) => value))),
    }));

    if (replaceContent) {
      const draftBody = payload.content || buildSeriesDraft({
        seriesKey: nextSeriesKey,
        title: payload.title || meta.title,
        excerpt: payload.excerpt || meta.excerpt,
        officialSources: nextSources,
      });
      setContent(draftBody);
      setEditorMode('markdown');
      setShowPreview(false);
      setHtmlContent('');
    }

    if (toast) {
      setSuccessMsg(toast);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const buildPayloadFromText = (text, fallbackName, overrides = {}) => {
    const { title, excerpt, excerptEndIdx } = extractTitleAndExcerpt(text, fallbackName);
    const contentBody = text.split('\n').slice(Math.max(excerptEndIdx, 1)).join('\n').trim();
    const seriesKey = overrides.series || selectedSeries || suggestSeriesKey(text);

    return {
      title,
      slug: slugifyText(title),
      excerpt,
      category: overrides.category || detectCategoryFromText(text),
      series: seriesKey,
      publicationDate,
      readTime: overrides.readTime || (DRAFT_SERIES.find(series => series.key === seriesKey)?.defaultReadTime || activeSeries.defaultReadTime),
      premium: overrides.premium,
      tags: overrides.tags || detectTagsFromText(text),
      officialSources: uniqueStrings([...(overrides.officialSources || []), ...(officialSources || [])]),
      engagements: overrides.engagements || {},
      content: contentBody || buildSeriesDraft({ seriesKey, title, excerpt, officialSources: overrides.officialSources || officialSources }),
      sourceText: text,
      sourceFileName: fallbackName,
    };
  };

  const handleSeriesSelect = (seriesKey) => {
    if (seriesKey === selectedSeries) return;

    const nextSeries = DRAFT_SERIES.find(series => series.key === seriesKey) || DRAFT_SERIES[0];
    const shouldReplaceBody = !content.trim() || window.confirm(`Switch to ${nextSeries.label}? This updates the draft body structure but keeps your metadata.`);
    const currentSeries = activeSeries;

    setSelectedSeries(seriesKey);
    setMeta(prev => ({
      ...prev,
      readTime: !prev.readTime || prev.readTime === currentSeries.defaultReadTime ? nextSeries.defaultReadTime : prev.readTime,
    }));
    if (isPremium === currentSeries.defaultPremium) setIsPremium(nextSeries.defaultPremium);

    if (shouldReplaceBody) {
      setContent(buildSeriesDraft({
        seriesKey,
        title: meta.title,
        excerpt: meta.excerpt,
        officialSources,
      }));
      setEditorMode('markdown');
      setShowPreview(false);
      setHtmlContent('');
    }
  };

  const handleSuggestSeries = () => {
    const basis = [sourceInput, sourceText, meta.title, meta.excerpt, content].filter(Boolean).join('\n');
    if (!basis.trim()) {
      alert('Add a source link, upload a source, or start the draft first.');
      return;
    }
    const suggestion = suggestSeriesKey(basis);
    handleSeriesSelect(suggestion);
    setSuccessMsg(`Suggested series: ${DRAFT_SERIES.find(series => series.key === suggestion)?.label}`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePasteLink = () => {
    if (!sourceInput.trim()) return;
    const nextSources = uniqueStrings([...officialSources, sourceInput]);
    setOfficialSources(nextSources);
    setSourceInput('');
    setSuccessMsg('Official source added');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleOfficialSourcesChange = (value) => {
    setOfficialSources(uniqueStrings(value.split(/\r?\n/)));
  };

  const loadPdfText = async (file) => {
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let extractedText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      extractedText += `${textContent.items.map(item => item.str).join(' ')}\n`;
    }
    return extractedText.trim();
  };

  const handleSourceFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
        ? await loadPdfText(file)
        : await file.text();

      const payload = buildPayloadFromText(text, file.name, {
        series: selectedSeries,
        officialSources,
      });

      setSourceFileName(file.name);
      setSourceText(text);
      applyDraftPayload(payload, {
        replaceMetadata: false,
        replaceContent: !content.trim(),
        toast: `Source loaded: ${file.name}`,
      });
    } catch (error) {
      console.error('Failed to process source file', error);
      alert(`Could not read ${file.name}. Try a text, markdown, or PDF file.`);
    }

    e.target.value = '';
  };

  // Smart MD upload: auto-fills title, excerpt, category, tags, and content
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseFrontmatter(text);

      if (parsed?.frontmatter) {
        const fm = parsed.frontmatter;
        const seriesKey = fm.series || selectedSeries || DEFAULT_SERIES_KEY;
        applyDraftPayload({
          title: fm.title || '',
          slug: fm.slug || (fm.title ? slugifyText(fm.title) : ''),
          excerpt: fm.excerpt || '',
          category: normaliseCategory(fm.category),
          series: seriesKey,
          publicationDate: fm.publicationDate || fm.date || publicationDate,
          readTime: fm.readTime || (DRAFT_SERIES.find(series => series.key === seriesKey)?.defaultReadTime || activeSeries.defaultReadTime),
          premium: Array.isArray(fm.premium) ? false : parseBooleanValue(fm.premium),
          tags: Array.isArray(fm.tags) ? uniqueStrings(fm.tags) : parseListValue(fm.tags),
          officialSources: Array.isArray(fm.officialSources) ? uniqueStrings(fm.officialSources) : parseListValue(fm.officialSources),
          engagements: {
            newsletterLine: fm.newsletterLine || '',
            linkedinTeaser: fm.linkedinTeaser || '',
            coverImagePrompt: fm.coverImagePrompt || '',
            internalNotes: fm.internalNotes || '',
          },
          content: parsed.body.trim(),
          sourceText: text,
          sourceFileName: file.name,
        }, {
          replaceMetadata: true,
          replaceContent: true,
          toast: `Imported ${file.name}`,
        });
      } else {
        const payload = buildPayloadFromText(text, file.name, { series: selectedSeries, officialSources });
        applyDraftPayload(payload, {
          replaceMetadata: true,
          replaceContent: true,
          toast: `Imported ${file.name}`,
        });
      }
    } catch (error) {
      console.error('Failed to import markdown file', error);
      alert(`Could not import ${file.name}.`);
    }

    e.target.value = '';
  };

  const resetForm = () => {
    setMeta({ title: '', slug: '', excerpt: '', category: 'AI Regulation', author: 'Pimlico XHS™ Team', readTime: '5 min read', featured: false, image: '' });
    setContent(''); setHtmlContent(''); setTags([]); setTagInput('');
    setPublicationDate(new Date().toISOString().split('T')[0]);
    setIsPremium(false); setPremiumCutoff(10); setScheduleEnabled(false); setScheduledDate('');
    setOgImageUrl(''); setEditingArticle(null); setLastSavedAt(null);
    setSelectedSeries(DEFAULT_SERIES_KEY); setOfficialSources([]); setSourceInput(''); setSourceText(''); setSourceFileName('');
    setEngagements(DEFAULT_ENGAGEMENTS); setShowEngagements(false);
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
      series: selectedSeries, officialSources,
      content: articleContent, isPremium, premiumCutoff: isPremium ? premiumCutoff : null,
      newsletterLine: engagements.newsletterLine,
      linkedinTeaser: engagements.linkedinTeaser,
      coverImagePrompt: engagements.coverImagePrompt,
      internalNotes: engagements.internalNotes,
      sourceFileName,
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
      series: selectedSeries, officialSources,
      content: editorMode === 'visual' ? htmlContent : content,
      isPremium, premiumCutoff: isPremium ? premiumCutoff : null,
      newsletterLine: engagements.newsletterLine,
      linkedinTeaser: engagements.linkedinTeaser,
      coverImagePrompt: engagements.coverImagePrompt,
      internalNotes: engagements.internalNotes,
      sourceFileName,
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
          <h1 className="text-xl font-bold text-white flex items-center gap-2">✏️ Drafts</h1>
          <p className="text-sm text-gray-400 mt-0.5">{editingArticle ? `Editing: ${editingArticle.title}` : 'Draft-first workflow: source in, one draft package out'}</p>
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

      <div className="flex flex-wrap gap-2">
        {DRAFT_FLOW_STEPS.map(step => (
          <span key={step} className="px-2.5 py-1 bg-gray-800/80 border border-gray-700/60 rounded-full text-[10px] uppercase tracking-[0.14em] text-gray-400">
            {step.replace(/-/g, ' ')}
          </span>
        ))}
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

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-white">Source intake</h2>
            <p className="text-xs text-gray-500 mt-0.5">Paste an official link, upload source material, import a draft payload, or let the editor suggest the best series.</p>
          </div>
          {sourceFileName && <span className="px-2.5 py-1 bg-gray-700/70 rounded-full text-[10px] text-gray-300">Loaded source: {sourceFileName}</span>}
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <input
            type="url"
            value={sourceInput}
            onChange={e => setSourceInput(e.target.value)}
            placeholder="Paste official source link..."
            className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={handlePasteLink} className="px-3.5 py-2.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors">Paste link</button>
            <label className="px-3.5 py-2.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
              Upload file
              <input type="file" accept=".pdf,.txt,.md,.markdown" onChange={handleSourceFileUpload} className="hidden" />
            </label>
            <label className="px-3.5 py-2.5 bg-emerald-600/90 text-white text-sm rounded-lg hover:bg-emerald-500 transition-colors cursor-pointer">
              Import .md
              <input type="file" accept=".md,.markdown,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <button onClick={handleSuggestSeries} className="px-3.5 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors">Suggest series</button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-white">Series</h2>
            <p className="text-xs text-gray-500 mt-0.5">Choose the editorial frame before drafting. This updates the body structure, not your metadata.</p>
          </div>
          <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-[11px] font-medium">{activeSeries.shortCommand}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {DRAFT_SERIES.map(series => (
            <button
              key={series.key}
              type="button"
              onClick={() => handleSeriesSelect(series.key)}
              className={`text-left rounded-xl border px-4 py-3 transition-colors ${selectedSeries === series.key ? 'border-indigo-500/40 bg-indigo-500/10' : 'border-gray-700/60 bg-gray-900/40 hover:bg-gray-900/70'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-semibold ${selectedSeries === series.key ? 'text-white' : 'text-gray-200'}`}>{series.label}</span>
                <span className="text-[10px] text-gray-500">{series.defaultReadTime}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{series.description}</p>
              <p className="text-[10px] text-indigo-300/80 mt-2 uppercase tracking-[0.14em]">{series.shortCommand}</p>
            </button>
          ))}
        </div>
      </div>

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

      <div className="space-y-5">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold text-white">Draft package</h3>
              <p className="text-xs text-gray-500 mt-0.5">Current frame: {activeSeries.label}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] text-gray-400">
              <span className="px-2 py-1 bg-gray-900/70 rounded-full border border-gray-700/60">Series: {activeSeries.label}</span>
              <span className="px-2 py-1 bg-gray-900/70 rounded-full border border-gray-700/60">Default read: {activeSeries.defaultReadTime}</span>
              <span className="px-2 py-1 bg-gray-900/70 rounded-full border border-gray-700/60">Premium default: {activeSeries.defaultPremium ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

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

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Official Sources</label>
          <textarea
            value={officialSources.join('\n')}
            onChange={e => handleOfficialSourcesChange(e.target.value)}
            rows={3}
            placeholder="One source URL or citation per line..."
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>

        {/* Category / Read Time / Date */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
            <select value={meta.category} onChange={e => setMeta(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
              {CATEGORY_OPTIONS.map(option => <option key={option}>{option}</option>)}
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
              <span className="px-3 py-1.5 bg-gray-800 border border-gray-700 text-[11px] text-gray-400 rounded-lg">{activeSeries.label}</span>
            </div>
          </div>

          {showPreview ? (
            /* Article Preview */
            <div className="bg-white rounded-lg border border-gray-300 p-8 min-h-[400px] overflow-y-auto max-h-[700px]">
              {/* Preview Header */}
              <div className="border-b border-gray-200 pb-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {meta.category && <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[11px] font-semibold rounded-full">{meta.category}</span>}
                  {selectedSeries && <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-full">{activeSeries.label}</span>}
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

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowEngagements(prev => !prev)}
            className="w-full px-4 py-3 flex items-center justify-between text-left"
          >
            <div>
              <span className="text-sm font-semibold text-white">📣 Engagements drawer</span>
              <p className="text-[11px] text-gray-500 mt-0.5">Newsletter line, LinkedIn teaser, cover image prompt, and internal notes.</p>
            </div>
            <span className="text-gray-400 text-sm">{showEngagements ? '−' : '+'}</span>
          </button>

          {showEngagements && (
            <div className="border-t border-gray-700 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Newsletter Line</label>
                <input
                  type="text"
                  value={engagements.newsletterLine}
                  onChange={e => setEngagements(prev => ({ ...prev, newsletterLine: e.target.value }))}
                  placeholder="One-line newsletter sell..."
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">LinkedIn Teaser</label>
                <input
                  type="text"
                  value={engagements.linkedinTeaser}
                  onChange={e => setEngagements(prev => ({ ...prev, linkedinTeaser: e.target.value }))}
                  placeholder="Short teaser for the post opener..."
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Cover Image Prompt</label>
                <textarea
                  value={engagements.coverImagePrompt}
                  onChange={e => setEngagements(prev => ({ ...prev, coverImagePrompt: e.target.value }))}
                  rows={3}
                  placeholder="Prompt for visual generation or design handoff..."
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Internal Notes</label>
                <textarea
                  value={engagements.internalNotes}
                  onChange={e => setEngagements(prev => ({ ...prev, internalNotes: e.target.value }))}
                  rows={3}
                  placeholder="Editorial notes, follow-ups, packaging reminders..."
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>
            </div>
          )}
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
