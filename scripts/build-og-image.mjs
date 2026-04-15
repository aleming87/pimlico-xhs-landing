#!/usr/bin/env node
/**
 * Build the site's social-share card at the canonical Open Graph size
 * (1200 × 630, 1.91:1). Takes the existing cta-bg.jpg, crops it to the
 * correct ratio with a top bias to preserve the main composition, and
 * composites the brand wordmark + strapline over a subtle gradient so
 * the card reads on Twitter / LinkedIn / Google without Google having
 * to re-crop (which is what was producing the stretched preview).
 *
 * Output:  public/og-default.jpg
 *
 * Re-run any time the CTA background changes:
 *   node scripts/build-og-image.mjs
 */
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs/promises'

const PUBLIC = path.resolve(process.cwd(), 'public')
const SRC = path.join(PUBLIC, 'cta-bg.jpg')
const OUT = path.join(PUBLIC, 'og-default.jpg')

const W = 1200
const H = 630

// Smart crop: scale the 1920×1278 source so width = 1200, then
// crop vertically from a point that keeps the upper-centre composition.
const bg = sharp(SRC).resize({ width: W, height: H, fit: 'cover', position: 'north' })

const overlay = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#000" stop-opacity="0.20"/>
        <stop offset="60%" stop-color="#000" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <g font-family="Georgia, 'Playfair Display', serif" fill="#ffffff">
      <text x="64" y="${H - 200}" font-size="30" font-weight="400" letter-spacing="6" opacity="0.75">PIMLICO  ·  XHS™ COPILOT</text>
      <text x="64" y="${H - 120}" font-size="68" font-weight="500">Every regulatory change.</text>
      <text x="64" y="${H - 60}"  font-size="68" font-weight="500" font-style="italic">Analyzed.</text>
    </g>
    <g font-family="'JetBrains Mono', 'Courier New', monospace" fill="#ffffff" opacity="0.7">
      <text x="${W - 64}" y="${H - 60}" font-size="22" text-anchor="end">pimlicosolutions.com</text>
    </g>
  </svg>`
)

const out = await bg
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 86, progressive: true, chromaSubsampling: '4:4:4' })
  .toBuffer()

await fs.writeFile(OUT, out)

const { size } = await fs.stat(OUT)
console.log(`og-default.jpg  →  ${W}×${H}  ${(size / 1024).toFixed(0)} KB`)
