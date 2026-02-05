"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { sampleArticles } from '@/data/sample-articles';

// Generate realistic view counts based on article age with variation
const generateViewCount = (dateStr, articleId) => {
  const now = new Date();
  const articleDate = new Date(dateStr);
  
  if (isNaN(articleDate)) return 50;
  
  // Calculate days since publication
  const daysSincePublish = Math.max(0, Math.floor((now - articleDate) / (1000 * 60 * 60 * 24)));
  
  // Base views increase with age (logarithmic growth with daily additions)
  const baseViews = 50 + Math.floor(Math.log2(daysSincePublish + 1) * 80);
  
  // Daily view accumulation (older articles have more accumulated views)
  const dailyAccumulation = daysSincePublish * (15 + Math.floor((articleId * 7) % 10));
  
  // Add pseudo-random variation based on article ID for consistency
  const seed = articleId * 7919 + daysSincePublish * 31;
  const variation = ((seed % 100) / 100) * 0.3 - 0.15; // ±15% variation
  
  return Math.floor((baseViews + dailyAccumulation) * (1 + variation));
};

// Helper function to extract country/region mentioned in article
function extractCountryFromArticle(article) {
  if (!article) return null;
  
  // Common countries and regions to look for in regulatory content
  const countries = [
    'Finland', 'Sweden', 'Denmark', 'Norway', 'Iceland',
    'UK', 'United Kingdom', 'Great Britain', 'Britain',
    'Germany', 'France', 'Italy', 'Spain', 'Portugal', 'Netherlands', 'Belgium',
    'Malta', 'Gibraltar', 'Isle of Man', 'Jersey', 'Guernsey',
    'Ireland', 'Poland', 'Czech Republic', 'Austria', 'Switzerland',
    'Luxembourg', 'Monaco', 'Liechtenstein', 'Cyprus', 'Greece',
    'Estonia', 'Latvia', 'Lithuania', 'Romania', 'Bulgaria', 'Hungary',
    'Croatia', 'Slovenia', 'Slovakia',
    'USA', 'United States', 'Canada', 'Australia', 'New Zealand',
    'Singapore', 'Hong Kong', 'Japan', 'South Korea',
    'UAE', 'Dubai', 'Saudi Arabia',
    'Brazil', 'Mexico', 'Argentina',
    'European Union', 'EU', 'Europe', 'European'
  ];
  
  // Check title first, then content
  const textToSearch = `${article.title} ${article.content || ''}`;
  
  for (const country of countries) {
    if (textToSearch.toLowerCase().includes(country.toLowerCase())) {
      // Return normalized country name
      if (country === 'UK') return 'the UK';
      if (country === 'United Kingdom' || country === 'Great Britain' || country === 'Britain') return 'the UK';
      if (country === 'USA' || country === 'United States') return 'the United States';
      if (country === 'European Union' || country === 'EU') return 'the European Union';
      if (country === 'Europe' || country === 'European') return 'Europe';
      if (country === 'UAE') return 'the UAE';
      return country;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [article, setArticle] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Set current URL for sharing
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
    
    // Check localStorage for custom articles first
    const savedArticles = localStorage.getItem('xhs-articles');
    const deletedSampleIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
    const now = new Date();
    
    let customArticles = [];
    if (savedArticles) {
      const parsed = JSON.parse(savedArticles);
      // Filter out drafts and scheduled articles that haven't reached their publish time
      customArticles = parsed.filter(article => {
        // Hide drafts from public view
        if (article.status === 'draft') {
          return false;
        }
        // Hide scheduled articles that haven't reached their publish time
        if (article.status === 'scheduled' && article.scheduledAt) {
          return new Date(article.scheduledAt) <= now;
        }
        return true;
      });
    }
    
    // Get sample articles that haven't been deleted or overridden
    const customSlugs = customArticles.map(a => a.slug);
    const visibleSamples = sampleArticles.filter(s => 
      !deletedSampleIds.includes(s.id) && !customSlugs.includes(s.slug)
    );
    
    const allArticles = [...customArticles, ...visibleSamples];
    const found = allArticles.find(a => a.slug === params.slug);
    setArticle(found);
    
    // Generate view count based on article date and ID
    if (found) {
      const views = generateViewCount(found.date, found.id);
      setViewCount(views);
    }
    
    // Update document title for custom articles (since server-side metadata only works for sample articles)
    if (found && !found.isSample) {
      document.title = `${found.title} - Pimlico XHS™`;
    }
  }, [params.slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!article) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
          <Link href="/insights" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
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
    <div className="bg-white min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico XHS™</span>
              <Image src="/Pimlico_Logo.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm/6 font-semibold text-gray-900">Home</a>
            <a href="/ai" className="text-sm/6 font-semibold text-gray-900">AI</a>
            <a href="/payments" className="text-sm/6 font-semibold text-gray-900">Payments</a>
            <a href="/gambling" className="text-sm/6 font-semibold text-gray-900">Gambling</a>
            <a href="/insights" className="text-sm/6 font-semibold text-blue-600">Insights</a>
            <a href="/pricing" className="text-sm/6 font-semibold text-gray-900">Pricing</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/contact" className="inline-flex items-center rounded-md px-5 py-2.5 font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105">
              Book a demo <span aria-hidden="true" className="ml-1">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Article Content */}
      <article className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/insights" className="text-blue-600 hover:text-blue-500 text-sm">
              ← Back to Insights
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-10">
            {/* Cover Image - Above Title */}
            {article.image && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-auto object-cover" />
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-medium">{article.category}</span>
                {article.isPremium && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-2.5 py-1 rounded-md font-medium">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </span>
                )}
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {viewCount.toLocaleString()} views
                </span>
              </div>
              
              {/* Share buttons - full color icons, compact */}
              <div className="flex items-center gap-0.5">
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                {/* X (Twitter) */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share on X"
                >
                  <svg className="w-4 h-4" fill="#000000" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n\n${article.excerpt || ''}\n\n${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4" fill="#25D366" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                
                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share on Telegram"
                >
                  <svg className="w-4 h-4" fill="#26A5E4" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                
                {/* Gmail */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\nRead more: ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share via Gmail"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#EA4335">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600">{article.excerpt}</p>
            
            <div className="mt-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white p-1">
                <Image src="/Pimlico_Logo.png" alt="Pimlico" width={32} height={32} className="h-7 w-7 object-contain" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">XHS™ Team</p>
              </div>
            </div>
          </header>

          {/* Article Body - with justified text */}
          <div className="prose prose-lg max-w-none">
            {article.isPremium && article.premiumCutoff ? (
              <>
                {/* Show only the cutoff percentage of content with blur effect */}
                <div className="relative">
                  <div className="blur-[2px] select-none">
                    <ReactMarkdown
                      components={{
                        h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">{children}</h3>,
                        p: ({children}) => <p className="text-gray-600 mb-4 leading-relaxed text-justify">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">{children}</ol>,
                        li: ({children}) => <li className="text-gray-600">{children}</li>,
                        strong: ({children}) => <strong className="text-gray-900 font-semibold">{children}</strong>,
                        a: ({href, children}) => <a href={href} className="text-blue-600 hover:text-blue-500 pointer-events-none">{children}</a>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-500">{children}</blockquote>,
                        code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-700">{children}</code>,
                        hr: () => <hr className="border-gray-200 my-8" />,
                        table: ({children}) => <table className="w-full border-collapse my-6">{children}</table>,
                        th: ({children}) => <th className="border border-gray-200 px-4 py-2 bg-gray-50 text-gray-900 text-left">{children}</th>,
                        td: ({children}) => <td className="border border-gray-200 px-4 py-2 text-gray-600">{children}</td>,
                      }}
                    >
                      {article.content.slice(0, Math.floor(article.content.length * (article.premiumCutoff / 100)))}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Fade-out gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
                </div>

                {/* Premium Paywall CTA - matching the blue gradient style */}
                <div className="relative mt-8">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-8 sm:py-20 sm:px-12">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                    <div className="relative text-center">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                        Unlock Full Access with XHS™
                      </h3>
                      
                      <p className="text-blue-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                        Monitor. Analyse. Collaborate. Integrate.
                      </p>
                      
                      {/* Features in a row */}
                      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 text-base">
                        <div className="flex items-center gap-2 text-white">
                          <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Real-time alerts</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Expert analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>API integrations</span>
                        </div>
                      </div>
                      
                      <p className="text-white text-lg font-semibold mb-8">
                        Try free for 7 days
                      </p>
                      
                      <Link
                        href="/contact?trial=true&source=premium-article"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Book a demo
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <ReactMarkdown
                components={{
                  h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">{children}</h3>,
                  p: ({children}) => <p className="text-gray-600 mb-4 leading-relaxed text-justify">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">{children}</ol>,
                  li: ({children}) => <li className="text-gray-600">{children}</li>,
                  strong: ({children}) => <strong className="text-gray-900 font-semibold">{children}</strong>,
                  a: ({href, children}) => <a href={href} className="text-blue-600 hover:text-blue-500">{children}</a>,
                  blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-500">{children}</blockquote>,
                  code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-700">{children}</code>,
                  hr: () => <hr className="border-gray-200 my-8" />,
                  table: ({children}) => <table className="w-full border-collapse my-6">{children}</table>,
                  th: ({children}) => <th className="border border-gray-200 px-4 py-2 bg-gray-50 text-gray-900 text-left">{children}</th>,
                  td: ({children}) => <td className="border border-gray-200 px-4 py-2 text-gray-600">{children}</td>,
                }}
              >
                {article.content}
              </ReactMarkdown>
            )}
          </div>

          {/* Tags Section - hidden for premium articles */}
          {!article.isPremium && article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-500 mr-1">Tags:</span>
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    #{tag.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trial CTA Section - only show for non-premium articles */}
          {!article.isPremium && (
            <div className="mt-10">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-10">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Tracking regulatory change in {extractCountryFromArticle(article)}?
                  </h3>
                  <p className="text-blue-100 text-base sm:text-lg mb-6 max-w-2xl">
                    Get real-time alerts and in-depth analysis with a <span className="text-white font-semibold">7-day free trial</span>.
                  </p>
                  <Link
                    href="/contact?trial=true"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Book a demo
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Back to Insights - hidden for premium articles */}
          {!article.isPremium && (
            <div className="mt-8">
              <Link 
                href="/insights" 
                className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse more articles
              </Link>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
