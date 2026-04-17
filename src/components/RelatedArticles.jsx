"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Related Articles block for insight posts.
 *
 * Fetches all published articles and ranks them by relevance to the
 * current article:
 *   1. Same category (strongest signal)
 *   2. Shared tag count (stronger = more tags in common)
 *   3. Recency tie-breaker
 *
 * Renders the top 3 (or fewer if the site is new and we don't have
 * enough). Silently renders nothing if there's nothing to show.
 *
 * SEO value: adds internal links from every article to 3 others →
 * dwell time goes up, crawl discovery improves, and Google gets
 * richer site-wide context for relevance scoring.
 */
export default function RelatedArticles({ currentSlug, currentCategory = "", currentTags = [] }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) return;
        const data = await res.json();
        const all = data.articles || [];
        const now = new Date();
        const published = all.filter((a) => {
          if (!a || !a.slug || a.slug === currentSlug) return false;
          if (a.status === "draft") return false;
          if (a.status === "scheduled" && a.scheduledAt && new Date(a.scheduledAt) > now) return false;
          return true;
        });
        const currentTagSet = new Set((currentTags || []).map((t) => String(t).toLowerCase()));
        const scored = published.map((a) => {
          const tags = (a.tags || []).map((t) => String(t).toLowerCase());
          const sharedTags = tags.filter((t) => currentTagSet.has(t)).length;
          const sameCategory = a.category === currentCategory ? 1 : 0;
          const score = sameCategory * 10 + sharedTags * 3;
          return { a, score, date: new Date(a.date || 0).getTime() };
        });
        scored.sort((x, y) => {
          if (y.score !== x.score) return y.score - x.score;
          return y.date - x.date;
        });
        if (!cancelled) setItems(scored.slice(0, 3).map((s) => s.a));
      } catch {
        /* no-op */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [currentSlug, currentCategory, JSON.stringify(currentTags)]);

  if (items.length === 0) return null;

  return (
    <aside
      aria-labelledby="related-articles-heading"
      className="mt-16 border-t border-[var(--color-border-default)]/30 pt-10"
    >
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
        [ RELATED ]
      </p>
      <h2
        id="related-articles-heading"
        className="font-display text-2xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-3xl mb-8"
      >
        Keep reading
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <li key={a.slug} className="group">
            <Link
              href={`/insights/${a.slug}`}
              className="block rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/30 p-5 transition-colors hover:border-[var(--color-text-tertiary)]/40"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">
                {a.category || "Insight"}
              </p>
              <h3 className="font-display text-base font-medium text-[var(--color-text-primary)] leading-snug mb-2 group-hover:underline decoration-[var(--color-border-default)] underline-offset-4">
                {a.title}
              </h3>
              {a.excerpt ? (
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed line-clamp-3">
                  {a.excerpt}
                </p>
              ) : null}
              <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                {a.readTime || ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
