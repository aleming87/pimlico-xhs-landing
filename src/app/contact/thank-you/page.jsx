"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [callBooked, setCallBooked] = useState(false);
  const router = useRouter();
  const surveyUrl = "/contact/survey";
  
  // Calendly URL with redirect to confirmation page
  const confirmationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/contact/confirmation` 
    : '';
  const calendlyUrl = `https://calendly.com/andrew-pimlicosolutions/xhs-demo?redirect_url=${encodeURIComponent(confirmationUrl)}`;

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
                      Call scheduled - check your email for confirmation
                    </div>
                  )}
                </div>
              </div>
            </div>
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
