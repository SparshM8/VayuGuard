'use client';

import { useState } from 'react';
import { UserContext, UserPreferences, UserProfile } from '@/types';
import { DEFAULT_CITY, DEFAULT_USER_PREFERENCES, PROFILE_OPTIONS } from '@/lib/constants';
import {
  Baby,
  Bike,
  Building,
  Bus,
  Car,
  CheckCircle2,
  Filter,
  Footprints,
  Heart,
  House,
  Leaf,
  Shield,
  Sliders,
  UserRound,
  Users,
  X,
} from 'lucide-react';

const TRANSPORT_OPTIONS = [
  { value: 'car', label: 'Solo Car', icon: Car },
  { value: 'public', label: 'Metro / Transit', icon: Bus },
  { value: 'bike', label: 'Bicycle / EV', icon: Bike },
  { value: 'walk', label: 'Walking', icon: Footprints },
] as const;

const HOME_TYPE_OPTIONS = [
  { value: 'apartment', label: 'Apartment', icon: Building },
  { value: 'house', label: 'Independent House', icon: House },
  { value: 'shared', label: 'Shared / Hostel', icon: Users },
] as const;

const HEALTH_OPTIONS = [
  { key: 'hasChildren' as const, label: 'Children at Home', icon: Baby, desc: 'Prioritize pediatric lung safety' },
  { key: 'hasElderly' as const, label: 'Elderly Members', icon: UserRound, desc: 'Cardiovascular sensitivity' },
  {
    key: 'hasRespiratoryIssues' as const,
    label: 'Asthma / Respiratory',
    icon: Heart,
    desc: 'High vulnerability to PM2.5',
  },
  { key: 'hasPets' as const, label: 'Domestic Pets', icon: Shield, desc: 'Filter out pet-toxic houseplants' },
];

interface UserProfileFormProps {
  initialContext?: Partial<UserContext>;
  onSubmit: (context: UserContext) => void;
  onSkip?: () => void;
  onClose?: () => void;
}

/** Modal form allowing granular configuration of household health factors, transport, and home equipment. */
export function UserProfileForm({ initialContext, onSubmit, onSkip, onClose }: UserProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(initialContext?.profile || 'family');
  const [location, setLocation] = useState(initialContext?.location || DEFAULT_CITY);
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...DEFAULT_USER_PREFERENCES,
    ...(initialContext?.preferences || {}),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      profile,
      location: location.trim() || DEFAULT_CITY,
      preferences,
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl">
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Personalize Air Quality Guidance</h2>
            <p className="text-xs text-slate-400">
              Tailors AI routines, pet-safe plant hacks, and smog inversion timings.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form
        id="profile-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Select Your Lifestyle Profile
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {PROFILE_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              const isSelected = profile === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setProfile(option.value)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="font-bold text-xs">{option.label}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{option.formDesc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="city-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            2. Your City / Region
          </label>
          <input
            id="city-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Delhi, Mumbai, Bengaluru, New York, London"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            3. Household Health &amp; Sensitivities
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {HEALTH_OPTIONS.map(({ key, label, icon: IconComponent, desc }) => {
              const isChecked = preferences[key];
              return (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    isChecked ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                    className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <IconComponent className="w-3.5 h-3.5 text-slate-500" />
                      {label}
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight">{desc}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              4. Daily Commute Distance
            </label>
            <div className="flex gap-2">
              {(['short', 'medium', 'long'] as const).map((distance) => (
                <button
                  type="button"
                  key={distance}
                  onClick={() => setPreferences({ ...preferences, commuteDistance: distance })}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                    preferences.commuteDistance === distance
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {distance === 'short' ? '< 5 km' : distance === 'medium' ? '5–20 km' : '> 20 km'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              5. Primary Transport Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TRANSPORT_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = preferences.transportMode === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setPreferences({ ...preferences, transportMode: opt.value })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              6. Housing Structure
            </label>
            <div className="flex gap-2">
              {HOME_TYPE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPreferences({ ...preferences, homeType: opt.value })}
                  className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-semibold border transition ${
                    preferences.homeType === opt.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              7. Current Indoor Measures
            </label>
            <div className="flex gap-2">
              <label
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                  preferences.hasAirPurifier
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={preferences.hasAirPurifier}
                  onChange={(e) => setPreferences({ ...preferences, hasAirPurifier: e.target.checked })}
                  className="w-3.5 h-3.5 text-emerald-600 accent-emerald-600 rounded"
                />
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Air Purifier</span>
              </label>

              <label
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                  preferences.hasPlants
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={preferences.hasPlants}
                  onChange={(e) => setPreferences({ ...preferences, hasPlants: e.target.checked })}
                  className="w-3.5 h-3.5 text-emerald-600 accent-emerald-600 rounded"
                />
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Indoor Plants</span>
              </label>
            </div>
          </div>
        </div>
      </form>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 flex-shrink-0">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          form="profile-form"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition"
        >
          Save &amp; Apply Recommendations
        </button>
      </div>
    </div>
  );
}
