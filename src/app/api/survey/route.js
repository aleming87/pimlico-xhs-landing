import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Format the survey results
    const surveyContent = `
New Survey Submission

JURISDICTIONS:
${data.jurisdictions.length > 0 ? data.jurisdictions.join(', ') : 'None selected'}

SECTORS:
${data.sectors.length > 0 ? data.sectors.join(', ') : 'None selected'}

REGULATORY TOPICS:
${data.topics.length > 0 ? data.topics.join(', ') : 'None selected'}

ROLE:
${data.role}

COMPANY DETAILS:
Name: ${data.companyName || 'Not provided'}
Size: ${data.companySize}

COMPLIANCE CHALLENGES:
${data.challenges || 'Not provided'}

IMPLEMENTATION TIMELINE:
${data.timeline}

ADDITIONAL INFORMATION:
${data.additionalInfo || 'None provided'}

Submitted: ${new Date().toISOString()}
    `.trim();

    // Log to console (replace with actual email service when ready)
    console.log('Survey submission received:', surveyContent);

    // TODO: Send email notification using Resend
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // await resend.emails.send({
    //   from: 'noreply@pimlicosolutions.com',
    //   to: 'contact@pimlicosolutions.com',
    //   subject: 'New Survey Response - XHS™',
    //   text: surveyContent,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process survey submission' },
      { status: 500 }
    );
  }
}
