"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useArticles } from '../ArticlesContext';

export default function ArticlesPage() {
  const { articles, setArticles, deleteArticle } = useArticles();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');

  const filteredArticles = articles.filter(article => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = article.title?.toLowerCase().includes(q) || article.excerpt?.toLowerCase().includes(q) || article.category?.toLowerCase().includes(q) || article.tags?.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filterCategory !== 'all' && article.category !== filterCategory) return false;
    if (filterStatus !== 'all') {
      const isDraft = article.status === 'draft';
      const isScheduled = article.status === 'scheduled' && article.scheduledAt;
      const scheduledTime = isScheduled ? new Date(article.scheduledAt) : null;
      const isPast = scheduledTime && scheduledTime <= new Date();
      const status = isDraft ? 'draft' : (isScheduled && !isPast ? 'scheduled' : 'published');
      if (filterStatus !== status) return false;
    }
    if (filterFeatured === 'featured' && !article.featured) return false;
    if (filterFeatured === 'not-featured' && article.featured) return false;
    return true;
  });

  const handleExport = () => {
    const custom = JSON.parse(localStorage.getItem('xhs-articles') || '[]');
    if (!custom.length) { alert('No custom articles to export.'); return; }
    const data = custom.map((a, i) => ({
      id: 100 + i, slug: a.slug, title: a.title, excerpt: a.excerpt, category: a.category,
      author: a.author || 'Pimlico XHS™ Team', date: a.date, readTime: a.readTime,
      image: '/Dashboard.png', ogImage: a.ogImage || `/articles/og-${a.category?.toLowerCase().replace(/\s+/g,'-')}.png`,
      featured: a.featured || false, tags: a.tags || [], isSample: true, content: a.content
    }));
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      alert('Articles exported to clipboard! Paste into sample-articles.js to enable sharing.');
    }).catch(() => alert('Check console (F12) for export data.'));
  };

  const handleDelete = (article) => {
    if (!confirm(`Delete "${article.title}"?`)) return;
    deleteArticle(article);
  };

  const hasFilters = searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterFeatured !== 'all';
  const clearFilters = () => { setSearchQuery(''); setFilterCategory('all'); setFilterStatus('all'); setFilterFeatured('all'); };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">📁 Articles</h1>
          <p className="text-sm text-gray-400 mt-0.5">{articles.length} total articles</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="px-3 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export
          </button>
          <Link href="/admin/drafting" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
            + New Article
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/70 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search articles..."
            className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
          <option value="all">All Categories</option>
          <option value="AI Regulation">AI Regulation</option>
          <option value="Payments">Payments</option>
          <option value="Crypto">Crypto</option>
          <option value="Gambling">Gambling</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
          <option value="all">All Status</option>
          <option value="draft">Drafts</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <select value={filterFeatured} onChange={e => setFilterFeatured(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
          <option value="all">All</option>
          <option value="featured">Featured Only</option>
          <option value="not-featured">Not Featured</option>
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300">Clear</button>
        )}
      </div>

      {/* Articles Table */}
      {filteredArticles.length > 0 ? (
        <>
          <p className="text-xs text-gray-500">Showing {filteredArticles.length} of {articles.length}</p>
          <div className="bg-gray-800/70 rounded-xl overflow-hidden border border-gray-700/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium text-xs">Title</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs">Category</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs">Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs">Status</th>
                  <th className="text-right p-4 text-gray-400 font-medium text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map(article => {
                  const isScheduled = article.status === 'scheduled' && article.scheduledAt;
                  const scheduledTime = isScheduled ? new Date(article.scheduledAt) : null;
                  const isPast = scheduledTime && scheduledTime <= new Date();
                  return (
                    <tr key={article.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {article.image ? (
                            <img src={article.image} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0 bg-gray-700" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">📄</span>
                            </div>
                          )}
                          <div>
                            <Link href={`/insights/${article.slug}`} className="text-sm text-white hover:text-indigo-400 font-medium">{article.title}</Link>
                            <div className="flex items-center gap-1 mt-0.5">
                              {article.isSample && <span className="px-1 py-0.5 bg-gray-700 text-gray-500 text-[10px] rounded">Sample</span>}
                              {article.featured && <span className="px-1 py-0.5 bg-purple-900/50 text-purple-400 text-[10px] rounded">★</span>}
                              {article.isPremium && <span className="px-1 py-0.5 bg-amber-900/50 text-amber-400 text-[10px] rounded">⭐</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-gray-400">{article.category}</td>
                      <td className="p-4 text-xs text-gray-400">{article.date}</td>
                      <td className="p-4">
                        {article.status === 'draft' ? (
                          <span className="px-2 py-0.5 bg-orange-900/50 text-orange-400 text-[10px] rounded-full">Draft</span>
                        ) : isScheduled && !isPast ? (
                          <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 text-[10px] rounded-full">Scheduled</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-900/50 text-green-400 text-[10px] rounded-full">Published</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href={`/insights/${article.slug}`} className="text-xs text-gray-400 hover:text-white">View</Link>
                        <button onClick={() => handleDelete(article)} className="text-xs text-red-400/70 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/30">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-400 text-sm font-medium">{hasFilters ? 'No articles match your filters' : 'No articles yet'}</p>
          {hasFilters ? (
            <button onClick={clearFilters} className="mt-3 text-indigo-400 text-sm hover:text-indigo-300">Clear all filters</button>
          ) : (
            <Link href="/admin/drafting" className="mt-3 text-indigo-400 text-sm hover:text-indigo-300 inline-block">Draft your first article →</Link>
          )}
        </div>
      )}
    </div>
  );
}
