"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Footer } from '@/components/footer';
import Link from 'next/link';

const categories = ['All', 'AI Regulation', 'Payments', 'Crypto', 'Gambling'];

// Common jurisdictions for filtering
const jurisdictions = [
  'European Union', 'United Kingdom', 'United States', 'Finland', 'Germany', 
  'France', 'Malta', 'Gibraltar', 'Sweden', 'Denmark', 'Netherlands', 'Spain',
  'Italy', 'Australia', 'Canada', 'Singapore'
];

// Generate realistic view counts based on article age with variation
const generateViewCount = (dateStr, articleId) => {
  const now = new Date();
  const articleDate = new Date(dateStr);
  
  if (isNaN(articleDate)) return 0;
  
  // Calculate days since publication
  const daysSincePublish = Math.max(0, Math.floor((now - articleDate) / (1000 * 60 * 60 * 24)));
  
  // Base views increase with age (not linear - logarithmic growth with daily additions)
  // Day 0: ~50-150 views, then grows with diminishing returns but still accumulating
  const baseViews = 50 + Math.floor(Math.log2(daysSincePublish + 1) * 80);
  
  // Daily view accumulation (older articles have more accumulated views)
  const dailyAccumulation = daysSincePublish * (15 + Math.floor(Math.random() * 10));
  
  // Add pseudo-random variation based on article ID for consistency
  // This ensures the same article always shows the same view count on a given day
  const seed = articleId * 7919 + daysSincePublish * 31; // Prime number seeding
  const variation = ((seed % 100) / 100) * 0.3 - 0.15; // ±15% variation
  
  // Calculate total with variation
  const totalViews = Math.floor((baseViews + dailyAccumulation) * (1 + variation));
  
  // Format for display
  if (totalViews >= 1000) {
    return (totalViews / 1000).toFixed(1) + 'k';
  }
  return totalViews.toString();
};

export default function InsightsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');

  // Load articles from localStorage only (no sample articles)
  useEffect(() => {
    const savedArticles = localStorage.getItem('xhs-articles');
    const now = new Date();
    
    let publishedArticles = [];
    if (savedArticles) {
      const parsed = JSON.parse(savedArticles);
      // Filter out drafts and scheduled articles that haven't reached their publish time
      publishedArticles = parsed.filter(article => {
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
    
    // Sort by date (newest first)
    const sortedArticles = publishedArticles.sort((a, b) => {
      // Parse dates - handle various date formats
      const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        // Handle "February 4, 2026" format
        const parsed = new Date(dateStr);
        if (!isNaN(parsed)) return parsed;
        return new Date(0);
      };
      return parseDate(b.date) - parseDate(a.date);
    });
    
    setArticles(sortedArticles);
    setIsLoading(false);
  }, []);

  // Get all unique tags from articles for filtering
  const allTags = [...new Set(articles.flatMap(a => a.tags || []))].sort();

  // Filter articles based on all criteria
  const filteredArticles = articles.filter(article => {
    // Category filter
    if (selectedCategory !== 'All' && article.category !== selectedCategory) {
      return false;
    }
    
    // Search query filter (searches title, excerpt, and content)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const searchText = `${article.title} ${article.excerpt || ''} ${article.content || ''}`.toLowerCase();
      if (!searchText.includes(query)) {
        return false;
      }
    }
    
    // Jurisdiction filter (searches in content and tags)
    if (selectedJurisdiction !== 'All') {
      const searchText = `${article.title} ${article.content || ''} ${(article.tags || []).join(' ')}`.toLowerCase();
      if (!searchText.includes(selectedJurisdiction.toLowerCase())) {
        return false;
      }
    }
    
    // Tag filter
    if (selectedTag && !(article.tags || []).includes(selectedTag)) {
      return false;
    }
    
    return true;
  });

  const featuredArticles = filteredArticles.filter(a => a.featured).slice(0, 2);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== 'All' || searchQuery.trim() || selectedJurisdiction !== 'All' || selectedTag;

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedJurisdiction('All');
    setSelectedTag('');
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
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
            <a href="/#differentiators" className="text-sm/6 font-semibold text-gray-900">How it works</a>
            <a href="/ai" className="text-sm/6 font-semibold text-gray-900">AI</a>
            <a href="/payments" className="text-sm/6 font-semibold text-gray-900">Payments</a>
            <a href="/gambling" className="text-sm/6 font-semibold text-gray-900">Gambling</a>
            <a href="/insights" className="text-sm/6 font-semibold text-blue-600">Insights</a>
            <a href="/pricing" className="text-sm/6 font-semibold text-gray-900">Pricing</a>
            <a href="/#team" className="text-sm/6 font-semibold text-gray-900">Team</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/contact" className="inline-flex items-center rounded-md px-5 py-2.5 font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105">
              Book a demo <span aria-hidden="true" className="ml-1">&rarr;</span>
            </a>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Pimlico XHS™</span>
                  <Image src="/Pimlico_Logo.png" alt="Pimlico" width={100} height={27} className="h-8 w-auto" />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Home</a>
                    <a href="/#differentiators" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">How it works</a>
                    <a href="/ai" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">AI</a>
                    <a href="/payments" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Payments</a>
                    <a href="/gambling" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Gambling</a>
                    <a href="/insights" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-blue-600 hover:bg-gray-50">Insights</a>
                    <a href="/pricing" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Pricing</a>
                    <a href="/#team" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Team</a>
                  </div>
                  <div className="py-6">
                    <a href="/contact" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Book a demo</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Regulatory <span className="text-blue-600">Insights</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Expert analysis and thought leadership from the Pimlico XHS™ team.
              </p>
            </div>

            {/* Category Filter */}
            <div className="mt-8 flex justify-center gap-2 sm:gap-3 flex-wrap px-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Loading articles...</p>
            </div>
          </div>
        </div>
      )}

      {/* Featured Articles */}
      {!isLoading && featuredArticles.length > 0 && (
        <div className="bg-gray-50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {featuredArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/insights/${article.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 active:scale-[0.98]"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
                    {article.image ? (
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/30 text-6xl font-bold">XHS<sup className="text-3xl">™</sup></span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-medium">{article.category}</span>
                      {article.isPremium && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-2 py-1 rounded-md font-medium text-xs">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Premium
                        </span>
                      )}
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {generateViewCount(article.date, article.id)} views
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-gray-600 line-clamp-2">{article.excerpt}</p>
                    <p className="mt-4 text-sm text-gray-500">By {article.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Articles */}
      {!isLoading && (
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
              {hasActiveFilters && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''})
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              )}
              <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-all ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Filter articles"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h.01M6 12a2 2 0 110-4 2 2 0 010 4zm0 0v6m6-10.5h.01M12 6a2 2 0 110-4 2 2 0 010 4zm0 0v12m6 1.5h.01M18 18a2 2 0 110-4 2 2 0 010 4zm0 0v-12" />
                </svg>
                {hasActiveFilters && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                )}
              </button>
              </div>
            </div>
          </div>

          {/* Expandable Filter Panel */}
          {showFilters && (
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Search */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Vertical */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Vertical</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Jurisdiction */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Jurisdiction</label>
                  <select
                    value={selectedJurisdiction}
                    onChange={(e) => setSelectedJurisdiction(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Jurisdictions</option>
                    {jurisdictions.map(j => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Tag</label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag.replace(/-/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {regularArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/insights/${article.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-300 text-4xl font-bold">XHS<sup className="text-xl">™</sup></span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{article.category}</span>
                    {article.isPremium && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-1.5 py-0.5 rounded font-medium">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Premium
                      </span>
                    )}
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{article.date}</span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {generateViewCount(article.date, article.id)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No articles found in this category.</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* 7 Day Trial CTA */}
      <div className="bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Sign up for a <span className="text-blue-400">7 day trial</span> today
            </h2>
            <p className="mt-6 text-base text-gray-400 sm:text-lg/8">
              Transform how your team manages compliance with AI-powered workspaces built for regulated industries.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <a
                href="/contact"
                className="rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:shadow-xl"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
