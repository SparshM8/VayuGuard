'use client';

import { useState } from 'react';
import { AQIData, RecommendationResponse, UserProfile } from '@/types';
import { PersonalizedAdvice } from './PersonalizedAdvice';
import { RoutineSuggestions } from './RoutineSuggestions';
import { IndoorAirQuality } from './IndoorAirQuality';
import { SustainableAlternatives } from './SustainableAlternatives';
import { ImpactCalculator } from './ImpactCalculator';
import { TriangleAlert } from 'lucide-react';

type DashboardTab = 'all' | 'routines' | 'indoor' | 'alternatives' | 'calculator';

const DASHBOARD_TABS: { key: DashboardTab; label: string }[] = [
  { key: 'all', label: 'All Insights & Solutions' },
  { key: 'routines', label: 'Low-Emission Routines' },
  { key: 'indoor', label: 'NASA Indoor Hacks' },
  { key: 'alternatives', label: 'Sustainable Alternatives' },
  { key: 'calculator', label: 'Impact Simulator' },
];

interface RecommendationsViewProps {
  aqiData: AQIData;
  recommendations: RecommendationResponse | null;
  loading: boolean;
  error: string | null;
  activeProfile: UserProfile;
  onRetry: () => void;
}

/** Accessible tabbed layout presenting personalized guidance, routines, IAQ hacks, alternatives, and impact simulator. */
export function RecommendationsView({
  aqiData,
  recommendations,
  loading,
  error,
  activeProfile,
  onRetry,
}: RecommendationsViewProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('all');

  if (error && !recommendations) {
    return (
      <div
        role="alert"
        className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-sm"
      >
        <div className="flex items-center gap-2.5">
          <TriangleAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl"
        >
          Retry AI Advice
        </button>
      </div>
    );
  }

  if (loading && !recommendations) {
    return (
      <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-1">
          <p className="text-base font-bold text-slate-800">
            Generating Personalized Recommendations with AI...
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Analyzing PM2.5 levels, {activeProfile} context, and winter smog inversions to craft
            actionable routines.
          </p>
        </div>
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <section aria-label="Personalized Air Quality Recommendations" className="space-y-8">
      <div
        role="tablist"
        aria-label="Recommendation views"
        className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none text-xs font-semibold"
      >
        <span className="text-slate-400 uppercase tracking-wider text-[11px] mr-1">Views:</span>
        {DASHBOARD_TABS.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition ${
                isSelected
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="space-y-8 animate-in fade-in duration-300">
        <PersonalizedAdvice
          advice={recommendations.personalizedAdvice}
          aqiCategory={aqiData.category}
          aqiValue={aqiData.aqi}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {(activeTab === 'all' || activeTab === 'routines' || activeTab === 'indoor') && (
            <div className={`space-y-8 ${activeTab === 'all' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              {(activeTab === 'all' || activeTab === 'routines') && (
                <RoutineSuggestions routines={recommendations.routines} />
              )}
              {(activeTab === 'all' || activeTab === 'indoor') && (
                <IndoorAirQuality hacks={recommendations.indoorHacks} />
              )}
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'alternatives') && (
            <div className={`space-y-8 ${activeTab === 'alternatives' ? 'lg:col-span-3' : ''}`}>
              <SustainableAlternatives alternatives={recommendations.alternatives} />
            </div>
          )}
        </div>

        {(activeTab === 'all' || activeTab === 'calculator') && <ImpactCalculator />}
      </div>
    </section>
  );
}
