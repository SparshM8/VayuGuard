import { AQICategory, UserContext, UserPreferences, UserProfile } from '@/types';
import { LucideIconComponent } from './icons';
import {
  Briefcase,
  CheckCircle2,
  Dumbbell,
  GraduationCap,
  Home,
  Info,
  ShieldAlert,
  TriangleAlert,
  UserRound,
  Users,
} from 'lucide-react';

export const DEFAULT_CITY = 'Delhi';
export const DEFAULT_COUNTRY = 'IN';

export interface QuickCityOption {
  city: string;
  country: string;
  label: string;
}

export const QUICK_CITIES: QuickCityOption[] = [
  { city: 'Delhi', country: 'IN', label: 'Delhi (Smog Hotspot)' },
  { city: 'Mumbai', country: 'IN', label: 'Mumbai' },
  { city: 'Kolkata', country: 'IN', label: 'Kolkata' },
  { city: 'Bengaluru', country: 'IN', label: 'Bengaluru' },
  { city: 'Beijing', country: 'CN', label: 'Beijing' },
  { city: 'London', country: 'GB', label: 'London' },
  { city: 'New York', country: 'US', label: 'New York' },
];

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  hasChildren: true,
  hasElderly: false,
  hasRespiratoryIssues: false,
  hasPets: true,
  commuteDistance: 'medium',
  transportMode: 'car',
  homeType: 'apartment',
  hasAirPurifier: true,
  hasPlants: true,
};

export const NEUTRAL_USER_PREFERENCES: UserPreferences = {
  hasChildren: false,
  hasElderly: false,
  hasRespiratoryIssues: false,
  hasPets: false,
  commuteDistance: 'medium',
  transportMode: 'car',
  homeType: 'apartment',
  hasAirPurifier: false,
  hasPlants: false,
};

export const DEFAULT_USER_CONTEXT: UserContext = {
  profile: 'family',
  location: DEFAULT_CITY,
  preferences: DEFAULT_USER_PREFERENCES,
};

export interface ProfileMetadataItem {
  value: UserProfile;
  label: string;
  shortDesc: string;
  formDesc: string;
  icon: LucideIconComponent;
}

export const PROFILE_OPTIONS: ProfileMetadataItem[] = [
  {
    value: 'family',
    label: 'Family with Kids',
    shortDesc: 'School commute, pediatric lung care & safe plants',
    formDesc: 'Safeguard children lung health & school commute',
    icon: Users,
  },
  {
    value: 'commuter',
    label: 'Daily Commuter',
    shortDesc: 'Rush-hour roadside soot, cabin filters & transit',
    formDesc: 'Exposed to roadside exhaust & traffic soot',
    icon: Briefcase,
  },
  {
    value: 'elderly',
    label: 'Older Adult',
    shortDesc: 'Morning inversion avoidance & cardiac care',
    formDesc: 'High sensitivity to morning smog inversions',
    icon: UserRound,
  },
  {
    value: 'athlete',
    label: 'Active Athlete',
    shortDesc: 'Solar mixing hours & 10x lung deposition defense',
    formDesc: 'Optimize outdoor runs around solar mixing',
    icon: Dumbbell,
  },
  {
    value: 'remote-worker',
    label: 'Remote Worker',
    shortDesc: 'Home microclimate & precision cross-ventilation',
    formDesc: 'Optimize indoor microclimate & clean hours',
    icon: Home,
  },
  {
    value: 'student',
    label: 'Student',
    shortDesc: 'DIY Corsi-Rosenthal boxes & campus shuttles',
    formDesc: 'Budget-friendly DIY boxes & campus shuttles',
    icon: GraduationCap,
  },
];

export const PROFILE_METADATA: Record<UserProfile, ProfileMetadataItem> = Object.fromEntries(
  PROFILE_OPTIONS.map((item) => [item.value, item])
) as Record<UserProfile, ProfileMetadataItem>;

export interface AQICategoryTheme {
  hexColor: string;
  description: string;
  shortSummary: string;
  heroGradient: string;
  heroGlow: string;
  badgeStyle: string;
  hourlyCardBg: string;
  hourlyText: string;
  hourlyBar: string;
  adviceBoxStyle: string;
  pollutantCardStyle: string;
  icon: LucideIconComponent;
  priorityActions: string[];
}

export const AQI_CATEGORY_THEMES: Record<AQICategory, AQICategoryTheme> = {
  Good: {
    hexColor: '#10B981',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk to health.',
    shortSummary: 'Satisfactory air quality; minimal health risk.',
    heroGradient: 'from-emerald-600 via-teal-700 to-emerald-900',
    heroGlow: 'shadow-emerald-500/20',
    badgeStyle: 'bg-emerald-500',
    hourlyCardBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hourlyText: 'text-emerald-600',
    hourlyBar: 'bg-emerald-500',
    adviceBoxStyle: 'bg-green-100 text-green-800 border-green-200',
    pollutantCardStyle: 'border-emerald-200 bg-emerald-50/60 text-emerald-950',
    icon: CheckCircle2,
    priorityActions: [
      'Maintain current healthy habits',
      'Continue outdoor activities as normal',
      'Keep indoor spaces well-ventilated',
    ],
  },
  Moderate: {
    hexColor: '#F59E0B',
    description: 'Air quality is acceptable. Sensitive individuals may experience mild respiratory symptoms.',
    shortSummary: 'Acceptable air; minor sensitive risk.',
    heroGradient: 'from-amber-600 via-yellow-700 to-amber-900',
    heroGlow: 'shadow-amber-500/20',
    badgeStyle: 'bg-amber-500',
    hourlyCardBg: 'bg-amber-50 text-amber-700 border-amber-200',
    hourlyText: 'text-amber-600',
    hourlyBar: 'bg-amber-500',
    adviceBoxStyle: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pollutantCardStyle: 'border-amber-200 bg-amber-50/60 text-amber-950',
    icon: Info,
    priorityActions: [
      'Sensitive individuals: limit prolonged outdoor exertion',
      'Keep windows closed during peak traffic hours',
      'Consider an air purifier for bedrooms',
    ],
  },
  'Unhealthy for Sensitive Groups': {
    hexColor: '#F97316',
    description:
      'Children, elderly, and people with lung or heart disease are at greater risk of health effects.',
    shortSummary: 'Sensitive groups must reduce exertion.',
    heroGradient: 'from-orange-600 via-amber-700 to-orange-950',
    heroGlow: 'shadow-orange-500/20',
    badgeStyle: 'bg-orange-500',
    hourlyCardBg: 'bg-orange-50 text-orange-700 border-orange-200',
    hourlyText: 'text-orange-600',
    hourlyBar: 'bg-orange-500',
    adviceBoxStyle: 'bg-orange-100 text-orange-800 border-orange-200',
    pollutantCardStyle: 'border-orange-200 bg-orange-50/60 text-orange-950',
    icon: TriangleAlert,
    priorityActions: [
      'Children, elderly, and those with respiratory conditions: avoid outdoor exertion',
      'Wear a snug N95/KN95 mask if going outside',
      'Run a HEPA air purifier continuously',
    ],
  },
  Unhealthy: {
    hexColor: '#EF4444',
    description:
      'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.',
    shortSummary: 'Everyone may experience health effects.',
    heroGradient: 'from-rose-600 via-red-700 to-rose-950',
    heroGlow: 'shadow-rose-500/25',
    badgeStyle: 'bg-rose-500',
    hourlyCardBg: 'bg-rose-50 text-rose-700 border-rose-200',
    hourlyText: 'text-rose-600',
    hourlyBar: 'bg-rose-500',
    adviceBoxStyle: 'bg-red-100 text-red-800 border-red-200',
    pollutantCardStyle: 'border-rose-200 bg-rose-50/60 text-rose-950',
    icon: TriangleAlert,
    priorityActions: [
      'Everyone: reduce strenuous outdoor activities',
      'Sensitive groups: stay strictly indoors',
      'Seal windows and run indoor air purification',
    ],
  },
  'Very Unhealthy': {
    hexColor: '#8B5CF6',
    description:
      'Health alert: Serious risk of health effects increased for the entire population. Avoid prolonged outdoor exertion.',
    shortSummary: 'Health alert; avoid prolonged outdoor exertion.',
    heroGradient: 'from-purple-700 via-indigo-900 to-slate-950',
    heroGlow: 'shadow-purple-500/30',
    badgeStyle: 'bg-purple-600',
    hourlyCardBg: 'bg-purple-50 text-purple-700 border-purple-200',
    hourlyText: 'text-purple-600',
    hourlyBar: 'bg-purple-600',
    adviceBoxStyle: 'bg-purple-100 text-purple-800 border-purple-200',
    pollutantCardStyle: 'border-purple-200 bg-purple-50/60 text-purple-950',
    icon: ShieldAlert,
    priorityActions: [
      'Avoid all non-essential outdoor activities',
      'Stay indoors with continuous HEPA filtration',
      'Wear a sealed N95/FFP2 respirator if venturing outside',
    ],
  },
  Hazardous: {
    hexColor: '#881337',
    description:
      'Emergency conditions: The entire population is likely to experience severe respiratory distress. Stay strictly indoors.',
    shortSummary: 'Emergency smog inversion; stay strictly indoors.',
    heroGradient: 'from-red-950 via-rose-950 to-neutral-950',
    heroGlow: 'shadow-red-600/40',
    badgeStyle: 'bg-red-950',
    hourlyCardBg: 'bg-red-950 text-rose-200 border-red-900',
    hourlyText: 'text-red-400',
    hourlyBar: 'bg-red-900',
    adviceBoxStyle: 'bg-red-900 text-red-100 border-red-800',
    pollutantCardStyle: 'border-red-900 bg-red-950/15 text-red-950',
    icon: ShieldAlert,
    priorityActions: [
      'Health emergency: remain strictly indoors',
      'Operate HEPA air purifiers in all living and sleeping rooms',
      'Avoid all outdoor physical exposure and indoor combustion',
    ],
  },
};

/** World Health Organization (WHO 2021) guideline exposure limits. */
export const WHO_DAILY_LIMITS: Record<string, { limit: number; unit: string; name: string }> = {
  pm25: { limit: 15, unit: 'μg/m³', name: 'WHO 24h limit: 15 μg/m³' },
  pm10: { limit: 45, unit: 'μg/m³', name: 'WHO 24h limit: 45 μg/m³' },
  no2: { limit: 25, unit: 'μg/m³', name: 'WHO 24h limit: 25 μg/m³' },
  so2: { limit: 40, unit: 'μg/m³', name: 'WHO 24h limit: 40 μg/m³' },
  o3: { limit: 100, unit: 'μg/m³', name: 'WHO 8h limit: 100 μg/m³' },
  co: { limit: 4, unit: 'mg/m³', name: 'WHO 24h limit: 4 mg/m³' },
};
