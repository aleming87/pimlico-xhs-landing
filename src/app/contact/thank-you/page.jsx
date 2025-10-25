"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function ThankYouPage() {
  const surveyUrl = "https://forms.gle/YOUR_GOOGLE_FORM_ID"; // Replace with your actual Google Form URL

  useEffect(() => {
    // Send thank you email via a serverless function or API
    // This is a placeholder - you'll need to implement the actual email sending
    const sendThankYouEmail = async () => {
      const email = sessionStorage.getItem('contactEmail');
      if (email) {
        // Call your API endpoint to send the email
        // await fetch('/api/send-thank-you', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, surveyUrl })
        // });
      }
    };
    
    sendThankYouEmail();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico XHS</span>
              <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
            </a>
          </div>
        </nav>
      </header>

      {/* Thank You Content */}
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center pt-20">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 mb-8">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-6">
            Thank you for your interest!
          </h1>
          
          <p className="text-lg text-gray-300 mb-8">
            We've received your inquiry and will be in touch soon.
          </p>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Help us tailor our conversation
            </h2>
            <p className="text-gray-300 mb-6">
              To ensure we address your specific needs, please take a moment to complete our brief survey. 
              We'll use this information to prepare for our conversation.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              A link to the survey has also been sent to your email.
            </p>
            <a
              href={surveyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
            >
              Complete Survey
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          <div className="space-y-4 text-sm text-gray-400">
            <p>
              <strong className="text-white">What happens next?</strong>
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">→</span>
                <span>Complete the survey to help us understand your requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">→</span>
                <span>Our team will review your information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">→</span>
                <span>We'll reach out to schedule a personalized demo</span>
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <a href="/" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
              ← Back to homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
