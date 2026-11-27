'use client';

import { useEffect, useState } from 'react';
import { UserContext, UserProfile } from '@/types';
import { DEFAULT_CITY, DEFAULT_COUNTRY, DEFAULT_USER_CONTEXT } from '@/lib/constants';
import { useAQIData, useCitySearch, useRecommendations } from '@/hooks/useAQIData';
import { Header } from '@/components/Header';
import { PersonaSwitcher } from '@/components/PersonaSwitcher';
import { Footer } from '@/components/Footer';
import { AQIDashboard } from '@/components/AQIDashboard';
import { RoutineSuggestions } from '@/components/RoutineSuggestions';
import { IndoorAirQuality } from '@/components/IndoorAirQuality';
import { SustainableAlternatives } from '@/components/SustainableAlternatives';
import { UserProfileForm } from '@/components/UserProfileForm';
import { PersonalizedAdvice } from '@/components/PersonalizedAdvice';
import { ImpactCalculator } from '@/components/ImpactCalculator';
import { SmogAlertBanner } from '@/components/SmogAlertBanner';
import { FamilySmogDefensePlan } from '@/components/FamilySmogDefensePlan';
import { MapPin, TriangleAlert, X } from 'lucide-react';

type DashboardTab = 'all' | 'routines' | 'indoor' | 'alternatives' | 'calculator';

const DASHBOARD_TABS: { key: DashboardTab; label: string }[] = [
  { key: 'all', label: 'All Insights & Solutions' },
  { key: 'routines', label: 'Low-Emission Routines' },
  { key: 'indoor', label: 'NASA Indoor Hacks' },
  { key: 'alternatives', label: 'Sustainable Alternatives' },
  { key: 'calculator', label: 'Impact Simulator' },
];

export default function HomePage() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [searchInput, setSearchInput] = useState(DEFAULT_CITY);
  const [isDefensePlanOpen, setIsDefensePlanOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('all');
  const [userContext, setUserContext] = useState<UserContext>(DEFAULT_USER_CONTEXT);

  const { data: aqiData, loading: aqiLoading, error: aqiError, refetch, fetchByCoords } = useAQIData(
    city,
    country
  );
  const { data: recommendations, loading: recLoading, generate } = useRecommendations();
  const { results: searchResults, search: triggerCitySearch } = useCitySearch();

  useEffect(() => {
    if (aqiData && userContext) {
      void generate(aqiData, userContext);
    }
  }, [aqiData, userContext, generate]);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    triggerCitySearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    setGeoError(null);
    setCity(trimmed);
    setUserContext((prev) => ({ ...prev, location: trimmed }));
  };

  const handleSelectCity = (selectedCity: string, selectedCountry = DEFAULT_COUNTRY) => {
    setGeoError(null);
    setCity(selectedCity);
    setCountry(selectedCountry);
    setSearchInput(selectedCity);
    setUserContext((prev) => ({ ...prev, location: selectedCity }));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser. Please search for your city manually.');
      return;
    }

    setGeoError(null);
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocatingUser(false);
        await fetchByCoords(pos.coords.latitude, pos.coords.longitude, 'My Location');
      },
      (err) => {
        setLocatingUser(false);
        console.warn('Geolocation error:', err);
        setGeoError('Could not obtain your GPS coordinates. Please search for your city manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleProfileSubmit = (context: UserContext) => {
    setUserContext(context);
    setShowProfileModal(false);
    if (context.location && context.location !== city) {
      setCity(context.location);
      setSearchInput(context.location);
    }
  };

  const handleQuickPersonaSwitch = (newProfile: UserProfile) => {
    setUserContext((prev) => ({
      ...prev,
      profile: newProfile,
      preferences: {
        ...prev.preferences,
        hasChildren: newProfile === 'family',
        hasElderly: newProfile === 'elderly',
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg"
      >
        Skip to main content
      </a>

      <Header
        city={city}
        searchInput={searchInput}
        activeProfile={userContext.profile}
        locatingUser={locatingUser}
        searchResults={searchResults}
        onSearchInputChange={handleSearchInputChange}
        onSearchSubmit={handleSearchSubmit}
        onSelectCity={handleSelectCity}
        onUseMyLocation={handleUseMyLocation}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onOpenDefensePlan={() => setIsDefensePlanOpen(true)}
      />

      <PersonaSwitcher activeProfile={userContext.profile} onSelectProfile={handleQuickPersonaSwitch} />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Mobile Search Input */}
        <div className="md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="Search city (e.g. Delhi, London)..."
              className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm"
              aria-label="Search city for air quality"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Accessible Geolocation Warning Banner */}
        {geoError && (
          <div
            role="status"
            className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex items-center gap-2.5">
              <TriangleAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{geoError}</span>
            </div>
            <button
              type="button"
              onClick={() => setGeoError(null)}
              className="p-1 text-amber-700 hover:bg-amber-100 rounded-lg"
              aria-label="Dismiss location warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global API Error Notice */}
        {aqiError && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-sm"
          >
            <TriangleAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-bold">Air Quality Data Notice</p>
              <p className="mt-0.5 text-rose-700">{aqiError}</p>
              <p className="text-xs text-rose-600 mt-2">
                Tip: Try searching for a nearby major city like Delhi, Mumbai, or London.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
            >
              Retry
            </button>
          </div>
        )}

        {aqiData && (
          <>
            <SmogAlertBanner data={aqiData} onOpenDefensePlan={() => setIsDefensePlanOpen(true)} />
            <AQIDashboard
              data={aqiData}
              onRefresh={() => void refetch()}
              onOpenDefensePlan={() => setIsDefensePlanOpen(true)}
            />
          </>
        )}

        {aqiLoading && !aqiData && (
          <div className="text-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600">
              Fetching live atmospheric sensor telemetry for {city}...
            </p>
          </div>
        )}

        {recommendations && aqiData && (
          <>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] mr-1">Views:</span>
              {DASHBOARD_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition ${
                    activeTab === tab.key
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-8 animate-in fade-in duration-300">
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
          </>
        )}

        {recLoading && !recommendations && aqiData && (
          <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800">
                Generating Personalized Recommendations with AI...
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Analyzing PM2.5 levels, {userContext.profile} context, and winter smog inversions to craft
                actionable routines.
              </p>
            </div>
          </div>
        )}
      </main>

      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl">
            <UserProfileForm
              initialContext={userContext}
              onSubmit={handleProfileSubmit}
              onSkip={() => setShowProfileModal(false)}
              onClose={() => setShowProfileModal(false)}
            />
          </div>
        </div>
      )}

      {aqiData && (
        <FamilySmogDefensePlan
          aqiData={aqiData}
          userContext={userContext}
          isOpen={isDefensePlanOpen}
          onClose={() => setIsDefensePlanOpen(false)}
        />
      )}

      <Footer aqiData={aqiData} activeProfile={userContext.profile} city={city} />
    </div>
  );
}
