export const runtime = 'edge';

import { NextResponse } from 'next/server';
// @vercel/blob removed for Cloudflare migration
const list = async () => ({ blobs: [] });
const put = async () => ({ url: '' });
import { marked } from 'marked';

const BLOB_SUBSCRIBERS_KEY = 'updates/subscribers.json';
const BLOB_HISTORY_KEY = 'updates/history.json';
const BLOB_SCHEDULED_KEY = 'updates/scheduled.json';
const BLOB_ORGS_KEY = 'updates/organizations.json';

/* ── Blob helpers ── */
async function readBlob(key, fallback) {
  try {
    const { blobs } = await list({ prefix: key });
    // Find exact match to avoid prefix collisions
    const exact = blobs.find(b => b.pathname === key) || blobs[0];
    if (!exact) return fallback;
    const res = await fetch(exact.url, { cache: 'no-store' });
    const data = await res.json();
    // Ensure array fallback works correctly
    if (Array.isArray(fallback) && !Array.isArray(data)) return fallback;
    return data;
  } catch { return fallback; }
}

async function writeBlob(key, data) {
  try {
    const { del } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: key.replace('.json', '') });
    for (const blob of blobs) await del(blob.url);
  } catch { /* ignore */ }
  await put(key, JSON.stringify(data, null, 2), { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
}

const XHS_LOGO_WHITE = 'https://pimlicosolutions.com/_next/image?url=%2FXHS_Logo_White.png&w=750&q=75';

/* ──────────────────────────────────────────────
   LIGHT EMAIL SHELL
   Footer modelled on pimlicosolutions.com
   ────────────────────────────────────────────── */
function emailShellLight({ subject, preheader, headerHtml, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${subject}</title>
<!--[if mso]><style>table,td{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
<style>
@media only screen and (max-width:620px){
  .outer{width:100%!important;}
  .inner{padding:20px 16px!important;}
  .hdr{padding:28px 16px 20px!important;}
  .hdr-title{font-size:20px!important;}
  .hdr-logo{width:80px!important;}
  .ftr{padding:16px!important;}
  .card-wrap{border-radius:6px!important;}
  .card-cell{padding:12px 14px!important;}
  .flag-bar{padding:8px 14px!important;}
  .pill{font-size:9px!important;padding:2px 7px!important;}
  .cta-btn{padding:6px 10px!important;font-size:9px!important;}
  .ftr-logo{width:60px!important;}
}
.eb h1{color:#111827;font-size:20px;font-weight:700;margin:20px 0 8px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;}
.eb h2{color:#1f2937;font-size:17px;font-weight:600;margin:18px 0 6px;}
.eb h3{color:#374151;font-size:14px;font-weight:600;margin:14px 0 4px;text-transform:uppercase;letter-spacing:.4px;}
.eb p{color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 14px;}
.eb a{color:#2563eb;text-decoration:underline;text-underline-offset:2px;}
.eb ul,.eb ol{color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 14px;padding-left:18px;}
.eb li{margin-bottom:4px;}
.eb strong{color:#111827;font-weight:600;}
.eb em{color:#4f46e5;}
.eb blockquote{border-left:3px solid #2563eb;margin:12px 0;padding:8px 16px;background:#eff6ff;border-radius:0 6px 6px 0;}
.eb blockquote p{color:#1e40af;margin:0;font-size:14px;}
.eb code{background:#f3f4f6;color:#4f46e5;padding:1px 4px;border-radius:3px;font-size:13px;font-family:monospace;}
.eb pre{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px;overflow-x:auto;margin:0 0 14px;}
.eb pre code{background:none;padding:0;}
.eb hr{border:none;border-top:1px solid #e5e7eb;margin:20px 0;}
.eb img{max-width:100%;height:auto;border-radius:6px;}
</style>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f0f2f5;color:#1f2937;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" class="outer" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06),0 8px 32px rgba(0,0,0,.04);">
<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#0c1d3a 0%,#142d5e 40%,#1e3f8a 100%);">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="hdr" style="padding:40px 40px 32px;">${headerHtml}</td></tr>
</table>
<div style="height:3px;background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 30%,#ec4899 60%,#f59e0b 100%);"></div>
</td></tr>
<!-- Body -->
<tr><td class="inner" style="padding:32px 40px 28px;background-color:#ffffff;">${bodyHtml}</td></tr>
<!-- Footer -->
<tr><td style="background-color:#ffffff;border-top:1px solid #e5e7eb;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="ftr" style="padding:24px 40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align:middle;text-align:left;">
  <img class="ftr-logo" src="https://pimlicosolutions.com/Pimlico_Logo.png" alt="Pimlico" width="90" style="width:90px;height:auto;display:block;" />
</td>
<td style="vertical-align:middle;text-align:right;">
  <a class="cta-btn" href="https://pimlicosolutions.com" style="display:inline-block;background-color:#1e3a8a;color:#ffffff;font-size:11px;font-weight:600;text-decoration:none;padding:8px 18px;border-radius:5px;letter-spacing:.2px;">Open in XHS &rarr;</a>
</td>
</tr>
</table>
</td></tr>
<tr><td style="padding:0 40px 16px;">
  <div style="border-top:1px solid #f3f4f6;padding-top:10px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="font-size:11px;color:#9ca3af;">&copy; ${new Date().getFullYear()} Pimlico Solutions Ltd.</td>
      <td style="text-align:right;vertical-align:middle;">
        <a href="https://www.linkedin.com/company/wearepimlico/" style="text-decoration:none;" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="13" height="13" style="width:13px;height:13px;display:inline-block;opacity:.35;" /></a>
      </td>
    </tr>
    </table>
  </div>
</td></tr>
</table>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ──────────────────────────────────────────────
   DARK EMAIL SHELL
   ────────────────────────────────────────────── */
function emailShellDark({ subject, preheader, headerHtml, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${subject}</title>
<!--[if mso]><style>table,td{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
<style>
@media only screen and (max-width:620px){
  .outer{width:100%!important;}
  .inner{padding:20px 16px!important;}
  .hdr{padding:28px 16px 20px!important;}
  .hdr-title{font-size:20px!important;}
  .hdr-logo{width:80px!important;}
  .ftr{padding:16px!important;}
  .card-wrap{border-radius:6px!important;}
  .card-cell{padding:12px 14px!important;}
  .flag-bar{padding:8px 14px!important;}
  .pill{font-size:9px!important;padding:2px 7px!important;}
  .cta-btn{padding:6px 10px!important;font-size:9px!important;}
  .ftr-logo{width:60px!important;}
}
.eb h1{color:#f1f5f9;font-size:20px;font-weight:700;margin:20px 0 8px;padding-bottom:6px;border-bottom:1px solid #1e293b;}
.eb h2{color:#e2e8f0;font-size:17px;font-weight:600;margin:18px 0 6px;}
.eb h3{color:#cbd5e1;font-size:14px;font-weight:600;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.4px;}
.eb p{color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 14px;}
.eb a{color:#818cf8;text-decoration:underline;text-underline-offset:2px;}
.eb ul,.eb ol{color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 14px;padding-left:18px;}
.eb li{margin-bottom:4px;}
.eb strong{color:#e2e8f0;font-weight:600;}
.eb em{color:#a5b4fc;}
.eb blockquote{border-left:3px solid #6366f1;margin:12px 0;padding:8px 16px;background:rgba(99,102,241,.06);border-radius:0 6px 6px 0;}
.eb blockquote p{color:#a5b4fc;margin:0;font-size:14px;}
.eb code{background:#0f172a;color:#a5b4fc;padding:1px 4px;border-radius:3px;font-size:13px;font-family:monospace;}
.eb pre{background:#0f172a;border:1px solid #1e293b;border-radius:6px;padding:12px;overflow-x:auto;margin:0 0 14px;}
.eb pre code{background:none;padding:0;}
.eb hr{border:none;border-top:1px solid #1e293b;margin:20px 0;}
.eb img{max-width:100%;height:auto;border-radius:6px;}
</style>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#090e1a;color:#e2e8f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#090e1a;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" class="outer" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;border:1px solid #1e293b;">
<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#0c1d3a 0%,#142552 40%,#1a1145 100%);">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="hdr" style="padding:40px 40px 32px;">${headerHtml}</td></tr>
</table>
<div style="height:2px;background:linear-gradient(90deg,transparent 5%,#4f46e5 30%,#818cf8 50%,#4f46e5 70%,transparent 95%);"></div>
</td></tr>
<!-- Body -->
<tr><td class="inner" style="padding:32px 40px 28px;background-color:#111827;">${bodyHtml}</td></tr>
<!-- Footer -->
<tr><td style="background-color:#0f172a;border-top:1px solid #1e293b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="ftr" style="padding:24px 40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align:middle;text-align:left;">
  <img class="ftr-logo" src="https://pimlicosolutions.com/Pimlico_Logo.png" alt="Pimlico" width="90" style="width:90px;height:auto;display:block;filter:brightness(0) invert(1);" />
</td>
<td style="vertical-align:middle;text-align:right;">
  <a class="cta-btn" href="https://pimlicosolutions.com" style="display:inline-block;background-color:#3b82f6;color:#ffffff;font-size:11px;font-weight:600;text-decoration:none;padding:8px 18px;border-radius:5px;letter-spacing:.2px;">Open in XHS &rarr;</a>
</td>
</tr>
</table>
</td></tr>
<tr><td style="padding:0 40px 16px;">
  <div style="border-top:1px solid #1e293b;padding-top:10px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="font-size:11px;color:#475569;">&copy; ${new Date().getFullYear()} Pimlico Solutions Ltd.</td>
      <td style="text-align:right;vertical-align:middle;">
        <a href="https://www.linkedin.com/company/wearepimlico/" style="text-decoration:none;" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="13" height="13" style="width:13px;height:13px;display:inline-block;opacity:.4;" /></a>
      </td>
    </tr>
    </table>
  </div>
</td></tr>
</table>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── Theme dispatcher ── */
function emailShell(opts) {
  return opts.theme === 'light' ? emailShellLight(opts) : emailShellDark(opts);
}

/* ──────────────────────────────────────────────
   STANDARD MARKDOWN EMAIL
   ────────────────────────────────────────────── */
function markdownToEmail(md, subject, { recipientName, orgConfig, theme } = {}) {
  const html = marked.parse(md || '');
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const isLight = theme === 'light';
  const orgName = orgConfig?.name || '';

  const title = subject.replace(/\s*[|\u2014].*$/, '');
  const headerHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align:middle;text-align:left;width:60%;">
  <h1 class="hdr-title" style="margin:0 0 6px;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-.3px;line-height:1.2;">${title}</h1>
  <p style="margin:0 0 ${orgName ? '4px' : '0'};color:rgba(255,255,255,.65);font-size:13px;font-weight:400;">${date}</p>
  ${orgName ? `<p style="margin:0;color:rgba(255,255,255,.45);font-size:11px;font-weight:500;letter-spacing:.3px;text-transform:uppercase;">Prepared for ${orgName}</p>` : ''}
</td>
<td style="vertical-align:middle;text-align:right;width:40%;padding-left:12px;">
  <img class="hdr-logo" src="${XHS_LOGO_WHITE}" alt="Pimlico XHS" width="130" style="width:130px;max-width:130px;height:auto;display:inline-block;" />
</td>
</tr>
</table>`;

  const greeting = recipientName
    ? `<p style="color:${isLight ? '#1f2937' : '#e2e8f0'};font-size:15px;margin:0 0 18px;font-weight:500;">Hello ${recipientName},</p>`
    : '';

  const bodyHtml = `${greeting}<div class="eb" style="font-size:15px;color:${isLight ? '#4b5563' : '#94a3b8'};line-height:1.7;">${html}</div>`;

  return emailShell({ subject, preheader: `${subject} | ${date}`, headerHtml, bodyHtml, theme });
}

/* ── Parse Horizon Scan markdown ── */
function parseHorizonScan(markdown) {
  const sections = [];
  const blocks = markdown.split(/^##\s+/m).filter(s => s.trim());
  for (const block of blocks) {
    const lines = block.split('\n');
    const h = lines[0].trim();
    const fm = h.match(/^([\u{1F1E6}-\u{1F1FF}]{2})\s*/u);
    const flag = fm ? fm[1] : '';
    const country = flag ? h.slice(fm[0].length).trim() : h.trim();
    const section = { flag, country, updates: [] };
    for (const ub of block.split(/^###\s+/m).slice(1)) {
      const ul = ub.trim().split('\n');
      const headline = ul[0].trim();
      let desc = '', tags = '', link = '', authority = '';
      for (let i = 1; i < ul.length; i++) {
        const l = ul[i].trim();
        if (!l || l === '---') continue;
        if (l.startsWith('**Tags:**')) tags = l.replace('**Tags:**', '').trim();
        else if (l.startsWith('**Authority:**')) authority = l.replace('**Authority:**', '').trim();
        else if (l.match(/^\[.+\]\(.+\)$/)) { const m = l.match(/\[.+?\]\((.+?)\)/); if (m) link = m[1]; }
        else desc += (desc ? ' ' : '') + l;
      }
      section.updates.push({ headline, desc, tags, link, authority });
    }
    if (section.updates.length) sections.push(section);
  }
  return sections;
}

/* ── Horizon Scan email ── */
function horizonScanToEmail(md, { recipientName, orgConfig, jurisdictions, theme } = {}) {
  let sections = parseHorizonScan(md);
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const isLight = theme === 'light';
  const orgName = orgConfig?.name || '';

  if (jurisdictions?.length) {
    const jSet = new Set(jurisdictions.map(j => j.toLowerCase()));
    sections = sections.filter(s => jSet.has(s.country.toLowerCase()));
  }

  const total = sections.reduce((n, s) => n + s.updates.length, 0);
  const subject = `XHS Daily Horizon Scan \u2014 ${date}`;

  /* Colour palette */
  const cardBorder = isLight ? '#e5e7eb' : '#1e293b';
  const headlineColor = isLight ? '#111827' : '#f1f5f9';
  const descColor = isLight ? '#4b5563' : '#94a3b8';
  const authorityColor = isLight ? '#6b7280' : '#64748b';
  const countryColor = isLight ? '#111827' : '#e2e8f0';
  const linkColor = isLight ? '#2563eb' : '#818cf8';
  const pillBg = isLight ? '#f3f4f6' : '#1e293b';
  const pillColor = isLight ? '#4b5563' : '#94a3b8';
  const pillBorder = isLight ? '#e5e7eb' : '#334155';
  const greetingColor = isLight ? '#111827' : '#e2e8f0';
  const introColor = isLight ? '#4b5563' : '#94a3b8';
  const bodyBg = isLight ? '#ffffff' : '#111827';

  /* Greeting + intro */
  const greeting = recipientName
    ? `<p style="color:${greetingColor};font-size:15px;margin:0 0 4px;font-weight:600;">Hello ${recipientName},</p>`
    : '';
  const intro = `<p style="color:${introColor};font-size:14px;line-height:1.6;margin:0 0 24px;">Here are today's regulatory developments across your tracked jurisdictions.</p>`;

  /* Update cards — clean contained cards under jurisdiction headers */
  const flagBarBg = isLight ? '#f8fafc' : '#0f172a';
  const flagBarBorder = isLight ? '#e2e8f0' : '#1e293b';
  const cardBg = isLight ? '#ffffff' : '#141c2e';
  const cards = sections.map(s => {
    const updates = s.updates.map((u, i) => {
      const pills = u.tags ? u.tags.split(/\s*\u00b7\s*/).map(t => t.trim()).filter(Boolean).map(t =>
        `<span class="pill" style="display:inline-block;background:${pillBg};color:${pillColor};font-size:10px;padding:3px 8px;border-radius:4px;margin:0 4px 4px 0;border:1px solid ${pillBorder};letter-spacing:.3px;font-weight:500;">${t}</span>`
      ).join('') : '';

      const isLast = i === s.updates.length - 1;

      return `<tr><td class="card-cell" style="padding:14px 16px;${!isLast ? `border-bottom:1px solid ${cardBorder};` : ''}">
  <p style="margin:0 0 3px;font-size:14px;font-weight:600;line-height:1.35;"><a href="${u.link || '#'}" style="color:${headlineColor};text-decoration:none;">${u.headline}</a></p>
  ${u.authority ? `<p style="margin:0 0 6px;font-size:10px;color:${authorityColor};font-weight:600;text-transform:uppercase;letter-spacing:.5px;">${u.authority}</p>` : ''}
  <p style="color:${descColor};font-size:13px;line-height:1.55;margin:0 0 ${pills || u.link ? '8px' : '0'};">${u.desc}</p>
  ${pills ? `<div style="margin:0 0 ${u.link ? '6px' : '0'};">${pills}</div>` : ''}
  ${u.link ? `<p style="margin:0;"><a href="${u.link}" style="color:${linkColor};font-size:11px;font-weight:500;text-decoration:none;">Read more \u2192</a></p>` : ''}
</td></tr>`;
    }).join('');

    return `<!-- ${s.country} -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr><td class="flag-bar" style="padding:10px 16px;background:${flagBarBg};border:1px solid ${flagBarBorder};border-bottom:none;border-radius:8px 8px 0 0;">
    <span style="font-size:15px;vertical-align:middle;margin-right:8px;">${s.flag}</span>
    <span style="color:${countryColor};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;vertical-align:middle;">${s.country}</span>
  </td></tr>
  <tr><td>
    <table class="card-wrap" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${cardBorder};border-radius:0 0 8px 8px;overflow:hidden;background:${cardBg};">${updates}</table>
  </td></tr>
</table>`;
  }).join('');

  /* Fallback if no content parsed */
  const fallback = !cards ? `<p style="color:${introColor};font-size:14px;padding:20px;text-align:center;background:${pillBg};border-radius:8px;">No regulatory updates were found for the selected jurisdictions today.</p>` : '';

  /* Two-column header */
  const headerHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align:middle;text-align:left;width:60%;">
  <h1 class="hdr-title" style="margin:0 0 6px;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-.3px;line-height:1.2;">Daily Horizon Scan</h1>
  <p style="margin:0 0 ${orgName ? '4px' : '0'};color:rgba(255,255,255,.65);font-size:13px;font-weight:400;">${date}</p>
  ${orgName ? `<p style="margin:0;color:rgba(255,255,255,.45);font-size:11px;font-weight:500;letter-spacing:.3px;text-transform:uppercase;">Prepared for ${orgName}</p>` : ''}
</td>
<td style="vertical-align:middle;text-align:right;width:40%;padding-left:12px;">
  <img class="hdr-logo" src="${XHS_LOGO_WHITE}" alt="Pimlico XHS" width="130" style="width:130px;max-width:130px;height:auto;display:inline-block;" />
</td>
</tr>
</table>`;

  return emailShell({ subject, preheader: `Latest regulatory developments | ${date}`, headerHtml, bodyHtml: `${greeting}${intro}${cards || fallback}`, theme });
}

/* ─── HELPERS ─── */
async function sendEmail({ to, subject, html }) {
  const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
  const fromAddress = senderEmail.includes('<') ? senderEmail : `Pimlico XHS\u2122 <${senderEmail}>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: fromAddress, to, subject, html }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || res.statusText); }
  return res.json();
}

/* ═══════════════════ GET ═══════════════════ */
export async function GET() {
  const [subscribers, history, scheduled, organizations] = await Promise.all([
    readBlob(BLOB_SUBSCRIBERS_KEY, []),
    readBlob(BLOB_HISTORY_KEY, []),
    readBlob(BLOB_SCHEDULED_KEY, []),
    readBlob(BLOB_ORGS_KEY, []),
  ]);
  return NextResponse.json({ success: true, subscribers, history, scheduled, organizations });
}

/* ═══════════════════ POST ═══════════════════ */
export async function POST(request) {
  try {
  const body = await request.json();
  const { action } = body;

  /* ── Organization CRUD ── */
  if (action === 'save-organization') {
    const { organization } = body; // { id?, name, logoUrl, jurisdictions[] }
    const orgs = await readBlob(BLOB_ORGS_KEY, []);
    if (organization.id) {
      const idx = orgs.findIndex(o => o.id === organization.id);
      if (idx >= 0) orgs[idx] = { ...orgs[idx], ...organization };
      else orgs.push({ ...organization, id: crypto.randomUUID() });
    } else {
      orgs.push({ ...organization, id: crypto.randomUUID() });
    }
    await writeBlob(BLOB_ORGS_KEY, orgs);
    return NextResponse.json({ success: true, organizations: orgs });
  }

  if (action === 'delete-organization') {
    const { organisationId } = body;
    let orgs = await readBlob(BLOB_ORGS_KEY, []);
    orgs = orgs.filter(o => o.id !== organisationId);
    await writeBlob(BLOB_ORGS_KEY, orgs);
    return NextResponse.json({ success: true, organizations: orgs });
  }

  /* ── Subscriber management ── */
  if (action === 'add-subscribers') {
    const existing = await readBlob(BLOB_SUBSCRIBERS_KEY, []);
    const existingEmails = existing.map(s => (s.email || '').toLowerCase());
    const incoming = Array.isArray(body.subscribers || body.emails) ? (body.subscribers || body.emails) : [];
    const org = body.org;
    const added = [];
    for (const s of incoming) {
      const entry = typeof s === 'string' ? { email: s } : s;
      if (!existingEmails.includes(entry.email.toLowerCase())) {
        existing.push({ ...entry, organization: org || entry.organization || '', id: crypto.randomUUID(), addedAt: new Date().toISOString() });
        existingEmails.push(entry.email.toLowerCase());
        added.push(entry.email);
      }
    }
    await writeBlob(BLOB_SUBSCRIBERS_KEY, existing);
    return NextResponse.json({ success: true, added, subscribers: existing });
  }

  if (action === 'remove-subscriber') {
    let subs = await readBlob(BLOB_SUBSCRIBERS_KEY, []);
    const id = body.subscriberId || body.id;
    const email = body.email;
    subs = subs.filter(s => id ? s.id !== id : s.email !== email);
    await writeBlob(BLOB_SUBSCRIBERS_KEY, subs);
    return NextResponse.json({ success: true, subscribers: subs });
  }

  if (action === 'update-subscriber') {
    const subs = await readBlob(BLOB_SUBSCRIBERS_KEY, []);
    const id = body.subscriber?.id || body.id;
    const email = body.email;
    const updates = body.subscriber || body.updates || {};
    const idx = subs.findIndex(s => id ? s.id === id : s.email === email);
    if (idx >= 0) {
      // Map 'org' to 'organization' for consistency
      if (updates.org !== undefined) { updates.organization = updates.org; delete updates.org; }
      subs[idx] = { ...subs[idx], ...updates };
    }
    await writeBlob(BLOB_SUBSCRIBERS_KEY, subs);
    return NextResponse.json({ success: true, subscribers: subs });
  }

  if (action === 'import-from-onboarding') {
    const existing = await readBlob(BLOB_SUBSCRIBERS_KEY, []);
    const onboardingSubs = await readBlob('onboarding/submissions.json', []);
    const emails = existing.map(s => (s.email || '').toLowerCase());
    const added = [];
    for (const s of onboardingSubs) {
      const email = s.email || s.contactEmail;
      const name = s.name || s.contactName || '';
      const org = s.company || s.organization || '';
      if (email && !emails.includes(email.toLowerCase())) {
        existing.push({ email, name, organization: org, id: crypto.randomUUID(), addedAt: new Date().toISOString(), source: 'onboarding' });
        emails.push(email.toLowerCase());
        added.push(email);
      }
    }
    await writeBlob(BLOB_SUBSCRIBERS_KEY, existing);
    return NextResponse.json({ success: true, added: added.length, total: existing.length, subscribers: existing });
  }

  /* ── Send test email ── */
  if (action === 'send-test') {
    const { testEmail, template, theme } = body;
    if (!testEmail) return NextResponse.json({ error: 'testEmail is required' }, { status: 400 });

    const testOrgConfig = { name: 'Acme Corp', logoUrl: '' };
    const testRecipientName = 'Andrew';

    let html, testSubject;
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    if (template === 'horizon-scan' || !template) {
    const sampleMarkdown = `## \ud83c\uddec\ud83c\udde7 United Kingdom

### FCA publishes PS26/3 on safeguarding requirements for payment firms
**Authority:** Financial Conduct Authority (FCA)
The FCA has finalised its safeguarding rules under PS26/3, requiring payment and e-money firms to hold client funds in statutory trust by Q3 2026. Affected firms must review their current arrangements and prepare implementation plans.
**Tags:** Payments \u00b7 Client Assets \u00b7 Publication
[Read more \u2192](https://www.fca.org.uk)

### PRA updates expectations on operational resilience for critical third parties
**Authority:** Prudential Regulation Authority (PRA)
Following the CTPs oversight regime, PRA published CP5/26 proposing minimum resilience standards for designated critical third parties providing services to the financial sector.
**Tags:** Banking \u00b7 Operational Resilience \u00b7 Consultation
[Read more \u2192](https://www.bankofengland.co.uk)

## \ud83c\udde8\ud83c\udde6 Canada

### Ontario Securities Commission proposes amendments to NI 31-103 for crypto dealer registration
**Authority:** Ontario Securities Commission (OSC)
The OSC issued proposed amendments streamlining the registration process for crypto asset trading platforms under NI 31-103, with a 90-day comment period now open.
**Tags:** Crypto \u00b7 Licensing & Authorisations \u00b7 Consultation
[Read more \u2192](https://www.osc.ca)

## \ud83c\uddfa\ud83c\uddf8 United States

### FinCEN issues proposed rule extending AML requirements to investment advisers
**Authority:** Financial Crimes Enforcement Network (FinCEN)
FinCEN has proposed a rule that would require SEC-registered investment advisers to implement AML/CFT programs and file suspicious activity reports, closing a longstanding gap.
**Tags:** AML/KYC \u00b7 Securities \u00b7 Proposed Rule
[Read more \u2192](https://www.fincen.gov)

### New York DFS updates BitLicense guidance on stablecoin reserves
**Authority:** New York Department of Financial Services (NYDFS)
NYDFS has published updated guidance requiring BitLicense holders to maintain 1:1 reserves in approved government securities or insured deposits for all USD-backed stablecoins.
**Tags:** Crypto \u00b7 Digital Assets \u00b7 Guideline
[Read more \u2192](https://www.dfs.ny.gov)

## \ud83c\uddea\ud83c\uddfa European Union

### EBA publishes final RTS on MiCA authorisation requirements
**Authority:** European Banking Authority (EBA)
The EBA has released final Regulatory Technical Standards for crypto-asset service provider authorisation under MiCA, covering governance, capital, and safeguarding requirements.
**Tags:** Crypto \u00b7 MiCA \u00b7 Implementation Measures
[Read more \u2192](https://www.eba.europa.eu)

### ESMA issues guidance on DORA reporting templates for ICT incidents
**Authority:** European Securities and Markets Authority (ESMA)
ESMA published final technical standards and reporting templates for ICT-related incident reporting under the Digital Operational Resilience Act, effective January 2027.
**Tags:** Payments \u00b7 Operational Resilience \u00b7 Technical Standards
[Read more \u2192](https://www.esma.europa.eu)`;

    testSubject = `XHS Daily Horizon Scan \u2014 ${date}`;
    html = horizonScanToEmail(sampleMarkdown, { recipientName: testRecipientName, orgConfig: testOrgConfig, theme });
    } else {
      const samplesByType = {
        'feature-update': { label: 'Feature Update', sample: `# Jurisdiction Alert Builder\n\nPimlico XHS\u2122 has launched the **Jurisdiction Alert Builder**, a new tool that lets you define custom monitoring rules for specific regulatory domains and geographies.\n\n## What's New\n\n### Custom Alert Rules\nCreate granular alert conditions based on jurisdiction, regulatory body, topic vertical, and document type. Alerts trigger in real time as new regulations are published.\n\n### Multi-Jurisdiction Grouping\nGroup alerts by client, portfolio, or internal team. Each group can have its own notification preferences and escalation rules.\n\n### Dashboard Integration\nAll alerts feed directly into your XHS\u2122 dashboard with full audit trail and compliance documentation support.\n\n## Getting Started\n\nThe Jurisdiction Alert Builder is available now in your XHS\u2122 dashboard under **Settings \u2192 Alerts**.` },
        'content-update': { label: 'Content Update', sample: `# The Future of Regulatory Intelligence\n\nThe regulatory landscape in 2026 is evolving faster than ever. With MiCA implementation across the EU and the UK's post-Brexit regulatory framework maturing, compliance teams need sharper tools.\n\n## Key Trends\n\n### AI-Driven Compliance Monitoring\nRegulators are increasingly adopting machine-readable formats for rule publication, enabling real-time compliance tracking and automated gap analysis.\n\n### Cross-Border Convergence\nDespite political fragmentation, technical standards in payments, crypto, and data protection are converging across major jurisdictions.\n\n### Operational Resilience\nDORA in the EU and the UK's CTP regime are setting new baselines for operational resilience that will reshape vendor management across financial services.` },
        'product-update': { label: 'Product Update', sample: `# Platform Update\n\nThe latest release of Pimlico XHS\u2122 includes performance improvements, new data sources, and enhanced reporting capabilities.\n\n## Changelog\n\n### New Data Sources\n- Added coverage for 12 new regulatory bodies across Southeast Asia\n- Real-time feed integration with ESMA's DORA reporting templates\n- Enhanced parsing for UK FCA policy statements\n\n### Performance\n- Dashboard load times reduced by 40% for large jurisdiction sets\n- Search indexing now updates within 60 seconds of publication\n\n### Bug Fixes\n- Fixed timezone display for scheduled alerts in non-GMT regions\n- Resolved CSV export encoding issue for special characters` },
      };
      const cfg = samplesByType[template] || { label: 'Update', sample: '# Update\n\nHere is the latest update from Pimlico XHS\u2122.\n\n## Key Points\n\n- Point one\n- Point two\n- Point three' };
      testSubject = `XHS ${cfg.label} \u2014 ${date}`;
      html = markdownToEmail(cfg.sample, testSubject, { recipientName: testRecipientName, orgConfig: testOrgConfig, theme });
    }

    try {
      await sendEmail({ to: testEmail, subject: `[TEST] ${testSubject}`, html });
      return NextResponse.json({ success: true, message: `Test email sent to ${testEmail}` });
    } catch (err) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  /* ── Send email ── */
  if (action === 'send') {
    const { subject, markdown, template, recipients, recipientEmails, theme } = body;
    const allSubs = await readBlob(BLOB_SUBSCRIBERS_KEY, []);
    const orgs = await readBlob(BLOB_ORGS_KEY, []);
    let targets;
    if (recipients?.length) {
      targets = allSubs.filter(s => recipients.includes(s.id));
    } else if (recipientEmails?.length) {
      const emailSet = new Set(recipientEmails.map(e => e.toLowerCase()));
      targets = allSubs.filter(s => emailSet.has(s.email.toLowerCase()));
    } else {
      targets = allSubs;
    }

    const results = [];
    for (const sub of targets) {
      const orgConfig = sub.organization
        ? orgs.find(o => o.name?.toLowerCase() === sub.organization.toLowerCase()) || {}
        : {};
      const recipientName = sub.name?.split(' ')[0] || '';

      let html;
      if (template === 'horizon-scan') {
        html = horizonScanToEmail(markdown, { recipientName, orgConfig, jurisdictions: orgConfig.jurisdictions, theme });
      } else {
        html = markdownToEmail(markdown, subject, { recipientName, orgConfig, theme });
      }

      try {
        await sendEmail({ to: sub.email, subject, html });
        results.push({ email: sub.email, success: true });
      } catch (err) {
        results.push({ email: sub.email, success: false, error: err.message });
      }
    }

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const history = await readBlob(BLOB_HISTORY_KEY, []);
    history.unshift({
      id: crypto.randomUUID(),
      subject,
      markdown,
      template: template || 'standard',
      theme: theme || 'dark',
      sentAt: new Date().toISOString(),
      recipientCount: targets.length,
      sent,
      failed,
      results,
    });
    await writeBlob(BLOB_HISTORY_KEY, history);
    return NextResponse.json({ success: true, sent, failed, results });
  }

  /* ── Schedule email ── */
  if (action === 'schedule') {
    const scheduled = await readBlob(BLOB_SCHEDULED_KEY, []);
    scheduled.push({
      id: crypto.randomUUID(),
      subject: body.subject,
      markdown: body.markdown,
      template: body.template || 'standard',
      theme: body.theme || 'dark',
      scheduledFor: body.scheduledFor,
      recipients: body.recipients || [],
      createdAt: new Date().toISOString(),
    });
    await writeBlob(BLOB_SCHEDULED_KEY, scheduled);
    return NextResponse.json({ success: true, scheduled });
  }

  if (action === 'cancel-scheduled') {
    let scheduled = await readBlob(BLOB_SCHEDULED_KEY, []);
    const cancelId = body.scheduledId || body.id;
    scheduled = scheduled.filter(s => s.id !== cancelId);
    await writeBlob(BLOB_SCHEDULED_KEY, scheduled);
    return NextResponse.json({ success: true, scheduled });
  }

  if (action === 'send-scheduled') {
    let scheduled = await readBlob(BLOB_SCHEDULED_KEY, []);
    const item = scheduled.find(s => s.id === body.scheduledId);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const allSubs = await readBlob(BLOB_SUBSCRIBERS_KEY, []);
    const orgs = await readBlob(BLOB_ORGS_KEY, []);
    const targets = item.recipients?.length
      ? allSubs.filter(s => item.recipients.includes(s.id))
      : allSubs;

    const results = [];
    for (const sub of targets) {
      const orgConfig = sub.organization
        ? orgs.find(o => o.name?.toLowerCase() === sub.organization.toLowerCase()) || {}
        : {};
      const recipientName = sub.name?.split(' ')[0] || '';

      let html;
      if (item.template === 'horizon-scan') {
        html = horizonScanToEmail(item.markdown, { recipientName, orgConfig, jurisdictions: orgConfig.jurisdictions, theme: item.theme });
      } else {
        html = markdownToEmail(item.markdown, item.subject, { recipientName, orgConfig, theme: item.theme });
      }

      try {
        await sendEmail({ to: sub.email, subject: item.subject, html });
        results.push({ email: sub.email, success: true });
      } catch (err) {
        results.push({ email: sub.email, success: false, error: err.message });
      }
    }

    const sentCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;
    const history = await readBlob(BLOB_HISTORY_KEY, []);
    history.unshift({
      id: crypto.randomUUID(),
      subject: item.subject,
      markdown: item.markdown,
      template: item.template || 'standard',
      theme: item.theme || 'dark',
      sentAt: new Date().toISOString(),
      recipientCount: targets.length,
      sent: sentCount,
      failed: failedCount,
      results,
      scheduled: true,
    });
    await writeBlob(BLOB_HISTORY_KEY, history);

    scheduled = scheduled.filter(s => s.id !== body.scheduledId);
    await writeBlob(BLOB_SCHEDULED_KEY, scheduled);
    return NextResponse.json({ success: true, results });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('POST /api/updates error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}