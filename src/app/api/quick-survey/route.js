import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    console.log('📧 Quick Survey Form Data Received');
    console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('- CONTACT_EMAIL:', process.env.CONTACT_EMAIL || 'NOT SET');
    
    // Format the comprehensive email report
    const emailReport = `
====================================================
NEW QUICK SURVEY SUBMISSION - COMPLETE LEAD PROFILE
====================================================

👤 CONTACT INFORMATION

Name: ${data.firstName} ${data.lastName}
Company: ${data.company}
Email: ${data.email}
Message: ${data.message || 'N/A'}

Consents:
- Privacy Policy Agreed: ${data.agreedToPolicy ? 'Yes' : 'No'}
- Marketing Communications: ${data.marketingConsent ? 'Yes' : 'No'}

====================================================

📊 PROSPECT INTELLIGENCE - SURVEY RESPONSES

Primary Focus Areas: ${data.focusAreas.join(', ')}

---------------------------------------------------

Top 5 Jurisdictions (Ranked):
${data.topJurisdictions.map((j, i) => `${i + 1}. ${j}`).join('\n')}

---------------------------------------------------
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

🎯 IMPLEMENTATION & NEEDS

What brings them here: ${data.timeline}

---------------------------------------------------

🔍 COMPLIANCE INTELLIGENCE

Current Challenges:
${data.challenges.length > 0 ? data.challenges.map(c => `• ${c}`).join('\n') : '• None specified'}

Using Competing Vendors: ${data.usingCompetitors}
${data.competitorVendors ? `Competitors: ${data.competitorVendors}` : ''}

---------------------------------------------------

💼 WORKSPACE & COLLABORATION

Has Shared Regulatory Workspace: ${data.hasSharedWorkspace}

Productivity & GRC Apps:
${data.productivityApps.length > 0 ? data.productivityApps.map(app => `• ${app}`).join('\n') : '• None specified'}

---------------------------------------------------

🕐 SUBMITTED: ${new Date().toISOString()}

====================================================
    `.trim();

    console.log('📧 Email Report:');
    console.log(emailReport);

    // Send email notification if Resend is configured
    if (process.env.RESEND_API_KEY) {
      console.log('✅ RESEND_API_KEY found, attempting to send email...');
      
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const recipientEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';

      try {
        // Send to team
        const teamEmailResult = await resend.emails.send({
          from: 'Pimlico XHS Quick Survey <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `🎯 QUICK SURVEY - ${data.firstName} ${data.lastName} from ${data.company}`,
          text: emailReport,
        });

        console.log('✅ Team notification sent:', teamEmailResult);

        // Send confirmation to user
        const userEmailResult = await resend.emails.send({
          from: 'Pimlico XHS <onboarding@resend.dev>',
          to: data.email,
          subject: 'Thank you for your submission - Pimlico XHS™',
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You - Pimlico XHS™</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .header { padding: 30px 20px 20px !important; }
      .content { padding: 30px 20px !important; }
      .footer { padding: 20px !important; }
      h1 { font-size: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
          
          <!-- Header with Logo -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 40px 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <img src="https://pimlicosolutions.com/XHS_Logo_White.png" alt="Pimlico XHS" style="max-width: 180px; height: auto;" />
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Thank You for Your Submission</h1>
              <p style="margin: 10px 0 0; color: #bfdbfe; font-size: 16px;">We'll be in contact soon</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="content" style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #f1f5f9; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Thank you for completing our quick survey and sharing information about your regulatory compliance needs. We've received your submission and a member of our team will review your responses and get back to you within 24-48 hours.
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                In the meantime, feel free to explore our website to learn more about how <strong>Pimlico XHS™</strong> transforms regulatory compliance across ${data.focusAreas.join(', ')}.
              </p>
              
              <p style="margin: 30px 0 0; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #f1f5f9;">The Pimlico XHS™ Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer" style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #94a3b8;">
                <strong style="color: #f1f5f9;">Pimlico XHS™</strong><br>
                Transforming Regulatory Compliance
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                <a href="https://pimlicosolutions.com" style="color: #3b82f6; text-decoration: none;">pimlicosolutions.com</a>
              </p>
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

        console.log('✅ User confirmation sent:', userEmailResult);

        return NextResponse.json({ 
          success: true, 
          message: 'Survey submitted successfully',
          emailSent: true 
        });
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
        console.error('Error details:', emailError.message);
        
        // Still return success for the form submission even if email fails
        return NextResponse.json({ 
          success: true, 
          message: 'Survey submitted successfully (email notification may have failed)',
          emailSent: false,
          emailError: emailError.message 
        });
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not found - email not sent');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Survey submitted successfully (no email service configured)',
        emailSent: false 
      });
    }
  } catch (error) {
    console.error('❌ Survey submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
