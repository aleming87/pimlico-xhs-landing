"use client";

// Admin Console for XHS Articles Management
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { sampleArticles as baseSampleArticles } from '@/data/sample-articles';

// Simple password protection - change this password
const ADMIN_PASSWORD = "pimlico2026";

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
  const [htmlContent, setHtmlContent] = useState(''); // Store visual editor content as HTML
  
  // Rich text editor ref
  const editorRef = useRef(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');

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

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
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
        setMarkdownContent(event.target.result);
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
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                
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
                            // Convert markdown to basic HTML when switching to visual
                            const html = markdownContent
                              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/~~(.*?)~~/g, '<del>$1</del>')
                              .replace(/\n/g, '<br>');
                            setHtmlContent(html);
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
