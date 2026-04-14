#!/usr/bin/env node
/**
 * One-shot image optimizer.
 *
 * Walks public/ for large PNGs (> 500 KB) and produces a sibling .webp
 * at a reasonable max width + quality. The original PNG is left in
 * place as a fallback; references in the codebase can be updated to
 * point at the .webp variant.
 *
 * Usage: node scripts/optimize-images.mjs [--max-width 2000] [--quality 82]
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const MIN_BYTES = 500 * 1024 // 500 KB
const MAX_WIDTH = Number(process.argv.find((a) => a.startsWith('--max-width='))?.split('=')[1] || 2000)
const QUALITY = Number(process.argv.find((a) => a.startsWith('--quality='))?.split('=')[1] || 82)

async function walk(dir) {
  const out = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(p)))
    else if (/\.png$/i.test(entry.name)) out.push(p)
  }
  return out
}

function fmt(n) {
  if (n > 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB'
  if (n > 1024) return (n / 1024).toFixed(0) + ' KB'
  return n + ' B'
}

const files = await walk(PUBLIC_DIR)
let totalBefore = 0
let totalAfter = 0
const results = []

for (const file of files) {
  const { size } = await fs.stat(file)
  if (size < MIN_BYTES) continue

  const webp = file.replace(/\.png$/i, '.webp')
  const image = sharp(file, { limitInputPixels: false })
  const meta = await image.metadata()
  const needsResize = (meta.width || 0) > MAX_WIDTH
  const pipeline = needsResize ? image.resize({ width: MAX_WIDTH }) : image

  await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(webp)

  const after = (await fs.stat(webp)).size
  totalBefore += size
  totalAfter += after
  results.push({
    file: path.relative(process.cwd(), file),
    before: size,
    after,
    savings: ((1 - after / size) * 100).toFixed(0) + '%',
  })
}

results.sort((a, b) => b.before - a.before)
for (const r of results) {
  console.log(`${r.file.padEnd(52)} ${fmt(r.before).padStart(9)} -> ${fmt(r.after).padStart(9)}  (${r.savings} smaller)`)
}
console.log('─'.repeat(80))
console.log(`${'TOTAL'.padEnd(52)} ${fmt(totalBefore).padStart(9)} -> ${fmt(totalAfter).padStart(9)}  (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}% smaller)`)
