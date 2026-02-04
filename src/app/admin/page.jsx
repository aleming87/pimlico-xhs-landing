"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from 'next/link';

// Simple password protection - change this password
const ADMIN_PASSWORD = "pimlico2026";

// Sample articles data - same as insights page
const sampleArticles = [
  {
    id: 1,
    slug: 'eu-ai-act-compliance-guide-2026',
    title: 'EU AI Act Compliance Guide 2026: What Regulated Entities Need to Know',
    excerpt: 'A comprehensive overview of the EU AI Act requirements for financial services, gambling, and payments companies entering into force this year.',
    category: 'AI Regulation',
    author: 'Pimlico XHS™ Team',
    date: '2026-02-01',
    readTime: '8 min read',
    image: '/screenshots/dashboard.png',
    featured: true,
    isSample: true,
  },
  {
    id: 2,
    slug: 'psd3-implementation-timeline',
    title: 'PSD3 Implementation Timeline: Key Dates and Milestones',
    excerpt: 'Track the critical milestones for PSD3 compliance and understand how the new payment services directive will reshape the European payments landscape.',
    category: 'Payments',
    author: 'Pimlico XHS™ Team',
    date: '2026-01-28',
    readTime: '6 min read',
    image: '/screenshots/dashboard.png',
    featured: true,
    isSample: true,
  },
  {
    id: 3,
    slug: 'ukgc-remote-gambling-updates',
    title: 'UKGC Remote Gambling: Latest Regulatory Updates',
    excerpt: 'Analysis of recent UK Gambling Commission guidance on remote gambling operations and player protection measures.',
    category: 'Gambling',
    author: 'Pimlico XHS™ Team',
    date: '2026-01-25',
    readTime: '5 min read',
    image: '/screenshots/dashboard.png',
    featured: false,
    isSample: true,
  },
  {
    id: 4,
    slug: 'mica-crypto-compliance-framework',
    title: 'MiCA Compliance Framework: Building Your Crypto Strategy',
    excerpt: 'How crypto asset service providers can prepare for Markets in Crypto-Assets regulation requirements across the EU.',
    category: 'Payments',
    author: 'Pimlico XHS™ Team',
    date: '2026-01-20',
    readTime: '7 min read',
    image: '/screenshots/dashboard.png',
    featured: false,
    isSample: true,
  },
  {
    id: 5,
    slug: 'ai-model-documentation-requirements',
    title: 'AI Model Documentation: Meeting Regulatory Requirements',
    excerpt: 'Best practices for documenting AI/ML models to satisfy emerging regulatory requirements in financial services.',
    category: 'AI Regulation',
    author: 'Pimlico XHS™ Team',
    date: '2026-01-15',
    readTime: '10 min read',
    image: '/screenshots/dashboard.png',
    featured: false,
    isSample: true,
  },
  {
    id: 6,
    slug: 'cross-border-gambling-licensing',
    title: 'Cross-Border Gambling: Navigating Multi-Jurisdictional Licensing',
    excerpt: 'Strategic approaches to obtaining and maintaining gambling licenses across multiple European jurisdictions.',
    category: 'Gambling',
    author: 'Pimlico XHS™ Team',
    date: '2026-01-10',
    readTime: '9 min read',
    image: '/screenshots/dashboard.png',
    featured: false,
    isSample: true,
  },
];

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

  // Check if already authenticated via sessionStorage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('xhs-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load saved articles from localStorage and merge with sample articles
  useEffect(() => {
    const savedArticles = localStorage.getItem('xhs-articles');
    const deletedSampleIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
    
    let customArticles = [];
    if (savedArticles) {
      customArticles = JSON.parse(savedArticles);
    }
    
    // Get sample articles that haven't been deleted or overridden
    const customSlugs = customArticles.map(a => a.slug);
    const visibleSamples = sampleArticles
      .filter(s => !deletedSampleIds.includes(s.id) && !customSlugs.includes(s.slug))
      .map(s => ({ ...s, isSample: true }));
    
    // Merge: custom articles first, then remaining samples
    setArticles([...customArticles, ...visibleSamples]);
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

    if (scheduleEnabled && !scheduledDate) {
      alert('Please select a scheduled publish date');
      return;
    }

    const isEditingSample = editingArticle?.isSample;
    
    const newArticle = {
      id: isEditingSample ? Date.now() : (editingArticle ? editingArticle.id : Date.now()),
      ...articleMeta,
      image: articleImage,
      tags: tags,
      date: scheduleEnabled ? scheduledDate.split('T')[0] : new Date().toISOString().split('T')[0],
      scheduledAt: scheduleEnabled ? scheduledDate : null,
      status: scheduleEnabled ? 'scheduled' : 'published',
      content: markdownContent,
      isSample: false,
    };

    let updatedArticles;
    if (editingArticle) {
      if (isEditingSample) {
        const deletedSampleIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
        if (!deletedSampleIds.includes(editingArticle.id)) {
          deletedSampleIds.push(editingArticle.id);
          localStorage.setItem('xhs-deleted-samples', JSON.stringify(deletedSampleIds));
        }
        updatedArticles = [newArticle, ...articles.filter(a => a.id !== editingArticle.id)];
      } else {
        updatedArticles = articles.map(a => a.id === editingArticle.id ? newArticle : a);
      }
      setSuccessMessage(`“${articleMeta.title}” has been updated successfully!`);
    } else {
      // Add new article
      updatedArticles = [newArticle, ...articles];
      setSuccessMessage(scheduleEnabled 
        ? `“${articleMeta.title}” has been scheduled for ${new Date(scheduledDate).toLocaleString()}!`
        : `“${articleMeta.title}” has been published successfully!`);
    }
    
    setArticles(updatedArticles);
    const customArticles = updatedArticles.filter(a => !a.isSample);
    localStorage.setItem('xhs-articles', JSON.stringify(customArticles));

    // Reset form
    resetForm();
    setEditingArticle(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const resetForm = () => {
    setMarkdownContent('');
    setArticleImage('');
    setScheduleEnabled(false);
    setScheduledDate('');
    setTags([]);
    setTagInput('');
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
    setMarkdownContent(article.content || '');
    setArticleImage(article.image || '');
    setTags(article.tags || []);
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

  const handleDeleteArticle = (article) => {
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
    }
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setArticleImage(event.target.result);
      };
      reader.readAsDataURL(file);
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
                    {articles.map((article) => {
                      const isScheduled = article.status === 'scheduled' && article.scheduledAt;
                      const scheduledTime = isScheduled ? new Date(article.scheduledAt) : null;
                      const isPastScheduled = scheduledTime && scheduledTime <= new Date();
                      
                      return (
                      <tr key={article.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/insights/${article.slug}`} className="text-white hover:text-indigo-400">
                              {article.title}
                            </Link>
                            {article.isSample && (
                              <span className="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">Sample</span>
                            )}
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
                          {isScheduled && !isPastScheduled ? (
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
            )}
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

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
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
                <p className="text-gray-500 text-xs mt-1">Press Enter to add a tag</p>
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
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {articleImage && (
                    <div className="relative">
                      <img src={articleImage} alt="Preview" className="h-20 w-32 object-cover rounded-lg" />
                      <button
                        onClick={() => setArticleImage('')}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-400"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-2">Recommended: 1200×630px for optimal social sharing</p>
              </div>

              {/* Markdown Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Content (Markdown)</label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    disabled={!markdownContent}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </button>
                </div>
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
                  {editingArticle 
                    ? '✓ Update Article' 
                    : scheduleEnabled 
                      ? '📅 Schedule Article' 
                      : '🚀 Publish Article'}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingArticle(null);
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Markdown Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Markdown Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {articleMeta.title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{articleMeta.title}</h1>
                )}
                {articleMeta.excerpt && (
                  <p className="text-xl text-gray-600 mb-6">{articleMeta.excerpt}</p>
                )}
                <div className="prose prose-lg max-w-none">
                  {markdownContent.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.replace('## ', '')}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{line.replace('### ', '')}</h3>;
                    } else if (line.startsWith('- ')) {
                      return <li key={i} className="text-gray-600 ml-4 list-disc">{line.replace('- ', '')}</li>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="text-gray-900 font-semibold mb-2">{line.replace(/\*\*/g, '')}</p>;
                    } else if (line.trim() === '') {
                      return <br key={i} />;
                    } else {
                      return <p key={i} className="text-gray-600 mb-4">{line}</p>;
                    }
                  })}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
