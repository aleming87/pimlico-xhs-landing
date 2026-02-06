"use client";

// Admin Console for XHS Articles Management
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { sampleArticles as baseSampleArticles } from '@/data/sample-articles';

// Simple password protection - change this password
const ADMIN_PASSWORD = "pimlico2026";

// Marketing asset element defaults
const DEFAULT_ELEMENTS = {
  pimlicoLogo: { x: 0.06, y: 0.88, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  xhsLogo: { x: 0.22, y: 0.88, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  image: { x: 0.62, y: 0, scale: 100, opacity: 100, zoom: 100, visible: true, dx: 0, dy: 0 },
  title: { x: 0.06, y: 0.33, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  subtitle: { x: 0.06, y: null, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  badge: { x: 0.06, y: 0.25, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  cta: { x: 0.94, y: 0.88, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  bottomBar: { height: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  accentLine: { opacity: 100, width: 100, visible: true, dx: 0, dy: 0 },
  premiumTag: { scale: 100, opacity: 100, visible: false, dx: 0, dy: 0 },
};

// Blank canvas — everything hidden except background
const BLANK_ELEMENTS = Object.fromEntries(
  Object.entries(DEFAULT_ELEMENTS).map(([k, v]) => [k, { ...v, visible: false, dx: 0, dy: 0 }])
);

// Minimal — just image, title, and bottom bar
const MINIMAL_ELEMENTS = Object.fromEntries(
  Object.entries(DEFAULT_ELEMENTS).map(([k, v]) => [
    k,
    { ...v, visible: ['image', 'title', 'bottomBar', 'pimlicoLogo', 'xhsLogo'].includes(k), dx: 0, dy: 0 }
  ])
);

// Pimlico Taxonomy Tags Structure (from pimlico_tags_structure_v2_2.7.2)
const PIMLICO_TAXONOMY = {
  vertical: ['Gambling', 'Payments', 'Crypto', 'AI'],
  category: [
    'Legal Framework', 'Licensing Market Access', 'Crossborder Provisions', 'Competition',
    'Product Design', 'Marketing Advertising', 'Consumer Protection', 'Player Protection',
    'Conduct Transparency', 'Governance Risk', 'Operational Resilience ICT', 'Data Privacy',
    'Data Sharing Open Access', 'KYC Identity', 'AML CFT', 'Fraud Cybercrime',
    'Reporting Disclosure', 'Taxation', 'Fees Charges', 'Crypto Digital Assets',
    'AI Governance', 'Technical Standards', 'Innovation Sandboxes Pilots',
    'Supervisory Priorities Plans', 'Enforcement Sanctions', 'Registers Blocklists'
  ],
  topic: [
    'Online Licensing', 'Land Licensing', 'B2B Licensing', 'Licence Windows', 'Licence Changes',
    'Lotteries', 'Bingo', 'Horse Racing', 'Pool Betting', 'Gaming Machines',
    'Age Verification', 'Affordability', 'Limits Controls', 'Self Exclusion', 'VIP Customers',
    'Slot Design', 'Betting Features', 'Loot Boxes', 'Prediction Markets',
    'Ad Content', 'Ad Placement', 'Sports Sponsorship', 'Affiliates', 'Bonuses Promotions',
    'Financial Promotions', 'Gambling Tax', 'Gambling Levies', 'Payments Tax', 'Crypto Tax',
    'PI Authorisation', 'EMI Authorisation', 'Small Firm Regime', 'Agents Distributors',
    'Instant Payments', 'Card Payments', 'Account To Account', 'Remittances',
    'Buy Now Pay Later (BNPL)', 'Open Banking', 'Open Finance',
    'Strong Customer Authentication (SCA)', 'Safeguarding of Funds', 'Fees Charges',
    'Refunds Disputes', 'Execution Times', 'VASP Licensing', 'Token Offers', 'Stablecoins',
    'Crypto Custody', 'DeFi', 'NFTs', 'Crypto Travel Rule', 'Onboarding CDD', 'AML Programmes',
    'Tx Monitoring', 'Suspicious Reports', 'Sanctions Controls', 'Fraud Scams', 'Geo Blocking',
    'AI Frameworks', 'AI Risk Tiers', 'AI Use Restrictions', 'AI Governance Controls',
    'AI Data Training', 'AI Transparency', 'GenAI Labelling', 'AI Credit Scoring', 'AI AML Fraud',
    'Technical Standards Testing', 'Game Approval Change Control', 'Sports Integrity',
    'Match Fixing Integrity Reporting', 'Complaints ADR Disputes', 'Payment Blocking',
    'Payment Method Restrictions', 'Ownership Control Suitability', 'Key Personnel Approvals',
    'Esports Betting', 'Fantasy Skill Sweepstakes', 'Poker Liquidity', 'Charity Gaming Raffles',
    'Safer Gambling Interactions', 'Promo Terms Fairness', 'Duty Of Care Liability',
    'Source Of Funds Wealth', 'Pep High Risk Controls', 'Cash Intensive Controls',
    'Enforcement Actions', 'Supervisory Priorities Reviews', 'Merchant Acquiring',
    'Payfac Submerchant Controls', 'Merchant KYB Monitoring', 'App Scam Reimbursement',
    'Consumer Disclosures Transparency', 'FX DCC Transparency', 'Prudential Capital Liquidity',
    'Digital Identity', 'KYC Reliance Portability', 'Crypto Market Abuse', 'Crypto Trading Venues',
    'Token Listing Delisting', 'Crypto Derivatives Leverage', 'Staking Services',
    'Crypto Lending Borrowing', 'MiCA Implementation', 'PSD2 Implementation', 'DORA Implementation'
  ],
  jurisdiction: [
    'European Union', 'United Kingdom', 'United States', 'Germany', 'France', 'Italy', 'Spain',
    'Netherlands', 'Sweden', 'Denmark', 'Greece', 'Romania', 'Croatia', 'Malta', 'Portugal',
    'Belgium', 'Austria', 'Switzerland', 'Ireland', 'Poland', 'Czech Republic', 'Hungary',
    'Finland', 'Norway', 'Luxembourg', 'Cyprus', 'Estonia', 'Latvia', 'Lithuania',
    'Canada', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile', 'Australia', 'New Zealand',
    'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'India', 'Philippines', 'Malaysia',
    'United Arab Emirates', 'Saudi Arabia', 'Israel', 'South Africa', 'Nigeria', 'Kenya',
    'Gibraltar', 'Isle of Man', 'Alderney', 'Curacao', 'Kahnawake'
  ],
  type: [
    'Primary Law', 'Secondary Law', 'Transposing Legislation', 'Rulebook', 'Guideline',
    'Q And A', 'Technical Standard', 'Code Of Conduct', 'Strategy Plan', 'Risk Report',
    'Consultation', 'Discussion Paper', 'Enforcement Decision', 'Judicial Decision',
    'Register Update', 'Licence Decision', 'Supervisory Letter', 'Press Release'
  ],
  stage: [
    'Pre Proposal', 'Proposal', 'Consultation Open', 'Consultation Closed', 'Drafting',
    'Political Agreement', 'Adoption', 'Publication', 'Entry Into Force', 'Application',
    'Implementation Measures', 'Transitional Period', 'Review', 'Amendment', 'Repeal Sunset'
  ],
  status: ['Indicative', 'Informative', 'Actionable']
};

// Comprehensive markdown to HTML converter
const markdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Handle code blocks first (to prevent processing markdown inside them)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Handle headers (must be at start of line)
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Handle horizontal rules
  html = html.replace(/^---$/gim, '<hr>');
  html = html.replace(/^\*\*\*$/gim, '<hr>');
  
  // Handle blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Handle bold and italic (order matters)
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  
  // Handle strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  // Handle links [text](url) - must handle various URL formats
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Handle images ![alt](url)
  html = html.replace(/!\[([^\]]*?)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;height:auto;">');
  
  // Handle unordered lists (- item or * item)
  html = html.replace(/(?:^[\t ]*[-*] (.+)$\n?)+/gim, (match) => {
    const items = match.trim().split('\n').map(line => {
      const itemContent = line.replace(/^[\t ]*[-*] /, '');
      return `<li>${itemContent}</li>`;
    }).join('');
    return `<ul>${items}</ul>`;
  });
  
  // Handle ordered lists (1. item)
  html = html.replace(/(?:^[\t ]*\d+\. (.+)$\n?)+/gim, (match) => {
    const items = match.trim().split('\n').map(line => {
      const itemContent = line.replace(/^[\t ]*\d+\. /, '');
      return `<li>${itemContent}</li>`;
    }).join('');
    return `<ol>${items}</ol>`;
  });
  
  // Handle paragraphs - double newlines become paragraph breaks
  html = html.replace(/\n\n+/g, '</p><p>');
  // Single newlines become line breaks
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }
  
  // Clean up empty paragraphs and fix nested issues
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ol>)/g, '$1');
  html = html.replace(/(<\/ol>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)/g, '$1');
  html = html.replace(/(<hr>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  
  return html;
};

// Add isSample flag to sample articles for admin display
const sampleArticles = baseSampleArticles.map(article => ({
  ...article,
  isSample: true,
}));

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [markdownContent, setMarkdownContent] = useState('');
  const [articleMeta, setArticleMeta] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'AI Regulation',
    author: 'Pimlico XHS™ Team',
    readTime: '5 min read',
    featured: false,
    image: '',
  });
  const [articleImage, setArticleImage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [publicationDate, setPublicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [premiumCutoff, setPremiumCutoff] = useState(10); // Percentage of content shown before paywall
  const [selectedTagCategory, setSelectedTagCategory] = useState('topic');
  const [isUploading, setIsUploading] = useState(false);
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' or 'markdown'
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagInputRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState(''); // Store visual editor content as HTML
  
  // Rich text editor ref
  const editorRef = useRef(null);
  
  // Marketing asset states
  const marketingCanvasRef = useRef(null);
  const [marketingArticle, setMarketingArticle] = useState(null);
  const [marketingTemplate, setMarketingTemplate] = useState('linkedin');
  const [marketingTheme, setMarketingTheme] = useState('dark');
  const [marketingTitle, setMarketingTitle] = useState('');
  const [marketingSubtitle, setMarketingSubtitle] = useState('');
  const [marketingCta, setMarketingCta] = useState('Read on pimlicosolutions.com');
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [marketingFontSize, setMarketingFontSize] = useState(100); // percentage scale
  const [marketingFontWeight, setMarketingFontWeight] = useState('800');
  const [marketingFont, setMarketingFont] = useState('system');
  const [marketingPostText, setMarketingPostText] = useState('');
  const [marketingLayout, setMarketingLayout] = useState('classic'); // 'classic', 'card', 'magazine'
  const [marketingDragTarget, setMarketingDragTarget] = useState(null);
  const [marketingElements, setMarketingElements] = useState(() => {
    // Try to load last-used element settings from localStorage
    try {
      const saved = localStorage.getItem('xhs-marketing-elements-last');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge: ensure every key from defaults exists with all its properties
        const merged = {};
        for (const k of Object.keys(DEFAULT_ELEMENTS)) {
          merged[k] = { ...DEFAULT_ELEMENTS[k], ...(parsed[k] || {}) };
        }
        return merged;
      }
    } catch {}
    return { ...DEFAULT_ELEMENTS };
  });
  const elementBoundsRef = useRef({});
  const dragStartRef = useRef(null);
  // Compat wrapper for drag system
  const marketingPositions = {
    title: marketingElements.title,
    subtitle: marketingElements.subtitle,
    logo: marketingElements.pimlicoLogo,
    cta: marketingElements.cta,
    badge: marketingElements.badge,
  };
  const [mktgPanelOpen, setMktgPanelOpen] = useState({ article: true, template: false, text: false, font: false, elements: true, presets: false });
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');

  // Marketing presets
  const [marketingPresets, setMarketingPresets] = useState({});
  const [presetName, setPresetName] = useState('');

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('xhs-marketing-presets');
      if (saved) setMarketingPresets(JSON.parse(saved));
    } catch {}
  }, []);

  const saveMarketingPreset = (name) => {
    if (!name.trim()) return;
    const preset = {
      elements: marketingElements,
      template: marketingTemplate,
      theme: marketingTheme,
      layout: marketingLayout,
      font: marketingFont,
      fontSize: marketingFontSize,
      fontWeight: marketingFontWeight,
      title: marketingTitle,
      subtitle: marketingSubtitle,
      cta: marketingCta,
      savedAt: new Date().toISOString(),
    };
    const updated = { ...marketingPresets, [name.trim()]: preset };
    setMarketingPresets(updated);
    localStorage.setItem('xhs-marketing-presets', JSON.stringify(updated));
    setPresetName('');
  };

  const loadMarketingPreset = (name) => {
    const preset = marketingPresets[name];
    if (!preset) return;
    // Merge saved elements with defaults so new keys (like premiumTag) don't break
    if (preset.elements) {
      const merged = { ...DEFAULT_ELEMENTS };
      for (const k of Object.keys(merged)) {
        if (preset.elements[k]) merged[k] = { ...merged[k], ...preset.elements[k] };
      }
      setMarketingElements(merged);
    }
    if (preset.template) setMarketingTemplate(preset.template);
    if (preset.theme) setMarketingTheme(preset.theme);
    if (preset.layout) setMarketingLayout(preset.layout);
    if (preset.font) setMarketingFont(preset.font);
    if (preset.fontSize) setMarketingFontSize(preset.fontSize);
    if (preset.fontWeight) setMarketingFontWeight(preset.fontWeight);
    if (preset.title !== undefined) setMarketingTitle(preset.title);
    if (preset.subtitle !== undefined) setMarketingSubtitle(preset.subtitle);
    if (preset.cta) setMarketingCta(preset.cta);
  };

  const deleteMarketingPreset = (name) => {
    const updated = { ...marketingPresets };
    delete updated[name];
    setMarketingPresets(updated);
    localStorage.setItem('xhs-marketing-presets', JSON.stringify(updated));
  };

  // Auto-save element settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('xhs-marketing-elements-last', JSON.stringify(marketingElements));
    } catch {}
  }, [marketingElements]);

  // Check if already authenticated via sessionStorage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('xhs-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle Escape key to close preview modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPreview) {
        setShowPreview(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showPreview]);

  // Auto-generate marketing asset when ANY settings change (debounced)
  const autoGenTimerRef = useRef(null);
  useEffect(() => {
    if (marketingArticle && activeTab === 'marketing' && marketingCanvasRef.current) {
      // Skip auto-regen during active drag (mouseUp triggers its own regen)
      if (marketingDragTarget) return;
      if (autoGenTimerRef.current) clearTimeout(autoGenTimerRef.current);
      autoGenTimerRef.current = setTimeout(() => {
        generateMarketingAsset();
      }, 300);
      return () => { if (autoGenTimerRef.current) clearTimeout(autoGenTimerRef.current); };
    }
  }, [marketingArticle, marketingTemplate, marketingTheme, marketingLayout, marketingElements,
      marketingTitle, marketingSubtitle, marketingCta, marketingFont, marketingFontSize, marketingFontWeight]);

  // Load saved articles from localStorage and merge with sample articles
  useEffect(() => {
    const savedArticles = localStorage.getItem('xhs-articles');
    const deletedSampleIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
    
    let customArticles = [];
    if (savedArticles) {
      customArticles = JSON.parse(savedArticles).map(a => ({ ...a, isSample: false }));
    }
    
    // Get sample articles that haven't been deleted or overridden
    const customSlugs = customArticles.map(a => a.slug);
    const visibleSamples = sampleArticles
      .filter(s => !deletedSampleIds.includes(s.id) && !customSlugs.includes(s.slug))
      .map(s => ({ ...s, isSample: true }));
    
    // Merge: custom articles first, then remaining samples
    setArticles([...customArticles, ...visibleSamples]);
  }, []);

  // Sync articles to Vercel Blob for server-side OG metadata
  const syncToVercelBlob = async () => {
    try {
      const customArticles = JSON.parse(localStorage.getItem('xhs-articles') || '[]');
      const deletedSampleIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
      
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: customArticles, deletedSampleIds }),
      });
      
      if (!response.ok) {
        console.error('Failed to sync to Vercel Blob:', await response.text());
      }
    } catch (error) {
      console.error('Error syncing to Vercel Blob:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('xhs-admin-auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('xhs-admin-auth');
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={120} height={32} className="h-8 w-auto mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white">Admin Console</h1>
              <p className="text-gray-400 mt-2">Enter password to continue</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
              >
                Login
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-400 hover:text-white text-sm">
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Visual editor formatting functions (uses execCommand for contenteditable)
  const execFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    // Focus back on editor
    document.getElementById('rich-editor')?.focus();
  };

  const formatBoldVisual = () => execFormat('bold');
  const formatItalicVisual = () => execFormat('italic');
  const formatUnderlineVisual = () => execFormat('underline');
  const formatStrikethroughVisual = () => execFormat('strikeThrough');
  const formatBulletListVisual = () => execFormat('insertUnorderedList');
  const formatNumberedListVisual = () => execFormat('insertOrderedList');
  const formatQuoteVisual = () => execFormat('formatBlock', 'blockquote');
  const formatH1Visual = () => execFormat('formatBlock', 'h1');
  const formatH2Visual = () => execFormat('formatBlock', 'h2');
  const formatH3Visual = () => execFormat('formatBlock', 'h3');
  const formatParagraphVisual = () => execFormat('formatBlock', 'p');
  const formatLinkVisual = () => {
    const url = prompt('Enter URL:');
    if (url) execFormat('createLink', url);
  };
  const formatUnlinkVisual = () => execFormat('unlink');
  const formatAlignLeftVisual = () => execFormat('justifyLeft');
  const formatAlignCenterVisual = () => execFormat('justifyCenter');
  const formatAlignRightVisual = () => execFormat('justifyRight');
  const formatIndentVisual = () => execFormat('indent');
  const formatOutdentVisual = () => execFormat('outdent');
  const formatClearVisual = () => execFormat('removeFormat');
  const formatHRVisual = () => execFormat('insertHorizontalRule');

  // Get content from visual editor as HTML
  const getEditorContent = () => {
    const editor = document.getElementById('rich-editor');
    return editor ? editor.innerHTML : '';
  };

  // Set content in visual editor
  const setEditorContent = (html) => {
    const editor = document.getElementById('rich-editor');
    if (editor) editor.innerHTML = html;
  };

  // Markdown formatting functions (for markdown mode)
  const insertFormatting = (before, after = '', placeholder = '') => {
    const textarea = document.getElementById('markdown-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || placeholder;
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setMarkdownContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertAtCursor = (textToInsert) => {
    const textarea = document.getElementById('markdown-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const text = textarea.value;
    
    const newText = text.substring(0, start) + textToInsert + text.substring(start);
    setMarkdownContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + textToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const formatBold = () => insertFormatting('**', '**', 'bold text');
  const formatItalic = () => insertFormatting('*', '*', 'italic text');
  const formatStrikethrough = () => insertFormatting('~~', '~~', 'strikethrough');
  const formatCode = () => insertFormatting('`', '`', 'code');
  const formatCodeBlock = () => insertFormatting('\n```\n', '\n```\n', 'code block');
  const formatH1 = () => insertFormatting('\n# ', '\n', 'Heading 1');
  const formatH2 = () => insertFormatting('\n## ', '\n', 'Heading 2');
  const formatH3 = () => insertFormatting('\n### ', '\n', 'Heading 3');
  const formatQuote = () => insertFormatting('\n> ', '\n', 'quote');
  const formatBulletList = () => insertAtCursor('\n- Item 1\n- Item 2\n- Item 3\n');
  const formatNumberedList = () => insertAtCursor('\n1. Item 1\n2. Item 2\n3. Item 3\n');
  const formatLink = () => {
    const url = prompt('Enter URL:');
    if (url) insertFormatting('[', `](${url})`, 'link text');
  };
  const formatImage = () => {
    const url = prompt('Enter image URL:');
    if (url) insertAtCursor(`\n![Image description](${url})\n`);
  };
  const formatTable = () => insertAtCursor('\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n');
  const formatHorizontalRule = () => insertAtCursor('\n---\n');

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setArticleMeta({
      ...articleMeta,
      title,
      slug: generateSlug(title),
    });
  };

  const handlePublish = async () => {
    // Get content based on editor mode
    const content = editorMode === 'visual' ? htmlContent : markdownContent;
    const contentType = editorMode === 'visual' ? 'html' : 'markdown';
    
    if (!articleMeta.title || !content) {
      alert('Please fill in the title and content');
      return;
    }

    if (scheduleEnabled && !scheduledDate) {
      alert('Please select a scheduled publish date');
      return;
    }

    try {
      const isEditingSample = editingArticle?.isSample === true;
      
      // Use the user-specified publication date, or scheduled date, or today
      let articleDate;
      if (scheduleEnabled && scheduledDate) {
        articleDate = scheduledDate.split('T')[0];
      } else {
        articleDate = publicationDate || new Date().toISOString().split('T')[0];
      }
      
      const newArticle = {
        id: isEditingSample ? Date.now() : (editingArticle ? editingArticle.id : Date.now()),
        title: articleMeta.title,
        slug: articleMeta.slug,
        excerpt: articleMeta.excerpt,
        category: articleMeta.category,
        author: 'Pimlico XHS™ Team',
        readTime: articleMeta.readTime,
        featured: articleMeta.featured,
        image: articleImage,
        ogImage: ogImageUrl || null, // External OG image URL for social sharing
        tags: tags,
        date: articleDate,
        scheduledAt: scheduleEnabled ? scheduledDate : null,
        status: scheduleEnabled ? 'scheduled' : 'published',
        content: content,
        contentType: contentType, // Track whether content is HTML or markdown
        isPremium: isPremium,
        premiumCutoff: isPremium ? premiumCutoff : null, // Percentage of content shown before paywall
      };

      // Get existing custom articles from localStorage
      const existingCustom = JSON.parse(localStorage.getItem('xhs-articles') || '[]');
      let newCustomArticles;
      let actionMessage;
      
      if (editingArticle) {
        if (isEditingSample) {
          // Editing sample - mark as deleted, add new custom version
          const deletedSampleIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
          if (!deletedSampleIds.includes(editingArticle.id)) {
            deletedSampleIds.push(editingArticle.id);
            localStorage.setItem('xhs-deleted-samples', JSON.stringify(deletedSampleIds));
          }
          newCustomArticles = [newArticle, ...existingCustom];
          actionMessage = `"${articleMeta.title}" has been updated successfully!`;
        } else {
          // Editing custom article - find and update it by ID
          const editId = String(editingArticle.id);
          let found = false;
          newCustomArticles = existingCustom.map(a => {
            if (String(a.id) === editId) {
              found = true;
              return newArticle;
            }
            return a;
          });
          if (!found) {
            // If not found by ID, add as new
            newCustomArticles = [newArticle, ...existingCustom];
          }
          actionMessage = `"${articleMeta.title}" has been updated successfully!`;
        }
      } else {
        // New article
        newCustomArticles = [newArticle, ...existingCustom];
        actionMessage = scheduleEnabled 
          ? `"${articleMeta.title}" has been scheduled for ${new Date(scheduledDate).toLocaleString()}!`
          : `"${articleMeta.title}" has been published successfully!`;
      }
      
      // Save to localStorage
      localStorage.setItem('xhs-articles', JSON.stringify(newCustomArticles));
      
      // Verify save worked
      const savedData = localStorage.getItem('xhs-articles');
      const savedArticles = JSON.parse(savedData);
      const savedArticle = savedArticles.find(a => String(a.id) === String(newArticle.id));
      
      if (!savedArticle) {
        alert('Error: Article was not saved to localStorage');
        return;
      }
      
      // Rebuild state with updated articles
      const deletedIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
      const customSlugs = newCustomArticles.map(a => a.slug);
      const visibleSamples = sampleArticles
        .filter(s => !deletedIds.includes(s.id) && !customSlugs.includes(s.slug))
        .map(s => ({ ...s, isSample: true }));
      
      const allArticles = [...newCustomArticles.map(a => ({ ...a, isSample: false })), ...visibleSamples];
      setArticles(allArticles);

      // Sync to Vercel Blob for server-side OG metadata
      await syncToVercelBlob();

      // Show success and redirect
      setSuccessMessage(actionMessage);
      setShowSuccess(true);
      setActiveTab('articles');
      
      // Reset form
      resetForm();
      setEditingArticle(null);
      
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        const clearStorage = confirm(
          'Storage quota exceeded! This usually happens when images are too large.\n\n' +
          'Options:\n' +
          '1. Click OK to remove the image and try saving without it\n' +
          '2. Click Cancel to abort and try with a smaller image\n\n' +
          'Tip: Use smaller images (under 500KB) or use image URLs instead of uploads.'
        );
        if (clearStorage) {
          setArticleImage('');
          alert('Image removed. Please click Update Article again to save without the image.');
        }
      } else {
        alert('Error saving article: ' + error.message);
      }
      console.error('Publish error:', error);
    }
  };

  // Save as Draft function
  const handleSaveDraft = async () => {
    if (!articleMeta.title) {
      alert('Please enter at least a title for your draft');
      return;
    }

    // Get content based on editor mode
    const content = editorMode === 'visual' ? htmlContent : markdownContent;
    const contentType = editorMode === 'visual' ? 'html' : 'markdown';

    try {
      const isEditingSample = editingArticle?.isSample === true;
      
      const draftArticle = {
        id: isEditingSample ? Date.now() : (editingArticle ? editingArticle.id : Date.now()),
        title: articleMeta.title,
        slug: articleMeta.slug || generateSlug(articleMeta.title),
        excerpt: articleMeta.excerpt,
        category: articleMeta.category,
        author: 'Pimlico XHS™ Team',
        readTime: articleMeta.readTime,
        featured: articleMeta.featured,
        image: articleImage,
        tags: tags,
        date: new Date().toISOString().split('T')[0],
        scheduledAt: scheduleEnabled ? scheduledDate : null,
        status: 'draft',
        content: content,
        contentType: contentType, // Track whether content is HTML or markdown
        lastSaved: new Date().toISOString(),
      };

      // Get existing custom articles from localStorage
      const existingCustom = JSON.parse(localStorage.getItem('xhs-articles') || '[]');
      let newCustomArticles;
      
      if (editingArticle && !isEditingSample) {
        // Update existing draft/article
        const editId = String(editingArticle.id);
        let found = false;
        newCustomArticles = existingCustom.map(a => {
          if (String(a.id) === editId) {
            found = true;
            return draftArticle;
          }
          return a;
        });
        if (!found) {
          newCustomArticles = [draftArticle, ...existingCustom];
        }
      } else {
        // New draft
        newCustomArticles = [draftArticle, ...existingCustom];
      }
      
      // Save to localStorage
      localStorage.setItem('xhs-articles', JSON.stringify(newCustomArticles));
      
      // Update editing state to track this draft
      setEditingArticle({ ...draftArticle, isSample: false });
      
      // Rebuild state with updated articles
      const deletedIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
      const customSlugs = newCustomArticles.map(a => a.slug);
      const visibleSamples = sampleArticles
        .filter(s => !deletedIds.includes(s.id) && !customSlugs.includes(s.slug))
        .map(s => ({ ...s, isSample: true }));
      
      const allArticles = [...newCustomArticles.map(a => ({ ...a, isSample: false })), ...visibleSamples];
      setArticles(allArticles);

      // Sync to Vercel Blob for server-side OG metadata
      await syncToVercelBlob();

      // Show success
      setSuccessMessage(`Draft saved at ${new Date().toLocaleTimeString()}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        alert('Storage quota exceeded! Try removing the image or using a smaller one.');
      } else {
        alert('Error saving draft: ' + error.message);
      }
      console.error('Draft save error:', error);
    }
  };

  const resetForm = () => {
    setMarkdownContent('');
    setHtmlContent('');
    setEditorMode('visual');
    setArticleImage('');
    setScheduleEnabled(false);
    setScheduledDate('');
    setTags([]);
    setTagInput('');
    setShowTagSuggestions(false);
    setPublicationDate(new Date().toISOString().split('T')[0]);
    setOgImageUrl('');
    setIsPremium(false);
    setPremiumCutoff(30);
    setSelectedTagCategory('topic');
    // Clear the visual editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    setArticleMeta({
      title: '',
      slug: '',
      excerpt: '',
      category: 'AI Regulation',
      author: 'Pimlico XHS™ Team',
      readTime: '5 min read',
      featured: false,
      image: '',
    });
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleMeta({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      category: article.category,
      author: article.author,
      readTime: article.readTime,
      featured: article.featured || false,
      image: article.image || '',
    });
    
    // Determine editor mode based on content type
    if (article.contentType === 'html') {
      setEditorMode('visual');
      setHtmlContent(article.content || '');
      setMarkdownContent('');
      // Update the visual editor after DOM renders
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = article.content || '';
        }
      }, 100);
    } else {
      // Default to markdown for backward compatibility
      setEditorMode('markdown');
      setMarkdownContent(article.content || '');
      setHtmlContent('');
    }
    
    setArticleImage(article.image || '');
    setTags(article.tags || []);
    setPublicationDate(article.date || new Date().toISOString().split('T')[0]);
    setOgImageUrl(article.ogImage || '');
    setIsPremium(article.isPremium || false);
    setPremiumCutoff(article.premiumCutoff || 30);
    if (article.scheduledAt) {
      setScheduleEnabled(true);
      setScheduledDate(article.scheduledAt);
    } else {
      setScheduleEnabled(false);
      setScheduledDate('');
    }
    setActiveTab('publish');
  };

  // Get all taxonomy tags flattened for searching
  const getAllTaxonomyTags = () => {
    return Object.values(PIMLICO_TAXONOMY).flat();
  };

  // Filter suggestions based on input
  const getTagSuggestions = () => {
    if (!tagInput.trim()) return [];
    const query = tagInput.toLowerCase();
    const allTags = getAllTaxonomyTags();
    return allTags
      .filter(tag => 
        tag.toLowerCase().includes(query) && 
        !tags.includes(tag)
      )
      .slice(0, 10); // Limit to 10 suggestions
  };

  const tagSuggestions = getTagSuggestions();

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
      setShowTagSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    if (!tags.includes(suggestion)) {
      setTags([...tags, suggestion]);
    }
    setTagInput('');
    setShowTagSuggestions(false);
    tagInputRef.current?.focus();
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDeleteArticle = async (article) => {
    if (confirm('Are you sure you want to delete this article?')) {
      if (article.isSample) {
        // For sample articles, track deletion separately
        const deletedSampleIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
        if (!deletedSampleIds.includes(article.id)) {
          deletedSampleIds.push(article.id);
          localStorage.setItem('xhs-deleted-samples', JSON.stringify(deletedSampleIds));
        }
      }
      
      // Remove from current state
      const updatedArticles = articles.filter(a => a.id !== article.id);
      setArticles(updatedArticles);
      
      // Update localStorage for custom articles only
      const customArticles = updatedArticles.filter(a => !a.isSample);
      localStorage.setItem('xhs-articles', JSON.stringify(customArticles));
      
      // Sync to Vercel Blob
      await syncToVercelBlob();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        // Set markdown content
        setMarkdownContent(content);
        
        // Convert markdown to HTML for visual editor
        const html = markdownToHtml(content);
        setHtmlContent(html);
        
        // Update visual editor DOM if it exists
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = html;
          }
        }, 100);
        
        // Switch to markdown mode to show the uploaded content directly
        setEditorMode('markdown');
      };
      reader.readAsText(file);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 50MB for Vercel Blob)
    if (file.size > 50 * 1024 * 1024) {
      alert('Image is too large. Please use an image under 50MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Vercel Blob for public URL
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.url) {
        // Use the public Vercel Blob URL
        setArticleImage(result.url);
        setOgImageUrl(result.url); // Also set as OG image for social sharing
        alert('Image uploaded successfully! This URL will work for both the article and social sharing.');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Fallback to base64 if Vercel Blob fails (e.g., in development or if not configured)
      alert('Cloud upload failed. Using local storage instead (social sharing may not work).\\n\\nTo enable cloud uploads, add BLOB_READ_WRITE_TOKEN to your Vercel environment variables.');
      
      // Compress and use base64 as fallback
      const maxWidth = 1200;
      const maxHeight = 630;
      const quality = 0.7;
      
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        setArticleImage(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Marketing asset template sizes
  const MARKETING_TEMPLATES = {
    linkedin: { width: 1200, height: 627, label: 'LinkedIn Post', icon: '💼' },
    twitter: { width: 1200, height: 675, label: 'Twitter/X Post', icon: '🐦' },
    instagram: { width: 1080, height: 1080, label: 'Instagram Square', icon: '📸' },
    instagramStory: { width: 1080, height: 1920, label: 'Instagram Story', icon: '📱' },
    og: { width: 1200, height: 630, label: 'OG Image', icon: '🌐' },
    email: { width: 600, height: 300, label: 'Email Header', icon: '📧' },
  };

  const FONT_OPTIONS = {
    system: { label: 'System (Default)', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    serif: { label: 'Serif', family: 'Georgia, "Times New Roman", serif' },
    mono: { label: 'Monospace', family: '"SF Mono", "Fira Code", "Courier New", monospace' },
    inter: { label: 'Inter', family: '"Inter", -apple-system, sans-serif' },
  };

  // Helper: wrap text on canvas
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    const lines = [];
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push({ text: line.trim(), y: currentY });
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    lines.push({ text: line.trim(), y: currentY });
    return lines;
  };

  // Load an image as a promise — uses proxy first for external URLs to avoid CORS issues
  const loadImage = (src) => new Promise((resolve, reject) => {
    if (!src) return reject(new Error('No image source'));
    
    // For relative/local paths, load directly
    if (src.startsWith('/') || src.startsWith('data:')) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load local image: ' + src));
      img.src = src;
      return;
    }
    
    // For external URLs, try proxy first (avoids CORS), fallback to direct
    if (src.startsWith('http')) {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
      const img1 = new window.Image();
      img1.crossOrigin = 'anonymous';
      img1.onload = () => resolve(img1);
      img1.onerror = () => {
        // Proxy failed — try direct as fallback
        console.warn('[loadImage] Proxy failed, trying direct:', src);
        const img2 = new window.Image();
        img2.crossOrigin = 'anonymous';
        img2.onload = () => resolve(img2);
        img2.onerror = () => {
          // Final attempt: direct without crossOrigin
          const img3 = new window.Image();
          img3.onload = () => resolve(img3);
          img3.onerror = () => reject(new Error('All image load attempts failed: ' + src));
          img3.src = src;
        };
        img2.src = src;
      };
      img1.src = proxyUrl;
      return;
    }
    
    // Unknown scheme — try direct
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image: ' + src));
    img.src = src;
  });

  // Draw image with aspect ratio preservation (cover mode)
  const drawImageCover = (ctx, img, dx, dy, dw, dh, alpha = 1) => {
    const imgRatio = img.width / img.height;
    const destRatio = dw / dh;
    let sx, sy, sw, sh;
    if (imgRatio > destRatio) {
      sh = img.height;
      sw = sh * destRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / destRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.restore();
  };

  // Shared helper: draw premium tag badge
  const drawPremiumTag = (ctx, template, fontFamily, fontScale, x, y, _b) => {
    const el = marketingElements;
    if (el.premiumTag.visible === false) return;
    const tagScale = (el.premiumTag.scale || 100) / 100;
    const tagOpacity = (el.premiumTag.opacity ?? 100) / 100;
    
    const fontSize = Math.round(template.width * 0.014 * fontScale * tagScale);
    const text = 'PREMIUM';
    ctx.font = `700 ${fontSize}px ${fontFamily}`;
    const textW = ctx.measureText(text).width;
    const padH = Math.round(fontSize * 0.9);
    const padV = Math.round(fontSize * 0.55);
    const tagW = textW + padH * 2 + fontSize * 1.2; // extra space for star icon
    const tagH = fontSize + padV * 2;
    const tx = x + (el.premiumTag.dx || 0);
    const ty = y + (el.premiumTag.dy || 0);
    
    ctx.save();
    ctx.globalAlpha = tagOpacity;
    
    // Gold gradient background
    const grad = ctx.createLinearGradient(tx, ty, tx + tagW, ty + tagH);
    grad.addColorStop(0, '#b8860b');
    grad.addColorStop(0.3, '#daa520');
    grad.addColorStop(0.7, '#f0c040');
    grad.addColorStop(1, '#daa520');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tagW, tagH, Math.round(tagH / 2));
    ctx.fill();
    
    // Subtle border/shadow
    ctx.strokeStyle = 'rgba(255,215,0,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Star icon
    const starX = tx + padH + fontSize * 0.15;
    const starY = ty + tagH / 2;
    const outerR = fontSize * 0.42;
    const innerR = outerR * 0.4;
    ctx.fillStyle = '#1a0f00';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      const px = starX + Math.cos(angle) * r;
      const py = starY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#1a0f00';
    ctx.fillText(text, tx + padH + fontSize * 1.0, ty + padV + fontSize * 0.88);
    
    ctx.restore();
    if (_b) _b.premiumTag = { x: tx, y: ty, w: tagW, h: tagH };
  };

  // Shared helper: draw bottom bar with balanced logos + CTA
  const drawBottomBar = async (ctx, template, padding, isDark, isGradient, fontFamily, fontScale, pos, _b) => {
    const el = marketingElements;
    const barScale = (el.bottomBar.height || 100) / 100;
    const barOpacity = (el.bottomBar.opacity || 100) / 100;
    const bottomH = Math.round(template.height * 0.13 * barScale);
    const bottomY = template.height - bottomH + (el.bottomBar.dy||0);
    
    ctx.save();
    ctx.globalAlpha = barOpacity;
    ctx.fillStyle = isDark || isGradient ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
    ctx.fillRect(0, bottomY, template.width, 1);
    ctx.fillStyle = isDark || isGradient ? 'rgba(0,0,0,0.35)' : 'rgba(249,250,251,0.92)';
    ctx.fillRect(0, bottomY + 1, template.width, bottomH);
    ctx.restore();
    if (_b) _b.bottomBar = {x:0, y:bottomY, w:template.width, h:bottomH};
    
    const baseLogoH = bottomH * 0.65;
    
    // Pimlico logo
    if (el.pimlicoLogo.visible !== false) {
      const pimScale = (el.pimlicoLogo.scale || 100) / 100;
      const pimOpacity = (el.pimlicoLogo.opacity ?? 100) / 100;
      const pimX = Math.round(el.pimlicoLogo.x * template.width) + (el.pimlicoLogo.dx||0);
      const pimY = bottomY + bottomH * 0.15 + (el.pimlicoLogo.dy||0);
      const pimH = baseLogoH * pimScale;
      
      try {
        const pimlicoLogoSrc = isDark || isGradient ? '/Pimlico_Logo_Inverted.png' : '/Pimlico_Logo.png';
        const pimlicoLogo = await loadImage(pimlicoLogoSrc);
        const pimW = (pimlicoLogo.width / pimlicoLogo.height) * pimH;
        ctx.save();
        ctx.globalAlpha = pimOpacity;
        ctx.drawImage(pimlicoLogo, pimX, pimY + (baseLogoH - pimH) / 2, pimW, pimH);
        ctx.restore();
        if (_b) _b.pimlicoLogo = {x:pimX, y:pimY, w:pimW, h:pimH};
        
        // Separator
        const sepX = pimX + pimW + 18;
        ctx.fillStyle = isDark || isGradient ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
        ctx.fillRect(sepX, pimY + 6, 1.5, baseLogoH - 12);
        
        // XHS logo
        if (el.xhsLogo.visible !== false) {
          const xhsScale = (el.xhsLogo.scale || 100) / 100;
          const xhsOpacity = (el.xhsLogo.opacity ?? 100) / 100;
          const xhsLogoSrc = isDark || isGradient ? '/XHS_Logo_White.png' : '/XHS Logo BLUE on WHITE.png';
          const xhsLogo = await loadImage(xhsLogoSrc);
          const xhsBaseH = baseLogoH * 1.5;
          const xhsScaledH = xhsBaseH * xhsScale;
          const xhsW = (xhsLogo.width / xhsLogo.height) * xhsScaledH;
          const xhsX = sepX + 18 + (el.xhsLogo.dx||0);
          const xhsY = pimY + (baseLogoH - xhsScaledH) / 2 + (el.xhsLogo.dy||0);
          ctx.save();
          ctx.globalAlpha = xhsOpacity;
          ctx.drawImage(xhsLogo, xhsX, xhsY, xhsW, xhsScaledH);
          ctx.restore();
          if (_b) _b.xhsLogo = {x:xhsX, y:xhsY, w:xhsW, h:xhsScaledH};
        }
      } catch (e) {
        const brandSize = Math.round(template.width * 0.022);
        ctx.font = `700 ${brandSize}px ${fontFamily}`;
        ctx.fillStyle = isDark || isGradient ? '#ffffff' : '#0f172a';
        ctx.fillText('Pimlico XHS™', pimX, bottomY + bottomH / 2 + brandSize * 0.35);
      }
    }
    
    if (el.cta.visible !== false && marketingCta) {
      const ctaEl = el.cta;
      const ctaOpacity = (ctaEl.opacity ?? 100) / 100;
      const ctaScale = (ctaEl.scale || 100) / 100;
      const ctaSize = Math.round(template.width * 0.018 * fontScale * ctaScale);
      ctx.font = `600 ${ctaSize}px ${fontFamily}`;
      ctx.save();
      ctx.globalAlpha = ctaOpacity;
      ctx.fillStyle = '#3b82f6';
      const ctaW = ctx.measureText(marketingCta).width;
      const ctaX = template.width - padding - ctaW + (el.cta.dx||0);
      const ctaY = bottomY + bottomH / 2 + ctaSize * 0.35 + (el.cta.dy||0);
      ctx.fillText(marketingCta, ctaX, ctaY);
      ctx.restore();
      if (_b) _b.cta = {x:ctaX - 10, y:ctaY - ctaSize, w:ctaW + 20, h:ctaSize + 10};
    }
    
    return { bottomY, bottomH };
  };

  const generateMarketingAsset = async () => {
    if (!marketingArticle) return;
    setMarketingLoading(true);
    
    const canvas = marketingCanvasRef.current;
    if (!canvas) { setMarketingLoading(false); return; }
    
    const template = MARKETING_TEMPLATES[marketingTemplate];
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');
    const el = marketingElements;
    const _b = {}; // bounds collector
    
    const isDark = marketingTheme === 'dark';
    const isGradient = marketingTheme === 'gradient';
    const isLight = marketingTheme === 'light';
    const fontFamily = FONT_OPTIONS[marketingFont]?.family || FONT_OPTIONS.system.family;
    const fontScale = marketingFontSize / 100;
    const padding = Math.round(template.width * 0.06);
    const pos = marketingPositions;

    // ============================
    // CARD LAYOUT
    // ============================
    if (marketingLayout === 'card') {
      // Background
      if (isGradient) {
        const grad = ctx.createLinearGradient(0, 0, template.width, template.height);
        grad.addColorStop(0, '#0d4f4f');
        grad.addColorStop(1, '#0a3d3d');
        ctx.fillStyle = grad;
      } else if (isDark) {
        ctx.fillStyle = '#0f172a';
      } else {
        ctx.fillStyle = '#e2e8f0';
      }
      ctx.fillRect(0, 0, template.width, template.height);

      // Subtle pattern overlay
      ctx.fillStyle = isDark || isGradient ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
      for (let i = 0; i < template.width; i += 40) {
        ctx.fillRect(i, 0, 1, template.height);
      }

      const cardPad = Math.round(template.width * 0.05);
      const isVert = marketingTemplate === 'instagram' || marketingTemplate === 'instagramStory';

      // Pimlico logo top-left
      if (el.pimlicoLogo.visible !== false) {
        try {
          const logoSrc = isDark || isGradient ? '/Pimlico_Logo_Inverted.png' : '/Pimlico_Logo.png';
          const logo = await loadImage(logoSrc);
          const pimScale = (el.pimlicoLogo.scale || 100) / 100;
          const pimOpacity = (el.pimlicoLogo.opacity ?? 100) / 100;
          const lH = Math.round(template.height * 0.055 * pimScale);
          const lW = (logo.width / logo.height) * lH;
          const _x = cardPad + (el.pimlicoLogo.dx||0), _y = cardPad + (el.pimlicoLogo.dy||0);
          ctx.save(); ctx.globalAlpha = pimOpacity;
          ctx.drawImage(logo, _x, _y, lW, lH);
          ctx.restore();
          _b.pimlicoLogo = {x:_x, y:_y, w:lW, h:lH};
        } catch (e) {}
      }

      // XHS brandmark top-right
      if (el.xhsLogo.visible !== false) {
        try {
          const xhsSrc = isDark || isGradient ? '/XHS_Logo_White.png' : '/XHS Logo BLUE on WHITE.png';
          const xhsLogo = await loadImage(xhsSrc);
          const xhsScale = (el.xhsLogo.scale || 100) / 100;
          const xhsOpacity = (el.xhsLogo.opacity ?? 100) / 100;
          const xH = Math.round(template.height * 0.07 * xhsScale);
          const xW = (xhsLogo.width / xhsLogo.height) * xH;
          const _x = template.width - cardPad - xW + (el.xhsLogo.dx||0), _y = cardPad + (el.xhsLogo.dy||0);
          ctx.save(); ctx.globalAlpha = xhsOpacity;
          ctx.drawImage(xhsLogo, _x, _y, xW, xH);
          ctx.restore();
          _b.xhsLogo = {x:_x, y:_y, w:xW, h:xH};
        } catch (e) {}
      }

      // Premium tag — top-right area below XHS logo
      drawPremiumTag(ctx, template, fontFamily, fontScale, template.width - cardPad - Math.round(template.width * 0.18), cardPad + Math.round(template.height * 0.08), _b);

      // Category white box
      if (el.badge.visible !== false) {
        const category = (marketingArticle.category || 'ARTICLE').toUpperCase();
        const catFontSize = Math.round(template.width * 0.018 * fontScale);
        ctx.font = `700 ${catFontSize}px ${fontFamily}`;
        const catTextW = ctx.measureText(category).width;
        const catBoxPad = Math.round(template.width * 0.015);
        const catBoxH = catFontSize + catBoxPad * 2;
        const catBoxW = catTextW + catBoxPad * 3;
        const catBoxY = cardPad + Math.round(template.height * 0.075);
        const _bx = cardPad + (el.badge.dx||0), _by = catBoxY + (el.badge.dy||0);
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(_bx, _by, catBoxW, catBoxH, 8);
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(_bx, _by, catBoxW, catBoxH, 8);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.fillStyle = '#0f172a';
        ctx.fillText(category, _bx + catBoxPad * 1.5, _by + catBoxPad + catFontSize * 0.85);
        _b.badge = {x:_bx, y:_by, w:catBoxW, h:catBoxH};
      }

      // Article image (centered, rounded, with shadow)
      const cardImgScale = (el.image.scale ?? 100) / 100;
      const cardImgOpacity = (el.image.opacity ?? 100) / 100;
      const catBoxYForImg = cardPad + Math.round(template.height * 0.075);
      const catBoxHForImg = Math.round(template.width * 0.018 * fontScale) + Math.round(template.width * 0.015) * 2;
      const imgTopY = catBoxYForImg + catBoxHForImg + Math.round(template.height * 0.04);
      const imgAreaH = (isVert ? template.height * 0.42 : template.height * 0.45) * cardImgScale;
      const imgAreaW = template.width - cardPad * 2;
      
      if (el.image.visible !== false && marketingArticle.image) {
        const _ix = cardPad + (el.image.dx||0), _iy = imgTopY + (el.image.dy||0);
        try {
          const img = await loadImage(marketingArticle.image);
          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetY = 8;
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.roundRect(_ix, _iy, imgAreaW, imgAreaH, 14);
          ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(_ix, _iy, imgAreaW, imgAreaH, 14);
          ctx.clip();
          drawImageCover(ctx, img, _ix, _iy, imgAreaW, imgAreaH, cardImgOpacity);
          ctx.restore();
          _b.image = {x:_ix, y:_iy, w:imgAreaW, h:imgAreaH};
        } catch (e) {
          ctx.fillStyle = isDark || isGradient ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
          ctx.beginPath();
          ctx.roundRect(_ix, _iy, imgAreaW, imgAreaH, 14);
          ctx.fill();
          _b.image = {x:_ix, y:_iy, w:imgAreaW, h:imgAreaH};
        }
      }

      // Title white box at bottom
      const titleBoxY = imgTopY + imgAreaH + Math.round(template.height * 0.03);
      const titleBoxH = template.height - titleBoxY - cardPad;
      const titleBoxW = template.width - cardPad * 2;
      
      if (el.title.visible !== false) {
        const _tx = cardPad + (el.title.dx||0), _ty = titleBoxY + (el.title.dy||0);
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(_tx, _ty, titleBoxW, titleBoxH, 10);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        const titleText = marketingTitle || marketingArticle.title;
        const titleFontSize = Math.round(template.width * (isVert ? 0.04 : 0.028) * fontScale);
        const titlePadInner = Math.round(template.width * 0.025);
        ctx.fillStyle = '#0f172a';
        ctx.font = `${marketingFontWeight} ${titleFontSize}px ${fontFamily}`;
        const titleMaxW = titleBoxW - titlePadInner * 2;
        const titleLines = wrapText(ctx, titleText, _tx + titlePadInner, _ty + titlePadInner + titleFontSize, titleMaxW, titleFontSize * 1.25);
        titleLines.slice(0, 3).forEach(line => {
          ctx.fillText(line.text, _tx + titlePadInner, line.y);
        });
        _b.title = {x:_tx, y:_ty, w:titleBoxW, h:titleBoxH};
      }

      // CTA inside title box, bottom-right
      if (el.cta.visible !== false && marketingCta) {
        const _cx = cardPad + (el.cta.dx||0), _cy = titleBoxY + (el.cta.dy||0);
        const ctaSize = Math.round(template.width * 0.014 * fontScale);
        ctx.font = `600 ${ctaSize}px ${fontFamily}`;
        ctx.fillStyle = '#3b82f6';
        const ctaW = ctx.measureText(marketingCta).width;
        const ctaX = _cx + titleBoxW - Math.round(template.width * 0.025) - ctaW;
        const ctaY = _cy + titleBoxH - Math.round(template.width * 0.025);
        ctx.fillText(marketingCta, ctaX, ctaY);
        _b.cta = {x:ctaX - 10, y:ctaY - ctaSize, w:ctaW + 20, h:ctaSize + 10};
      }

    // ============================
    // MAGAZINE LAYOUT
    // ============================
    } else if (marketingLayout === 'magazine') {
      // Full-bleed article image
      const magImgOpacity = (el.image.opacity ?? 100) / 100;
      if (el.image.visible !== false && marketingArticle.image) {
        try {
          const img = await loadImage(marketingArticle.image);
          drawImageCover(ctx, img, 0 + (el.image.dx||0), 0 + (el.image.dy||0), template.width, template.height, magImgOpacity);
          _b.image = {x:0, y:0, w:template.width, h:template.height};
        } catch (e) {
          const grad = ctx.createLinearGradient(0, 0, template.width, template.height);
          grad.addColorStop(0, '#1e293b');
          grad.addColorStop(1, '#0f172a');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, template.width, template.height);
        }
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, template.width, template.height);
      }

      // Strong gradient overlay from bottom
      const overlayColor = isGradient ? [15, 40, 71] : isDark ? [15, 23, 42] : [15, 23, 42];
      const grad1 = ctx.createLinearGradient(0, 0, 0, template.height);
      grad1.addColorStop(0, `rgba(${overlayColor.join(',')},0.1)`);
      grad1.addColorStop(0.35, `rgba(${overlayColor.join(',')},0.4)`);
      grad1.addColorStop(0.6, `rgba(${overlayColor.join(',')},0.75)`);
      grad1.addColorStop(1, `rgba(${overlayColor.join(',')},0.95)`);
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, template.width, template.height);

      const topGrad = ctx.createLinearGradient(0, 0, 0, template.height * 0.25);
      topGrad.addColorStop(0, `rgba(${overlayColor.join(',')},0.6)`);
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, template.width, template.height * 0.25);

      const isVert = marketingTemplate === 'instagram' || marketingTemplate === 'instagramStory';
      const magPad = Math.round(template.width * 0.06);

      // Pimlico + XHS logos at top
      if (el.pimlicoLogo.visible !== false) {
        try {
          const magPimScale = (el.pimlicoLogo.scale || 100) / 100;
          const magPimOpacity = (el.pimlicoLogo.opacity ?? 100) / 100;
          const logo = await loadImage('/Pimlico_Logo_Inverted.png');
          const lH = Math.round(template.height * 0.05 * magPimScale);
          const lW = (logo.width / logo.height) * lH;
          const _px = magPad + (el.pimlicoLogo.dx||0), _py = magPad + (el.pimlicoLogo.dy||0);
          ctx.save(); ctx.globalAlpha = magPimOpacity;
          ctx.drawImage(logo, _px, _py, lW, lH);
          ctx.restore();
          _b.pimlicoLogo = {x:_px, y:_py, w:lW, h:lH};

          // XHS next to it
          if (el.xhsLogo.visible !== false) {
            const magXhsScale = (el.xhsLogo.scale || 100) / 100;
            const magXhsOpacity = (el.xhsLogo.opacity ?? 100) / 100;
            const xhsLogo = await loadImage('/XHS_Logo_White.png');
            const xhsH = lH * 1.4 * magXhsScale;
            const xhsW = (xhsLogo.width / xhsLogo.height) * xhsH;
            const sepX = _px + lW + 14;
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(sepX, _py + 3, 1.5, lH - 6);
            const _xx = sepX + 14 + (el.xhsLogo.dx||0), _xy = _py + (lH - xhsH) / 2 + (el.xhsLogo.dy||0);
            ctx.save(); ctx.globalAlpha = magXhsOpacity;
            ctx.drawImage(xhsLogo, _xx, _xy, xhsW, xhsH);
            ctx.restore();
            _b.xhsLogo = {x:_xx, y:_xy, w:xhsW, h:xhsH};
          }
        } catch (e) {}
      }

      // Category badge
      if (el.badge.visible !== false) {
        const category = marketingArticle.category || '';
        if (category) {
          const catFontSize = Math.round(template.width * 0.016 * fontScale);
          ctx.font = `700 ${catFontSize}px ${fontFamily}`;
          const catText = category.toUpperCase();
          const catW = ctx.measureText(catText).width;
          const catPadH = 16;
          const catPadV = 10;
          const _bx = magPad + (el.badge.dx||0);
          const _by = template.height * (isVert ? 0.55 : 0.52) + (el.badge.dy||0);
          const bW = catW + catPadH * 2;
          const bH = catFontSize + catPadV * 2;
          
          ctx.fillStyle = 'rgba(59,130,246,0.25)';
          ctx.beginPath();
          ctx.roundRect(_bx, _by, bW, bH, 6);
          ctx.fill();
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(_bx, _by, 4, bH);
          ctx.fillText(catText, _bx + catPadH, _by + catPadV + catFontSize * 0.85);
          _b.badge = {x:_bx, y:_by, w:bW, h:bH};
        }
      }

      // Premium tag — top-right
      drawPremiumTag(ctx, template, fontFamily, fontScale, template.width - magPad - Math.round(template.width * 0.17), magPad, _b);

      // Title — large, dramatic
      if (el.title.visible !== false) {
        const titleText = marketingTitle || marketingArticle.title;
        const baseTitleSize = isVert ? template.width * 0.065 : template.width * 0.046;
        const titleSize = Math.round(baseTitleSize * fontScale);
        ctx.fillStyle = '#ffffff';
        ctx.font = `${marketingFontWeight} ${titleSize}px ${fontFamily}`;
        
        const maxTextW = isVert ? template.width - magPad * 2 : template.width * 0.7;
        const _tx = magPad + (el.title.dx||0);
        const titleY = template.height * (isVert ? 0.63 : 0.62) + (el.title.dy||0);
        const titleLines = wrapText(ctx, titleText, _tx, titleY, maxTextW, titleSize * 1.15);
        titleLines.slice(0, 4).forEach(line => {
          ctx.fillText(line.text, _tx, line.y);
        });
        const lastTitleLine = titleLines.length > 0 ? titleLines[titleLines.length - 1].y : titleY;
        _b.title = {x:_tx, y:titleY - titleSize, w:maxTextW, h:lastTitleLine - titleY + titleSize * 1.5};

        // Subtitle below title
        if (el.subtitle.visible !== false) {
          const subtitleText = marketingSubtitle || '';
          if (subtitleText) {
            const lastTY = titleLines.length > 0 ? titleLines[titleLines.length - 1].y : titleY;
            const subSize = Math.round(titleSize * 0.45);
            const _sx = magPad + (el.subtitle.dx||0);
            const _sy = lastTY + titleSize * 0.8 + (el.subtitle.dy||0);
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = `400 ${subSize}px ${fontFamily}`;
            const subLines = wrapText(ctx, subtitleText, _sx, _sy, maxTextW, subSize * 1.5);
            subLines.slice(0, 2).forEach(line => {
              ctx.fillText(line.text, _sx, line.y);
            });
            _b.subtitle = {x:_sx, y:_sy - subSize, w:maxTextW, h:subSize * 4};
          }
        }
      }

      // Bottom bar
      if (el.bottomBar.visible !== false) {
        const bottomH = Math.round(template.height * 0.1);
        const bottomY = template.height - bottomH + (el.bottomBar.dy||0);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, bottomY, template.width, bottomH);
        _b.bottomBar = {x:0, y:bottomY, w:template.width, h:bottomH};
      }

      // CTA at bottom-right
      if (el.cta.visible !== false && marketingCta) {
        const bottomH = Math.round(template.height * 0.1);
        const bottomY = template.height - bottomH + (el.bottomBar.dy||0);
        const ctaSize = Math.round(template.width * 0.018 * fontScale);
        ctx.font = `600 ${ctaSize}px ${fontFamily}`;
        ctx.fillStyle = '#60a5fa';
        const ctaW = ctx.measureText(marketingCta).width;
        const _cx = template.width - magPad - ctaW + (el.cta.dx||0);
        const _cy = bottomY + bottomH / 2 + ctaSize * 0.35 + (el.cta.dy||0);
        ctx.fillText(marketingCta, _cx, _cy);
        _b.cta = {x:_cx - 10, y:_cy - ctaSize, w:ctaW + 20, h:ctaSize + 10};

        // Arrow indicator
        const arrowX = template.width - magPad;
        const arrowY = bottomY + bottomH / 2;
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(arrowX - 12, arrowY - 6);
        ctx.lineTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 12, arrowY + 6);
        ctx.stroke();
      }

    // ============================
    // CLASSIC LAYOUT (default)
    // ============================
    } else {
      // Background
      if (isGradient) {
        const grad = ctx.createLinearGradient(0, 0, template.width, template.height);
        grad.addColorStop(0, '#1e3a5f');
        grad.addColorStop(0.5, '#0f2847');
        grad.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = grad;
      } else if (isDark) {
        ctx.fillStyle = '#0f172a';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      ctx.fillRect(0, 0, template.width, template.height);

      // Article image
      const imgEl = el.image;
      const imgOpacity = (imgEl.opacity ?? 100) / 100;
      const imgZoom = (imgEl.zoom ?? 100) / 100;
      const imgScale = (imgEl.scale ?? 100) / 100;
      if (el.image.visible !== false && marketingArticle.image) {
        try {
          const img = await loadImage(marketingArticle.image);
          
          if (marketingTemplate === 'instagram' || marketingTemplate === 'instagramStory') {
            const imgH = template.height * 0.45 * imgScale;
            const _iy = (el.image.dy||0);
            drawImageCover(ctx, img, 0, _iy, template.width, imgH, 0.3 * imgOpacity);
            const fadeGrad = ctx.createLinearGradient(0, _iy + imgH * 0.3, 0, _iy + imgH);
            fadeGrad.addColorStop(0, isDark || isGradient ? 'rgba(15,23,42,0)' : 'rgba(255,255,255,0)');
            fadeGrad.addColorStop(1, isDark ? '#0f172a' : isGradient ? '#0f2847' : '#ffffff');
            ctx.fillStyle = fadeGrad;
            ctx.fillRect(0, _iy, template.width, imgH);
            _b.image = {x:0, y:_iy, w:template.width, h:imgH};
          } else {
            const imgW = template.width * 0.38 * imgScale;
            const imgX = Math.round(imgEl.x * template.width) + (el.image.dx||0);
            const _iy = (el.image.dy||0);
            drawImageCover(ctx, img, imgX, _iy, imgW, template.height, imgOpacity);
            const fadeGrad = ctx.createLinearGradient(imgX - 60, 0, imgX + 100, 0);
            fadeGrad.addColorStop(0, isDark ? '#0f172a' : isGradient ? '#0f2847' : '#ffffff');
            fadeGrad.addColorStop(1, 'rgba(15,23,42,0)');
            ctx.fillStyle = fadeGrad;
            ctx.fillRect(imgX - 60, _iy, imgW + 60, template.height);
            _b.image = {x:imgX, y:_iy, w:imgW, h:template.height};
          }
        } catch (e) {
          console.log('Could not load article image for marketing asset', e);
        }
      }
      
      // Accent line
      if (el.accentLine.visible !== false) {
        const accentEl = el.accentLine;
        const accentOpacity = (accentEl.opacity ?? 100) / 100;
        const accentWidth = 60 * ((accentEl.width ?? 100) / 100);
        ctx.save();
        ctx.globalAlpha = accentOpacity;
        ctx.fillStyle = '#3b82f6';
        const _ax = Math.round(pos.badge.x * template.width) + (el.accentLine.dx||0);
        const accentY = Math.round(pos.badge.y * template.height) - 20 + (el.accentLine.dy||0);
        ctx.fillRect(_ax, accentY, accentWidth, 4);
        ctx.restore();
        _b.accentLine = {x:_ax, y:accentY, w:accentWidth, h:4};
      }
      
      // Category badge
      if (el.badge.visible !== false) {
        const badgeEl = el.badge;
        const badgeOpacity = (badgeEl.opacity ?? 100) / 100;
        const badgeScale = (badgeEl.scale ?? 100) / 100;
        const category = marketingArticle.category || '';
        if (category) {
          const badgeFontSize = Math.round(template.width * 0.016 * fontScale * badgeScale);
          ctx.font = `700 ${badgeFontSize}px ${fontFamily}`;
          const badgeText = category.toUpperCase();
          const badgeMetrics = ctx.measureText(badgeText);
          const badgePadH = 14;
          const badgePadV = 8;
          const bx = Math.round(pos.badge.x * template.width) + (el.badge.dx||0);
          const by = Math.round(pos.badge.y * template.height) + (el.badge.dy||0);
          const bw = badgeMetrics.width + badgePadH * 2;
          const bh = badgeFontSize + badgePadV * 2;
          
          ctx.save();
          ctx.globalAlpha = badgeOpacity;
          ctx.fillStyle = isDark || isGradient ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)';
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 6);
          ctx.fill();
          ctx.fillStyle = '#3b82f6';
          ctx.fillText(badgeText, bx + badgePadH, by + badgePadV + badgeFontSize * 0.85);
          ctx.restore();
          _b.badge = {x:bx, y:by, w:bw, h:bh};
        }
      }

      // Premium tag — near top-right
      drawPremiumTag(ctx, template, fontFamily, fontScale, template.width * 0.42, padding, _b);
      
      // Title
      if (el.title.visible !== false) {
        const titleEl = el.title;
        const titleOpacity = (titleEl.opacity ?? 100) / 100;
        const titleScaleEl = (titleEl.scale ?? 100) / 100;
        const titleText = marketingTitle || marketingArticle.title;
        const titleColor = isDark || isGradient ? '#ffffff' : '#0f172a';
        const baseTitleSize = marketingTemplate === 'instagramStory' 
          ? template.width * 0.065
          : marketingTemplate === 'instagram'
            ? template.width * 0.058
            : template.width * 0.038;
        const titleSize = Math.round(baseTitleSize * fontScale * titleScaleEl);
        ctx.save();
        ctx.globalAlpha = titleOpacity;
        ctx.fillStyle = titleColor;
        ctx.font = `${marketingFontWeight} ${titleSize}px ${fontFamily}`;
        
        const isVertical = marketingTemplate === 'instagram' || marketingTemplate === 'instagramStory';
        const maxTextW = isVertical ? template.width - padding * 2 : template.width * 0.55;
        const titleX = Math.round(pos.title.x * template.width) + (el.title.dx||0);
        const titleY = Math.round(pos.title.y * template.height) + (el.title.dy||0);
        const titleLines = wrapText(ctx, titleText, titleX, titleY, maxTextW, titleSize * 1.2);
        titleLines.forEach(line => {
          ctx.fillText(line.text, titleX, line.y);
        });
        ctx.restore();
        const lastTL = titleLines.length > 0 ? titleLines[titleLines.length - 1].y : titleY;
        _b.title = {x:titleX, y:titleY - titleSize, w:maxTextW, h:lastTL - titleY + titleSize * 1.5};
      
        // Subtitle
        if (el.subtitle.visible !== false) {
          const subEl = el.subtitle;
          const subOpacity = (subEl.opacity ?? 100) / 100;
          const lastTitleY = titleLines.length > 0 ? titleLines[titleLines.length - 1].y : titleY;
          const subtitleText = marketingSubtitle || '';
          if (subtitleText) {
            const subtitleSize = Math.round(titleSize * 0.5);
            ctx.save();
            ctx.globalAlpha = subOpacity;
            ctx.fillStyle = isDark || isGradient ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.55)';
            ctx.font = `400 ${subtitleSize}px ${fontFamily}`;
            const subX = (pos.subtitle.x !== undefined ? Math.round((pos.subtitle.x || pos.title.x) * template.width) : titleX) + (el.subtitle.dx||0);
            const subY = (pos.subtitle.y ? Math.round(pos.subtitle.y * template.height) : lastTitleY + titleSize * 0.9) + (el.subtitle.dy||0);
            const subtitleLines = wrapText(ctx, subtitleText, subX, subY, maxTextW, subtitleSize * 1.5);
            subtitleLines.slice(0, 2).forEach(line => {
              ctx.fillText(line.text, subX, line.y);
            });
            ctx.restore();
            _b.subtitle = {x:subX, y:subY - subtitleSize, w:maxTextW, h:subtitleSize * 4};
          }
        }
      }
      
      // Bottom bar with logos + CTA (logos render independently if bar hidden)
      if (el.bottomBar.visible !== false) {
        await drawBottomBar(ctx, template, padding, isDark, isGradient, fontFamily, fontScale, pos, _b);
      } else {
        // Render logos and CTA independently when bottom bar is hidden
        const classicLogoY = template.height * 0.87, classicLogoH = template.height * 0.08;
        if (el.pimlicoLogo.visible !== false) {
          try { const logo = await loadImage(isDark || isGradient ? '/Pimlico_Logo_Inverted.png' : '/Pimlico_Logo.png');
          const pS = (el.pimlicoLogo.scale || 100) / 100, pO = (el.pimlicoLogo.opacity ?? 100) / 100;
          const pH = classicLogoH * pS, pW = (logo.width / logo.height) * pH;
          const _px = Math.round(el.pimlicoLogo.x * template.width) + (el.pimlicoLogo.dx || 0), _py = classicLogoY + (el.pimlicoLogo.dy || 0);
          ctx.save(); ctx.globalAlpha = pO; ctx.drawImage(logo, _px, _py, pW, pH); ctx.restore(); _b.pimlicoLogo = {x:_px,y:_py,w:pW,h:pH}; } catch{}
        }
        if (el.xhsLogo.visible !== false) {
          try { const xhsLogo = await loadImage(isDark || isGradient ? '/XHS_Logo_White.png' : '/XHS Logo BLUE on WHITE.png');
          const xS = (el.xhsLogo.scale || 100) / 100, xO = (el.xhsLogo.opacity ?? 100) / 100;
          const xH = classicLogoH * 1.4 * xS, xW = (xhsLogo.width / xhsLogo.height) * xH;
          const _xx = Math.round(el.xhsLogo.x * template.width) + (el.xhsLogo.dx || 0), _xy = classicLogoY + (el.xhsLogo.dy || 0);
          ctx.save(); ctx.globalAlpha = xO; ctx.drawImage(xhsLogo, _xx, _xy, xW, xH); ctx.restore(); _b.xhsLogo = {x:_xx,y:_xy,w:xW,h:xH}; } catch{}
        }
        if (el.cta.visible !== false && marketingCTA) {
          const ctaOp = (el.cta.opacity ?? 100) / 100, ctaScale = (el.cta.scale || 100) / 100;
          const ctaSize = Math.round(template.width * 0.018 * fontScale * ctaScale);
          ctx.font = `600 ${ctaSize}px ${fontFamily}`; ctx.save(); ctx.globalAlpha = ctaOp; ctx.fillStyle = '#3b82f6';
          const ctaW = ctx.measureText(marketingCTA).width;
          ctx.fillText(marketingCTA, template.width - padding - ctaW + (el.cta.dx || 0), classicLogoY + classicLogoH * 0.6 + (el.cta.dy || 0)); ctx.restore();
        }
      }
    }
    
    // Store bounds for drag hit testing
    elementBoundsRef.current = _b;
    setMarketingLoading(false);
  };

  // Canvas drag handling — bounding-box hit testing, pixel-level offsets
  const handleCanvasMouseDown = (e) => {
    const canvas = marketingCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    
    const bounds = elementBoundsRef.current;
    // Check elements from front to back (top-most first)
    const hitOrder = ['premiumTag', 'cta', 'subtitle', 'title', 'badge', 'xhsLogo', 'pimlicoLogo', 'accentLine', 'bottomBar', 'image'];
    for (const key of hitOrder) {
      const b = bounds[key];
      if (!b) continue;
      if (marketingElements[key]?.visible === false) continue;
      // Expand hit area slightly for easier grabbing
      const pad = 15;
      if (px >= b.x - pad && px <= b.x + b.w + pad && py >= b.y - pad && py <= b.y + b.h + pad) {
        setMarketingDragTarget(key);
        dragStartRef.current = { px, py, dx: marketingElements[key]?.dx || 0, dy: marketingElements[key]?.dy || 0 };
        return;
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!marketingDragTarget || !dragStartRef.current) return;
    const canvas = marketingCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    
    const ds = dragStartRef.current;
    const newDx = ds.dx + (px - ds.px);
    const newDy = ds.dy + (py - ds.py);
    
    setMarketingElements(prev => ({
      ...prev,
      [marketingDragTarget]: {
        ...prev[marketingDragTarget],
        dx: Math.round(newDx),
        dy: Math.round(newDy),
      }
    }));
  };

  const handleCanvasMouseUp = () => {
    if (marketingDragTarget) {
      setMarketingDragTarget(null);
      dragStartRef.current = null;
      setTimeout(() => generateMarketingAsset(), 50);
    }
  };

  const downloadMarketingAsset = () => {
    const canvas = marketingCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const articleSlug = marketingArticle?.slug || 'asset';
    link.download = `pimlico-${articleSlug}-${marketingTemplate}-${marketingLayout}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const generatePostText = () => {
    if (!marketingArticle) return;
    const title = marketingTitle || marketingArticle.title;
    const excerpt = marketingArticle.excerpt || '';
    const category = marketingArticle.category || '';
    const slug = marketingArticle.slug || '';
    const link = `pimlicosolutions.com/insights/${slug}`;
    const tags = (marketingArticle.tags || []).slice(0, 5).map(t => `#${t.replace(/\s+/g, '')}`).join(' ');
    const catTag = category ? `#${category.replace(/\s+/g, '')}` : '';
    const coreTags = `${tags}${catTag ? ` ${catTag}` : ''} #RegulatoryIntelligence #Compliance`;
    
    // Derive a concise insight sentence from the excerpt
    const sentences = excerpt.split(/(?<=[.!?])\s+/).filter(s => s.length > 20);
    const leadSentence = sentences[0] || excerpt.slice(0, 200);
    const secondSentence = sentences[1] || '';
    
    let post = '';
    if (marketingTemplate === 'linkedin') {
      post = [
        `${title}`,
        ``,
        `${leadSentence}`,
        secondSentence ? `\n${secondSentence}` : '',
        ``,
        `For compliance and regulatory affairs teams, staying ahead isn't optional — it's the cost of doing business. Pimlico XHS™ delivers the intelligence you need to anticipate change, not react to it.`,
        ``,
        `📖 Read the full analysis → ${link}`,
        ``,
        `${coreTags} #RegTech #GRC`,
      ].filter(Boolean).join('\n');
    } else if (marketingTemplate === 'twitter') {
      // Twitter: tight, punchy, under 280 chars target
      const tweetExcerpt = excerpt.length > 140 ? excerpt.slice(0, 137) + '...' : excerpt;
      post = `${title}\n\n${tweetExcerpt}\n\n📖 ${link}\n\n${tags}`;
      // Trim to safe length
      if (post.length > 280) {
        post = `${title}\n\n📖 ${link}\n\n${tags}`;
      }
    } else if (marketingTemplate === 'instagram' || marketingTemplate === 'instagramStory') {
      post = [
        `${title}`,
        ``,
        `${leadSentence}`,
        secondSentence ? `\n${secondSentence}` : '',
        ``,
        `Pimlico XHS™ — regulatory intelligence for teams that can't afford to fall behind.`,
        ``,
        `📖 Link in bio for the full analysis`,
        ``,
        `·`,
        `·`,
        `·`,
        ``,
        `${coreTags} #RegTech #FinTech #GRC`,
      ].filter(Boolean).join('\n');
    } else if (marketingTemplate === 'email') {
      post = [
        `Subject: ${title}`,
        ``,
        `Hi [First Name],`,
        ``,
        `${leadSentence}`,
        secondSentence ? `\n${secondSentence}` : '',
        ``,
        `We've published a detailed analysis on Pimlico XHS™ that breaks down what this means for your organisation's compliance strategy.`,
        ``,
        `👉 Read the full article: ${link}`,
        ``,
        `Best regards,`,
        `The Pimlico Team`,
      ].filter(Boolean).join('\n');
    } else {
      // OG / generic
      post = [
        `${title}`,
        ``,
        `${leadSentence}`,
        ``,
        `📖 Read more: ${link}`,
        ``,
        `${coreTags}`,
      ].filter(Boolean).join('\n');
    }
    setMarketingPostText(post);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
              <span className="text-gray-400">|</span>
              <span className="text-white font-semibold">Admin Console</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white text-sm">
                ← Back to Site
              </Link>
              <Link href="/insights" className="text-blue-400 hover:text-blue-300 text-sm">
                View Insights
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'articles'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              📝 Articles
            </button>
            <button
              onClick={() => setActiveTab('publish')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'publish'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              ✏️ Publish New
            </button>
            <button
              onClick={() => setActiveTab('marketing')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'marketing'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              🎨 Marketing Assets
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-900/50 border border-green-500 text-green-300 px-6 py-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-green-400 hover:text-green-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Published Articles</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // Export all custom articles for adding to sample-articles.js
                    const customArticles = JSON.parse(localStorage.getItem('xhs-articles') || '[]');
                    if (customArticles.length === 0) {
                      alert('No custom articles to export. All your articles are already in the sample articles file.');
                      return;
                    }
                    
                    // Format for sample-articles.js
                    const exportData = customArticles.map((a, idx) => ({
                      id: 100 + idx, // Start from 100 for custom articles
                      slug: a.slug,
                      title: a.title,
                      excerpt: a.excerpt,
                      category: a.category,
                      author: a.author || 'Pimlico XHS™ Team',
                      date: a.date,
                      readTime: a.readTime,
                      image: '/Dashboard.png', // Use default since base64 won't work for OG
                      ogImage: a.ogImage || `/articles/og-${a.category.toLowerCase().replace(/\s+/g, '-')}.png`,
                      featured: a.featured || false,
                      tags: a.tags || [],
                      isSample: true,
                      content: a.content
                    }));
                    
                    const jsonOutput = JSON.stringify(exportData, null, 2);
                    
                    // Copy to clipboard
                    navigator.clipboard.writeText(jsonOutput).then(() => {
                      alert('Articles exported to clipboard!\\n\\nPaste this into sample-articles.js to enable LinkedIn sharing.\\n\\nNote: Add these objects to the sampleArticles array in src/data/sample-articles.js');
                    }).catch(() => {
                      // Fallback - show in console
                      console.log('Export for sample-articles.js:', jsonOutput);
                      alert('Could not copy to clipboard. Check the browser console (F12) for the export data.');
                    });
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  title="Export articles for social sharing support"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Export for LinkedIn
                </button>
                <button
                  onClick={() => setActiveTab('publish')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  + New Article
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 bg-gray-800 rounded-xl p-4">
              <div className="flex flex-wrap gap-4">
                {/* Search Input */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                {/* Category Filter */}
                <div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="AI Regulation">AI Regulation</option>
                    <option value="Payments">Payments</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Gambling">Gambling</option>
                  </select>
                </div>
                
                {/* Status Filter */}
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Drafts</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                
                {/* Featured Filter */}
                <div>
                  <select
                    value={filterFeatured}
                    onChange={(e) => setFilterFeatured(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Articles</option>
                    <option value="featured">Featured Only</option>
                    <option value="not-featured">Not Featured</option>
                  </select>
                </div>
              </div>
              
              {/* Active filters count */}
              {(searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterFeatured !== 'all') && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Filters active
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('all');
                      setFilterStatus('all');
                      setFilterFeatured('all');
                    }}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {(() => {
              // Apply filters to articles
              const filteredArticles = articles.filter(article => {
                // Search filter
                if (searchQuery) {
                  const query = searchQuery.toLowerCase();
                  const matchesSearch = 
                    article.title.toLowerCase().includes(query) ||
                    article.excerpt?.toLowerCase().includes(query) ||
                    article.category?.toLowerCase().includes(query) ||
                    article.tags?.some(tag => tag.toLowerCase().includes(query));
                  if (!matchesSearch) return false;
                }
                
                // Category filter
                if (filterCategory !== 'all' && article.category !== filterCategory) {
                  return false;
                }
                
                // Status filter
                if (filterStatus !== 'all') {
                  const isDraft = article.status === 'draft';
                  const isScheduled = article.status === 'scheduled' && article.scheduledAt;
                  const scheduledTime = isScheduled ? new Date(article.scheduledAt) : null;
                  const isPastScheduled = scheduledTime && scheduledTime <= new Date();
                  let currentStatus;
                  if (isDraft) currentStatus = 'draft';
                  else if (isScheduled && !isPastScheduled) currentStatus = 'scheduled';
                  else currentStatus = 'published';
                  if (filterStatus !== currentStatus) return false;
                }
                
                // Featured filter
                if (filterFeatured === 'featured' && !article.featured) return false;
                if (filterFeatured === 'not-featured' && article.featured) return false;
                
                return true;
              });

              if (articles.length === 0) {
                return (
                  <div className="text-center py-16 bg-gray-800 rounded-xl">
                    <p className="text-gray-400 mb-4">No articles published yet</p>
                    <button
                      onClick={() => setActiveTab('publish')}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      Publish your first article →
                    </button>
                  </div>
                );
              }

              if (filteredArticles.length === 0) {
                return (
                  <div className="text-center py-16 bg-gray-800 rounded-xl">
                    <p className="text-gray-400 mb-4">No articles match your filters</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterCategory('all');
                        setFilterStatus('all');
                        setFilterFeatured('all');
                      }}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      Clear all filters
                    </button>
                  </div>
                );
              }

              return (
                <>
                  <div className="mb-4 text-sm text-gray-400">
                    Showing {filteredArticles.length} of {articles.length} articles
                  </div>
                  <div className="bg-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Publish Date</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Featured</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredArticles.map((article) => {
                          const isScheduled = article.status === 'scheduled' && article.scheduledAt;
                          const scheduledTime = isScheduled ? new Date(article.scheduledAt) : null;
                          const isPastScheduled = scheduledTime && scheduledTime <= new Date();
                          
                          return (
                          <tr key={article.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {/* Image Thumbnail */}
                                {article.image ? (
                                  <img 
                                    src={article.image} 
                                    alt="" 
                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-gray-700"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                                <div>
                                  <Link href={`/insights/${article.slug}`} className="text-white hover:text-indigo-400 font-medium">
                                    {article.title}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-1">
                                    {article.isSample && (
                                      <span className="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">Sample</span>
                                    )}
                                    {article.tags && article.tags.length > 0 && (
                                      <span className="text-xs text-gray-500">{article.tags.length} tags</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                        <td className="p-4 text-gray-400">{article.category}</td>
                        <td className="p-4 text-gray-400">
                          {article.date}
                          {isScheduled && !isPastScheduled && (
                            <div className="text-xs text-yellow-400 mt-1">
                              ⏱ {scheduledTime.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {article.featured && (
                              <span className="px-2 py-1 bg-purple-900/50 text-purple-400 text-xs rounded">★ Featured</span>
                            )}
                            {article.isPremium && (
                              <span className="px-2 py-1 bg-amber-900/50 text-amber-400 text-xs rounded">⭐ Premium</span>
                            )}
                            {!article.featured && !article.isPremium && (
                              <span className="text-gray-500 text-sm">—</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {article.status === 'draft' ? (
                            <span className="px-2 py-1 bg-orange-900/50 text-orange-400 text-xs rounded">Draft</span>
                          ) : isScheduled && !isPastScheduled ? (
                            <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded">Scheduled</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded">Published</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Publish Tab */}
        {activeTab === 'publish' && (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingArticle ? 'Edit Article' : 'Publish New Article'}
              </h2>
              {editingArticle && (
                <button
                  onClick={() => {
                    setEditingArticle(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕ Cancel Edit
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={articleMeta.title}
                  onChange={handleTitleChange}
                  placeholder="Enter article title..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/insights/</span>
                  <input
                    type="text"
                    value={articleMeta.slug}
                    onChange={(e) => setArticleMeta({ ...articleMeta, slug: e.target.value })}
                    placeholder="article-slug"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                <textarea
                  value={articleMeta.excerpt}
                  onChange={(e) => setArticleMeta({ ...articleMeta, excerpt: e.target.value })}
                  placeholder="Brief description of the article..."
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category & Read Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={articleMeta.category}
                    onChange={(e) => setArticleMeta({ ...articleMeta, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AI Regulation">AI Regulation</option>
                    <option value="Payments">Payments</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Gambling">Gambling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={articleMeta.readTime}
                    onChange={(e) => setArticleMeta({ ...articleMeta, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Publication Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Publication Date</label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPublicationDate(new Date().toISOString().split('T')[0])}
                    className="px-3 py-2 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Set a past date to backdate the article, or future for scheduling</p>
              </div>

              {/* OG Image URL for Social Sharing */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Social Share Image URL <span className="text-gray-500 font-normal">(optional)</span></label>
                <input
                  type="url"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-gray-500 text-xs mt-1">External image URL (1200x630px) for LinkedIn/Twitter previews. Leave blank to use category default.</p>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={articleMeta.featured}
                  onChange={(e) => setArticleMeta({ ...articleMeta, featured: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-indigo-500 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-gray-300">Featured article</label>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (Pimlico Taxonomy)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-indigo-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setShowTagSuggestions(e.target.value.trim().length > 0);
                    }}
                    onKeyDown={handleAddTag}
                    onFocus={() => setShowTagSuggestions(tagInput.trim().length > 0)}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    placeholder="Start typing to search tags..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  
                  {/* Live Tag Suggestions Dropdown */}
                  {showTagSuggestions && tagSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      <div className="p-2 text-xs text-gray-500 border-b border-gray-700">
                        {tagSuggestions.length} matching tag{tagSuggestions.length !== 1 ? 's' : ''} found
                      </div>
                      {tagSuggestions.map((suggestion, idx) => {
                        // Find which category this tag belongs to
                        const category = Object.entries(PIMLICO_TAXONOMY).find(([_, values]) => 
                          values.includes(suggestion)
                        )?.[0] || '';
                        
                        return (
                          <button
                            key={suggestion}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectSuggestion(suggestion);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-indigo-900/50 flex items-center justify-between group transition-colors"
                          >
                            <span className="text-white">
                              {/* Highlight matching text */}
                              {suggestion.split(new RegExp(`(${tagInput})`, 'gi')).map((part, i) => 
                                part.toLowerCase() === tagInput.toLowerCase() ? 
                                  <span key={i} className="text-indigo-400 font-semibold">{part}</span> : 
                                  part
                              )}
                            </span>
                            <span className="text-xs text-gray-500 group-hover:text-gray-400 capitalize">
                              {category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  {showTagSuggestions && tagInput.trim() && tagSuggestions.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 text-gray-400 text-sm">
                      No matching tags found. Press Enter to add "{tagInput}" as a custom tag.
                    </div>
                  )}
                </div>
                
                {/* Pimlico Taxonomy Tag Suggestions */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-gray-500 text-xs">Browse by:</label>
                    <select
                      value={selectedTagCategory}
                      onChange={(e) => setSelectedTagCategory(e.target.value)}
                      className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="vertical">Vertical</option>
                      <option value="topic">Topic</option>
                      <option value="category">Category</option>
                      <option value="jurisdiction">Jurisdiction</option>
                      <option value="type">Document Type</option>
                      <option value="stage">Stage</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                    {PIMLICO_TAXONOMY[selectedTagCategory]
                      .filter(tag => !tags.includes(tag))
                      .slice(0, selectedTagCategory === 'jurisdiction' ? 30 : 40)
                      .map((suggestedTag) => (
                      <button
                        key={suggestedTag}
                        type="button"
                        onClick={() => setTags([...tags, suggestedTag])}
                        className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 rounded text-xs transition-colors"
                      >
                        + {suggestedTag}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mt-1.5">
                    {PIMLICO_TAXONOMY[selectedTagCategory].filter(t => !tags.includes(t)).length} tags available in {selectedTagCategory}
                  </p>
                </div>
              </div>

              {/* Premium Content */}
              <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="premium"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="w-4 h-4 rounded bg-gray-800 border-amber-700 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="premium" className="text-amber-300 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium Content
                  </label>
                </div>
                {isPremium && (
                  <div className="ml-7 space-y-4">
                    <div>
                      <label className="block text-sm text-amber-300/80 mb-2">
                        Content shown before paywall: <span className="font-bold text-amber-300">{premiumCutoff}%</span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="75"
                        step="5"
                        value={premiumCutoff}
                        onChange={(e) => setPremiumCutoff(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10% (teaser)</span>
                        <span>75% (almost full)</span>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-amber-200/70">
                      <p className="font-medium text-amber-300 mb-1">Preview:</p>
                      <p>Readers will see the first {premiumCutoff}% of the article, then a paywall with a CTA to try XHS™ for full access.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule Publishing */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="schedule"
                    checked={scheduleEnabled}
                    onChange={(e) => setScheduleEnabled(e.target.checked)}
                    className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-indigo-500 focus:ring-indigo-500"
                  />
                  <label htmlFor="schedule" className="text-gray-300 font-medium">Schedule for later</label>
                </div>
                {scheduleEnabled && (
                  <div className="ml-7">
                    <label className="block text-sm text-gray-400 mb-2">Publish date & time</label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-gray-500 text-xs mt-2">
                      Article will be visible on the insights page after this date/time
                    </p>
                  </div>
                )}
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                <div className="flex items-start gap-4">
                  <label className={`inline-flex items-center gap-2 px-4 py-2 ${isUploading ? 'bg-gray-600 cursor-wait' : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'} text-white rounded-lg transition-colors`}>
                    {isUploading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload Image
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  {articleImage && (
                    <div className="relative">
                      <img src={articleImage} alt="Preview" className="h-20 w-32 object-cover rounded-lg" />
                      <button
                        onClick={() => {
                          setArticleImage('');
                          setOgImageUrl('');
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-400"
                      >
                        ×
                      </button>
                      {articleImage.includes('vercel') && (
                        <span className="absolute -bottom-2 -right-2 px-1.5 py-0.5 bg-green-500 text-white rounded text-xs">✓ Cloud</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-2">Images are uploaded to cloud storage for social sharing. Recommended: 1200×630px</p>
              </div>

              {/* Markdown Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Content</label>
                  <div className="flex items-center gap-2">
                    {/* Mode Toggle */}
                    <div className="flex items-center bg-gray-700 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (editorMode === 'markdown' && markdownContent) {
                            // Convert markdown to HTML when switching to visual
                            const html = markdownToHtml(markdownContent);
                            setHtmlContent(html);
                            // Update visual editor DOM
                            setTimeout(() => {
                              if (editorRef.current) {
                                editorRef.current.innerHTML = html;
                              }
                            }, 50);
                          }
                          setEditorMode('visual');
                        }}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          editorMode === 'visual' 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editorMode === 'visual' && htmlContent) {
                            // Convert HTML to markdown when switching
                            const md = htmlContent
                              .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
                              .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
                              .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
                              .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                              .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                              .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                              .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                              .replace(/<del>(.*?)<\/del>/gi, '~~$1~~')
                              .replace(/<br\s*\/?>/gi, '\n')
                              .replace(/<\/p>/gi, '\n\n')
                              .replace(/<p[^>]*>/gi, '')
                              .replace(/<[^>]+>/g, '');
                            setMarkdownContent(md);
                          }
                          setEditorMode('markdown');
                        }}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          editorMode === 'markdown' 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Markdown
                      </button>
                    </div>
                    
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload .md
                      <input
                        type="file"
                        accept=".md,.markdown,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      disabled={editorMode === 'visual' ? !htmlContent : !markdownContent}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </button>
                  </div>
                </div>
                
                {editorMode === 'visual' ? (
                  <>
                    {/* Visual Rich Text Editor Toolbar */}
                    <div className="bg-gray-800 border border-gray-700 rounded-t-lg p-2 flex flex-wrap gap-1">
                      {/* Headings */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatH1Visual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 1">
                          <span className="text-xs font-bold">H1</span>
                        </button>
                        <button type="button" onClick={formatH2Visual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 2">
                          <span className="text-xs font-bold">H2</span>
                        </button>
                        <button type="button" onClick={formatH3Visual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 3">
                          <span className="text-xs font-bold">H3</span>
                        </button>
                        <button type="button" onClick={formatParagraphVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Paragraph">
                          <span className="text-xs font-bold">P</span>
                        </button>
                      </div>
                      
                      {/* Text Formatting */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatBoldVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Bold (Ctrl+B)">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                        </button>
                        <button type="button" onClick={formatItalicVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Italic (Ctrl+I)">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                        </button>
                        <button type="button" onClick={formatUnderlineVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Underline (Ctrl+U)">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
                        </button>
                        <button type="button" onClick={formatStrikethroughVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Strikethrough">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>
                        </button>
                      </div>
                      
                      {/* Lists */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatBulletListVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Bullet List">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
                        </button>
                        <button type="button" onClick={formatNumberedListVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Numbered List">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                        </button>
                        <button type="button" onClick={formatQuoteVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Quote">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
                        </button>
                      </div>
                      
                      {/* Alignment */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatAlignLeftVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Align Left">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
                        </button>
                        <button type="button" onClick={formatAlignCenterVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Align Center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>
                        </button>
                        <button type="button" onClick={formatAlignRightVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Align Right">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>
                        </button>
                      </div>
                      
                      {/* Indent */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatOutdentVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Decrease Indent">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>
                        </button>
                        <button type="button" onClick={formatIndentVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Increase Indent">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>
                        </button>
                      </div>
                      
                      {/* Insert */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatLinkVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Insert Link">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                        </button>
                        <button type="button" onClick={formatUnlinkVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Remove Link">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11A4.991 4.991 0 002 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z"/></svg>
                        </button>
                        <button type="button" onClick={formatHRVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Horizontal Rule">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 11h16v2H4z"/></svg>
                        </button>
                      </div>
                      
                      {/* Clear Formatting */}
                      <div className="flex items-center">
                        <button type="button" onClick={formatClearVisual} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Clear Formatting">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/></svg>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            if (htmlContent && confirm('Are you sure you want to clear all content?')) {
                              setHtmlContent('');
                              if (editorRef.current) editorRef.current.innerHTML = '';
                            }
                          }} 
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors" 
                          title="Clear All"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Visual Editor (contenteditable) */}
                    <div
                      id="rich-editor"
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => setHtmlContent(e.currentTarget.innerHTML)}
                      onKeyDown={(e) => {
                        // Keyboard shortcuts
                        if (e.ctrlKey || e.metaKey) {
                          if (e.key === 'b') { e.preventDefault(); formatBoldVisual(); }
                          if (e.key === 'i') { e.preventDefault(); formatItalicVisual(); }
                          if (e.key === 'u') { e.preventDefault(); formatUnderlineVisual(); }
                          if (e.key === 'k') { e.preventDefault(); formatLinkVisual(); }
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-gray-300 border-t-0 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 prose max-w-none min-h-[400px] overflow-y-auto"
                      style={{ minHeight: '400px' }}
                      dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color: #9ca3af;">Start writing your article here...</p>' }}
                      onFocus={(e) => {
                        // Clear placeholder on focus
                        if (e.currentTarget.innerHTML.includes('Start writing your article here...')) {
                          e.currentTarget.innerHTML = '<p></p>';
                        }
                      }}
                    />
                    
                    {/* Visual Editor Status Bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-gray-700 border-t-0 rounded-b-lg text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>
                          {htmlContent ? htmlContent.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(w => w).length : 0} words
                        </span>
                        <span>
                          {htmlContent ? htmlContent.replace(/<[^>]+>/g, '').length : 0} characters
                        </span>
                        <span>
                          ~{Math.max(1, Math.ceil((htmlContent ? htmlContent.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(w => w).length : 0) / 200))} min read
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-indigo-400">Visual Editor</span>
                        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Ctrl+B</span>
                        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Ctrl+I</span>
                        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Ctrl+U</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Markdown Editor Toolbar */}
                    <div className="bg-gray-800 border border-gray-700 rounded-t-lg p-2 flex flex-wrap gap-1">
                      {/* Headings */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatH1} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 1">
                          <span className="text-xs font-bold">H1</span>
                        </button>
                        <button type="button" onClick={formatH2} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 2">
                          <span className="text-xs font-bold">H2</span>
                        </button>
                        <button type="button" onClick={formatH3} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 3">
                          <span className="text-xs font-bold">H3</span>
                        </button>
                      </div>
                      
                      {/* Text Formatting */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatBold} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Bold (Ctrl+B)">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                        </button>
                        <button type="button" onClick={formatItalic} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Italic (Ctrl+I)">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                        </button>
                        <button type="button" onClick={formatStrikethrough} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Strikethrough">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>
                        </button>
                      </div>
                      
                      {/* Lists */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatBulletList} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Bullet List">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
                        </button>
                        <button type="button" onClick={formatNumberedList} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Numbered List">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                        </button>
                        <button type="button" onClick={formatQuote} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Quote">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
                        </button>
                      </div>
                      
                      {/* Code */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatCode} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Inline Code">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
                        </button>
                        <button type="button" onClick={formatCodeBlock} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Code Block">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/><rect x="11" y="11" width="2" height="2"/></svg>
                        </button>
                      </div>
                      
                      {/* Insert */}
                      <div className="flex items-center border-r border-gray-600 pr-2 mr-1">
                        <button type="button" onClick={formatLink} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Insert Link">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                        </button>
                        <button type="button" onClick={formatImage} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Insert Image">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                        </button>
                        <button type="button" onClick={formatTable} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Insert Table">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h4v4H7V7zm0 6h4v4H7v-4zm6-6h4v4h-4V7zm0 6h4v4h-4v-4z"/></svg>
                        </button>
                        <button type="button" onClick={formatHorizontalRule} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Horizontal Rule">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 11h16v2H4z"/></svg>
                        </button>
                      </div>
                      
                      {/* Clear */}
                      <div className="flex items-center">
                        <button 
                          type="button" 
                          onClick={() => {
                            if (markdownContent && confirm('Are you sure you want to clear all content?')) {
                              setMarkdownContent('');
                            }
                          }} 
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors" 
                          title="Clear All"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Markdown Editor Textarea */}
                    <textarea
                      id="markdown-editor"
                      value={markdownContent}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      placeholder="## Introduction&#10;&#10;Start writing your article here...&#10;&#10;### Key Points&#10;&#10;- Use the toolbar above for formatting&#10;- Or write Markdown directly&#10;- Preview your article before publishing"
                      rows={20}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 border-t-0 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-y min-h-[400px]"
                      onKeyDown={(e) => {
                        // Keyboard shortcuts
                        if (e.ctrlKey || e.metaKey) {
                          if (e.key === 'b') { e.preventDefault(); formatBold(); }
                          if (e.key === 'i') { e.preventDefault(); formatItalic(); }
                          if (e.key === 'k') { e.preventDefault(); formatLink(); }
                        }
                        // Tab key inserts spaces
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          insertAtCursor('  ');
                        }
                      }}
                    />
                    
                    {/* Markdown Editor Status Bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-gray-700 border-t-0 rounded-b-lg text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>
                          {markdownContent.trim() ? markdownContent.trim().split(/\s+/).length : 0} words
                        </span>
                        <span>
                          {markdownContent.length} characters
                        </span>
                        <span>
                          ~{Math.max(1, Math.ceil((markdownContent.trim() ? markdownContent.trim().split(/\s+/).length : 0) / 200))} min read
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400">Markdown Mode</span>
                        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Ctrl+B</span>
                        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Ctrl+I</span>
                        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Ctrl+K</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={handleSaveDraft}
                  className="px-5 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-semibold flex items-center gap-2"
                >
                  {editingArticle?.status === 'draft' ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Publish Draft
                    </>
                  ) : editingArticle ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Article
                    </>
                  ) : scheduleEnabled ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Schedule Article
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Publish Article
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingArticle(null);
                  }}
                  className="px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
                {editingArticle && (
                  <span className="flex items-center text-sm text-gray-500 ml-2">
                    {editingArticle.status === 'draft' && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Editing draft
                      </span>
                    )}
                    {editingArticle.lastSaved && (
                      <span className="ml-2 text-gray-600">
                        Last saved: {new Date(editingArticle.lastSaved).toLocaleTimeString()}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Marketing Assets Tab */}
        {activeTab === 'marketing' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Controls */}
              <div className="lg:col-span-1 space-y-2">
                {/* Article Selection — collapsible */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setMktgPanelOpen(p => ({...p, article: !p.article}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
                    <h3 className="font-semibold flex items-center gap-2 text-sm"><span>📄</span> Article {marketingArticle ? <span className="text-xs text-indigo-400 font-normal ml-1 truncate max-w-[140px] inline-block align-bottom">— {marketingArticle.title}</span> : null}</h3>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${mktgPanelOpen.article ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mktgPanelOpen.article && (
                    <div className="px-4 pb-3">
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {articles.map(article => (
                          <button
                            key={article.id}
                            type="button"
                            onClick={() => {
                              setMarketingArticle(article);
                              setMarketingTitle(article.title || '');
                              setMarketingSubtitle(article.excerpt || '');
                              // Keep current element settings — don't reset
                              setMktgPanelOpen(p => ({...p, article: false}));
                            }}
                            className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2.5 ${
                              marketingArticle?.id === article.id
                                ? 'bg-indigo-900/50 border border-indigo-500'
                                : 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
                            }`}
                          >
                            {article.image ? (
                              <img src={article.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-gray-600 flex-shrink-0 flex items-center justify-center text-gray-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-white text-xs font-medium truncate">{article.title}</p>
                              <p className="text-gray-400 text-[10px]">{article.category}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Template, Theme, Layout — inline compact row */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setMktgPanelOpen(p => ({...p, template: !p.template}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
                    <h3 className="font-semibold flex items-center gap-2 text-sm"><span>📐</span> Template & Style <span className="text-xs text-gray-400 font-normal">— {MARKETING_TEMPLATES[marketingTemplate].label} · {marketingTheme} · {marketingLayout}</span></h3>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${mktgPanelOpen.template ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mktgPanelOpen.template && (
                    <div className="px-4 pb-4 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Template</label>
                        <select value={marketingTemplate} onChange={(e) => setMarketingTemplate(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
                          {Object.entries(MARKETING_TEMPLATES).map(([key, tmpl]) => (
                            <option key={key} value={key}>{tmpl.icon} {tmpl.label} ({tmpl.width}×{tmpl.height})</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1.5">Theme</label>
                          <select value={marketingTheme} onChange={(e) => setMarketingTheme(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
                            <option value="dark">🌙 Dark</option>
                            <option value="light">☀️ Light</option>
                            <option value="gradient">🌊 Gradient</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1.5">Layout</label>
                          <select value={marketingLayout} onChange={(e) => setMarketingLayout(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
                            <option value="classic">📋 Classic</option>
                            <option value="card">🃏 Card</option>
                            <option value="magazine">📰 Magazine</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Content — collapsible */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setMktgPanelOpen(p => ({...p, text: !p.text}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
                    <h3 className="font-semibold flex items-center gap-2 text-sm"><span>✏️</span> Text Content</h3>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${mktgPanelOpen.text ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mktgPanelOpen.text && (
                    <div className="px-4 pb-4">
                      <label className="block text-xs text-gray-400 mb-1">Title</label>
                      <textarea value={marketingTitle} onChange={(e) => setMarketingTitle(e.target.value)} placeholder="Article title..." rows={2} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none mb-2" />
                      <label className="block text-xs text-gray-400 mb-1">Subtitle</label>
                      <textarea value={marketingSubtitle} onChange={(e) => setMarketingSubtitle(e.target.value)} placeholder="Optional subtitle..." rows={1} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none mb-2" />
                      <label className="block text-xs text-gray-400 mb-1">Call to Action</label>
                      <input type="text" value={marketingCta} onChange={(e) => setMarketingCta(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                    </div>
                  )}
                </div>

                {/* Font Settings — collapsible */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setMktgPanelOpen(p => ({...p, font: !p.font}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
                    <h3 className="font-semibold flex items-center gap-2 text-sm"><span>🔤</span> Font Settings <span className="text-xs text-gray-400 font-normal">— {FONT_OPTIONS[marketingFont]?.label}, {marketingFontWeight}, {marketingFontSize}%</span></h3>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${mktgPanelOpen.font ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mktgPanelOpen.font && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Family</label>
                          <select value={marketingFont} onChange={(e) => setMarketingFont(e.target.value)} className="w-full px-2 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
                            {Object.entries(FONT_OPTIONS).map(([key, opt]) => (<option key={key} value={key}>{opt.label}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Weight</label>
                          <select value={marketingFontWeight} onChange={(e) => setMarketingFontWeight(e.target.value)} className="w-full px-2 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
                            <option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extra Bold</option><option value="900">Black</option>
                          </select>
                        </div>
                      </div>
                      <label className="block text-xs text-gray-400 mb-1">Size: {marketingFontSize}%</label>
                      <input type="range" min="60" max="150" value={marketingFontSize} onChange={(e) => setMarketingFontSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                  )}
                </div>

                {/* Element Controls — collapsible */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setMktgPanelOpen(p => ({...p, elements: !p.elements}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
                    <h3 className="font-semibold flex items-center gap-2 text-sm">
                      <span>🎛️</span> Elements
                      <span className="text-xs text-gray-400 font-normal">— {Object.values(marketingElements).filter(e => e.visible !== false).length}/{Object.keys(marketingElements).length} on</span>
                    </h3>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${mktgPanelOpen.elements ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mktgPanelOpen.elements && (
                    <div className="px-4 pb-4 space-y-2 border-t border-gray-700">
                      {/* Quick mode toggles */}
                      <div className="flex gap-1.5 pt-2">
                        <button type="button" onClick={() => setMarketingElements({...DEFAULT_ELEMENTS})}
                          className="flex-1 py-1.5 text-[10px] font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/50 transition-colors">
                          ✦ All On
                        </button>
                        <button type="button" onClick={() => setMarketingElements({...MINIMAL_ELEMENTS})}
                          className="flex-1 py-1.5 text-[10px] font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/40 transition-colors">
                          ◐ Minimal
                        </button>
                        <button type="button" onClick={() => setMarketingElements({...BLANK_ELEMENTS})}
                          className="flex-1 py-1.5 text-[10px] font-semibold bg-gray-600/30 text-gray-300 border border-gray-500/30 rounded-lg hover:bg-gray-600/50 transition-colors">
                          ○ Blank
                        </button>
                      </div>
                      {/* Element list */}
                      {[
                        { key: 'image', label: '🖼️ Image', hasScale: true, hasOpacity: true },
                        { key: 'title', label: '📝 Title', hasScale: true, hasOpacity: true },
                        { key: 'subtitle', label: '📄 Subtitle', hasOpacity: true },
                        { key: 'badge', label: '🏷️ Category', hasScale: true, hasOpacity: true },
                        { key: 'pimlicoLogo', label: '🏢 Pimlico Logo', hasScale: true, hasOpacity: true },
                        { key: 'xhsLogo', label: '🔷 XHS Logo', hasScale: true, hasOpacity: true },
                        { key: 'cta', label: '🔗 CTA', hasScale: true, hasOpacity: true },
                        { key: 'bottomBar', label: '▬ Bottom Bar', hasHeight: true, hasOpacity: true },
                        { key: 'accentLine', label: '━ Accent Line', hasOpacity: true, hasWidth: true },
                        { key: 'premiumTag', label: '⭐ Premium Tag', hasScale: true, hasOpacity: true },
                      ].map(item => {
                        const isVisible = marketingElements[item.key]?.visible !== false;
                        const hasMoved = marketingElements[item.key]?.dx || marketingElements[item.key]?.dy;
                        return (
                        <div key={item.key} className={`rounded-lg transition-all ${isVisible ? 'bg-gray-700/40 border border-gray-600/50' : 'bg-gray-800/50 border border-gray-700/30'}`}>
                          <div className="flex items-center justify-between px-2.5 py-1.5">
                            <button
                              type="button"
                              onClick={() => setMarketingElements(prev => ({...prev, [item.key]: {...prev[item.key], visible: !isVisible}}))}
                              className={`flex items-center gap-2 text-[11px] font-semibold transition-colors ${isVisible ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                              <span className={`w-2 h-2 rounded-full ${isVisible ? 'bg-green-400' : 'bg-gray-600'}`} />
                              {item.label}
                            </button>
                            <div className="flex items-center gap-1">
                              {hasMoved ? (
                                <button type="button" title="Reset position" onClick={() => setMarketingElements(prev => ({...prev, [item.key]: {...prev[item.key], dx: 0, dy: 0}}))} className="p-0.5 text-gray-500 hover:text-yellow-400 transition-colors">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                              ) : null}
                              <button
                                type="button"
                                title={isVisible ? 'Remove from canvas' : 'Add to canvas'}
                                onClick={() => setMarketingElements(prev => ({...prev, [item.key]: {...prev[item.key], visible: !isVisible}}))}
                                className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-colors ${
                                  isVisible
                                    ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
                                    : 'text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:text-green-300'
                                }`}
                              >
                                {isVisible ? '✕' : '+ ADD'}
                              </button>
                            </div>
                          </div>
                          {isVisible && (
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-2.5 pb-2">
                            {item.hasScale && (
                              <div>
                                <label className="text-[10px] text-gray-500">Scale {marketingElements[item.key]?.scale ?? 100}%</label>
                                <input type="range" min="30" max="200" value={marketingElements[item.key]?.scale ?? 100}
                                  onChange={(e) => setMarketingElements(prev => ({ ...prev, [item.key]: { ...prev[item.key], scale: parseInt(e.target.value) } }))}
                                  className="w-full accent-indigo-500 h-1" />
                              </div>
                            )}
                            {item.hasOpacity && (
                              <div>
                                <label className="text-[10px] text-gray-500">Opacity {marketingElements[item.key]?.opacity ?? 100}%</label>
                                <input type="range" min="0" max="100" value={marketingElements[item.key]?.opacity ?? 100}
                                  onChange={(e) => setMarketingElements(prev => ({ ...prev, [item.key]: { ...prev[item.key], opacity: parseInt(e.target.value) } }))}
                                  className="w-full accent-indigo-500 h-1" />
                              </div>
                            )}
                            {item.hasHeight && (
                              <div>
                                <label className="text-[10px] text-gray-500">Height {marketingElements[item.key]?.height ?? 100}%</label>
                                <input type="range" min="30" max="200" value={marketingElements[item.key]?.height ?? 100}
                                  onChange={(e) => setMarketingElements(prev => ({ ...prev, [item.key]: { ...prev[item.key], height: parseInt(e.target.value) } }))}
                                  className="w-full accent-indigo-500 h-1" />
                              </div>
                            )}
                            {item.hasWidth && (
                              <div>
                                <label className="text-[10px] text-gray-500">Width {marketingElements[item.key]?.width ?? 100}%</label>
                                <input type="range" min="20" max="300" value={marketingElements[item.key]?.width ?? 100}
                                  onChange={(e) => setMarketingElements(prev => ({ ...prev, [item.key]: { ...prev[item.key], width: parseInt(e.target.value) } }))}
                                  className="w-full accent-indigo-500 h-1" />
                              </div>
                            )}
                          </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Presets — save/load settings */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setMktgPanelOpen(p => ({...p, presets: !p.presets}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
                    <h3 className="font-semibold flex items-center gap-2 text-sm"><span>💾</span> Presets {Object.keys(marketingPresets).length > 0 && <span className="text-xs text-gray-400 font-normal">— {Object.keys(marketingPresets).length} saved</span>}</h3>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${mktgPanelOpen.presets ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mktgPanelOpen.presets && (
                    <div className="px-4 pb-4 space-y-2 border-t border-gray-700">
                      {/* Save new preset */}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={presetName}
                          onChange={(e) => setPresetName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && presetName.trim()) saveMarketingPreset(presetName); }}
                          placeholder="Preset name..."
                          className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => saveMarketingPreset(presetName)}
                          disabled={!presetName.trim()}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          💾 Save
                        </button>
                      </div>
                      {/* Saved presets list */}
                      {Object.keys(marketingPresets).length > 0 ? (
                        <div className="space-y-1 max-h-36 overflow-y-auto">
                          {Object.entries(marketingPresets).map(([name, preset]) => (
                            <div key={name} className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-white font-medium truncate">{name}</div>
                                <div className="text-[10px] text-gray-400">{preset.layout} · {preset.theme} · {preset.template}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => loadMarketingPreset(name)}
                                className="px-2 py-1 bg-indigo-600/80 text-white text-[10px] font-medium rounded hover:bg-indigo-500 transition-colors"
                              >
                                Load
                              </button>
                              <button
                                type="button"
                                onClick={() => { if (confirm(`Delete preset "${name}"?`)) deleteMarketingPreset(name); }}
                                className="px-1.5 py-1 text-red-400 hover:text-red-300 text-xs transition-colors"
                                title="Delete preset"
                              >
                                🗑
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-500 text-center py-2">No presets saved yet. Adjust your settings then save a preset.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={generateMarketingAsset}
                  disabled={!marketingArticle || marketingLoading}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {marketingLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Generating...
                    </>
                  ) : (
                    <>🖼️ Generate Asset</>
                  )}
                </button>
              </div>

              {/* Right: Canvas Preview */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <span>👁️</span> Preview
                      {marketingArticle && (
                        <span className="text-gray-400 text-sm font-normal">
                          — {MARKETING_TEMPLATES[marketingTemplate].label} ({MARKETING_TEMPLATES[marketingTemplate].width}×{MARKETING_TEMPLATES[marketingTemplate].height})
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2">
                      {marketingArticle && (
                        <button
                          type="button"
                          onClick={() => setMarketingElements({...DEFAULT_ELEMENTS})}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          ↺ Reset Layout
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={downloadMarketingAsset}
                        disabled={!marketingArticle}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download PNG
                      </button>
                    </div>
                  </div>
                  
                  {!marketingArticle ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                      <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg font-medium mb-1">Select an article to get started</p>
                      <p className="text-sm">Choose an article, pick a template, then generate your asset</p>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <canvas
                        ref={marketingCanvasRef}
                        className={`max-w-full h-auto rounded-lg border border-gray-700 shadow-xl ${marketingDragTarget ? 'cursor-grabbing' : 'cursor-grab'}`}
                        style={{ maxHeight: '65vh' }}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                      />
                    </div>
                  )}
                  
                  {marketingArticle && (
                    <p className="mt-3 text-xs text-gray-500">💡 Start Blank and add elements, or use All On. Drag to reposition. Canvas updates live. Settings auto-saved between sessions.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Post Text Generator */}
            {marketingArticle && (
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span>📝</span> Post Text for {MARKETING_TEMPLATES[marketingTemplate].label}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={generatePostText}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                      ✨ Generate Post Text
                    </button>
                    {marketingPostText && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(marketingPostText);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        📋 Copy
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  value={marketingPostText}
                  onChange={(e) => setMarketingPostText(e.target.value)}
                  placeholder="Click 'Generate Post Text' to create a ready-to-post caption for this platform..."
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-y font-mono leading-relaxed"
                />
                {marketingPostText && (
                  <p className="mt-2 text-xs text-gray-500">
                    {marketingPostText.length} characters • Edit the text above to customise before copying
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Markdown Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Article Preview</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">Preview Mode</span>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Exit Preview
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {articleImage && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img src={articleImage} alt={articleMeta.title} className="w-full h-auto object-cover" />
                  </div>
                )}
                {articleMeta.title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{articleMeta.title}</h1>
                )}
                {articleMeta.excerpt && (
                  <p className="text-xl text-gray-600 mb-6">{articleMeta.excerpt}</p>
                )}
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}
                <div className="prose prose-lg max-w-none">
                  {editorMode === 'visual' ? (
                    <div 
                      className="article-content [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-8 [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:text-gray-600 [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-justify [&>ul]:list-disc [&>ul]:list-inside [&>ul]:text-gray-600 [&>ul]:mb-4 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:text-gray-600 [&>ol]:mb-4 [&>ol]:space-y-2 [&_strong]:text-gray-900 [&_strong]:font-semibold [&_a]:text-blue-600 [&_a:hover]:text-blue-500 [&_a]:underline [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-500 [&>blockquote]:my-4 [&>hr]:border-gray-200 [&>hr]:my-8"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  ) : (
                    <ReactMarkdown
                      components={{
                        h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                        h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>,
                        h4: ({children}) => <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h4>,
                        p: ({children}) => <p className="text-gray-600 mb-4 leading-relaxed text-justify">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2 ml-4">{children}</ol>,
                        li: ({children}) => <li className="text-gray-600">{children}</li>,
                        strong: ({children}) => <strong className="text-gray-900 font-semibold">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>,
                        a: ({href, children}) => <a href={href} className="text-blue-600 hover:text-blue-500 underline">{children}</a>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-500 my-4">{children}</blockquote>,
                        code: ({inline, children}) => inline 
                          ? <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-700">{children}</code>
                          : <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code className="text-sm text-gray-800">{children}</code></pre>,
                        pre: ({children}) => <div className="my-4">{children}</div>,
                        hr: () => <hr className="border-gray-200 my-8" />,
                        table: ({children}) => <table className="w-full border-collapse my-6">{children}</table>,
                        thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                        tbody: ({children}) => <tbody>{children}</tbody>,
                        tr: ({children}) => <tr className="border-b border-gray-200">{children}</tr>,
                        th: ({children}) => <th className="border border-gray-200 px-4 py-2 bg-gray-50 text-gray-900 text-left font-semibold">{children}</th>,
                        td: ({children}) => <td className="border border-gray-200 px-4 py-2 text-gray-600">{children}</td>,
                        img: ({src, alt}) => <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" />,
                      }}
                    >
                      {markdownContent}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-500">Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700 font-mono text-xs">Esc</kbd> or click outside to close</p>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
                >
                  ← Back to Editor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
