#!/usr/bin/env node
/**
 * Generate the full brand-asset pack from the two source brandmarks.
 *
 * Inputs (versioned in public/):
 *   Pimlico_SI_Brandmark_Inverted.png   square-ish arch + keystone, white on transparent
 *   Pimlico_SI_Logo_Inverted.png        full wordmark, white on transparent
 *
 * Outputs → public/:
 *   pimlico-logo-square.png   1200×1200 square logo for schema.org Organization.logo
 *   apple-touch-icon.png      180×180   iOS home screen (edge-to-edge on dark bg)
 *   icon-192.png              192×192   PWA
 *   icon-512.png              512×512   PWA
 *   favicon-48.png            48×48
 *   favicon-32.png            32×32
 *   favicon-16.png            16×16
 *   og-default.jpg            1200×630  Open Graph share card (with wordmark stamp)
 *   og-{vertical}.jpg         1200×630  per-vertical OG cards
 *   og-regulators.jpg         1200×630  regulators hub
 *   og-frameworks.jpg         1200×630  frameworks hub
 *
 * Run:  node scripts/build-brand-assets.mjs
 */
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs/promises'

const PUBLIC = path.resolve(process.cwd(), 'public')
const MARK = path.join(PUBLIC, 'Pimlico_SI_Brandmark_Inverted.png')
const WORDMARK = path.join(PUBLIC, 'Pimlico_SI_Logo_Inverted.png')

// Brand palette — aligned with Tailwind CSS variables on the site.
const BG = '#020617'           // page background
const BG_SOFT = '#0b1229'      // card surface
const ACCENT = '#e48b0c'       // keystone orange

// ---------------------------------------------------------------------------
// Helper: place `src` centered onto a canvas of given size with % padding.
// ---------------------------------------------------------------------------
async function badge({ size, pad = 0.18, bg = BG, out, edgeToEdge = false }) {
  const meta = await sharp(MARK).metadata()
  const markW = meta.width
  const markH = meta.height
  const target = edgeToEdge ? size : Math.round(size * (1 - pad * 2))
  const scale = Math.min(target / markW, target / markH)
  const w = Math.round(markW * scale)
  const h = Math.round(markH * scale)

  const resizedMark = await sharp(MARK)
    .resize({ width: w, height: h, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer()

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resizedMark, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(out)
}

// ---------------------------------------------------------------------------
// Helper: 1200×630 OG card with wordmark stamp + headline + strapline.
// ---------------------------------------------------------------------------
async function ogCard({ out, kicker = 'PIMLICO · XHS™ COPILOT', headline, headlineItalic, strap = 'pimlicosolutions.com' }) {
  const W = 1200
  const H = 630

  // Background: tall vertical gradient across brand colors
  const bgSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0b1a3a"/>
          <stop offset="60%" stop-color="#061127"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <radialGradient id="glow" cx="85%" cy="15%" r="55%">
          <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>
    </svg>`

  // Wordmark: scale the 943×197 inverted wordmark to ~360px wide
  const wordmarkW = 360
  const wordmarkBuf = await sharp(WORDMARK)
    .resize({ width: wordmarkW, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer()
  const wm = await sharp(wordmarkBuf).metadata()

  // Text overlay (Playfair for headline, mono for kicker/strap)
  const textSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <g font-family="Georgia, 'Playfair Display', serif" fill="#ffffff">
        <text x="64" y="${H - 220}" font-size="22" font-weight="400" letter-spacing="6" opacity="0.7" font-family="'JetBrains Mono','Courier New',monospace">${kicker}</text>
        <text x="64" y="${H - 130}" font-size="64" font-weight="500">${headline}</text>
        ${headlineItalic ? `<text x="64" y="${H - 60}" font-size="64" font-weight="500" font-style="italic">${headlineItalic}</text>` : ''}
      </g>
      <text x="${W - 64}" y="${H - 60}" text-anchor="end" font-family="'JetBrains Mono','Courier New',monospace" font-size="22" fill="#ffffff" opacity="0.65">${strap}</text>
    </svg>`

  await sharp(Buffer.from(bgSvg))
    .composite([
      { input: wordmarkBuf, top: 56, left: 60 },
      { input: Buffer.from(textSvg), top: 0, left: 0 },
    ])
    .jpeg({ quality: 88, progressive: true, chromaSubsampling: '4:4:4' })
    .toFile(out)
}

// ---------------------------------------------------------------------------
// Run everything
// ---------------------------------------------------------------------------
await fs.mkdir(PUBLIC, { recursive: true })

// Logos + icons
await badge({ size: 1200, pad: 0.18, out: path.join(PUBLIC, 'pimlico-logo-square.png') })
await badge({ size: 512, pad: 0.16, out: path.join(PUBLIC, 'icon-512.png') })
await badge({ size: 192, pad: 0.16, out: path.join(PUBLIC, 'icon-192.png') })
await badge({ size: 180, pad: 0.12, out: path.join(PUBLIC, 'apple-touch-icon.png'), edgeToEdge: false })
await badge({ size: 48,  pad: 0.10, out: path.join(PUBLIC, 'favicon-48.png') })
await badge({ size: 32,  pad: 0.08, out: path.join(PUBLIC, 'favicon-32.png') })
await badge({ size: 16,  pad: 0.06, out: path.join(PUBLIC, 'favicon-16.png') })

// Default OG card (replaces existing)
await ogCard({
  out: path.join(PUBLIC, 'og-default.jpg'),
  headline: 'Every regulatory change.',
  headlineItalic: 'Analyzed.',
})

// Per-vertical OG cards
const VERTICALS = [
  { slug: 'gambling',  kicker: 'GAMBLING COMPLIANCE',  headline: '150+ authorities.',  headlineItalic: 'Tracked daily.' },
  { slug: 'payments',  kicker: 'PAYMENTS COMPLIANCE',  headline: 'PSD2, PSR, DORA.',   headlineItalic: 'End to end.' },
  { slug: 'crypto',    kicker: 'CRYPTO COMPLIANCE',    headline: 'MiCA, Travel Rule.', headlineItalic: 'Live.' },
  { slug: 'ai',        kicker: 'AI COMPLIANCE',        headline: 'EU AI Act, NIST.',   headlineItalic: 'Mapped.' },
]
for (const v of VERTICALS) {
  await ogCard({
    out: path.join(PUBLIC, `og-${v.slug}.jpg`),
    kicker: `PIMLICO · ${v.kicker}`,
    headline: v.headline,
    headlineItalic: v.headlineItalic,
  })
}

// Hub OG cards
await ogCard({
  out: path.join(PUBLIC, 'og-regulators.jpg'),
  kicker: 'PIMLICO · REGULATORS',
  headline: 'Every major authority,',
  headlineItalic: 'under one roof.',
})
await ogCard({
  out: path.join(PUBLIC, 'og-frameworks.jpg'),
  kicker: 'PIMLICO · FRAMEWORKS',
  headline: 'Level 1 to enforcement.',
  headlineItalic: 'Tracked.',
})

console.log('Generated brand assets:')
for (const name of [
  'pimlico-logo-square.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'favicon-48.png',
  'favicon-32.png',
  'favicon-16.png',
  'og-default.jpg',
  ...VERTICALS.map((v) => `og-${v.slug}.jpg`),
  'og-regulators.jpg',
  'og-frameworks.jpg',
]) {
  const s = await fs.stat(path.join(PUBLIC, name))
  console.log(`  ${name.padEnd(30)} ${(s.size / 1024).toFixed(0)} KB`)
}
