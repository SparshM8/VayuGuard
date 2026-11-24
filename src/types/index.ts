export interface AQIData {
  location: string;
  country: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  aqi: number;
  category: AQICategory;
  pollutants: Pollutant[];
  timestamp: string;
  source: string;
  sourceUrl: string;
  hourlyForecast?: HourlyDataPoint[];
  dominantPollutant?: string;
  isSmogSevere?: boolean;
}

export interface HourlyDataPoint {
  time: string;
  hour: string;
  aqi: number;
  pm25: number;
  pm10: number;
  category: AQICategory;
}

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface Pollutant {
  name: string;
  code: string;
  value: number;
  unit: string;
  aqi: number;
  description: string;
}

export interface UserContext {
  profile: UserProfile;
  location: string;
  preferences: UserPreferences;
}

export type UserProfile = 'commuter' | 'family' | 'elderly' | 'athlete' | 'remote-worker' | 'student';

export interface UserPreferences {
  hasChildren: boolean;
  hasElderly: boolean;
  hasRespiratoryIssues: boolean;
  hasPets: boolean;
  commuteDistance: 'short' | 'medium' | 'long';
  transportMode: 'car' | 'public' | 'bike' | 'walk' | 'mixed';
  homeType: 'apartment' | 'house' | 'shared';
  hasAirPurifier: boolean;
  hasPlants: boolean;
}

export interface RoutineSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'commute' | 'activity' | 'lifestyle' | 'indoor';
  impact: ImpactLevel;
  emissionReduction: string;
  healthBenefit: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  estimatedTime: string;
  icon: string;
}

export type ImpactLevel = 'high' | 'medium' | 'low';

export interface IndoorAirQualityHack {
  id: string;
  title: string;
  description: string;
  category: 'plants' | 'ventilation' | 'purification' | 'habits' | 'maintenance';
  effectiveness: number;
  cost: 'free' | 'low' | 'medium' | 'high';
  maintenance: 'none' | 'low' | 'medium' | 'high';
  suitableFor: string[];
  icon: string;
}

export interface SustainableAlternative {
  id: string;
  currentPractice: string;
  alternative: string;
  category: 'transport' | 'energy' | 'waste' | 'consumption' | 'indoor';
  co2Reduction: string;
  healthImpact: string;
  costImpact: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  explanation: string;
  icon: string;
}

export interface RecommendationResponse {
  routines: RoutineSuggestion[];
  indoorHacks: IndoorAirQualityHack[];
  alternatives: SustainableAlternative[];
  personalizedAdvice: string;
  smogAlertNotice?: string;
  generatedAt: string;
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

export interface CitySearchResult {
  city: string;
  state?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}
