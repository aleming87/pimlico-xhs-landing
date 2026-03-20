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

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#0f172a;color:#e2e8f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;">
<tr><td align="center" style="padding:20px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.3);">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);padding:40px;text-align:center;">
  <div style="margin-bottom:20px;"><img src="https://pimlicosolutions.com/XHS_Logo_White.png" alt="Pimlico XHS" style="max-width:180px;height:auto;" /></div>
  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${subject}</h1>
  <p style="margin:10px 0 0;color:#bfdbfe;font-size:14px;">Product Update from Pimlico XHS™</p>
</td></tr>

<!-- Content -->
<tr><td style="padding:40px;">
  <div style="font-size:16px;color:#cbd5e1;line-height:1.8;">
    ${htmlBody}
  </div>
</td></tr>

<!-- Footer -->
<tr><td style="background-color:#0f172a;padding:30px;text-align:center;border-top:1px solid #334155;">
  <p style="margin:0 0 10px;font-size:14px;color:#94a3b8;"><strong style="color:#f1f5f9;">Pimlico XHS™</strong><br>Transforming Regulatory Compliance</p>
  <p style="margin:0;font-size:12px;color:#64748b;"><a href="https://pimlicosolutions.com" style="color:#3b82f6;text-decoration:none;">pimlicosolutions.com</a></p>
</td></tr>

</table>
</td></tr></table>
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
      const { emails } = body; // array of { email, name? }
      if (!Array.isArray(emails) || emails.length === 0) {
        return NextResponse.json({ success: false, error: 'Emails array is required' }, { status: 400 });
      }

      const data = await readBlob('updates/subscribers', { subscribers: [] });
      const subscribers = data.subscribers || [];
      let added = 0;

      for (const entry of emails) {
        const email = (typeof entry === 'string' ? entry : entry.email)?.trim().toLowerCase();
        if (!email) continue;
        if (subscribers.find(s => s.email === email)) continue;
        subscribers.push({
          email,
          name: typeof entry === 'object' ? entry.name || '' : '',
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

    /* ─── Import Subscribers from Onboarding ─── */
    if (action === 'import-from-onboarding') {
      const onboardingData = await readBlob('onboarding/index', { submissions: [] });
      const submissions = onboardingData.submissions || [];

      const emails = [];
      for (const sub of submissions) {
        for (const member of sub.teamMembers || []) {
          if (member.email) {
            emails.push({ email: member.email, name: member.name || '' });
          }
        }
      }

      const data = await readBlob('updates/subscribers', { subscribers: [] });
      const subscribers = data.subscribers || [];
      let added = 0;

      for (const entry of emails) {
        const email = entry.email.trim().toLowerCase();
        if (subscribers.find(s => s.email === email)) continue;
        subscribers.push({ email, name: entry.name, addedAt: new Date().toISOString(), source: 'onboarding' });
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
