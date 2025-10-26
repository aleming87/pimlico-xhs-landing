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
            subject: 'Welcome to Pimlico XHS™ - Your Regulatory AI Workspace Partner',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Pimlico XHS™</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 40px 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <svg width="140" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                  <text x="10" y="40" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">PIMLICO XHS</text>
                </svg>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Pimlico XHS™</h1>
              <p style="margin: 10px 0 0; color: #bfdbfe; font-size: 16px;">Your Regulatory AI Workspace Partner</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #f1f5f9; line-height: 1.6;">
                Hi <strong>${contactData.firstName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Thank you for your interest in <strong>Pimlico XHS™</strong> - the regulatory AI workspace designed for ${data.focusAreas.join(', ')} compliance teams.
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                We've received your submission and our team is reviewing your requirements. Here's what happens next:
              </p>
              
              <!-- What's Next Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #0f172a; border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 20px; color: #3b82f6; font-size: 20px; font-weight: 600;">What Happens Next?</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0;">
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">1</td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 12px 0 12px 0; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                          Our team will review your submission
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">2</td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 12px 0 12px 0; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                          We'll prepare a personalized demo tailored to your focus areas
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">3</td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 12px 0 12px 0; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                          A member of our team will reach out within 24-48 hours
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Your Submission Summary -->
              <div style="margin: 30px 0; padding: 24px; background-color: #0f172a; border-left: 4px solid #3b82f6; border-radius: 8px;">
                <p style="margin: 0 0 16px; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Your Submission Summary</p>
                
                ${data.focusAreas.length > 0 ? `
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 6px; color: #cbd5e1; font-size: 13px; font-weight: 600;">Focus Area(s):</p>
                  <p style="margin: 0; color: #f1f5f9; font-size: 15px;">${data.focusAreas.join(' • ')}</p>
                </div>
                ` : ''}
                
                ${data.topJurisdictions && data.topJurisdictions.length > 0 ? `
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 6px; color: #cbd5e1; font-size: 13px; font-weight: 600;">Jurisdictions:</p>
                  <p style="margin: 0; color: #f1f5f9; font-size: 15px;">${data.topJurisdictions.join(', ')}</p>
                </div>
                ` : ''}
                
                ${data.challenges && data.challenges.length > 0 ? `
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 6px; color: #cbd5e1; font-size: 13px; font-weight: 600;">Challenges:</p>
                  <p style="margin: 0; color: #f1f5f9; font-size: 15px;">${data.challenges.join(', ')}</p>
                </div>
                ` : ''}
                
                ${data.timeline ? `
                <div>
                  <p style="margin: 0 0 6px; color: #cbd5e1; font-size: 13px; font-weight: 600;">Objective:</p>
                  <p style="margin: 0; color: #f1f5f9; font-size: 15px;">${data.timeline}</p>
                </div>
                ` : ''}
              </div>
              
              <p style="margin: 30px 0 0; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                In the meantime, feel free to explore our website to learn more about how Pimlico XHS™ can transform your regulatory monitoring.
              </p>
              
              <p style="margin: 20px 0 0; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #f1f5f9;">The Pimlico XHS Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px 40px; border-top: 1px solid #334155;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <!-- Social Media Icons -->
                    <a href="https://www.linkedin.com/company/pimlico-solutions-ltd" style="display: inline-block; margin: 0 8px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 32px; height: 32px; vertical-align: middle;">
                    </a>
                    <a href="https://x.com/pimlicosol" style="display: inline-block; margin: 0 8px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="X" style="width: 32px; height: 32px; vertical-align: middle;">
                    </a>
                    <a href="https://wa.me/message/YOUR_WHATSAPP_NUMBER" style="display: inline-block; margin: 0 8px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" style="width: 32px; height: 32px; vertical-align: middle;">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px; color: #64748b; font-size: 13px; line-height: 1.6;">
                    © 2025 Pimlico Solutions Ltd. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
