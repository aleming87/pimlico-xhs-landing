#!/usr/bin/env node
/**
 * D4 — targeted PNG/JPG → WEBP batch.
 *
 * Operates on an explicit allow-list of files so we don't accidentally
 * touch favicons / icons / OG cards (where the PNG/JPG codec is the
 * intended delivery format). For each file:
 *
 *   - Decode at native size, resize to MAX_WIDTH if larger
 *   - Encode WEBP at QUALITY with effort=6 (slowest, smallest)
 *   - Write sibling `.webp` (PNG is left in place as fallback)
 *   - Print before/after size
 *
 * Usage: node scripts/d4-webp-batch.mjs
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const MAX_WIDTH = 2000
const QUALITY = 82

// Explicit targets — referenced from production components per
// `grep -rE` on src/. Adding a new file here is a one-line PR.
const TARGETS = [
  // ProductShowcase tab images (Hero crossfade carousel)
  'landing-shot-dashboard.png',
  'landing-shot-monitors.png',
  'landing-shot-laws.png',
  'landing-shot-reports.png',
  'landing-shot-countries.png',
  'landing-shot-news.png',

  // Verticals page hero stripes
  'vertical-gambling-hero.jpg',
  'vertical-payments-hero.jpg',
  'vertical-ai-hero.jpg',

  // HomeSections sector cards
  'sector-gambling.jpg',
  'sector-payments.jpg',
  'sector-ai.jpg',

  // HomeSections CTA background
  'cta-bg.jpg',
]

function fmt(n) {
  if (n > 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB'
  if (n > 1024) return (n / 1024).toFixed(0) + ' KB'
  return n + ' B'
}

let totalBefore = 0
let totalAfter = 0
const results = []

for (const name of TARGETS) {
  const src = path.join(PUBLIC_DIR, name)
  let stat
  try {
    stat = await fs.stat(src)
  } catch {
    console.warn(`[skip] ${name} — not found`)
    continue
  }

  const webpName = name.replace(/\.(png|jpe?g)$/i, '.webp')
  const dest = path.join(PUBLIC_DIR, webpName)

  const image = sharp(src, { limitInputPixels: false })
  const meta = await image.metadata()
  const needsResize = (meta.width || 0) > MAX_WIDTH
  const pipeline = needsResize ? image.resize({ width: MAX_WIDTH }) : image

  await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(dest)

  const afterStat = await fs.stat(dest)
  totalBefore += stat.size
  totalAfter += afterStat.size
  results.push({
    name,
    before: stat.size,
    after: afterStat.size,
    savings: ((1 - afterStat.size / stat.size) * 100).toFixed(0) + '%',
  })
}

results.sort((a, b) => b.before - a.before)
for (const r of results) {
  console.log(
    `${r.name.padEnd(40)} ${fmt(r.before).padStart(10)} -> ${fmt(r.after).padStart(10)}  (${r.savings} smaller)`,
  )
}
console.log('─'.repeat(80))
console.log(
  `${'TOTAL'.padEnd(40)} ${fmt(totalBefore).padStart(10)} -> ${fmt(totalAfter).padStart(10)}  (${(
    (1 - totalAfter / totalBefore) *
    100
  ).toFixed(0)}% smaller)`,
)
