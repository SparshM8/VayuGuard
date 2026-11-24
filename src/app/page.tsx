'use client';

import { useState, useEffect, useRef } from 'react';
import { UserContext, UserProfile } from '@/types';
import { LucideIconComponent } from '@/lib/icons';
import { useAQIData, useRecommendations, useCitySearch } from '@/hooks/useAQIData';
import { AQIDashboard } from '@/components/AQIDashboard';
import { RoutineSuggestions } from '@/components/RoutineSuggestions';
import { IndoorAirQuality } from '@/components/IndoorAirQuality';
import { SustainableAlternatives } from '@/components/SustainableAlternatives';
import { UserProfileForm } from '@/components/UserProfileForm';
import { PersonalizedAdvice } from '@/components/PersonalizedAdvice';
import { ImpactCalculator } from '@/components/ImpactCalculator';
import { SmogAlertBanner } from '@/components/SmogAlertBanner';
import { FamilySmogDefensePlan } from '@/components/FamilySmogDefensePlan';
import { 
  MapPin, 
  Settings, 
  TriangleAlert as AlertTriangle, 
  Wind, 
  Crosshair, 
  Sparkles, 
  FileText, 
  Briefcase, 
  Users, 
  UserRound as Elderly, 
  Dumbbell, 
  Home, 
  GraduationCap, 
  ShieldCheck, 
  ExternalLink,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_CITY = 'Delhi';
const DEFAULT_COUNTRY = 'IN';

const QUICK_CITIES = [
  { city: 'Delhi', country: 'IN', label: 'Delhi (Smog Hotspot)' },
  { city: 'Mumbai', country: 'IN', label: 'Mumbai' },
  { city: 'Kolkata', country: 'IN', label: 'Kolkata' },
  { city: 'Bengaluru', country: 'IN', label: 'Bengaluru' },
  { city: 'Beijing', country: 'CN', label: 'Beijing' },
  { city: 'London', country: 'GB', label: 'London' },
  { city: 'New York', country: 'US', label: 'New York' },
];

const profileMetadata: Record<UserProfile, { label: string; desc: string; icon: LucideIconComponent }> = {
  family: { label: 'Family with Kids', desc: 'School commute, pediatric lung care & safe plants', icon: Users },
  commuter: { label: 'Daily Commuter', desc: 'Rush-hour roadside soot, cabin filters & transit', icon: Briefcase },
  elderly: { label: 'Older Adult', desc: 'Morning inversion avoidance & cardiac care', icon: Elderly },
  athlete: { label: 'Active Athlete', desc: 'Solar mixing hours & 10x lung deposition defense', icon: Dumbbell },
  'remote-worker': { label: 'Remote Worker', desc: 'Home microclimate & precision cross-ventilation', icon: Home },
  student: { label: 'Student', desc: 'DIY Corsi-Rosenthal boxes & campus shuttles', icon: GraduationCap },
};

export default function HomePage() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [searchInput, setSearchInput] = useState(DEFAULT_CITY);
  const [isDefensePlanOpen, setIsDefensePlanOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'routines' | 'indoor' | 'alternatives' | 'calculator'>('all');

  // Default initial context
  const [userContext, setUserContext] = useState<UserContext>({
    profile: 'family',
    location: DEFAULT_CITY,
    preferences: {
      hasChildren: true,
      hasElderly: false,
      hasRespiratoryIssues: false,
      hasPets: true,
      commuteDistance: 'medium',
      transportMode: 'car',
      homeType: 'apartment',
      hasAirPurifier: true,
      hasPlants: true,
    },
  });

  const { data: aqiData, loading: aqiLoading, error: aqiError, refetch, fetchByCoords } = useAQIData(city, country);
  const { data: recommendations, loading: recLoading, generate } = useRecommendations();
  const { results: searchResults, search: triggerCitySearch } = useCitySearch();

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Automatically generate AI recommendations when AQI data or user context updates
  useEffect(() => {
    if (aqiData && userContext) {
      generate(aqiData, userContext);
    }
  }, [aqiData, userContext, generate]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setShowSearchDropdown(false);
      setUserContext(prev => ({ ...prev, location: searchInput.trim() }));
    }
  };

  const handleSelectCity = (selectedCity: string, selectedCountry = 'IN') => {
    setCity(selectedCity);
    setCountry(selectedCountry);
    setSearchInput(selectedCity);
    setShowSearchDropdown(false);
    setUserContext(prev => ({ ...prev, location: selectedCity }));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocatingUser(false);
        const { latitude, longitude } = pos.coords;
        await fetchByCoords(latitude, longitude, 'My Location');
      },
      (err) => {
        setLocatingUser(false);
        console.warn('Geolocation error:', err);
        alert('Could not obtain your GPS coordinates. Please search for your city manually.');
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
    setUserContext(prev => ({
      ...prev,
      profile: newProfile,
      preferences: {
        ...prev.preferences,
        hasChildren: newProfile === 'family',
        hasElderly: newProfile === 'elderly',
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Accessible Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-600/25 border border-white/20">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block">
                    VayuGuard <span className="text-blue-600 font-extrabold text-base bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">AI</span>
                  </span>
                  <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    CPCB & CAMS LIVE
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium hidden sm:block">
                  AI Winter Smog & Urban Clean-Air Navigator
                </span>
              </div>
            </div>

            {/* City Search Bar & Geolocation */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    triggerCitySearch(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search city (e.g. Delhi, Mumbai, London)..."
                  className="w-full pl-10 pr-24 py-2.5 bg-slate-100/90 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition shadow-inner"
                  aria-label="Search city for air quality"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={locatingUser}
                    className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-blue-600 transition"
                    title="Use My Location via GPS"
                    aria-label="Use My GPS Location"
                  >
                    <Crosshair className={`w-4 h-4 ${locatingUser ? 'animate-spin text-blue-600' : ''}`} />
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                    aria-label="Submit search"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 divide-y divide-slate-100">
                  {searchResults.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectCity(r.city, r.countryCode)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50/70 flex items-center justify-between text-slate-700 transition"
                    >
                      <span className="font-semibold text-slate-900">{r.city}</span>
                      <span className="text-xs text-slate-400">
                        {r.state ? `${r.state}, ` : ''}{r.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              {/* Profile Context Pill */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition text-xs font-semibold text-slate-800 shadow-sm"
                aria-label="Configure user persona profile"
              >
                {(() => {
                  const CurrentIcon = profileMetadata[userContext.profile]?.icon || Users;
                  return <CurrentIcon className="w-4 h-4 text-blue-600" />;
                })()}
                <span className="hidden sm:inline">{profileMetadata[userContext.profile]?.label}</span>
                <Settings className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* 1-Page Smog Plan Trigger */}
              <button
                onClick={() => setIsDefensePlanOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/25 transition"
                aria-label="View printable family smog defense action plan"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Smog Plan</span>
              </button>
            </div>
          </div>

          {/* Quick-Pick Popular Cities Carousel */}
          <div className="flex items-center gap-2 py-2 overflow-x-auto border-t border-slate-100 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold whitespace-nowrap pl-0.5">Quick Hotspots:</span>
            {QUICK_CITIES.map((c) => (
              <button
                key={c.city}
                onClick={() => handleSelectCity(c.city, c.country)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition font-medium ${
                  city.toLowerCase() === c.city.toLowerCase()
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Interactive Persona Quick-Switcher Bar */}
      <section 
        aria-label="User Persona Selector"
        className="bg-slate-900 text-white py-3 border-b border-slate-800 shadow-inner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Select Persona:
              </span>
              <span className="text-[11px] text-slate-400 hidden md:inline">
                (Click to see how AI recommendations dynamically adapt)
              </span>
            </div>

            {/* Persona Pills Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(Object.keys(profileMetadata) as UserProfile[]).map((pKey) => {
                const meta = profileMetadata[pKey];
                const IconComponent = meta.icon;
                const isSelected = userContext.profile === pKey;

                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => handleQuickPersonaSwitch(pKey)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{meta.label}</span>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-blue-200" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Mobile Search Input */}
        <div className="md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city (e.g. Delhi, London)..."
              className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Global API Error Notice */}
        {aqiError && (
          <div 
            role="alert" 
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-sm"
          >
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-bold">Air Quality Data Notice</p>
              <p className="mt-0.5 text-rose-700">{aqiError}</p>
              <p className="text-xs text-rose-600 mt-2">
                Tip: Try searching for a nearby major city like Delhi, Mumbai, or London.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
            >
              Retry
            </button>
          </div>
        )}

        {/* Severe Smog Emergency Advisory Banner */}
        {aqiData && (
          <SmogAlertBanner 
            data={aqiData} 
            onOpenDefensePlan={() => setIsDefensePlanOpen(true)} 
          />
        )}

        {/* Real-time Air Quality Dashboard & 24h Hourly Forecast */}
        {aqiData && (
          <AQIDashboard 
            data={aqiData} 
            onRefresh={refetch} 
            onOpenDefensePlan={() => setIsDefensePlanOpen(true)}
          />
        )}

        {/* Loading Spinner for Real-time Sensor Data */}
        {aqiLoading && !aqiData && (
          <div className="text-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600">
              Fetching live atmospheric sensor telemetry for {city}...
            </p>
          </div>
        )}

        {/* Section Navigation Tabs */}
        {recommendations && aqiData && (
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none text-xs font-semibold">
            <span className="text-slate-400 uppercase tracking-wider text-[11px] mr-1">Views:</span>
            {[
              { key: 'all', label: 'All Insights & Solutions' },
              { key: 'routines', label: 'Low-Emission Routines' },
              { key: 'indoor', label: 'NASA Indoor Hacks' },
              { key: 'alternatives', label: 'Sustainable Alternatives' },
              { key: 'calculator', label: 'Impact Simulator' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'routines' | 'indoor' | 'alternatives' | 'calculator')}
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
        )}

        {/* AI Recommendations Section */}
        {recommendations && aqiData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* GenAI Personalized Clinical & Routine Guidance */}
            <PersonalizedAdvice 
              advice={recommendations.personalizedAdvice}
              aqiCategory={aqiData.category}
              aqiValue={aqiData.aqi}
            />

            {/* Core 3 Problem Areas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Routines & Indoor Hacks */}
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

              {/* Right Col: Sustainable Alternatives & Justified Impacts */}
              {(activeTab === 'all' || activeTab === 'alternatives') && (
                <div className={`space-y-8 ${activeTab === 'alternatives' ? 'lg:col-span-3' : ''}`}>
                  <SustainableAlternatives alternatives={recommendations.alternatives} />
                </div>
              )}
            </div>

            {/* Interactive Household & Community What-If Simulator */}
            {(activeTab === 'all' || activeTab === 'calculator') && (
              <ImpactCalculator />
            )}
          </div>
        )}

        {/* Loading Indicator for AI Recommendations */}
        {recLoading && !recommendations && aqiData && (
          <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800">
                Generating Personalized Recommendations with AI...
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Analyzing PM2.5 levels, {userContext.profile} context, and winter smog inversions to craft actionable routines.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Profile Customization Modal */}
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

      {/* 1-Page Printable Family Smog Defense Plan Modal */}
      {aqiData && (
        <FamilySmogDefensePlan
          aqiData={aqiData}
          userContext={userContext}
          isOpen={isDefensePlanOpen}
          onClose={() => setIsDefensePlanOpen(false)}
        />
      )}

      {/* Transparent Footer with Source, Timestamp, and Hackathon Attribution */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            {/* Live Data Attribution */}
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
                with Copernicus Atmosphere Monitoring Service (CAMS) & CPCB ground reference calibration.
              </p>
              {aqiData && (
                <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                  Timestamp: {new Date(aqiData.timestamp).toLocaleString()}
                </div>
              )}
            </div>

            {/* AI Architecture */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                GenAI Decision Engine
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Powered by Google Gemini structured reasoning. Translates raw multi-pollutant sub-indices into personalized, context-aware routines, indoor hacks, and quantified impact metrics.
              </p>
            </div>

            {/* Persona Alignment */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Active Persona Profile
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Tailored for: <span className="font-bold text-slate-800">{profileMetadata[userContext.profile]?.label}</span> in {city}.
                Personalized with health parameters, housing structure, and daily commute mode.
              </p>
            </div>

            {/* Hackathon Alignment & Disclaimer */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Challenge-6 Compliance</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Built for Challenge 6: Urban Air Quality Assistant. Designed to help communities navigate winter smog with low-emission routines and actionable sustainable alternatives.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; 2026 VayuGuard AI. Built with Next.js, TypeScript, & Tailwind CSS.</p>
            <p className="text-slate-400">Clean Air for Healthier Communities</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
