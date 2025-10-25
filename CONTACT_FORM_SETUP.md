# Contact Form Email Setup Instructions

The contact form has been updated to use a modern submission flow with a thank you page and automated email capabilities.

## What's Been Implemented

1. **Contact Form** (`/contact`)
   - Client-side form validation
   - Proper form submission handling (no more `mailto:` links)
   - Loading states and error handling
   - Required fields for all inputs

2. **Thank You Page** (`/contact/thank-you`)
   - Displays after successful form submission
   - Includes link to survey
   - Confirms email was sent
   - Provides next steps for the user

3. **API Route** (`/api/contact`)
   - Handles form submissions
   - Ready for email service integration
   - Error handling and logging

4. **Favicon**
   - Added `Pimlico_SI_Brandmark.png` as site favicon
   - Will appear in browser tabs

## Setting Up Automated Emails

To enable automated thank you emails with survey links, you need to:

### Option 1: Resend (Recommended)

1. **Install Resend**:
   ```bash
   npm install resend
   ```

2. **Get API Key**:
   - Sign up at https://resend.com
   - Create an API key
   - Add to `.env.local`:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxx
     ```

3. **Update `/src/app/api/contact/route.js`**:
   - Uncomment the Resend code
   - Update the email addresses and survey URL

4. **Verify Domain** (for production):
   - Add your domain in Resend dashboard
   - Add DNS records to verify ownership

### Option 2: SendGrid

1. **Install SendGrid**:
   ```bash
   npm install @sendgrid/mail
   ```

2. **Add to `.env.local`**:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxx
   ```

3. **Update API route** with SendGrid implementation

## Setting Up the Survey

1. **Create Google Form**:
   - Go to https://forms.google.com
   - Create a new form with these fields:
     - Jurisdictions you're monitoring (multiple choice/checkboxes)
     - Industry sectors of interest (multiple choice)
     - Regulatory topics being tracked (checkboxes)
     - Your role in the organization (dropdown)
     - Company name (text)
     - Company size (dropdown)
     - Current compliance challenges (long text)
     - Timeline for implementation (dropdown)

2. **Get Share Link**:
   - Click "Send" in Google Forms
   - Copy the link (format: `https://forms.gle/XXXXXXXXX`)

3. **Update Survey URLs**:
   - `/src/app/contact/thank-you/page.jsx`: Update `surveyUrl` constant
   - `/src/app/api/contact/route.js`: Update survey link in email template

## Testing

1. **Test the form locally**:
   ```bash
   npm run dev
   ```

2. **Navigate to** http://localhost:3000/contact

3. **Submit the form** and verify:
   - Redirects to thank you page
   - Console logs show submission (until email is configured)
   - Survey link works

4. **After configuring email service**:
   - Submit a test form
   - Check that you receive the notification email
   - Check that the user receives the thank you email
   - Verify survey link works in email

## Email Templates

### Thank You Email (to user)
The template in the API route includes:
- Personalized greeting using their first name
- Confirmation of receipt
- Link to survey
- Professional sign-off

### Notification Email (to you)
Includes all form data:
- Contact details
- Message content
- Timestamp
- Privacy agreement confirmation

## Next Steps

1. Set up Resend account and add API key
2. Create Google Form for survey
3. Update survey URLs in code
4. Test email flow end-to-end
5. Deploy to production

## Troubleshooting

**Form submits but no redirect**:
- Check browser console for errors
- Verify API route is working (check terminal logs)

**Emails not sending**:
- Verify API key is correct in `.env.local`
- Check Resend/SendGrid dashboard for logs
- Ensure domain is verified (for production)

**Survey link doesn't work**:
- Verify Google Form is set to "Anyone with the link"
- Check that you copied the short link (forms.gle)

## Contact

For issues with this setup, contact the development team.
