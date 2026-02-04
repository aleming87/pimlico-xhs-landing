"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from 'next/link';

// Simple password protection - change this password
const ADMIN_PASSWORD = "pimlico2026";

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
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if already authenticated via sessionStorage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('xhs-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load saved articles from localStorage
  useEffect(() => {
    const savedArticles = localStorage.getItem('xhs-articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }
  }, []);

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

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setArticleMeta({
      ...articleMeta,
      title,
      slug: generateSlug(title),
    });
  };

  const handlePublish = () => {
    if (!articleMeta.title || !markdownContent) {
      alert('Please fill in the title and content');
      return;
    }

    const newArticle = {
      id: Date.now(),
      ...articleMeta,
      date: new Date().toISOString().split('T')[0],
      content: markdownContent,
    };

    const updatedArticles = [newArticle, ...articles];
    setArticles(updatedArticles);
    localStorage.setItem('xhs-articles', JSON.stringify(updatedArticles));

    // Reset form
    setMarkdownContent('');
    setArticleMeta({
      title: '',
      slug: '',
      excerpt: '',
      category: 'AI Regulation',
      author: 'Pimlico XHS Team',
      readTime: '5 min read',
      featured: false,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteArticle = (id) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const updatedArticles = articles.filter(a => a.id !== id);
      setArticles(updatedArticles);
      localStorage.setItem('xhs-articles', JSON.stringify(updatedArticles));
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
          <div className="mb-6 bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
            ✓ Article published successfully!
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Published Articles</h2>
              <button
                onClick={() => setActiveTab('publish')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
              >
                + New Article
              </button>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-16 bg-gray-800 rounded-xl">
                <p className="text-gray-400 mb-4">No articles published yet</p>
                <button
                  onClick={() => setActiveTab('publish')}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Publish your first article →
                </button>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="p-4">
                          <Link href={`/insights/${article.slug}`} className="text-white hover:text-indigo-400">
                            {article.title}
                          </Link>
                        </td>
                        <td className="p-4 text-gray-400">{article.category}</td>
                        <td className="p-4 text-gray-400">{article.date}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded">Published</span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Publish Tab */}
        {activeTab === 'publish' && (
          <div className="max-w-4xl">
            <h2 className="text-xl font-semibold text-white mb-6">Publish New Article</h2>

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

              {/* Markdown Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (Markdown)</label>
                <div className="mb-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload .md file
                    <input
                      type="file"
                      accept=".md,.markdown,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder="## Introduction&#10;&#10;Write your article content in Markdown format...&#10;&#10;### Key Points&#10;&#10;- Point 1&#10;- Point 2&#10;- Point 3"
                  rows={15}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handlePublish}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-semibold"
                >
                  Publish Article
                </button>
                <button
                  onClick={() => {
                    setMarkdownContent('');
                    setArticleMeta({
                      title: '',
                      slug: '',
                      excerpt: '',
                      category: 'AI Regulation',
                      author: 'Pimlico XHS Team',
                      readTime: '5 min read',
                      featured: false,
                    });
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
