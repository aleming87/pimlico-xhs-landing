import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

const BLOB_INDEX_KEY = 'onboarding/index.json';
const BLOB_ORGS_KEY = 'onboarding/orgs.json';

/* ── Blob helpers ── */
async function readBlob(prefix, fallback = []) {
  try {
    const { blobs } = await list({ prefix });
    if (blobs.length === 0) return fallback;
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch (error) {
    console.error(`Error reading blob ${prefix}:`, error);
    return fallback;
  }
}

async function writeBlob(key, data) {
  try {
    const { del } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: key.replace('/index.json', '/index').replace('/orgs.json', '/orgs') });
    for (const blob of blobs) await del(blob.url);
  } catch (e) { /* ignore deletion errors */ }

  await put(key, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

/* ── GET: return all submissions + orgs ── */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'orgs') {
      const data = await readBlob('onboarding/orgs', { orgs: [] });
      return NextResponse.json({ success: true, orgs: data.orgs || [] });
    }

    if (type === 'submissions') {
      const orgSlug = searchParams.get('org');
      const data = await readBlob('onboarding/index', { submissions: [] });
      let submissions = data.submissions || [];
      if (orgSlug) {
        submissions = submissions.filter(s => s.orgSlug === orgSlug);
      }
      return NextResponse.json({ success: true, submissions });
    }

    // Return both
    const [orgsData, subsData] = await Promise.all([
      readBlob('onboarding/orgs', { orgs: [] }),
      readBlob('onboarding/index', { submissions: [] }),
    ]);
    return NextResponse.json({
      success: true,
      orgs: orgsData.orgs || [],
      submissions: subsData.submissions || [],
    });
  } catch (error) {
    console.error('Onboarding GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/* ── POST: create org or submit onboarding response ── */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    /* ─── Create Organisation ─── */
    if (action === 'create-org') {
      const { name, slug, maxSeats, maxJurisdictions, verticals, notes } = body;
      if (!name || !slug) {
        return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });
      }

      // Validate slug format
      const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
      if (!slugRegex.test(slug) && slug.length > 1) {
        return NextResponse.json({ success: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' }, { status: 400 });
      }

      const data = await readBlob('onboarding/orgs', { orgs: [] });
      const orgs = data.orgs || [];

      if (orgs.find(o => o.slug === slug)) {
        return NextResponse.json({ success: false, error: 'Organisation with this slug already exists' }, { status: 409 });
      }

      const newOrg = {
        id: `org_${Date.now()}`,
        name,
        slug,
        maxSeats: maxSeats || 10,
        maxJurisdictions: maxJurisdictions || 20,
        verticals: verticals || ['Gambling', 'Payments', 'Crypto', 'AI'],
        notes: notes || '',
        createdAt: new Date().toISOString(),
        active: true,
      };

      orgs.push(newOrg);
      await writeBlob(BLOB_ORGS_KEY, { orgs, updatedAt: new Date().toISOString() });

      return NextResponse.json({ success: true, org: newOrg });
    }

    /* ─── Delete Organisation ─── */
    if (action === 'delete-org') {
      const { slug } = body;
      if (!slug) {
        return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
      }
      const data = await readBlob('onboarding/orgs', { orgs: [] });
      const orgs = data.orgs || [];
      const idx = orgs.findIndex(o => o.slug === slug);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Organisation not found' }, { status: 404 });
      }
      orgs.splice(idx, 1);
      await writeBlob(BLOB_ORGS_KEY, { orgs, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    /* ─── Update Organisation ─── */
    if (action === 'update-org') {
      const { slug, updates } = body;
      const data = await readBlob('onboarding/orgs', { orgs: [] });
      const orgs = data.orgs || [];
      const idx = orgs.findIndex(o => o.slug === slug);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Organisation not found' }, { status: 404 });
      }
      orgs[idx] = { ...orgs[idx], ...updates, slug: orgs[idx].slug }; // prevent slug change
      await writeBlob(BLOB_ORGS_KEY, { orgs, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true, org: orgs[idx] });
    }

    /* ─── Submit Onboarding Form ─── */
    if (action === 'submit') {
      const {
        orgSlug,
        company,
        teamMembers,
        jurisdictions,
        verticals,
        scheduleTraining,
        preferredTrainingDate,
        wantOnboardingGuide,
        participateInSurveys,
        participateInInterviews,
        tryNewProducts,
        productsOfInterest,
        additionalNotes,
      } = body;

      const submission = {
        id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        orgSlug: orgSlug || 'general',
        company: company || 'N/A',
        teamMembers: teamMembers || [],
        jurisdictions: jurisdictions || [],
        verticals: verticals || [],
        scheduleTraining: scheduleTraining || false,
        preferredTrainingDate: preferredTrainingDate || '',
        wantOnboardingGuide: wantOnboardingGuide || false,
        participateInSurveys: participateInSurveys || false,
        participateInInterviews: participateInInterviews || false,
        tryNewProducts: tryNewProducts || false,
        productsOfInterest: productsOfInterest || [],
        additionalNotes: additionalNotes || '',
        submittedAt: new Date().toISOString(),
      };

      // Persist
      const data = await readBlob('onboarding/index', { submissions: [] });
      const submissions = data.submissions || [];
      submissions.push(submission);
      await writeBlob(BLOB_INDEX_KEY, { submissions, updatedAt: new Date().toISOString() });

      // Send email notification
      if (process.env.RESEND_API_KEY) {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          const recipientEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';

          const teamList = submission.teamMembers
            .map((m, i) => `  ${i + 1}. ${m.name} <${m.email}>${m.role ? ` — ${m.role}` : ''}`)
            .join('\n');

          const emailReport = `
====================================================
NEW ONBOARDING SUBMISSION
====================================================

🏢 ORGANISATION: ${submission.company}
📎 Link: pimlicosolutions.com/onboarding/${submission.orgSlug}

👥 TEAM MEMBERS (${submission.teamMembers.length}):
${teamList || '  None specified'}

🌍 JURISDICTIONS (${submission.jurisdictions.length}):
${submission.jurisdictions.map(j => `  • ${j}`).join('\n') || '  None selected'}

📊 VERTICALS: ${submission.verticals.join(', ') || 'None selected'}

📋 PREFERENCES:
  • Video Call Training: ${submission.scheduleTraining ? `Yes${submission.preferredTrainingDate ? ` (preferred: ${submission.preferredTrainingDate})` : ''}` : 'No'}
  • Onboarding Guide: ${submission.wantOnboardingGuide ? 'Yes' : 'No'}
  • Participate in Surveys: ${submission.participateInSurveys ? 'Yes' : 'No'}
  • Participate in Interviews: ${submission.participateInInterviews ? 'Yes' : 'No'}
  • Try New Products: ${submission.tryNewProducts ? 'Yes' : 'No'}
${submission.productsOfInterest.length ? `  • Products of Interest: ${submission.productsOfInterest.join(', ')}` : ''}

${submission.additionalNotes ? `💬 NOTES:\n${submission.additionalNotes}` : ''}

🕐 SUBMITTED: ${submission.submittedAt}
====================================================
          `.trim();

          await resend.emails.send({
            from: 'Pimlico Onboarding <onboarding@resend.dev>',
            to: recipientEmail,
            subject: `🚀 NEW ONBOARDING — ${submission.company} (${submission.teamMembers.length} users)`,
            text: emailReport,
          });

          // Send confirmation to primary contact
          const primaryContact = submission.teamMembers[0];
          if (primaryContact?.email) {
            await resend.emails.send({
              from: 'Pimlico XHS <onboarding@resend.dev>',
              to: primaryContact.email,
              subject: 'Welcome to Pimlico XHS™ — Onboarding Confirmed',
              html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#0f172a;color:#e2e8f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;">
<tr><td align="center" style="padding:20px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
<tr><td style="background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);padding:40px;text-align:center;">
  <div style="margin-bottom:20px;"><img src="https://pimlicosolutions.com/XHS_Logo_White.png" alt="Pimlico XHS" style="max-width:180px;height:auto;" /></div>
  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">Welcome to Pimlico XHS™</h1>
  <p style="margin:10px 0 0;color:#bfdbfe;font-size:16px;">Your onboarding is confirmed</p>
</td></tr>
<tr><td style="padding:40px;">
  <p style="margin:0 0 20px;font-size:18px;color:#f1f5f9;">Hi <strong>${primaryContact.name}</strong>,</p>
  <p style="margin:0 0 20px;font-size:16px;color:#cbd5e1;line-height:1.6;">Thank you for completing the onboarding form for <strong>${submission.company}</strong>. We've received your team's information and preferences.</p>
  <p style="margin:0 0 20px;font-size:16px;color:#cbd5e1;line-height:1.6;">Here's what happens next:</p>
  <ul style="margin:0 0 20px;padding-left:20px;color:#cbd5e1;font-size:15px;line-height:2;">
    <li>Your ${submission.teamMembers.length} team member${submission.teamMembers.length > 1 ? 's' : ''} will receive their access credentials</li>
    <li>Your workspace will be configured for ${submission.jurisdictions.length} jurisdiction${submission.jurisdictions.length > 1 ? 's' : ''}</li>
    ${submission.scheduleTraining ? '<li>We\'ll reach out to schedule your team training call</li>' : ''}
    ${submission.wantOnboardingGuide ? '<li>Your onboarding guide will be sent separately</li>' : ''}
  </ul>
  <p style="margin:30px 0 0;font-size:16px;color:#cbd5e1;">Best regards,<br><strong style="color:#f1f5f9;">The Pimlico XHS™ Team</strong></p>
</td></tr>
<tr><td style="background-color:#0f172a;padding:30px;text-align:center;border-top:1px solid #334155;">
  <p style="margin:0 0 10px;font-size:14px;color:#94a3b8;"><strong style="color:#f1f5f9;">Pimlico XHS™</strong><br>Transforming Regulatory Compliance</p>
  <p style="margin:0;font-size:12px;color:#64748b;"><a href="https://pimlicosolutions.com" style="color:#3b82f6;text-decoration:none;">pimlicosolutions.com</a></p>
</td></tr>
</table>
</td></tr></table>
</body></html>`,
            });
          }
        } catch (emailError) {
          console.error('Onboarding email error:', emailError);
        }
      }

      return NextResponse.json({ success: true, submission });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Onboarding POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
