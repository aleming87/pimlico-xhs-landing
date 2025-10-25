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

Top 5 Regulatory Topics (Ranked):
${data.topTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

---------------------------------------------------

👤 PROSPECT PROFILE

Role: ${data.role}
Company Size: ${data.companySize}
Implementation Timeline: ${data.timeline}

---------------------------------------------------

🎯 COMPLIANCE INTELLIGENCE

Current Challenges:
${data.challenges.length > 0 ? data.challenges.map(c => `• ${c}`).join('\n') : '• None specified'}

Using Competing Vendors: ${data.usingCompetitors}
${data.competitorVendors.length > 0 ? `Competitor: ${data.competitorVendors.join(', ')}` : ''}

---------------------------------------------------

💼 WORKSPACE & COLLABORATION

Has Shared Regulatory Workspace: ${data.hasSharedWorkspace}
Interested in XHS™ Workspace: ${data.interestedInXHS}

Productivity & GRC Apps:
${data.productivityApps.length > 0 ? data.productivityApps.map(i => `• ${i}`).join('\n') : '• None specified'}

---------------------------------------------------

📝 ADDITIONAL CONTEXT

${data.additionalInfo || 'None provided'}

---------------------------------------------------

🕐 SUBMITTED: ${new Date().toISOString()}

====================================================
    `.trim();

    // Log to console (for development)
    console.log('Survey intelligence received:');
    console.log(surveyIntel);

    // TODO: Send to your CRM/intelligence system
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // await resend.emails.send({
    //   from: 'intel@pimlicosolutions.com',
    //   to: 'contact@pimlicosolutions.com', // Or your intelligence inbox
    //   subject: `🎯 New XHS™ Prospect Intel - ${data.focusAreas.join('+')} | ${data.topJurisdictions[0] || 'Multi-jurisdiction'}`,
    //   text: surveyIntel,
    // });

    return NextResponse.json({ success: true, message: 'Survey intelligence captured' });
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process survey submission' },
      { status: 500 }
    );
  }
}
