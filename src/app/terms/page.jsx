export const metadata = {
  title: 'Terms and Conditions - Pimlico XHS',
  description: 'Terms and Conditions for Pimlico Solutions Ltd. Read our terms of service for using the XHS platform.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function Terms() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <div className="mb-8">
          <a href="/" className="text-sm text-blue-600 hover:text-blue-500">
            ← Back to home
          </a>
        </div>
        
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Terms and Conditions
        </h1>
        
        <p className="mt-6 text-xl leading-8">
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="mt-10 max-w-2xl space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">1. Introduction</h2>
            <p className="mt-4">
              These terms and conditions ("Terms") govern your use of our website and services provided by 
              Pimlico Solutions Ltd ("we", "our", or "us"), a company registered in England and Wales.
            </p>
            <p className="mt-4">
              By accessing or using our website and services, you agree to be bound by these Terms. 
              If you disagree with any part of these terms, then you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">2. Definitions</h2>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li><strong>"Company"</strong> refers to Pimlico Solutions Ltd</li>
              <li><strong>"Service"</strong> refers to the website and any related services provided by the Company</li>
              <li><strong>"User"</strong> refers to any individual who accesses or uses the Service</li>
              <li><strong>"Content"</strong> refers to all information, data, text, software, graphics, or other materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">3. Use of Service</h2>
            <p className="mt-4">
              You may use our Service for lawful purposes only. You agree not to use the Service:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>In any way that violates applicable local, national, or international law or regulation</li>
              <li>To transmit or procure the sending of any unsolicited or unauthorised advertising or promotional material</li>
              <li>To impersonate or attempt to impersonate the Company, employees, another user, or any other person or entity</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">4. Intellectual Property Rights</h2>
            <p className="mt-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of 
              Pimlico Solutions Ltd and its licensors. The Service is protected by copyright, trademark, and other laws. 
              Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">5. User Content</h2>
            <p className="mt-4">
              Our Service may allow you to post, link, store, share and otherwise make available certain information, text, 
              graphics, videos, or other material. You are responsible for the content that you post to the Service, 
              including its legality, reliability, and appropriateness.
            </p>
            <p className="mt-4">
              By posting content to the Service, you grant us the right and license to use, modify, publicly perform, 
              publicly display, reproduce, and distribute such content on and through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">6. Privacy Policy</h2>
            <p className="mt-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information 
              when you use our Service. By using our Service, you agree to the collection and use of information in accordance 
              with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">7. Disclaimer</h2>
            <p className="mt-4">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
              this Company:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Excludes all representations and warranties relating to this website and its contents</li>
              <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">8. Limitation of Liability</h2>
            <p className="mt-4">
              In no event shall Pimlico Solutions Ltd, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">9. Termination</h2>
            <p className="mt-4">
              We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, 
              including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">10. Governing Law</h2>
            <p className="mt-4">
              These Terms shall be interpreted and governed by the laws of England and Wales. Any disputes relating to these Terms 
              shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">11. Changes to Terms</h2>
            <p className="mt-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
              we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">12. Contact Information</h2>
            <p className="mt-4">
              If you have any questions about these Terms and Conditions, please contact us:
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