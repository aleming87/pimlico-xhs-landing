"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const categories = ["All", "AI Regulation", "Payments", "Crypto", "Gambling"];

export default function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        const data = await response.json();
        let allArticles = data.articles || [];
        const now = new Date();
        const published = allArticles.filter((a) => {
          if (a.status === "draft") return false;
          if (a.status === "scheduled" && a.scheduledAt) return new Date(a.scheduledAt) <= now;
          return true;
        });
        published.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        setArticles(published);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  const filtered = articles.filter((a) => {
    if (selectedCategory !== "All" && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const text = `${a.title} ${a.excerpt || ""} ${(a.tags || []).join(" ")}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  const featured = filtered.filter((a) => a.featured).slice(0, 2);
  const regular = filtered.filter((a) => !a.featured);

  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
          [ NEWS & INSIGHTS ]
        </p>
        <h1 className="text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl mb-4">
          News & Insights
        </h1>
        <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-xl mb-10">
          Regulatory briefings, sector analysis, and implementation notes from the Pimlico research team.
        </p>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]/40 rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text-tertiary)] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-text-muted)] border-t-transparent mb-4" />
            <p className="text-sm text-[var(--color-text-muted)]">Loading articles...</p>
          </div>
        </div>
      )}

      {/* Featured */}
      {!isLoading && featured.length > 0 && (
        <div className="border-t border-[var(--color-border-default)]/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
            <p className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-8">Featured</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((article) => (
                <Link
                  key={article.id}
                  href={`/insights/${article.slug}`}
                  className="group rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/50 overflow-hidden hover:border-[var(--color-border-subtle)] transition-all"
                >
                  <div className="aspect-video bg-[var(--color-bg-elevated)] relative overflow-hidden">
                    {article.image ? (
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[var(--color-text-muted)]/30 text-5xl font-medium font-mono">XHS{"\u2122"}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mb-3">
                      <span className="bg-[var(--color-bg-elevated)] text-[var(--color-text-tertiary)] px-2 py-1 rounded font-medium">{article.category}</span>
                      <span>{article.date}</span>
                      <span className="text-[var(--color-text-muted)]">{article.readTime}</span>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-secondary)] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-2 text-sm text-[var(--color-text-tertiary)] line-clamp-2">{article.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All articles */}
      {!isLoading && (
        <div className="border-t border-[var(--color-border-default)]/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-baseline justify-between mb-8">
              <p className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                {selectedCategory === "All" ? "All articles" : selectedCategory}
                {filtered.length > 0 && (
                  <span className="ml-2 text-[var(--color-text-muted)]/60">{filtered.length}</span>
                )}
              </p>
            </div>

            {regular.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regular.map((article) => (
                  <Link
                    key={article.id}
                    href={`/insights/${article.slug}`}
                    className="group rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/30 overflow-hidden hover:border-[var(--color-border-subtle)] transition-all flex flex-col h-full"
                  >
                    <div className="aspect-video bg-[var(--color-bg-elevated)] relative overflow-hidden">
                      {article.image ? (
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[var(--color-text-muted)]/20 text-3xl font-medium font-mono">XHS{"\u2122"}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-2">
                        <span className="bg-[var(--color-bg-elevated)] text-[var(--color-text-tertiary)] px-2 py-0.5 rounded font-medium">{article.category}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="text-base font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-secondary)] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-[var(--color-text-tertiary)] line-clamp-2">{article.excerpt}</p>
                      )}
                      <p className="mt-auto pt-3 text-xs text-[var(--color-text-muted)]">{article.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-sm text-[var(--color-text-muted)]">No articles found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl">
            See it in your jurisdictions.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access. No credit card.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://xhsdata.ai/register" className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90">
              Start free trial
            </a>
            <Link href="/contact" className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
              Book a demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
