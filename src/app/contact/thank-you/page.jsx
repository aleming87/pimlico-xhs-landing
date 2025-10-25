"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [callBooked, setCallBooked] = useState(false);
  const router = useRouter();
  const surveyUrl = "/contact/survey";
  const calendlyUrl = "https://calendly.com/andrew-pimlicosolutions/xhs-demo";

  useEffect(() => {
    // Check if survey was completed
    const surveyDone = localStorage.getItem('surveyCompleted') === 'true';
    setSurveyCompleted(surveyDone);

    // Check if call was booked
    const booked = localStorage.getItem('callBooked') === 'true';
    setCallBooked(booked);

    // Listen for messages from Calendly iframe
    const handleMessage = (e) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        if (e.data.event === 'calendly.event_scheduled') {
          localStorage.setItem('callBooked', 'true');
          setCallBooked(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
        <div className="mx-auto max-w-3xl text-center pt-20">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 mb-8">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
            Thank you for your interest!
          </h1>
          
          <p className="text-lg text-gray-300 mb-12">
            Complete these steps to book your personalized demo
          </p>

          {/* Two-Step Process */}
          <div className="space-y-6 mb-12">
            
            {/* Step 1: Take Survey */}
            <div className={`bg-white/5 rounded-2xl p-8 border transition-all ${
              surveyCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-white/10'
            }`}>
              <div className="flex items-start gap-6">
                {/* Step Number */}
                <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                  surveyCompleted 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {surveyCompleted ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    '1'
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Take Survey
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Help us understand your needs (2 minutes)
                  </p>
                  {!surveyCompleted ? (
                    <a
                      href={surveyUrl}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                    >
                      Start Survey
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Survey completed
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Book Call */}
            <div className={`bg-white/5 rounded-2xl p-8 border transition-all ${
              !surveyCompleted 
                ? 'opacity-50 cursor-not-allowed border-white/10' 
                : callBooked 
                  ? 'border-green-500/50 bg-green-500/5' 
                  : 'border-white/10'
            }`}>
              <div className="flex items-start gap-6">
                {/* Step Number */}
                <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                  !surveyCompleted
                    ? 'bg-gray-600 text-gray-400'
                    : callBooked 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 text-white'
                }`}>
                  {callBooked ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    '2'
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Book Your Call
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Schedule a personalized demo with our team
                  </p>
                  {!surveyCompleted ? (
                    <div className="text-sm text-gray-500 italic">
                      Complete the survey to unlock this step
                    </div>
                  ) : !callBooked ? (
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                    >
                      Book Call
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Call scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Follow on Social Media (only shows after call is booked) */}
            {callBooked && (
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 animate-fade-in">
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                    3
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      Follow Us on Social Media
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Stay updated with the latest regulatory insights
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="https://www.linkedin.com/company/pimlico-solutions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-[#0A66C2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#004182] transition-all"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                      <a
                        href="https://twitter.com/pimlicosolutions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        X (Twitter)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
