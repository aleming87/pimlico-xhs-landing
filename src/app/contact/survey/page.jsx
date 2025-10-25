"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      jurisdictions: formData.getAll('jurisdictions'),
      sectors: formData.getAll('sectors'),
      topics: formData.getAll('topics'),
      role: formData.get('role'),
      companyName: formData.get('company-name'),
      companySize: formData.get('company-size'),
      challenges: formData.get('challenges'),
      timeline: formData.get('timeline'),
      additionalInfo: formData.get('additional-info')
    };

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      // Redirect to homepage or thank you
      router.push('/?survey=complete');
    } catch (error) {
      console.error('Survey submission error:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your survey. Please try again.');
    }
  };

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

      {/* Survey Form */}
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12 pt-12">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
              Help us understand your needs
            </h1>
            <p className="text-lg text-gray-400">
              This survey helps us tailor our conversation to your specific regulatory compliance requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Jurisdictions */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                Which jurisdictions are you monitoring? <span className="text-red-400">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'European Union', 'United Kingdom', 'United States', 'Canada',
                  'Australia', 'Singapore', 'Hong Kong', 'Japan',
                  'South Korea', 'China', 'India', 'UAE',
                  'Brazil', 'Switzerland', 'Norway', 'Other'
                ].map((jurisdiction) => (
                  <label key={jurisdiction} className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      name="jurisdictions"
                      value={jurisdiction}
                      className="size-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm">{jurisdiction}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sectors */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                Which industry sectors are you focused on? <span className="text-red-400">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Financial Services', 'Banking', 'Payments', 'Insurance',
                  'Healthcare', 'Technology', 'E-commerce', 'Telecommunications',
                  'Energy & Utilities', 'Transportation', 'Manufacturing', 'Professional Services',
                  'Government & Public Sector', 'Education', 'Media & Entertainment', 'Other'
                ].map((sector) => (
                  <label key={sector} className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      name="sectors"
                      value={sector}
                      className="size-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm">{sector}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Regulatory Topics */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                What regulatory topics are you tracking? <span className="text-red-400">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'AI & Machine Learning', 'Data Protection & Privacy', 'Cybersecurity',
                  'AML & Financial Crime', 'Consumer Protection', 'Open Banking',
                  'Crypto & Digital Assets', 'ESG & Sustainability', 'Competition & Antitrust',
                  'Digital Services', 'Product Safety', 'Employment & Labor',
                  'Licensing & Authorization', 'Reporting & Disclosure', 'Risk Management', 'Other'
                ].map((topic) => (
                  <label key={topic} className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      name="topics"
                      value={topic}
                      className="size-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm">{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Role */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="role" className="block text-xl font-semibold text-white mb-4">
                What is your role? <span className="text-red-400">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              >
                <option value="" className="bg-gray-800">Select your role...</option>
                <option value="Chief Compliance Officer" className="bg-gray-800">Chief Compliance Officer</option>
                <option value="Compliance Manager/Director" className="bg-gray-800">Compliance Manager/Director</option>
                <option value="Legal Counsel/General Counsel" className="bg-gray-800">Legal Counsel/General Counsel</option>
                <option value="Risk Manager" className="bg-gray-800">Risk Manager</option>
                <option value="Regulatory Affairs" className="bg-gray-800">Regulatory Affairs</option>
                <option value="Data Protection Officer" className="bg-gray-800">Data Protection Officer</option>
                <option value="Policy Manager" className="bg-gray-800">Policy Manager</option>
                <option value="C-Suite Executive" className="bg-gray-800">C-Suite Executive</option>
                <option value="Consultant/Advisor" className="bg-gray-800">Consultant/Advisor</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            {/* Company Details */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
              <div>
                <label htmlFor="company-name" className="block text-xl font-semibold text-white mb-4">
                  Company name
                </label>
                <input
                  type="text"
                  id="company-name"
                  name="company-name"
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                />
              </div>

              <div>
                <label htmlFor="company-size" className="block text-xl font-semibold text-white mb-4">
                  Company size <span className="text-red-400">*</span>
                </label>
                <select
                  id="company-size"
                  name="company-size"
                  required
                  className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                >
                  <option value="" className="bg-gray-800">Select company size...</option>
                  <option value="1-10" className="bg-gray-800">1-10 employees</option>
                  <option value="11-50" className="bg-gray-800">11-50 employees</option>
                  <option value="51-200" className="bg-gray-800">51-200 employees</option>
                  <option value="201-500" className="bg-gray-800">201-500 employees</option>
                  <option value="501-1000" className="bg-gray-800">501-1,000 employees</option>
                  <option value="1001-5000" className="bg-gray-800">1,001-5,000 employees</option>
                  <option value="5001+" className="bg-gray-800">5,001+ employees</option>
                </select>
              </div>
            </div>

            {/* Challenges */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="challenges" className="block text-xl font-semibold text-white mb-4">
                What are your current compliance challenges?
              </label>
              <textarea
                id="challenges"
                name="challenges"
                rows={4}
                placeholder="Tell us about the compliance pain points you're experiencing..."
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              ></textarea>
            </div>

            {/* Timeline */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="timeline" className="block text-xl font-semibold text-white mb-4">
                What is your timeline for implementation? <span className="text-red-400">*</span>
              </label>
              <select
                id="timeline"
                name="timeline"
                required
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              >
                <option value="" className="bg-gray-800">Select timeline...</option>
                <option value="Immediate (within 1 month)" className="bg-gray-800">Immediate (within 1 month)</option>
                <option value="Short-term (1-3 months)" className="bg-gray-800">Short-term (1-3 months)</option>
                <option value="Medium-term (3-6 months)" className="bg-gray-800">Medium-term (3-6 months)</option>
                <option value="Long-term (6-12 months)" className="bg-gray-800">Long-term (6-12 months)</option>
                <option value="Exploring options (12+ months)" className="bg-gray-800">Exploring options (12+ months)</option>
              </select>
            </div>

            {/* Additional Information */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="additional-info" className="block text-xl font-semibold text-white mb-4">
                Any additional information you'd like to share?
              </label>
              <textarea
                id="additional-info"
                name="additional-info"
                rows={3}
                placeholder="Optional: Tell us anything else that might help us prepare for our conversation..."
                className="block w-full rounded-md bg-white/10 px-3.5 py-2.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-md bg-blue-600 px-3.5 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
              <a
                href="/"
                className="px-6 py-3 text-sm font-semibold text-gray-400 hover:text-white"
              >
                Skip for now
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
