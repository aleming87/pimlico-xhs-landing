"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { sampleArticles } from '@/data/sample-articles';

const categories = ['All', 'AI Regulation', 'Payments', 'Gambling'];

export default function InsightsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState(sampleArticles);

  // Load articles from localStorage if available
  useEffect(() => {
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
    
    setArticles([...customArticles, ...visibleSamples]);
  }, []);

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const featuredArticles = filteredArticles.filter(a => a.featured).slice(0, 2);
  const regularArticles = filteredArticles.filter(a => !a.featured);

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
        
        <div className="py-32 sm:py-48">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Regulatory <span className="text-blue-600">Insights</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Expert analysis and thought leadership from the Pimlico XHS™ team.
              </p>
            </div>

            {/* Category Filter */}
            <div className="mt-10 flex justify-center gap-3 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
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

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/insights/${article.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
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
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
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
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/insights/${article.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
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
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                  <p className="mt-3 text-xs text-gray-500">{article.date}</p>
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
