/**
 * Dynamic sitemap for pimlicosolutions.com
 *
 * Static pages are enumerated explicitly. Insights articles are pulled
 * from the local JSON so every published article appears in search.
 * Regulator landing pages are pulled from src/data/regulators.js.
 */

import fs from 'fs'
import path from 'path'
import { listRegulators } from '@/data/regulators'
import { listFrameworks } from '@/data/frameworks'

const BASE = 'https://pimlicosolutions.com'

function readArticles() {
  try {
    const file = path.join(process.cwd(), 'src', 'data', 'sample-articles.js')
    if (!fs.existsSync(file)) return []
    const raw = fs.readFileSync(file, 'utf8')
    const matches = [...raw.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)]
    return matches.map((m) => m[1])
  } catch {
    return []
  }
}

export default function sitemap() {
  const now = new Date()

  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/verticals', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/insights', priority: 0.8, changeFrequency: 'daily' },
    { path: '/regulators', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/frameworks', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/security', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    // /terms-and-conditions is intentionally omitted — the page sets
    // robots: noindex, so listing it in the sitemap would be contradictory.
  ]

  const entries = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const articles = readArticles()
  for (const slug of articles) {
    entries.push({
      url: `${BASE}/insights/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  // Regulator landing pages — every entry in src/data/regulators.js
  for (const r of listRegulators()) {
    entries.push({
      url: `${BASE}/regulators/${r.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  // Framework landing pages — every entry in src/data/frameworks.js
  for (const f of listFrameworks()) {
    entries.push({
      url: `${BASE}/frameworks/${f.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return entries
}
