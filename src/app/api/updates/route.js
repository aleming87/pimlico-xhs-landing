import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { marked } from 'marked';

const BLOB_SUBSCRIBERS_KEY = 'updates/subscribers.json';
const BLOB_HISTORY_KEY = 'updates/history.json';
const BLOB_SCHEDULED_KEY = 'updates/scheduled.json';

/* ── Blob helpers ── */
async function readBlob(prefix, fallback) {
  try {
    const { blobs } = await list({ prefix });
    if (blobs.length === 0) return fallback;
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return fallback;
  }
}

async function writeBlob(key, data) {
  try {
    const { del } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: key.replace('.json', '') });
    for (const blob of blobs) await del(blob.url);
  } catch { /* ignore */ }

  await put(key, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

/* ── Markdown → branded HTML email ── */
function markdownToEmail(markdownContent, subject) {
  const htmlBody = marked.parse(markdownContent);
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${subject}</title>
  <!--[if mso]><style>table,td{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
  <style>
    @media only screen and (max-width: 620px) {
      .outer { width: 100% !important; }
      .inner { padding: 28px 20px !important; }
      .header-inner { padding: 32px 20px 24px !important; }
      .footer-inner { padding: 24px 20px !important; }
      h1 { font-size: 22px !important; }
    }
    /* Markdown content styles */
    .email-body h1 { color: #f1f5f9; font-size: 22px; font-weight: 700; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #334155; }
    .email-body h2 { color: #e2e8f0; font-size: 18px; font-weight: 600; margin: 28px 0 10px; }
    .email-body h3 { color: #cbd5e1; font-size: 15px; font-weight: 600; margin: 24px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .email-body p { color: #94a3b8; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .email-body a { color: #60a5fa; text-decoration: underline; text-underline-offset: 2px; }
    .email-body a:hover { color: #93bbfd; }
    .email-body ul, .email-body ol { color: #94a3b8; font-size: 15px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px; }
    .email-body li { margin-bottom: 6px; }
    .email-body li::marker { color: #6366f1; }
    .email-body strong { color: #e2e8f0; font-weight: 600; }
    .email-body em { color: #a5b4fc; font-style: italic; }
    .email-body blockquote { border-left: 3px solid #6366f1; margin: 16px 0; padding: 12px 20px; background: rgba(99, 102, 241, 0.08); border-radius: 0 8px 8px 0; }
    .email-body blockquote p { color: #a5b4fc; margin: 0; font-size: 14px; }
    .email-body code { background: #1e293b; color: #a5b4fc; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; }
    .email-body pre { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; overflow-x: auto; margin: 0 0 16px; }
    .email-body pre code { background: none; padding: 0; font-size: 13px; line-height: 1.5; }
    .email-body hr { border: none; border-top: 1px solid #334155; margin: 24px 0; }
    .email-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; }
    .email-body table { border-collapse: collapse; width: 100%; margin: 0 0 16px; }
    .email-body table th { background: #1e293b; color: #e2e8f0; text-align: left; padding: 10px 12px; font-size: 13px; font-weight: 600; border-bottom: 2px solid #334155; }
    .email-body table td { padding: 10px 12px; font-size: 14px; color: #94a3b8; border-bottom: 1px solid #1e293b; }
  </style>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#0b1120;color:#e2e8f0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- Preheader (hidden preview text) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  ${subject} — ${date}
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1120;">
<tr><td align="center" style="padding:24px 16px;">

  <!-- Main Container -->
  <table role="presentation" class="outer" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#151d2e;border-radius:16px;overflow:hidden;border:1px solid #1e293b;">

    <!-- Header with gradient -->
    <tr><td style="background:linear-gradient(135deg,#1e3a8a 0%,#312e81 50%,#1e3a8a 100%);position:relative;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td class="header-inner" style="padding:44px 40px 32px;text-align:center;">
          <!-- Logo -->
          <div style="margin-bottom:24px;">
            <img src="https://pimlicosolutions.com/XHS_Logo_White.png" alt="Pimlico XHS™" width="160" style="max-width:160px;height:auto;display:inline-block;" />
          </div>
          <!-- Badge -->
          <div style="margin-bottom:16px;">
            <span style="display:inline-block;background:rgba(255,255,255,0.12);color:#c7d2fe;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:5px 14px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);">
              📡 Product Update · ${date}
            </span>
          </div>
          <!-- Title -->
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.3px;line-height:1.3;">
            ${subject}
          </h1>
        </td></tr>
      </table>
      <!-- Bottom fade line -->
      <div style="height:3px;background:linear-gradient(90deg,transparent,#6366f1,#818cf8,#6366f1,transparent);"></div>
    </td></tr>

    <!-- Content -->
    <tr><td class="inner" style="padding:36px 40px 28px;">
      <div class="email-body" style="font-size:15px;color:#94a3b8;line-height:1.7;">
        ${htmlBody}
      </div>
    </td></tr>

    <!-- CTA Divider -->
    <tr><td style="padding:0 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="border-top:1px solid #1e293b;padding-top:28px;padding-bottom:4px;text-align:center;">
          <a href="https://pimlicosolutions.com" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">
            Visit Pimlico XHS™ →
          </a>
        </td></tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="background-color:#0b1120;border-top:1px solid #1e293b;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td class="footer-inner" style="padding:28px 40px;text-align:center;">

          <!-- Social Links -->
          <div style="margin-bottom:16px;">
            <a href="https://www.linkedin.com/company/pimlico-solutions" style="display:inline-block;width:32px;height:32px;background:#1e293b;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;margin:0 4px;font-size:14px;">💼</a>
            <a href="https://pimlicosolutions.com" style="display:inline-block;width:32px;height:32px;background:#1e293b;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;margin:0 4px;font-size:14px;">🌐</a>
          </div>

          <p style="margin:0 0 6px;font-size:14px;color:#94a3b8;">
            <strong style="color:#e2e8f0;">Pimlico XHS™</strong>
          </p>
          <p style="margin:0 0 12px;font-size:12px;color:#64748b;">
            Transforming Regulatory Compliance
          </p>
          <p style="margin:0;font-size:11px;color:#475569;">
            <a href="https://pimlicosolutions.com" style="color:#6366f1;text-decoration:none;">pimlicosolutions.com</a>
            &nbsp;·&nbsp;
            <a href="mailto:andrew@pimlicosolutions.com" style="color:#6366f1;text-decoration:none;">andrew@pimlicosolutions.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>

  </table>

</td></tr>
</table>
</body></html>`;
}

/* ── GET: return subscribers, history, scheduled ── */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'subscribers') {
      const data = await readBlob('updates/subscribers', { subscribers: [] });
      return NextResponse.json({ success: true, subscribers: data.subscribers || [] });
    }

    if (type === 'history') {
      const data = await readBlob('updates/history', { history: [] });
      return NextResponse.json({ success: true, history: data.history || [] });
    }

    if (type === 'scheduled') {
      const data = await readBlob('updates/scheduled', { scheduled: [] });
      return NextResponse.json({ success: true, scheduled: data.scheduled || [] });
    }

    // Return all
    const [subsData, histData, schedData] = await Promise.all([
      readBlob('updates/subscribers', { subscribers: [] }),
      readBlob('updates/history', { history: [] }),
      readBlob('updates/scheduled', { scheduled: [] }),
    ]);

    return NextResponse.json({
      success: true,
      subscribers: subsData.subscribers || [],
      history: histData.history || [],
      scheduled: schedData.scheduled || [],
    });
  } catch (error) {
    console.error('Updates GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/* ── POST: manage subscribers, send updates, schedule ── */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    /* ─── Add Subscribers ─── */
    if (action === 'add-subscribers') {
      const { emails, org } = body; // array of { email, name? }, optional org group
      if (!Array.isArray(emails) || emails.length === 0) {
        return NextResponse.json({ success: false, error: 'Emails array is required' }, { status: 400 });
      }

      const data = await readBlob('updates/subscribers', { subscribers: [] });
      const subscribers = data.subscribers || [];
      let added = 0;

      for (const entry of emails) {
        const email = (typeof entry === 'string' ? entry : entry.email)?.trim().toLowerCase();
        if (!email) continue;
        const existing = subscribers.find(s => s.email === email);
        if (existing) {
          // Update org if provided and subscriber exists
          if (org && !existing.org) existing.org = org;
          continue;
        }
        subscribers.push({
          email,
          name: typeof entry === 'object' ? entry.name || '' : '',
          org: org || (typeof entry === 'object' ? entry.org || '' : ''),
          addedAt: new Date().toISOString(),
        });
        added++;
      }

      await writeBlob(BLOB_SUBSCRIBERS_KEY, { subscribers, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true, added, total: subscribers.length });
    }

    /* ─── Remove Subscriber ─── */
    if (action === 'remove-subscriber') {
      const { email } = body;
      if (!email) return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });

      const data = await readBlob('updates/subscribers', { subscribers: [] });
      const subscribers = (data.subscribers || []).filter(s => s.email !== email.trim().toLowerCase());
      await writeBlob(BLOB_SUBSCRIBERS_KEY, { subscribers, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true, total: subscribers.length });
    }

    /* ─── Update Subscriber (org, name) ─── */
    if (action === 'update-subscriber') {
      const { email, updates } = body;
      if (!email) return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });

      const data = await readBlob('updates/subscribers', { subscribers: [] });
      const subscribers = data.subscribers || [];
      const sub = subscribers.find(s => s.email === email.trim().toLowerCase());
      if (!sub) return NextResponse.json({ success: false, error: 'Subscriber not found' }, { status: 404 });

      if (updates.org !== undefined) sub.org = updates.org;
      if (updates.name !== undefined) sub.name = updates.name;

      await writeBlob(BLOB_SUBSCRIBERS_KEY, { subscribers, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    /* ─── Import Subscribers from Onboarding ─── */
    if (action === 'import-from-onboarding') {
      const onboardingData = await readBlob('onboarding/index', { submissions: [] });
      const submissions = onboardingData.submissions || [];

      const emails = [];
      for (const sub of submissions) {
        for (const member of sub.teamMembers || []) {
          if (member.email) {
            emails.push({ email: member.email, name: member.name || '', org: sub.company || sub.orgSlug || '' });
          }
        }
      }

      const data = await readBlob('updates/subscribers', { subscribers: [] });
      const subscribers = data.subscribers || [];
      let added = 0;

      for (const entry of emails) {
        const email = entry.email.trim().toLowerCase();
        if (subscribers.find(s => s.email === email)) continue;
        subscribers.push({ email, name: entry.name, org: entry.org, addedAt: new Date().toISOString(), source: 'onboarding' });
        added++;
      }

      await writeBlob(BLOB_SUBSCRIBERS_KEY, { subscribers, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true, added, total: subscribers.length });
    }

    /* ─── Send Update Now ─── */
    if (action === 'send') {
      const { subject, markdown, recipientEmails } = body;
      if (!subject || !markdown) {
        return NextResponse.json({ success: false, error: 'Subject and markdown content are required' }, { status: 400 });
      }

      // Get recipients: either specified, or all subscribers
      let recipients = recipientEmails;
      if (!recipients || recipients.length === 0) {
        const data = await readBlob('updates/subscribers', { subscribers: [] });
        recipients = (data.subscribers || []).map(s => s.email);
      }

      if (recipients.length === 0) {
        return NextResponse.json({ success: false, error: 'No recipients. Add subscribers first.' }, { status: 400 });
      }

      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ success: false, error: 'RESEND_API_KEY not configured' }, { status: 500 });
      }

      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
      const htmlContent = markdownToEmail(markdown, subject);

      const results = { sent: 0, failed: 0, errors: [] };

      // Send in batches of 10 to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const promises = batch.map(async (email) => {
          try {
            await resend.emails.send({
              from: `Pimlico XHS Updates <${senderEmail}>`,
              to: email,
              subject,
              html: htmlContent,
            });
            results.sent++;
          } catch (err) {
            results.failed++;
            results.errors.push({ email, error: err?.message || String(err) });
          }
        });
        await Promise.all(promises);
      }

      // Save to history
      const histData = await readBlob('updates/history', { history: [] });
      const history = histData.history || [];
      history.push({
        id: `upd_${Date.now()}`,
        subject,
        markdown,
        recipientCount: recipients.length,
        sent: results.sent,
        failed: results.failed,
        sentAt: new Date().toISOString(),
      });
      await writeBlob(BLOB_HISTORY_KEY, { history, updatedAt: new Date().toISOString() });

      return NextResponse.json({ success: true, ...results });
    }

    /* ─── Schedule Update ─── */
    if (action === 'schedule') {
      const { subject, markdown, scheduledFor } = body;
      if (!subject || !markdown || !scheduledFor) {
        return NextResponse.json({ success: false, error: 'Subject, markdown, and scheduledFor are required' }, { status: 400 });
      }

      const data = await readBlob('updates/scheduled', { scheduled: [] });
      const scheduled = data.scheduled || [];

      scheduled.push({
        id: `sched_${Date.now()}`,
        subject,
        markdown,
        scheduledFor,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });

      await writeBlob(BLOB_SCHEDULED_KEY, { scheduled, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true, scheduled: scheduled.length });
    }

    /* ─── Cancel Scheduled Update ─── */
    if (action === 'cancel-scheduled') {
      const { id } = body;
      const data = await readBlob('updates/scheduled', { scheduled: [] });
      const scheduled = (data.scheduled || []).filter(s => s.id !== id);
      await writeBlob(BLOB_SCHEDULED_KEY, { scheduled, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    /* ─── Send Scheduled (called by cron) ─── */
    if (action === 'send-scheduled') {
      const schedData = await readBlob('updates/scheduled', { scheduled: [] });
      const scheduled = schedData.scheduled || [];
      const now = new Date();
      const due = scheduled.filter(s => s.status === 'pending' && new Date(s.scheduledFor) <= now);

      if (due.length === 0) {
        return NextResponse.json({ success: true, message: 'No updates due' });
      }

      const subsData = await readBlob('updates/subscribers', { subscribers: [] });
      const recipients = (subsData.subscribers || []).map(s => s.email);

      if (recipients.length === 0) {
        return NextResponse.json({ success: false, error: 'No subscribers' });
      }

      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

      const histData = await readBlob('updates/history', { history: [] });
      const history = histData.history || [];

      for (const item of due) {
        const htmlContent = markdownToEmail(item.markdown, item.subject);
        let sent = 0, failed = 0;

        const batchSize = 10;
        for (let i = 0; i < recipients.length; i += batchSize) {
          const batch = recipients.slice(i, i + batchSize);
          const promises = batch.map(async (email) => {
            try {
              await resend.emails.send({
                from: `Pimlico XHS Updates <${senderEmail}>`,
                to: email,
                subject: item.subject,
                html: htmlContent,
              });
              sent++;
            } catch { failed++; }
          });
          await Promise.all(promises);
        }

        item.status = 'sent';
        item.sentAt = new Date().toISOString();

        history.push({
          id: `upd_${Date.now()}`,
          subject: item.subject,
          markdown: item.markdown,
          recipientCount: recipients.length,
          sent,
          failed,
          sentAt: new Date().toISOString(),
          scheduled: true,
        });
      }

      await writeBlob(BLOB_SCHEDULED_KEY, { scheduled, updatedAt: new Date().toISOString() });
      await writeBlob(BLOB_HISTORY_KEY, { history, updatedAt: new Date().toISOString() });

      return NextResponse.json({ success: true, processed: due.length });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Updates POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
