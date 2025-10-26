import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Format the survey intelligence report
    const surveyIntel = `
====================================================
NEW SURVEY SUBMISSION - XHS™ PROSPECT INTELLIGENCE
====================================================

📊 PRIORITY INTELLIGENCE

Top 3 Jurisdictions (Ranked):
${data.topJurisdictions.map((j, i) => `${i + 1}. ${j}`).join('\n')}

Primary Focus Areas: ${data.focusAreas.join(', ')}

Top 3 Regulatory Topics (Ranked):
${data.topTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

---------------------------------------------------

👤 PROSPECT PROFILE

Implementation Timeline: ${data.timeline}

---------------------------------------------------

🎯 COMPLIANCE INTELLIGENCE

Current Challenges:
${data.challenges.length > 0 ? data.challenges.map(c => `• ${c}`).join('\n') : '• None specified'}

Using Competing Vendors: ${data.usingCompetitors}
${data.competitorVendors ? `Competitors: ${data.competitorVendors}` : ''}

---------------------------------------------------

💼 WORKSPACE & COLLABORATION

Has Shared Regulatory Workspace: ${data.hasSharedWorkspace}

Productivity & GRC Apps:
${data.productivityApps.length > 0 ? data.productivityApps.map(i => `• ${i}`).join('\n') : '• None specified'}

---------------------------------------------------

🕐 SUBMITTED: ${new Date().toISOString()}

====================================================
    `.trim();

    // Send to your intelligence inbox
    await resend.emails.send({
      from: 'Pimlico XHS Intelligence <intel@pimlicosolutions.com>',
      to: process.env.CONTACT_EMAIL || 'contact@pimlicosolutions.com',
      subject: `🎯 New Prospect Intel - ${data.focusAreas.join('+')} | ${data.topJurisdictions[0] || 'Multi-jurisdiction'}`,
      text: surveyIntel,
    });

    return NextResponse.json({ success: true, message: 'Survey intelligence captured' });
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process survey submission' },
      { status: 500 }
    );
  }
}
