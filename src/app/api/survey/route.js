import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    console.log('🔍 Survey API called');
    console.log('📧 Environment check:');
    console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('- RESEND_API_KEY length:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0);
    console.log('- CONTACT_EMAIL:', process.env.CONTACT_EMAIL || 'NOT SET');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    // Extract contact data if it exists
    const contactData = data.contactData || {};
    
    console.log('📋 Contact data received:', {
      hasContactData: !!data.contactData,
      firstName: contactData.firstName,
      email: contactData.email,
      company: contactData.company
    });
    
    // Format the COMBINED intelligence report
    const combinedReport = `
====================================================
NEW LEAD SUBMISSION - COMPLETE PROSPECT PROFILE
====================================================

👤 CONTACT INFORMATION

Name: ${contactData.firstName || 'N/A'} ${contactData.lastName || 'N/A'}
Company: ${contactData.company || 'N/A'}
Email: ${contactData.email || 'N/A'}
Message: ${contactData.message || 'N/A'}

Consents:
- Privacy Policy Agreed: ${contactData.agreedToPolicy ? 'Yes' : 'No'}
- Marketing Communications: ${contactData.marketingConsent ? 'Yes' : 'No'}

====================================================

📊 PROSPECT INTELLIGENCE - SURVEY RESPONSES

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
      console.log('✅ RESEND_API_KEY found, attempting to send email...');
      
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const recipientEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';
      console.log('📧 Sending COMBINED lead report to:', recipientEmail);
      console.log('📧 Subject:', `🎯 NEW LEAD - ${contactData.firstName || 'Unknown'} ${contactData.lastName || ''} from ${contactData.company || 'Unknown Company'} | ${data.focusAreas.join('+')}`);

      // Send combined report to your team
      try {
        const leadEmail = await resend.emails.send({
          from: 'Pimlico XHS Lead Intelligence <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `🎯 NEW LEAD - ${contactData.firstName || 'Unknown'} ${contactData.lastName || ''} from ${contactData.company || 'Unknown Company'} | ${data.focusAreas.join('+')}`,
          text: combinedReport,
        });
        
        console.log('✅ Combined lead email sent successfully!');
        console.log('📧 Email ID:', leadEmail.id);
        console.log('📧 Response:', JSON.stringify(leadEmail, null, 2));
      } catch (emailError) {
        console.error('❌ ERROR sending lead email:', emailError);
        console.error('❌ Error details:', JSON.stringify(emailError, null, 2));
        throw emailError;
      }

      // Send confirmation to the user if we have their email
      if (contactData.email) {
        console.log('📧 Sending user confirmation to:', contactData.email);
        
        try {
          const userEmail = await resend.emails.send({
            from: 'Pimlico XHS <onboarding@resend.dev>',
            to: contactData.email,
            subject: 'Thank you for contacting Pimlico XHS™',
            html: `
              <h1>Thank you for your interest in Pimlico XHS™</h1>
              <p>Hi ${contactData.firstName},</p>
              <p>We've received your inquiry and survey responses. Our team will review your information and be in touch soon.</p>
              <p>Best regards,<br>The Pimlico XHS Team</p>
            `,
          });
          console.log('✅ User confirmation email sent successfully!');
          console.log('📧 Email ID:', userEmail.id);
        } catch (userEmailError) {
          console.error('❌ ERROR sending user confirmation:', userEmailError);
        }
      }
    } else {
      console.error('❌ RESEND_API_KEY NOT FOUND IN ENVIRONMENT!');
      console.error('❌ Email will NOT be sent. Check Vercel environment variables.');
      // Fallback: just log to console if Resend not configured
      console.log('📊 COMBINED Lead Submission (Resend not configured):');
      console.log(combinedReport);
    }

    return NextResponse.json({ success: true, message: 'Lead intelligence captured' });
  } catch (error) {
    console.error('❌ CRITICAL ERROR in survey route:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to process survey submission',
        message: error.message,
        details: 'Check Vercel logs for full error details'
      },
      { status: 500 }
    );
  }
}
