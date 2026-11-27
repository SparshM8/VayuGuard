'use client';

import { AQIData, UserProfile } from '@/types';
import { PROFILE_METADATA } from '@/lib/constants';
import { ExternalLink, ShieldCheck, Sparkles, Users } from 'lucide-react';

interface FooterProps {
  aqiData: AQIData | null;
  activeProfile: UserProfile;
  city: string;
}

/** Transparent data attribution, AI methodology summary, and compliance footer. */
export function Footer({ aqiData, activeProfile, city }: FooterProps) {
  const activeProfileLabel = PROFILE_METADATA[activeProfile]?.label || activeProfile;

  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Live Data Attribution
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Real-time atmospheric telemetry sourced from{' '}
              <a
                href="https://open-meteo.com/en/docs/air-quality-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                Open-Meteo Air Quality Engine <ExternalLink className="w-3 h-3" />
              </a>{' '}
              with Copernicus Atmosphere Monitoring Service (CAMS) &amp; CPCB ground reference calibration.
            </p>
            {aqiData && (
              <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                Timestamp: {new Date(aqiData.timestamp).toLocaleString()}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              GenAI Decision Engine
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Powered by Google Gemini structured reasoning. Translates raw multi-pollutant sub-indices into
              personalized, context-aware routines, indoor hacks, and quantified impact metrics.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Active Persona Profile
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Tailored for: <span className="font-bold text-slate-800">{activeProfileLabel}</span> in {city}.
              Personalized with health parameters, housing structure, and daily commute mode.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Challenge-6 Compliance</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Built for Challenge 6: Urban Air Quality Assistant. Designed to help communities navigate winter smog
              with low-emission routines and actionable sustainable alternatives.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; 2026 VayuGuard AI. Built with Next.js, TypeScript, &amp; Tailwind CSS.</p>
          <p className="text-slate-400">Clean Air for Healthier Communities</p>
        </div>
      </div>
    </footer>
  );
}
