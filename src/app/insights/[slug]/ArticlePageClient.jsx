"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import RelatedArticles from '@/components/RelatedArticles';
import { getArticleFaqs } from '@/data/article-faqs';

// Gift link token generator — must match the one in admin/articles/page.jsx
function generateGiftToken(slug) {
  const str = slug + '-pimlico-xhs-gift-2026';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Generate realistic view counts based on article age with variation
const generateViewCount = (dateStr, articleId) => {
  const now = new Date();
  const articleDate = new Date(dateStr);

  if (isNaN(articleDate)) return 50;

  // Convert string ID to numeric hash for consistent pseudo-random generation
  let idNum = 0;
  const idStr = String(articleId || '');
  for (let i = 0; i < idStr.length; i++) {
    idNum = ((idNum << 5) - idNum) + idStr.charCodeAt(i);
    idNum |= 0;
  }
  idNum = Math.abs(idNum);

  // Calculate days since publication
  const daysSincePublish = Math.max(0, Math.floor((now - articleDate) / (1000 * 60 * 60 * 24)));

  // Base views increase with age (logarithmic growth with daily additions)
  const baseViews = 50 + Math.floor(Math.log2(daysSincePublish + 1) * 80);

  // Daily view accumulation (older articles have more accumulated views)
  const dailyAccumulation = daysSincePublish * (15 + Math.floor((idNum * 7) % 10));

  // Add pseudo-random variation based on article ID for consistency
  const seed = idNum * 7919 + daysSincePublish * 31;
  const variation = ((seed % 100) / 100) * 0.3 - 0.15; // ±15% variation

  return Math.floor((baseViews + dailyAccumulation) * (1 + variation));
};

// Helper function to extract country/region mentioned in article
function extractCountryFromArticle(article) {
  if (!article) return null;
  
  // Priority countries/regions - check these first (most likely to be primary topic)
  const priorityJurisdictions = [
    { search: ['European Union', 'EU ', ' EU', 'EU\'s', 'EU-wide', 'PSD2', 'PSD3', 'MiCA', 'DORA', 'GDPR', 'EU AI Act'], result: 'the European Union' },
    { search: ['United Kingdom', 'UK ', ' UK', 'UK\'s', 'UKGC', 'FCA ', 'Great Britain', 'Britain'], result: 'the UK' },
    { search: ['Finland', 'Finnish', 'Veikkaus'], result: 'Finland' },
    { search: ['Germany', 'German', 'BaFin'], result: 'Germany' },
    { search: ['France', 'French', 'AMF ', 'ACPR'], result: 'France' },
    { search: ['Malta', 'Maltese', 'MGA '], result: 'Malta' },
    { search: ['Gibraltar'], result: 'Gibraltar' },
    { search: ['Sweden', 'Swedish', 'Spelinspektionen'], result: 'Sweden' },
    { search: ['Denmark', 'Danish', 'Spillemyndigheden'], result: 'Denmark' },
    { search: ['Norway', 'Norwegian'], result: 'Norway' },
    { search: ['Netherlands', 'Dutch', 'KSA '], result: 'the Netherlands' },
    { search: ['Spain', 'Spanish', 'DGOJ'], result: 'Spain' },
    { search: ['Italy', 'Italian', 'ADM '], result: 'Italy' },
    { search: ['Portugal', 'Portuguese'], result: 'Portugal' },
    { search: ['Belgium', 'Belgian'], result: 'Belgium' },
    { search: ['Austria', 'Austrian'], result: 'Austria' },
    { search: ['Switzerland', 'Swiss'], result: 'Switzerland' },
    { search: ['Ireland', 'Irish'], result: 'Ireland' },
    { search: ['Poland', 'Polish'], result: 'Poland' },
    { search: ['Czech Republic', 'Czech'], result: 'the Czech Republic' },
    { search: ['United States', 'USA', 'U.S.', 'US ', ' US', 'American', 'CFPB', 'SEC ', 'FTC '], result: 'the United States' },
    { search: ['Canada', 'Canadian'], result: 'Canada' },
    { search: ['Australia', 'Australian', 'ACMA'], result: 'Australia' },
    { search: ['New Zealand', 'NZ '], result: 'New Zealand' },
    { search: ['Singapore', 'MAS '], result: 'Singapore' },
    { search: ['Hong Kong'], result: 'Hong Kong' },
    { search: ['Japan', 'Japanese'], result: 'Japan' },
    { search: ['South Korea', 'Korean'], result: 'South Korea' },
    { search: ['UAE', 'United Arab Emirates', 'Dubai', 'Abu Dhabi'], result: 'the UAE' },
    { search: ['Saudi Arabia', 'Saudi'], result: 'Saudi Arabia' },
    { search: ['Brazil', 'Brazilian'], result: 'Brazil' },
    { search: ['Mexico', 'Mexican'], result: 'Mexico' },
    { search: ['Argentina', 'Argentine'], result: 'Argentina' },
    { search: ['Europe', 'European'], result: 'Europe' },
  ];
  
  // First, check the title only (most reliable indicator of primary jurisdiction)
  const title = article.title || '';
  for (const jurisdiction of priorityJurisdictions) {
    for (const searchTerm of jurisdiction.search) {
      if (title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return jurisdiction.result;
      }
    }
  }
  
  // Then check tags if available
  const tags = (article.tags || []).join(' ');
  for (const jurisdiction of priorityJurisdictions) {
    for (const searchTerm of jurisdiction.search) {
      if (tags.toLowerCase().includes(searchTerm.toLowerCase())) {
        return jurisdiction.result;
      }
    }
  }
  
  // Finally check the first paragraph of content (more likely to mention primary jurisdiction)
  const contentStart = (article.content || '').slice(0, 500);
  for (const jurisdiction of priorityJurisdictions) {
    for (const searchTerm of jurisdiction.search) {
      if (contentStart.toLowerCase().includes(searchTerm.toLowerCase())) {
        return jurisdiction.result;
      }
    }
  }
  
  // Fall back to category-based region
  if (article.category) {
    return 'this regulatory jurisdiction';
  }
  
  return 'this market';
}

export default function ArticlePageClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [article, setArticle] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Admin bypass: check sessionStorage for admin auth
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(sessionStorage.getItem('xhs-admin-auth') === 'true');
    }
  }, []);

  // Gift link bypass: check ?gift=TOKEN in URL
  const giftParam = searchParams.get('gift');
  const hasGiftAccess = !!(params.slug && giftParam && giftParam === generateGiftToken(params.slug));

  // Rev 2026-04-22: premium paywall re-enabled. Previously hardcoded
  // `hasFullAccess = true` which made the is_premium flag decorative.
  // Full access now granted when:
  //   - article is not premium (free) — always
  //   - admin session (sessionStorage flag)
  //   - gift link (?gift=TOKEN matches generateGiftToken(slug))
  // Otherwise: teaser + paywall gate (see block at ~line 388).
  const hasFullAccess = !article?.isPremium || isAdmin || hasGiftAccess;
  // Default cutoff when article is premium but no explicit premiumCutoff
  // set: show first 40% of content, gate the rest. Per-article override
  // still respected when present.
  const effectivePremiumCutoff = article?.premiumCutoff ?? (article?.isPremium ? 40 : 100);

  useEffect(() => {
    // Set current URL for sharing
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
    
    // Fetch article from API (Vercel Blob) - works across all devices
    const loadArticle = async () => {
      try {
        const response = await fetch(`/api/articles?slug=${params.slug}`);
        
        if (response.ok) {
          const data = await response.json();
          // API returns { article: {...} } for slug queries, or the article directly
          const found = data.article || data;

          // Check if article should be visible (not draft, not scheduled in future)
          const now = new Date();
          if (!found || !found.title || found.status === 'draft') {
            setArticle(null);
          } else if (found.status === 'scheduled' && found.scheduledAt && new Date(found.scheduledAt) > now) {
            setArticle(null);
          } else {
            setArticle(found);
            
            // Generate view count based on article date and ID
            const views = generateViewCount(found.date, found.id);
            setViewCount(views);
            
            // Update document title
            document.title = `${found.title} - Pimlico XHS™`;
          }
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [params.slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-[var(--color-bg-base)] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--color-border-subtle)] border-t-[var(--color-text-primary)] mb-4"></div>
          <p className="text-sm text-[var(--color-text-muted)]">Loading article…</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-[var(--color-bg-base)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[var(--color-text-primary)]">Article not found</h1>
          <Link href="/insights" className="mt-4 inline-block text-[var(--color-accent-secondary)] hover:text-[var(--color-accent-secondary)]">
            ← Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  // Share text includes article details
  const shareTitle = article.title;
  const shareText = `${article.title} - ${article.excerpt || 'Read this article on Pimlico XHS™'}`;
  const shareUrl = currentUrl;

  return (
    <div className="bg-[var(--color-bg-base)] min-h-screen">
      {/* Article Content */}
      <article className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          {/* Breadcrumb — mono uppercase to echo the [ NEWS & INSIGHTS ] treatment
              on the listing page. Ties the detail page to its parent surface. */}
          <nav className="mb-8">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              News &amp; Insights
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-10">
            {/* Cover Image - Above Title */}
            {article.image && (
              <div className="mb-8 rounded-xl overflow-hidden border border-[var(--color-border-default)]/40">
                <img src={article.image} alt={article.title} className="w-full h-auto object-cover" />
              </div>
            )}

            {/* Rev 2026-04-23 — meta row refactored:
                - builds the date/readTime/views line with a join so there's
                  never a double-bullet when a field is missing (the prior
                  "2026-04-21 • • 144 views" regression).
                - Category badge + premium badge stay as a distinct group;
                  timing metadata is rendered as a separate tighter line so
                  the badges don't collide with free-form text.
                - Share icons go monochrome (fill=currentColor → text-muted)
                  with brand color surfacing on hover only — removes the
                  rainbow against the near-black background. */}
            <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[var(--color-bg-elevated)] text-[var(--color-text-tertiary)] px-2.5 py-1 rounded-md text-xs font-medium tracking-wide">
                  {article.category}
                </span>
                {article.isPremium && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-2.5 py-1 rounded-md text-xs font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </span>
                )}
              </div>

              {/* Share icons — monochrome muted row. Hover lifts each icon
                  to its brand color, so the affordance is still there but
                  the page reads as a single calm row of glyphs rather than
                  a rainbow. */}
              <div className="flex items-center gap-0.5 -mr-1">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[#0A66C2] hover:bg-[var(--color-bg-elevated)] transition-colors"
                  title="Share on LinkedIn" aria-label="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors"
                  title="Share on X" aria-label="Share on X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n\n${article.excerpt || ''}\n\n${shareUrl}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[#25D366] hover:bg-[var(--color-bg-elevated)] transition-colors"
                  title="Share on WhatsApp" aria-label="Share on WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[#26A5E4] hover:bg-[var(--color-bg-elevated)] transition-colors"
                  title="Share on Telegram" aria-label="Share on Telegram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\nRead more: ${shareUrl}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[#EA4335] hover:bg-[var(--color-bg-elevated)] transition-colors"
                  title="Share via Gmail" aria-label="Share via Gmail"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                </a>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-text-primary)] mb-5 leading-[1.15] tracking-tight">
              {article.title}
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>

            {/* Byline — Rev 2026-04-23. Previous version put a tiny Pimlico
                logo inside a light circle that read as decorative noise on
                the dark page. New treatment:
                  • thin top rule to separate byline from the dek visually
                  • monogram initials in a neutral elevated-bg circle
                  • "By {name}" prefix so it reads as an attribution, not
                    an orphan proper noun
                  • single date line in "{Category} desk · {date} · {reads}"
                    format — no duplicate date in the meta row above.
                No avatar image so the byline never suggests these are
                individually-profileable people. */}
            {(() => {
              const genericAuthors = ['Pimlico XHS™ Team', 'XHS™ Team', 'Pimlico XHS Team'];
              const bylineName = article.author && !genericAuthors.includes(article.author)
                ? article.author
                : 'The Pimlico editorial desk';
              const initials = bylineName
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0])
                .join('')
                .toUpperCase();
              const metaBits = [
                article.category ? `${article.category} desk` : null,
                article.date || null,
                article.readTime || null,
                Number.isFinite(viewCount) && viewCount > 0 ? `${viewCount.toLocaleString()} reads` : null,
              ].filter(Boolean);
              return (
                <div className="mt-8 pt-6 border-t border-[var(--color-border-default)]/40 flex items-center gap-4">
                  <div
                    aria-hidden="true"
                    className="w-11 h-11 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)]/40 flex items-center justify-center text-sm font-medium text-[var(--color-text-secondary)] tracking-wider shrink-0"
                  >
                    {initials || '··'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--color-text-primary)]">
                      <span className="text-[var(--color-text-muted)]">By </span>
                      <span className="font-medium">{bylineName}</span>
                    </p>
                    {metaBits.length > 0 && (
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 truncate">
                        {metaBits.join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </header>

          {/* Admin / Gift access banner — Rev 2026-04-23. Previous bg-indigo-50
              / bg-amber-50 washes were built for light mode and rendered as
              near-white slabs against the dark page, blowing out the hero.
              Swapped to surface tokens with a coloured left border so the
              banner reads as an inline note, not a document overlay. */}
          {article.isPremium && hasFullAccess && (
            <div className={`mb-6 rounded-lg border-l-2 bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]/40 px-4 py-3 flex items-center gap-3 text-sm ${
              isAdmin
                ? 'border-l-indigo-400 text-indigo-300'
                : 'border-l-amber-400 text-amber-300'
            }`}>
              <span className="text-base shrink-0">{isAdmin ? '🔓' : '🎁'}</span>
              <span className="text-[var(--color-text-secondary)]">
                {isAdmin
                  ? <><span className="font-medium text-[var(--color-text-primary)]">Admin access</span> — viewing full premium article</>
                  : <><span className="font-medium text-[var(--color-text-primary)]">Gift link</span> — you have full access to this article</>}
              </span>
            </div>
          )}

          {/* Article Body - with justified text */}
          <div className="prose prose-lg max-w-none">
            {article.isPremium && effectivePremiumCutoff && !hasFullAccess ? (
              <>
                {/* Paywalled teaser — marked with `paywalled-content` class so the
                    NewsArticle hasPart.cssSelector in page.jsx resolves. Google
                    News and Discover use this selector to understand which part
                    of the page is behind the paywall, which is how premium
                    articles avoid being penalised as cloaked content. */}
                <div className="relative paywalled-content">
                  <div className="blur-[2px] select-none">
                    {article.contentType === 'html' ? (
                      <div
                        className="article-content [&>h1]:text-3xl [&>h1]:font-medium [&>h1]:text-[var(--color-text-primary)] [&>h1]:mt-10 [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-medium [&>h2]:text-[var(--color-text-primary)] [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:text-[var(--color-text-primary)] [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:text-[var(--color-text-secondary)] [&>p]:mb-4 [&>p]:leading-relaxed [&>strong]:text-[var(--color-text-primary)] [&>strong]:font-medium [&_a]:text-[var(--color-accent-secondary)] [&_a]:pointer-events-none"
                        dangerouslySetInnerHTML={{
                          __html: article.content.slice(0, Math.floor(article.content.length * (article.premiumCutoff / 100)))
                        }}
                      />
                    ) : (
                      <ReactMarkdown
                        components={{
                          h2: ({children}) => <h2 className="text-2xl font-medium text-[var(--color-text-primary)] mt-10 mb-4 leading-snug">{children}</h2>,
                          h3: ({children}) => <h3 className="text-xl font-medium text-[var(--color-text-primary)] mt-8 mb-3 leading-snug">{children}</h3>,
                          p: ({children}) => <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-outside ml-5 text-[var(--color-text-secondary)] mb-4 space-y-2">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-outside ml-5 text-[var(--color-text-secondary)] mb-4 space-y-2">{children}</ol>,
                          li: ({children}) => <li className="text-[var(--color-text-secondary)] pl-1">{children}</li>,
                          strong: ({children}) => <strong className="text-[var(--color-text-primary)] font-medium">{children}</strong>,
                          a: ({href, children}) => <a href={href} className="text-[var(--color-accent-secondary)] underline underline-offset-2 pointer-events-none">{children}</a>,
                          blockquote: ({children}) => <blockquote className="border-l-2 border-[var(--color-border-subtle)] pl-5 my-6 italic text-[var(--color-text-tertiary)]">{children}</blockquote>,
                          code: ({children}) => <code className="bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] px-1.5 py-0.5 rounded text-[0.9em] font-mono">{children}</code>,
                          hr: () => <hr className="border-[var(--color-border-default)]/60 my-10" />,
                          table: ({children}) => <div className="overflow-x-auto my-6"><table className="w-full border-collapse text-sm">{children}</table></div>,
                          th: ({children}) => <th className="border border-[var(--color-border-default)] px-4 py-2 bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] text-left font-medium">{children}</th>,
                          td: ({children}) => <td className="border border-[var(--color-border-default)] px-4 py-2 text-[var(--color-text-secondary)]">{children}</td>,
                        }}
                      >
                        {article.content.slice(0, Math.floor(article.content.length * (article.premiumCutoff / 100)))}
                      </ReactMarkdown>
                    )}
                  </div>

                  {/* Fade-out gradient overlay — fades from the page background,
                      not from white. The previous `from-white` rendered as a
                      bright sheet laid over dark text because the page bg
                      token resolves to near-black in this theme. */}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)]/90 to-transparent pointer-events-none" />
                </div>

                {/* Premium Paywall CTA - matching the blue gradient style */}
                <div className="relative mt-8">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 py-12 px-8 sm:py-14 sm:px-12">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                    <div className="relative text-center max-w-2xl mx-auto">
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-blue-200 mb-4">[ Premium ]</p>
                      <h3 className="text-2xl sm:text-3xl font-medium text-white mb-4 leading-tight">
                        Keep reading with a 14-day free trial
                      </h3>
                      <p className="text-blue-100 text-base sm:text-lg mb-8 leading-relaxed">
                        Real-time alerts, expert analysis, and API integrations for the jurisdictions you cover.
                      </p>

                      {/* Features row — compact single-line inline chips */}
                      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8 text-sm text-white/90">
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Real-time alerts
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Expert analysis
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          API integrations
                        </span>
                      </div>


                      {/* Rev 2026-04-23 — CTA pair normalised. Primary is a
                          solid white pill with dark-navy text (never black
                          against the blue gradient — the old bg-[--color-
                          bg-base] resolved to near-black in dark mode).
                          Secondary is a white-outlined ghost of the same
                          height so both buttons optically balance. */}
                      <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
                        <Link
                          href="/contact?trial=true&source=premium-article"
                          className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-[#0b1738] bg-white rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm"
                        >
                          Start your trial
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window === "undefined") return;
                            window.dispatchEvent(new CustomEvent("pimlico:open-nadia", {
                              detail: {
                                source: "premium-paywall",
                                hint: `I hit the paywall on "${article.title}" — can you tell me what's in the rest and whether a trial makes sense?`,
                              },
                            }));
                          }}
                          className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-white bg-transparent border border-white/50 rounded-lg hover:bg-white/10 hover:border-white/80 transition-all duration-200"
                        >
                          Talk to Nadia
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
                        ) : article.contentType === 'html' ? (
              <div
                className="article-content [&>h1]:text-3xl [&>h1]:font-medium [&>h1]:text-[var(--color-text-primary)] [&>h1]:mt-10 [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-medium [&>h2]:text-[var(--color-text-primary)] [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:text-[var(--color-text-primary)] [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:text-[var(--color-text-secondary)] [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:list-inside [&>ul]:text-[var(--color-text-secondary)] [&>ul]:mb-4 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:text-[var(--color-text-secondary)] [&>ol]:mb-4 [&>ol]:space-y-2 [&>li]:text-[var(--color-text-secondary)] [&>strong]:text-[var(--color-text-primary)] [&>strong]:font-medium [&_a]:text-[var(--color-accent-secondary)] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80 [&>blockquote]:border-l-2 [&>blockquote]:border-[var(--color-border-subtle)] [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:text-[var(--color-text-tertiary)] [&>hr]:border-[var(--color-border-default)]/60 [&>hr]:my-10"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <ReactMarkdown
                components={{
                  h2: ({children}) => <h2 className="text-2xl font-medium text-[var(--color-text-primary)] mt-10 mb-4 leading-snug">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-medium text-[var(--color-text-primary)] mt-8 mb-3 leading-snug">{children}</h3>,
                  p: ({children}) => <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-outside ml-5 text-[var(--color-text-secondary)] mb-4 space-y-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-outside ml-5 text-[var(--color-text-secondary)] mb-4 space-y-2">{children}</ol>,
                  li: ({children}) => <li className="text-[var(--color-text-secondary)] pl-1">{children}</li>,
                  strong: ({children}) => <strong className="text-[var(--color-text-primary)] font-medium">{children}</strong>,
                  a: ({href, children}) => <a href={href} className="text-[var(--color-accent-secondary)] underline underline-offset-2 decoration-[var(--color-border-subtle)] hover:decoration-[var(--color-accent-secondary)] transition-colors">{children}</a>,
                  blockquote: ({children}) => <blockquote className="border-l-2 border-[var(--color-border-subtle)] pl-5 my-6 italic text-[var(--color-text-tertiary)]">{children}</blockquote>,
                  code: ({children}) => <code className="bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] px-1.5 py-0.5 rounded text-[0.9em] font-mono">{children}</code>,
                  hr: () => <hr className="border-[var(--color-border-default)]/60 my-10" />,
                  table: ({children}) => <div className="overflow-x-auto my-6"><table className="w-full border-collapse text-sm">{children}</table></div>,
                  th: ({children}) => <th className="border border-[var(--color-border-default)] px-4 py-2 bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] text-left font-medium">{children}</th>,
                  td: ({children}) => <td className="border border-[var(--color-border-default)] px-4 py-2 text-[var(--color-text-secondary)]">{children}</td>,
                }}
              >
                {article.content}
              </ReactMarkdown>
            )}
          </div>

          {/* Tags Section - hidden for paywalled premium articles, shown for admin/gift */}
          {(!article.isPremium || hasFullAccess) && article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[var(--color-border-default)]/40">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mr-2">Tags</span>
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)]/40"
                  >
                    #{tag.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Frequently asked questions — emitted as FAQPage JSON-LD in the
              SSR page.jsx. The two MUST stay in sync (Google manual action
              trigger if schema mentions Qs that aren't visible on the page). */}
          {(!article.isPremium || hasFullAccess) && (() => {
            const faqs = getArticleFaqs(article.slug);
            if (!faqs) return null;
            return (
              <section className="mt-12 pt-10 border-t border-[var(--color-border-default)]">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                  [ FAQ ]
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-[var(--color-text-primary)] mb-8 leading-[1.15]">
                  Frequently asked questions
                </h2>
                <dl className="space-y-6">
                  {faqs.map(({ question, answer }, i) => (
                    <div key={i} className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 sm:p-6">
                      <dt className="text-base sm:text-lg font-medium text-[var(--color-text-primary)] mb-2 leading-snug">
                        {question}
                      </dt>
                      <dd className="text-sm sm:text-base text-[var(--color-text-tertiary)] leading-relaxed">
                        {answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })()}

          {/* Trial CTA Section — Rev 2026-04-23. Previous card used dark
              "black" primary button against the blue gradient because the
              bg-base token resolves near-black. Normalised:
                • primary is solid white + dark-navy text
                • secondary is a transparent pill matched to the primary
                  so both stack cleanly at the same height
                • title + dek sizes tightened for a footer placement
                  (it's not the main CTA — the paywall is) */}
          {(!article.isPremium || hasFullAccess) && (
            <div className="mt-12">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-7 sm:p-9">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-2 leading-snug">
                      Tracking regulatory change in {extractCountryFromArticle(article)}?
                    </h3>
                    <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                      Get real-time alerts and in-depth analysis. <span className="text-white font-medium">14-day free trial</span>.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
                    <Link
                      href="/contact?trial=true&source=article-footer"
                      className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-[#0b1738] bg-white rounded-lg hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Start your trial
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window === "undefined") return;
                        const country = extractCountryFromArticle(article);
                        window.dispatchEvent(new CustomEvent("pimlico:open-nadia", {
                          detail: {
                            source: "article-footer",
                            hint: country
                              ? `How does XHS Copilot cover regulatory change in ${country}?`
                              : `How does XHS Copilot help me track regulatory change like in this article?`,
                          },
                        }));
                      }}
                      className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-transparent border border-white/50 rounded-lg hover:bg-white/10 hover:border-white/80 transition-colors whitespace-nowrap"
                    >
                      Talk to Nadia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Articles — internal linking + dwell time */}
          {(!article.isPremium || hasFullAccess) && (
            <RelatedArticles
              currentSlug={article.slug}
              currentCategory={article.category}
              currentTags={article.tags || []}
            />
          )}

          {/* Back to Insights — mono uppercase to echo the top breadcrumb. */}
          {(!article.isPremium || hasFullAccess) && (
            <div className="mt-12 pt-6 border-t border-[var(--color-border-default)]/40">
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to News &amp; Insights
              </Link>
            </div>
          )}
        </div>
      </article>

    </div>
  );
}
