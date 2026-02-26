import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    console.log('📧 XHS™ Monitoring Survey Data Received');
    console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('- CONTACT_EMAIL:', process.env.CONTACT_EMAIL || 'NOT SET');
    
    // Format the comprehensive email report
    const emailReport = `
====================================================
XHS™ MONITORING FEEDBACK SURVEY - INDIVIDUAL USER
====================================================

👤 CONTACT INFORMATION

Name: ${data.firstName} ${data.lastName}
Company: ${data.company}
Email: ${data.email}

Consents:
- Privacy Policy Agreed: ${data.agreedToPolicy ? 'Yes' : 'No'}
- Marketing Communications: ${data.marketingConsent ? 'Yes' : 'No'}

====================================================

📈 USAGE

How often they use XHS™: ${data.usageFrequency || 'N/A'}

====================================================

📊 PLATFORM RATINGS

Overall Satisfaction: ${data.overallSatisfaction}/5
Regulatory Coverage (Breadth): ${data.coverageRating}/5
Depth of Analysis: ${data.depthRating}/5
Timeliness of Updates: ${data.timelinessRating}/5
Ease of Use: ${data.easeOfUseRating}/5

---------------------------------------------------

🌍 COVERAGE FEEDBACK

Coverage Comments: ${data.coverageComments || 'N/A'}
Missed Jurisdictions: ${data.missedJurisdictions || 'N/A'}
Missed Topics or Regulations: ${data.missedTopics || 'N/A'}
Would Recommend Adding Sources: ${data.recommendSources}
Suggested Sources: ${data.suggestedSources || 'N/A'}

---------------------------------------------------

🔗 SLACK INTEGRATION

Has Used Slack Integration: ${data.usedSlackIntegration}
Slack Integration Rating: ${data.integrationRating ? data.integrationRating + '/5' : 'N/A'}
Slack Integration Feedback: ${data.integrationFeedback || 'N/A'}
Desired Future Integrations: ${data.desiredIntegrations && data.desiredIntegrations.length > 0 ? data.desiredIntegrations.join(', ') : 'N/A'}

---------------------------------------------------

📄 COUNTRY REPORTS

Has Used Country Reports: ${data.usedCountryReports}
Country Reports Rating: ${data.countryReportsRating ? data.countryReportsRating + '/5' : 'N/A'}
Country Reports Feedback: ${data.countryReportsFeedback || 'N/A'}
Most Useful Country Reports: ${data.mostUsefulCountryReports || 'N/A'}

---------------------------------------------------

📰 NEWS COVERAGE

Would Find News Coverage Beneficial: ${data.newsCoverageBeneficial}
News Coverage Comments: ${data.newsCoverageComments || 'N/A'}
Preferred News Topics: ${data.preferredNewsTopics && data.preferredNewsTopics.length > 0 ? data.preferredNewsTopics.join(', ') : 'N/A'}

---------------------------------------------------

🔮 IMPROVEMENTS & FUTURE FEATURES

What Would They Change: ${data.whatWouldChange || 'N/A'}
Most Valuable Feature: ${data.mostValuableFeature || 'N/A'}
Desired Features: ${data.desiredFeatures && data.desiredFeatures.length > 0 ? data.desiredFeatures.join(', ') : 'N/A'}
Other Feature Suggestions: ${data.otherFeatureSuggestions || 'N/A'}
Additional Comments: ${data.additionalComments || 'N/A'}

---------------------------------------------------

⭐ RECOMMENDATION

Likelihood to Recommend (NPS): ${data.npsScore}/10

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
          from: 'Pimlico XHS™ Monitoring Survey <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `📊 XHS™ MONITORING FEEDBACK - ${data.firstName} ${data.lastName} from ${data.company} | NPS: ${data.npsScore}/10`,
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XHS™ Monitoring Survey Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="700" cellpadding="0" cellspacing="0" style="max-width: 700px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">📊 XHS™ Monitoring Feedback</h1>
              <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">Individual User Survey Response</p>
            </td>
          </tr>
          
          <!-- Contact Information -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">👤 Contact Information</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Name:</td>
                  <td style="color: #1e293b; font-size: 14px;"><strong>${data.firstName} ${data.lastName}</strong></td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Company:</td>
                  <td style="color: #1e293b; font-size: 14px;"><strong>${data.company}</strong></td>
                </tr>
                <tr>
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Email:</td>
                  <td style="color: #2563eb; font-size: 14px;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Usage Frequency:</td>
                  <td style="color: #1e293b; font-size: 14px;">${data.usageFrequency || 'N/A'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Platform Ratings -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">⭐ Platform Ratings</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Overall Satisfaction:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700;">${data.overallSatisfaction}/5</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600;">Regulatory Coverage:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700;">${data.coverageRating}/5</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Depth of Analysis:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700;">${data.depthRating}/5</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600;">Timeliness:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700;">${data.timelinessRating}/5</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Ease of Use:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700;">${data.easeOfUseRating}/5</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600;">NPS Score:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700;">${data.npsScore}/10</td></tr>
              </table>
            </td>
          </tr>

          <!-- Coverage Feedback -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🌍 Coverage Feedback</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Coverage Comments:</td><td style="color: #1e293b; font-size: 14px;">${data.coverageComments || 'N/A'}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Missed Jurisdictions:</td><td style="color: #1e293b; font-size: 14px;">${data.missedJurisdictions || 'N/A'}</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Missed Topics:</td><td style="color: #1e293b; font-size: 14px;">${data.missedTopics || 'N/A'}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600;">Recommend Adding Sources:</td><td style="color: #1e293b; font-size: 14px;">${data.recommendSources}</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Suggested Sources:</td><td style="color: #1e293b; font-size: 14px;">${data.suggestedSources || 'N/A'}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Slack Integration -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🔗 Slack Integration</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Has Used Slack Integration:</td><td style="color: #1e293b; font-size: 14px;">${data.usedSlackIntegration}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600;">Slack Rating:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700;">${data.integrationRating ? data.integrationRating + '/5' : 'N/A'}</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Slack Feedback:</td><td style="color: #1e293b; font-size: 14px;">${data.integrationFeedback || 'N/A'}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600;">Desired Future Integrations:</td><td style="color: #1e293b; font-size: 14px;">${data.desiredIntegrations && data.desiredIntegrations.length > 0 ? data.desiredIntegrations.join(', ') : 'N/A'}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Country Reports -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📄 Country Reports</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Has Used Country Reports:</td><td style="color: #1e293b; font-size: 14px;">${data.usedCountryReports}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600;">Rating:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700;">${data.countryReportsRating ? data.countryReportsRating + '/5' : 'N/A'}</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Feedback:</td><td style="color: #1e293b; font-size: 14px;">${data.countryReportsFeedback || 'N/A'}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Most Useful Reports:</td><td style="color: #1e293b; font-size: 14px;">${data.mostUsefulCountryReports || 'N/A'}</td></tr>
              </table>
            </td>
          </tr>

          <!-- News Coverage -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📰 News Coverage</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Would Find Beneficial:</td><td style="color: #1e293b; font-size: 14px;">${data.newsCoverageBeneficial}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Comments:</td><td style="color: #1e293b; font-size: 14px;">${data.newsCoverageComments || 'N/A'}</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Preferred Topics:</td><td style="color: #1e293b; font-size: 14px;">${data.preferredNewsTopics && data.preferredNewsTopics.length > 0 ? data.preferredNewsTopics.join(', ') : 'N/A'}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Improvements -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🔮 Improvements & Future Features</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Most Valuable Feature:</td><td style="color: #1e293b; font-size: 14px;">${data.mostValuableFeature || 'N/A'}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">What Would Change:</td><td style="color: #1e293b; font-size: 14px;">${data.whatWouldChange || 'N/A'}</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Desired Features:</td><td style="color: #1e293b; font-size: 14px;">${data.desiredFeatures && data.desiredFeatures.length > 0 ? data.desiredFeatures.join(', ') : 'N/A'}</td></tr>
                <tr style="background-color: #f8fafc;"><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Other Suggestions:</td><td style="color: #1e293b; font-size: 14px;">${data.otherFeatureSuggestions || 'N/A'}</td></tr>
                <tr><td style="color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Additional Comments:</td><td style="color: #1e293b; font-size: 14px;">${data.additionalComments || 'N/A'}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">Submitted: ${new Date().toISOString()}</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
          text: emailReport,
        });

        console.log('✅ Team notification sent:', teamEmailResult);

        // Send confirmation to user
        const userEmailResult = await resend.emails.send({
          from: 'Pimlico XHS™ <onboarding@resend.dev>',
          to: data.email,
          subject: 'Thank you for your feedback - Pimlico XHS™',
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
                <img src="https://pimlicosolutions.com/XHS_Logo_White.png" alt="Pimlico XHS™" style="max-width: 180px; height: auto;" />
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Thank You for Your Feedback</h1>
              <p style="margin: 10px 0 0; color: #bfdbfe; font-size: 16px;">Your input helps us improve XHS™</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="content" style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #f1f5f9; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Thank you for taking the time to share your experience with the XHS™ monitoring platform. Your feedback is invaluable in helping us improve the platform and build the features that matter most to you.
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Our product team will review your responses carefully. If you've raised any specific issues or suggestions, a member of our team may reach out to discuss them further.
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
    console.error('❌ XHS™ Monitoring Survey submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
