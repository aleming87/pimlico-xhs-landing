"use client";
import { useState, useEffect, createContext, useContext } from 'react';
import { sampleArticles as baseSampleArticles } from '@/data/sample-articles';

const sampleArticles = baseSampleArticles.map(a => ({ ...a, isSample: true }));

const ArticlesContext = createContext(null);

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const savedArticles = localStorage.getItem('xhs-articles');
    const deletedSampleIds = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');

    let customArticles = [];
    if (savedArticles) {
      customArticles = JSON.parse(savedArticles).map(a => ({ ...a, isSample: false }));
    }

    const customSlugs = customArticles.map(a => a.slug);
    const visibleSamples = sampleArticles
      .filter(s => !customSlugs.includes(s.slug) && !deletedSampleIds.includes(s.id));

    setArticles([...customArticles, ...visibleSamples]);
  }, []);

  const saveArticles = (updated) => {
    setArticles(updated);
    const custom = updated.filter(a => !a.isSample);
    localStorage.setItem('xhs-articles', JSON.stringify(custom));
  };

  const deleteArticle = (article) => {
    if (article.isSample) {
      const deleted = JSON.parse(localStorage.getItem('xhs-deleted-samples') || '[]');
      deleted.push(article.id);
      localStorage.setItem('xhs-deleted-samples', JSON.stringify(deleted));
    }
    saveArticles(articles.filter(a => a.id !== article.id));
  };

  return (
    <ArticlesContext.Provider value={{ articles, setArticles: saveArticles, deleteArticle }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const ctx = useContext(ArticlesContext);
  if (!ctx) throw new Error('useArticles must be used within ArticlesProvider');
  return ctx;
}
