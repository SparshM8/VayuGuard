'use client';

import { useState } from 'react';
import { AQIData } from '@/types';
import { CheckCircle2, Home, ShieldAlert, UserX, X } from 'lucide-react';

interface SmogAlertBannerProps {
  data: AQIData;
  onOpenDefensePlan?: () => void;
}

/** High-visibility urgent advisory displayed automatically when AQI reaches Unhealthy (150+) or worse. */
export function SmogAlertBanner({ data, onOpenDefensePlan }: SmogAlertBannerProps) {
  const [dismissedLocation, setDismissedLocation] = useState<string | null>(null);
  const locationKey = `${data.city}-${data.aqi}`;

  if (dismissedLocation === locationKey || data.aqi < 150) return null;

  const isHazardous = data.aqi >= 300;
  const isVeryUnhealthy = data.aqi >= 200;

  const bannerTheme = isHazardous
    ? 'bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-red-700 text-rose-100'
    : isVeryUnhealthy
      ? 'bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 border-purple-700 text-purple-100'
      : 'bg-gradient-to-r from-orange-950 via-amber-900 to-orange-950 border-orange-700 text-orange-100';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`rounded-2xl border p-5 shadow-lg relative overflow-hidden transition-all ${bannerTheme}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
            <ShieldAlert className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/30 text-rose-200 border border-rose-400/30">
                Severe Winter Smog Advisory
              </span>
              <span className="text-sm font-semibold text-white/90">
                AQI {data.aqi} &bull; {data.category} in {data.city}
              </span>
            </div>
            <p className="text-sm text-white/80 max-w-3xl leading-relaxed">
              Thermal ground inversion is trapping concentrated toxic particulates (
              {data.dominantPollutant || 'PM2.5'}). High risk of acute respiratory and ocular inflammation.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissedLocation(locationKey)}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          aria-label="Dismiss smog alert"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
          <span>Wear N95/KN95 outdoors</span>
        </div>
        <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
          <Home className="w-4 h-4 text-blue-300 flex-shrink-0" />
          <span>Seal windows &amp; run HEPA</span>
        </div>
        <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
          <UserX className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span>No early morning cardio</span>
        </div>
        <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between">
          <span className="font-semibold text-amber-200">Children &amp; elderly indoors</span>
          {onOpenDefensePlan && (
            <button
              type="button"
              onClick={onOpenDefensePlan}
              className="underline text-[11px] font-bold text-white hover:text-amber-200 ml-1"
            >
              Action Plan &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
