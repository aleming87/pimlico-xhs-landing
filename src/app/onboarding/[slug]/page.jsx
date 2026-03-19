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
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading onboarding form...</p>
        </div>
      </div>
    );
  }

  if (error === 'not-found') {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Onboarding Link Not Found</h1>
          <p className="text-slate-500 mb-6">
            The onboarding link <span className="text-slate-900 font-mono">/onboarding/{slug}</span> doesn&apos;t exist or hasn&apos;t been set up yet.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            If you believe this is an error, please contact your account manager.
          </p>
          <a href="/onboarding" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors">
            Use General Onboarding Form
          </a>
        </div>
      </div>
    );
  }

  if (error === 'inactive') {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏸️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Onboarding Paused</h1>
          <p className="text-slate-500 mb-8">
            This onboarding link is currently inactive. Please contact your account manager for assistance.
          </p>
          <a href="/" className="text-teal-600 hover:text-teal-700 transition-colors">
            ← Back to Pimlico
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h1>
          <p className="text-slate-500 mb-6">Unable to load the onboarding form. Please try again later.</p>
          <a href="/" className="text-teal-600 hover:text-teal-700">← Back to Pimlico</a>
        </div>
      </div>
    );
  }

  return <OnboardingForm orgSlug={slug} orgConfig={orgConfig} />;
}
