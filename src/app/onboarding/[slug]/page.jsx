"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { OnboardingForm } from "../page";
import Image from "next/image";

export default function OrgOnboardingPage() {
  const params = useParams();
  const slug = params.slug;
  const [orgConfig, setOrgConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrg() {
      try {
        const res = await fetch(`/api/onboarding?type=orgs`);
        const data = await res.json();
        if (!data.success) throw new Error('Failed to load');

        const org = (data.orgs || []).find(o => o.slug === slug);
        if (!org) {
          setError('not-found');
        } else if (!org.active) {
          setError('inactive');
        } else {
          setOrgConfig(org);
        }
      } catch (err) {
        console.error(err);
        setError('error');
      } finally {
        setLoading(false);
      }
    }
    loadOrg();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading onboarding form...</p>
        </div>
      </div>
    );
  }

  if (error === 'not-found') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Onboarding Link Not Found</h1>
          <p className="text-gray-400 mb-6">
            The onboarding link <span className="text-white font-mono">/onboarding/{slug}</span> doesn't exist or hasn't been set up yet.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            If you believe this is an error, please contact your account manager.
          </p>
          <a href="/onboarding" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors">
            Use General Onboarding Form
          </a>
        </div>
      </div>
    );
  }

  if (error === 'inactive') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏸️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Onboarding Paused</h1>
          <p className="text-gray-400 mb-8">
            This onboarding link is currently inactive. Please contact your account manager for assistance.
          </p>
          <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Pimlico
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">Unable to load the onboarding form. Please try again later.</p>
          <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Pimlico</a>
        </div>
      </div>
    );
  }

  return <OnboardingForm orgSlug={slug} orgConfig={orgConfig} />;
}
