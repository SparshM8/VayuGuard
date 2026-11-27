'use client';

import { useEffect, useRef, useState } from 'react';
import { CitySearchResult, UserProfile } from '@/types';
import { PROFILE_METADATA, QUICK_CITIES } from '@/lib/constants';
import { Crosshair, FileText, MapPin, Settings, Users, Wind } from 'lucide-react';

interface HeaderProps {
  city: string;
  searchInput: string;
  activeProfile: UserProfile;
  locatingUser: boolean;
  searchResults: CitySearchResult[];
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSelectCity: (city: string, countryCode?: string) => void;
  onUseMyLocation: () => void;
  onOpenProfileModal: () => void;
  onOpenDefensePlan: () => void;
}

/** Sticky application header containing branding, city search with autocomplete, GPS trigger, and action buttons. */
export function Header({
  city,
  searchInput,
  activeProfile,
  locatingUser,
  searchResults,
  onSearchInputChange,
  onSearchSubmit,
  onSelectCity,
  onUseMyLocation,
  onOpenProfileModal,
  onOpenDefensePlan,
}: HeaderProps) {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profileInfo = PROFILE_METADATA[activeProfile];
  const CurrentProfileIcon = profileInfo?.icon || Users;

  return (
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
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block">
                  VayuGuard{' '}
                  <span className="text-blue-600 font-extrabold text-base bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    AI
                  </span>
                </h1>
                <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  CPCB &amp; CAMS LIVE
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                AI Winter Smog &amp; Urban Clean-Air Navigator
              </span>
            </div>
          </div>

          {/* City Search Bar & Geolocation */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
            <form
              onSubmit={(e) => {
                setShowSearchDropdown(false);
                onSearchSubmit(e);
              }}
              className="relative flex items-center"
            >
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  onSearchInputChange(e.target.value);
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
                  onClick={onUseMyLocation}
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
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.city}-${result.countryCode}-${idx}`}
                    type="button"
                    onClick={() => {
                      setShowSearchDropdown(false);
                      onSelectCity(result.city, result.countryCode);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50/70 flex items-center justify-between text-slate-700 transition"
                  >
                    <span className="font-semibold text-slate-900">{result.city}</span>
                    <span className="text-xs text-slate-400">
                      {result.state ? `${result.state}, ` : ''}
                      {result.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition text-xs font-semibold text-slate-800 shadow-sm"
              aria-label="Configure user persona profile"
            >
              <CurrentProfileIcon className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">{profileInfo?.label}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={onOpenDefensePlan}
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
          {QUICK_CITIES.map((option) => {
            const isSelected = city.toLowerCase() === option.city.toLowerCase();
            return (
              <button
                key={option.city}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectCity(option.city, option.country)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition font-medium ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
