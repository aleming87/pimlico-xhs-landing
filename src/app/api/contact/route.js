import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Store contact data in a way the survey can access it
    // We'll combine both in the survey submission
    
    // Format the email content for logging
    const emailContent = `
New Contact Form Submission

Name: ${data.firstName} ${data.lastName}
Company: ${data.company}
Email: ${data.email}
Message: ${data.message}

Consents:
- Privacy Policy Agreed: ${data.agreedToPolicy ? 'Yes' : 'No'}
- Marketing Communications: ${data.marketingConsent ? 'Yes' : 'No'}

Submitted: ${new Date().toISOString()}
    `.trim();

    console.log('📧 Contact Form Data Received (will be sent with survey):');
    console.log(emailContent);

    // Don't send email yet - wait for survey completion
    // Store the contact data for the survey to use
    return NextResponse.json({ 
      success: true,
      contactData: {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        email: data.email,
        message: data.message,
        agreedToPolicy: data.agreedToPolicy,
        marketingConsent: data.marketingConsent,
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
