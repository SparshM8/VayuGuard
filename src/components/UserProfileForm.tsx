'use client';

import { useState } from 'react';
import { UserProfile, UserPreferences, UserContext } from '@/types';
import { 
  iconMap,
  LucideIconComponent,
} from '@/lib/icons';

const profileOptions: { value: UserProfile; label: string; icon: LucideIconComponent; description: string }[] = [
  { value: 'commuter', label: 'Daily Commuter', icon: iconMap.briefcase, description: 'Travel to work regularly, exposed to traffic pollution' },
  { value: 'family', label: 'Family with Children', icon: iconMap.users, description: 'Concerned about long-term health impacts on kids' },
  { value: 'elderly', label: 'Older Adult', icon: iconMap.elderly, description: 'Higher sensitivity to air pollution, reduced lung function' },
  { value: 'athlete', label: 'Active/Athlete', icon: iconMap.dumbbell, description: 'Exercise outdoors, need to optimize training around air quality' },
  { value: 'remote-worker', label: 'Remote Worker', icon: iconMap.home, description: 'Work from home, can control indoor environment' },
  { value: 'student', label: 'Student', icon: iconMap['graduation-cap'], description: 'Walk or take public transport, budget-conscious' },
];

const transportOptions = [
  { value: 'car', label: 'Car', icon: iconMap.car },
  { value: 'public', label: 'Public Transit', icon: iconMap.bus },
  { value: 'bike', label: 'Bicycle', icon: iconMap.bike },
  { value: 'walk', label: 'Walk', icon: iconMap.walk },
  { value: 'mixed', label: 'Mixed', icon: iconMap.car },
];

const homeTypeOptions = [
  { value: 'apartment', label: 'Apartment', icon: iconMap.apartment },
  { value: 'house', label: 'House', icon: iconMap.house },
  { value: 'shared', label: 'Shared Housing', icon: iconMap.users },
];

interface UserProfileFormProps {
  initialContext?: Partial<UserContext>;
  onSubmit: (context: UserContext) => void;
  onSkip?: () => void;
}

export function UserProfileForm({ initialContext, onSubmit, onSkip }: UserProfileFormProps) {
  const CheckCircleIcon = iconMap['check-circle'];
  const [profile, setProfile] = useState<UserProfile>(initialContext?.profile || 'commuter');
  const [location, setLocation] = useState(initialContext?.location || '');
  const [preferences, setPreferences] = useState<UserPreferences>({
    hasChildren: initialContext?.preferences?.hasChildren || false,
    hasElderly: initialContext?.preferences?.hasElderly || false,
    hasRespiratoryIssues: initialContext?.preferences?.hasRespiratoryIssues || false,
    hasPets: initialContext?.preferences?.hasPets || false,
    commuteDistance: initialContext?.preferences?.commuteDistance || 'medium',
    transportMode: initialContext?.preferences?.transportMode || 'car',
    homeType: initialContext?.preferences?.homeType || 'apartment',
    hasAirPurifier: initialContext?.preferences?.hasAirPurifier || false,
    hasPlants: initialContext?.preferences?.hasPlants || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      profile,
      location,
      preferences,
    });
  };

  const healthOptions = [
    { key: 'hasChildren' as const, label: 'Has Children', icon: iconMap.baby },
    { key: 'hasElderly' as const, label: 'Has Elderly', icon: iconMap.elderly },
    { key: 'hasRespiratoryIssues' as const, label: 'Respiratory Issues', icon: iconMap.heart },
    { key: 'hasPets' as const, label: 'Has Pets', icon: iconMap.shield },
  ];

  const airQualityOptions = [
    { key: 'hasAirPurifier' as const, label: 'Air Purifier', icon: iconMap.filter },
    { key: 'hasPlants' as const, label: 'Indoor Plants', icon: iconMap.leaf },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Personalize Your Experience</h1>
        <p className="text-gray-600 mt-2">
          Help us provide tailored recommendations based on your lifestyle and needs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Your Profile</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {profileOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setProfile(option.value)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    profile === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`w-5 h-5 ${profile === option.value ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                  {profile === option.value && (
                    <CheckCircleIcon className="absolute top-2 right-2 w-5 h-5 text-blue-600 bg-blue-100 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Your City</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Delhi, Mumbai, Bangalore"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Health & Household</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {healthOptions.map(({ key, label, icon }) => {
              const IconComponent = icon;
              return (
                <label key={key} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[key]}
                    onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <IconComponent className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Commute Distance</label>
          <div className="flex gap-3">
            {(['short', 'medium', 'long'] as const).map((distance) => (
              <button
                type="button"
                key={distance}
                onClick={() => setPreferences({ ...preferences, commuteDistance: distance })}
                className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  preferences.commuteDistance === distance
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {distance.charAt(0).toUpperCase() + distance.slice(1)} ({distance === 'short' ? '< 5 km' : distance === 'medium' ? '5-20 km' : '> 20 km'})
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Primary Transport</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {transportOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setPreferences({ ...preferences, transportMode: option.value as UserPreferences['transportMode'] })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    preferences.transportMode === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${preferences.transportMode === option.value ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-gray-700">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Home Type</label>
          <div className="grid grid-cols-3 gap-3">
            {homeTypeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setPreferences({ ...preferences, homeType: option.value as UserPreferences['homeType'] })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    preferences.homeType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 ${preferences.homeType === option.value ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-gray-700">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Current Air Quality Measures</label>
          <div className="grid grid-cols-2 gap-3">
            {airQualityOptions.map(({ key, label, icon }) => {
              const IconComponent = icon;
              return (
                <label key={key} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[key]}
                    onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <IconComponent className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Get Personalized Recommendations
          </button>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
          )}
        </div>
      </form>
    </div>
  );
}