import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Format the survey intelligence report
    const surveyIntel = `
====================================================
NEW SURVEY SUBMISSION - XHS™ PROSPECT INTELLIGENCE
====================================================

📊 PRIORITY INTELLIGENCE

Top 5 Jurisdictions (Ranked):
${data.topJurisdictions.map((j, i) => `${i + 1}. ${j}`).join('\n')}

Primary Focus Areas: ${data.focusAreas.join(', ')}

${data.topTopicsAI && data.topTopicsAI.length > 0 ? `
Top 3 AI Regulatory Topics (Ranked):
${data.topTopicsAI.map((t, i) => `${i + 1}. ${t}`).join('\n')}
` : ''}
${data.topTopicsPayments && data.topTopicsPayments.length > 0 ? `
Top 3 Payments Regulatory Topics (Ranked):
${data.topTopicsPayments.map((t, i) => `${i + 1}. ${t}`).join('\n')}
` : ''}
${data.topTopicsGambling && data.topTopicsGambling.length > 0 ? `
Top 3 Gambling Regulatory Topics (Ranked):
${data.topTopicsGambling.map((t, i) => `${i + 1}. ${t}`).join('\n')}
` : ''}

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

    // Check if Resend is configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send to your intelligence inbox
      await resend.emails.send({
        from: 'Pimlico XHS Intelligence <intel@pimlicosolutions.com>',
        to: process.env.CONTACT_EMAIL || 'contact@pimlicosolutions.com',
        subject: `🎯 New Prospect Intel - ${data.focusAreas.join('+')} | ${data.topJurisdictions[0] || 'Multi-jurisdiction'}`,
        text: surveyIntel,
      });
    } else {
      // Fallback: just log to console if Resend not configured
      console.log('📊 Survey Submission (Resend not configured):');
      console.log(surveyIntel);
    }

    return NextResponse.json({ success: true, message: 'Survey intelligence captured' });
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process survey submission' },
      { status: 500 }
    );
  }
}
