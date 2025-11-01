"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from '@/components/footer';

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [validFields, setValidFields] = useState({
    firstName: false,
    lastName: false,
    company: false,
    email: false
  });
  const router = useRouter();

  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
    'gmx.com', 'live.com', 'msn.com', 'inbox.com', 'tutanota.com'
  ];

  const validateBusinessEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    if (freeEmailProviders.includes(domain)) {
      setEmailError('Please use your business email address');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleFieldChange = (field, value) => {
    let isValid = false;
    
    switch(field) {
      case 'firstName':
      case 'lastName':
      case 'company':
        isValid = value.trim().length > 0;
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value) && validateBusinessEmail(value);
        break;
    }
    
    setValidFields(prev => ({...prev, [field]: isValid}));
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    handleFieldChange('email', email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    // Block vixio.com email addresses
    if (email && email.toLowerCase().endsWith('@vixio.com')) {
      setIsSubmitting(false);
      alert('We are unable to process your request at this time. Please contact us through alternative channels.');
      return;
    }
    
    // Validate business email
    if (!validateBusinessEmail(email)) {
      setIsSubmitting(false);
      return;
    }

    const data = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      company: formData.get('company'),
      email: email,
      message: formData.get('message'),
      agreedToPolicy: formData.get('agree-to-policies') === 'on',
      marketingConsent: formData.get('marketing-consent') === 'on'
    };

    // Store contact data in localStorage for combined email with survey
    localStorage.setItem('contactFormData', JSON.stringify(data));
    // Store email for thank you page
    sessionStorage.setItem('contactEmail', data.email);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Redirect to thank you page
      router.push('/contact/thank-you');
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your form. Please try again or email us directly at contact@pimlicosolutions.com');
    }
  };

  return (
    <div className="bg-gray-900">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico XHS</span>
              <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm/6 font-semibold text-white">Home</a>
            <a href="/#differentiators" className="text-sm/6 font-semibold text-white">How it works</a>
            <a href="/ai" className="text-sm/6 font-semibold text-white">AI</a>
            <a href="/payments" className="text-sm/6 font-semibold text-white">Payments</a>
            <a href="/gambling" className="text-sm/6 font-semibold text-white">Gambling</a>
            <a href="/pricing" className="text-sm/6 font-semibold text-white">Pricing</a>
            <a href="/#team" className="text-sm/6 font-semibold text-white">Team</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/contact" className="inline-flex items-center rounded-md px-5 py-2.5 font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105">
              Book a demo <span aria-hidden="true" className="ml-1">&rarr;</span>
            </a>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Pimlico XHS</span>
                  <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={100} height={27} className="h-8 w-auto" />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">Home</a>
                    <a href="/#differentiators" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">How it works</a>
                    <a href="/ai" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">AI</a>
                    <a href="/payments" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">Payments</a>
                    <a href="/gambling" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">Gambling</a>
                    <a href="/pricing" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">Pricing</a>
                    <a href="/#team" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">Team</a>
                  </div>
                  <div className="py-6">
                    <a href="/contact" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-blue-400 hover:bg-gray-800">Book a demo</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Contact Form Section */}
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}} className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0B1B3B] to-[#1E3A8A] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">Book your demo</h2>
          <p className="mt-2 text-lg/8 text-gray-400">Get in touch with to learn how XHS™ transforms regulatory compliance</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name" className="block text-sm/6 font-semibold text-white">First name</label>
              <div className="mt-2.5 relative">
                <input 
                  id="first-name" 
                  type="text" 
                  name="first-name" 
                  autoComplete="given-name" 
                  required 
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500" 
                />
                {validFields.firstName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm/6 font-semibold text-white">Last name</label>
              <div className="mt-2.5 relative">
                <input 
                  id="last-name" 
                  type="text" 
                  name="last-name" 
                  autoComplete="family-name" 
                  required 
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500" 
                />
                {validFields.lastName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="company" className="block text-sm/6 font-semibold text-white">Company</label>
              <div className="mt-2.5 relative">
                <input 
                  id="company" 
                  type="text" 
                  name="company" 
                  autoComplete="organization" 
                  required 
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500" 
                />
                {validFields.company && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm/6 font-semibold text-white">Work Email</label>
              <div className="mt-2.5 relative">
                <input 
                  id="email" 
                  type="email" 
                  name="email" 
                  autoComplete="email" 
                  required 
                  onChange={handleEmailChange}
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500" 
                />
                {validFields.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {emailError && (
                  <p className="mt-2 text-sm text-red-400">{emailError}</p>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm/6 font-semibold text-white">Message</label>
              <div className="mt-2.5">
                <textarea id="message" name="message" rows={2} className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"></textarea>
              </div>
            </div>
            <div className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center">
                <input id="agree-to-policies" type="checkbox" name="agree-to-policies" required className="size-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900" />
              </div>
              <label htmlFor="agree-to-policies" className="text-sm/6 text-gray-400">
                By selecting this, you agree to our{' '}
                <a href="/privacy" className="font-semibold whitespace-nowrap text-blue-400 hover:text-blue-300">privacy policy</a>.
              </label>
            </div>
            <div className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center">
                <input id="marketing-consent" type="checkbox" name="marketing-consent" className="size-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900" />
              </div>
              <label htmlFor="marketing-consent" className="text-sm/6 text-gray-400">
                Receive updates about Pimlico XHS™ products and services.
              </label>
            </div>
          </div>
          <div className="mt-10">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : "Let's talk"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
