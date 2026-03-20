import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { marked } from 'marked';

const BLOB_SUBSCRIBERS_KEY = 'updates/subscribers.json';
const BLOB_HISTORY_KEY = 'updates/history.json';
const BLOB_SCHEDULED_KEY = 'updates/scheduled.json';
const BLOB_ORGS_KEY = 'updates/organisations.json';

/* ── Blob helpers ── */
async function readBlob(prefix, fallback) {
  try {
    const { blobs } = await list({ prefix });
    if (blobs.length === 0) return fallback;
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
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

const XHS_ICON = 'https://pimlico-xhs-landing.vercel.app/company/pimlico-icon.png';

/* ── Shared email shell ── */
function emailShell({ subject, preheader, headerHtml, bodyHtml, orgConfig }) {
  const clientLogo = orgConfig?.logoUrl;
  const cobrandRow = clientLogo
    ? `<tr><td style="padding:12px 40px 20px;text-align:center;background-color:#111827;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
          <td style="vertical-align:middle;"><img src="${clientLogo}" alt="" width="32" height="32" style="width:32px;height:32px;border-radius:6px;object-fit:contain;display:block;" /></td>
          <td style="vertical-align:middle;padding:0 10px;color:#334155;font-size:16px;line-height:1;">\u00d7</td>
          <td style="vertical-align:middle;"><img src="${XHS_ICON}" alt="XHS" width="32" height="32" style="width:32px;height:32px;border-radius:6px;object-fit:contain;display:block;" /></td>
        </tr></table>
      </td></tr>` : '';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${subject}</title>
<!--[if mso]><style>table,td{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
<style>
@media only screen and (max-width:620px){.outer{width:100%!important;}.inner{padding:24px 20px!important;}.hdr{padding:36px 20px 28px!important;}.ftr{padding:24px 20px!important;}h1{font-size:20px!important;}}
.eb h1{color:#f1f5f9;font-size:20px;font-weight:700;margin:24px 0 8px;padding-bottom:6px;border-bottom:1px solid #1e293b;}
.eb h2{color:#e2e8f0;font-size:17px;font-weight:600;margin:20px 0 6px;}
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
<tr><td style="background:linear-gradient(160deg,#0f1b3d 0%,#1a1145 50%,#0f1b3d 100%);">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="hdr" style="padding:44px 40px 32px;text-align:center;">${headerHtml}</td></tr>
</table>
<div style="height:2px;background:linear-gradient(90deg,transparent 5%,#4f46e5 30%,#818cf8 50%,#4f46e5 70%,transparent 95%);"></div>
</td></tr>
<!-- Body -->
<tr><td class="inner" style="padding:32px 40px 24px;background-color:#111827;">${bodyHtml}</td></tr>
${cobrandRow}
<!-- Footer -->
<tr><td style="background-color:#090e1a;border-top:1px solid #1e293b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="ftr" style="padding:24px 40px;text-align:center;">
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
<tr>
<td style="padding:0 5px;"><a href="https://www.linkedin.com/company/pimlico-solutions" style="display:block;width:26px;height:26px;background:#1e293b;border-radius:6px;text-align:center;line-height:26px;text-decoration:none;font-size:11px;color:#94a3b8;">in</a></td>
<td style="padding:0 5px;"><a href="https://pimlicosolutions.com" style="display:block;width:26px;height:26px;background:#1e293b;border-radius:6px;text-align:center;line-height:26px;text-decoration:none;font-size:11px;">\ud83c\udf10</a></td>
</tr>
</table>
<p style="margin:0 0 3px;font-size:12px;color:#94a3b8;font-weight:600;">Pimlico XHS\u2122</p>
<p style="margin:0;font-size:11px;color:#475569;"><a href="https://pimlicosolutions.com" style="color:#6366f1;text-decoration:none;">pimlicosolutions.com</a></p>
</td></tr>
</table>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── Standard markdown email ── */
function markdownToEmail(md, subject, { recipientName, orgConfig } = {}) {
  const html = marked.parse(md);
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const hi = recipientName ? `<p style="color:#cbd5e1;font-size:15px;margin:0 0 18px;">Hi ${recipientName},</p>` : '';

  const headerHtml = `
    <div style="margin-bottom:18px;"><img src="${XHS_ICON}" alt="XHS" width="44" height="44" style="width:44px;height:44px;border-radius:10px;display:inline-block;" /></div>
    <h1 style="margin:0 0 6px;color:#fff;font-size:24px;font-weight:700;letter-spacing:-.3px;line-height:1.3;">${subject}</h1>
    <p style="margin:0;color:#94a3b8;font-size:13px;">${date}</p>`;

  return emailShell({ subject, preheader: `${subject} \u2014 ${date}`, headerHtml, bodyHtml: `${hi}<div class="eb" style="font-size:15px;color:#94a3b8;line-height:1.7;">${html}</div>`, orgConfig });
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
      let desc = '', tags = '', link = '';
      for (let i = 1; i < ul.length; i++) {
        const l = ul[i].trim();
        if (!l || l === '---') continue;
        if (l.startsWith('**Tags:**')) tags = l.replace('**Tags:**', '').trim();
        else if (l.match(/^\[.+\]\(.+\)$/)) { const m = l.match(/\[.+?\]\((.+?)\)/); if (m) link = m[1]; }
        else desc += (desc ? ' ' : '') + l;
      }
      section.updates.push({ headline, desc, tags, link });
    }
    if (section.updates.length) sections.push(section);
  }
  return sections;
}

/* ── Horizon Scan email ── */
function horizonScanToEmail(md, { recipientName, orgConfig, jurisdictions } = {}) {
  let sections = parseHorizonScan(md);
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  if (jurisdictions?.length) {
    const jSet = new Set(jurisdictions.map(j => j.toLowerCase()));
    sections = sections.filter(s => jSet.has(s.country.toLowerCase()));
  }

  const total = sections.reduce((n, s) => n + s.updates.length, 0);
  const subject = `XHS Daily Horizon Scan \u2014 ${date}`;
  const hi = recipientName
    ? `<p style="color:#cbd5e1;font-size:15px;margin:0 0 4px;">Hi ${recipientName},</p><p style="color:#64748b;font-size:13px;margin:0 0 22px;">Here are the latest regulatory developments across your tracked jurisdictions.</p>`
    : '';

  const cards = sections.map(s => {
    const rows = s.updates.map((u, i) => {
      const pills = u.tags ? u.tags.split(/\s*\u00b7\s*/).map(t => t.trim()).filter(Boolean).map(t =>
        `<span style="display:inline-block;background:#1e293b;color:#94a3b8;font-size:10px;padding:2px 7px;border-radius:8px;margin:1px 2px 1px 0;border:1px solid #334155;">${t}</span>`
      ).join('') : '';
      const sep = i > 0 ? '<tr><td style="padding:0;"><div style="border-top:1px solid #1e293b;margin:10px 0;"></div></td></tr>' : '';
      return `${sep}<tr><td style="padding:0;">
        <a href="${u.link || '#'}" style="color:#f1f5f9;font-size:14px;font-weight:600;text-decoration:none;line-height:1.4;display:block;margin-bottom:3px;">${u.headline}</a>
        <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0 0 6px;">${u.desc}</p>
        ${pills ? `<div style="margin-bottom:4px;">${pills}</div>` : ''}
        ${u.link ? `<a href="${u.link}" style="color:#818cf8;font-size:12px;font-weight:500;text-decoration:none;">Read full update \u2192</a>` : ''}
      </td></tr>`;
    }).join('');

    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;border-radius:8px;overflow:hidden;border:1px solid #1e293b;">
      <tr><td style="padding:10px 14px;background:#0f172a;border-bottom:1px solid #1e293b;">
        <span style="font-size:18px;vertical-align:middle;margin-right:6px;">${s.flag}</span>
        <span style="color:#e2e8f0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;vertical-align:middle;">${s.country}</span>
        <span style="color:#475569;font-size:11px;margin-left:6px;vertical-align:middle;">${s.updates.length}</span>
      </td></tr>
      <tr><td style="padding:14px;background:#111827;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td></tr>
    </table>`;
  }).join('');

  const headerHtml = `
    <div style="margin-bottom:18px;"><img src="${XHS_ICON}" alt="XHS" width="44" height="44" style="width:44px;height:44px;border-radius:10px;display:inline-block;" /></div>
    <h1 style="margin:0 0 4px;color:#fff;font-size:22px;font-weight:700;letter-spacing:-.3px;line-height:1.2;">XHS Daily Horizon Scan</h1>
    <p style="margin:0 0 14px;color:#94a3b8;font-size:13px;">${date}</p>
    <div style="display:inline-block;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.18);border-radius:14px;padding:4px 12px;">
      <span style="color:#a5b4fc;font-size:11px;font-weight:600;">${sections.length} Jurisdictions \u00b7 ${total} Updates</span>
    </div>`;

  return emailShell({ subject, preheader: `${sections.length} jurisdictions \u00b7 ${total} regulatory updates \u2014 ${date}`, headerHtml, bodyHtml: `${hi}${cards}`, orgConfig });
}

/* ─── HELPERS ─── */
async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.SENDER_EMAIL || 'onboarding@resend.dev', to, subject, html }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || res.statusText); }
  return res.json();
}

/* ═══════════════════ GET ═══════════════════ */
export async function GET() {
  const [subscribers, history, scheduled, organisations] = await Promise.all([
    readBlob(BLOB_SUBSCRIBERS_KEY, []),
    readBlob(BLOB_HISTORY_KEY, []),
    readBlob(BLOB_SCHEDULED_KEY, []),
    readBlob(BLOB_ORGS_KEY, []),
  ]);
  return NextResponse.json({ success: true, subscribers, history, scheduled, organisations });
}

/* ═══════════════════ POST ═══════════════════ */
export async function POST(request) {
  const body = await request.json();
  const { action } = body;

  /* ── Organisation CRUD ── */
  if (action === 'save-organisation') {
    const { organisation } = body; // { id?, name, logoUrl, jurisdictions[] }
    const orgs = await readBlob(BLOB_ORGS_KEY, []);
    if (organisation.id) {
      const idx = orgs.findIndex(o => o.id === organisation.id);
      if (idx >= 0) orgs[idx] = { ...orgs[idx], ...organisation };
      else orgs.push({ ...organisation, id: crypto.randomUUID() });
    } else {
      orgs.push({ ...organisation, id: crypto.randomUUID() });
    }
    await writeBlob(BLOB_ORGS_KEY, orgs);
    return NextResponse.json({ success: true, organisations: orgs });
  }

  if (action === 'delete-organisation') {
    const { organisationId } = body;
    let orgs = await readBlob(BLOB_ORGS_KEY, []);
    orgs = orgs.filter(o => o.id !== organisationId);
    await writeBlob(BLOB_ORGS_KEY, orgs);
    return NextResponse.json({ success: true, organisations: orgs });
  }

  /* ── Subscriber management ── */
  if (action === 'add-subscribers') {
    const existing = await readBlob(BLOB_SUBSCRIBERS_KEY, []);
    const existingEmails = existing.map(s => s.email.toLowerCase());
    const incoming = body.subscribers || body.emails || [];
    const org = body.org;
    const added = [];
    for (const s of incoming) {
      const entry = typeof s === 'string' ? { email: s } : s;
      if (!existingEmails.includes(entry.email.toLowerCase())) {
        existing.push({ ...entry, organisation: org || entry.organisation || '', id: crypto.randomUUID(), addedAt: new Date().toISOString() });
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
      // Map 'org' to 'organisation' for consistency
      if (updates.org !== undefined) { updates.organisation = updates.org; delete updates.org; }
      subs[idx] = { ...subs[idx], ...updates };
    }
    await writeBlob(BLOB_SUBSCRIBERS_KEY, subs);
    return NextResponse.json({ success: true, subscribers: subs });
  }

  if (action === 'import-from-onboarding') {
    const existing = await readBlob(BLOB_SUBSCRIBERS_KEY, []);
    const onboardingSubs = await readBlob('onboarding/submissions', []);
    const emails = existing.map(s => s.email.toLowerCase());
    const added = [];
    for (const s of onboardingSubs) {
      const email = s.email || s.contactEmail;
      const name = s.name || s.contactName || '';
      const org = s.company || s.organisation || '';
      if (email && !emails.includes(email.toLowerCase())) {
        existing.push({ email, name, organisation: org, id: crypto.randomUUID(), addedAt: new Date().toISOString(), source: 'onboarding' });
        emails.push(email.toLowerCase());
        added.push(email);
      }
    }
    await writeBlob(BLOB_SUBSCRIBERS_KEY, existing);
    return NextResponse.json({ success: true, added: added.length, total: existing.length, subscribers: existing });
  }

  /* ── Send email ── */
  if (action === 'send') {
    const { subject, markdown, template, recipients, recipientEmails } = body;
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
      const orgConfig = sub.organisation
        ? orgs.find(o => o.name?.toLowerCase() === sub.organisation.toLowerCase()) || {}
        : {};
      const recipientName = sub.name?.split(' ')[0] || '';

      let html;
      if (template === 'horizon-scan') {
        html = horizonScanToEmail(markdown, { recipientName, orgConfig, jurisdictions: orgConfig.jurisdictions });
      } else {
        html = markdownToEmail(markdown, subject, { recipientName, orgConfig });
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
      const orgConfig = sub.organisation
        ? orgs.find(o => o.name?.toLowerCase() === sub.organisation.toLowerCase()) || {}
        : {};
      const recipientName = sub.name?.split(' ')[0] || '';

      let html;
      if (item.template === 'horizon-scan') {
        html = horizonScanToEmail(item.markdown, { recipientName, orgConfig, jurisdictions: orgConfig.jurisdictions });
      } else {
        html = markdownToEmail(item.markdown, item.subject, { recipientName, orgConfig });
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
}