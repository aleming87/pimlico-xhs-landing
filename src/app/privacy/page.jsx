export const metadata = {
  title: 'Privacy Policy - Pimlico XHS',
  description: 'Privacy Policy for Pimlico Solutions Ltd. Learn how we collect, use, and protect your personal data.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function Privacy() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <div className="mb-8">
          <a href="/" className="text-sm text-blue-600 hover:text-blue-500">
            ← Back to home
          </a>
        </div>
        
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        
        <p className="mt-6 text-xl leading-8">
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="mt-10 max-w-2xl space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">1. Introduction</h2>
            <p className="mt-4">
              Pimlico Solutions Ltd ("we", "our", or "us") is committed to protecting and respecting your privacy. 
              This policy sets out the basis on which any personal data we collect from you, or that you provide to us, 
              will be processed by us.
            </p>
            <p className="mt-4">
              For the purpose of the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, 
              the data controller is Pimlico Solutions Ltd.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">2. Information We Collect</h2>
            <p className="mt-4">We may collect and process the following data about you:</p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Information you give us by filling in forms on our website or by corresponding with us</li>
              <li>Information we collect about your visit to our website including traffic data and communication data</li>
              <li>Technical information including IP address, browser type, and operating system</li>
              <li>Contact information such as name, email address, and phone number when provided</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">3. How We Use Your Information</h2>
            <p className="mt-4">We use information held about you in the following ways:</p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>To provide you with information, products, or services that you request from us</li>
              <li>To carry out our obligations arising from any contracts entered into between you and us</li>
              <li>To notify you about changes to our service</li>
              <li>To ensure that content from our website is presented in the most effective manner</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">4. Legal Basis for Processing</h2>
            <p className="mt-4">
              We will only process your personal data where we have a legal basis to do so. The legal basis will depend 
              on the purposes for which we have collected and use your personal data. In almost every case the legal basis 
              will be one of the following:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Consent: where you have given clear consent for us to process your personal data for a specific purpose</li>
              <li>Contract: where our processing is necessary for a contract we have with you</li>
              <li>Legitimate interests: where our processing is necessary for our legitimate interests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">5. Data Security</h2>
            <p className="mt-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
              used, or accessed in an unauthorised way. We limit access to your personal data to those employees, agents, 
              contractors, and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">6. Data Retention</h2>
            <p className="mt-4">
              We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, 
              including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">7. Your Rights</h2>
            <p className="mt-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Right to request access to your personal data</li>
              <li>Right to request correction of your personal data</li>
              <li>Right to request erasure of your personal data</li>
              <li>Right to object to processing of your personal data</li>
              <li>Right to request restriction of processing your personal data</li>
              <li>Right to request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">8. Cookies</h2>
            <p className="mt-4">
              Our website may use cookies to distinguish you from other users of our website. This helps us to provide you 
              with a good experience when you browse our website and also allows us to improve our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">9. Changes to Privacy Policy</h2>
            <p className="mt-4">
              We reserve the right to update this privacy policy at any time. Any changes we may make to our privacy policy 
              in the future will be posted on this page and, where appropriate, notified to you by email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">10. Contact</h2>
            <p className="mt-4">
              Questions, comments, and requests regarding this privacy policy are welcomed and should be addressed to:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p><strong>Pimlico Solutions Ltd</strong></p>
              <p>Email: <a href="mailto:contact@pimlicosolutions.com" className="text-blue-600 hover:text-blue-500">contact@pimlicosolutions.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}