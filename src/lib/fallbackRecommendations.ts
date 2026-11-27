import { AQICategory, AQIData, RecommendationResponse, UserContext, UserPreferences, UserProfile } from '@/types';
import { NEUTRAL_USER_PREFERENCES } from './constants';
import {
  createIndoorHacksCatalog,
  createUniversalRoutines,
  PROFILE_ROUTINE_BUILDERS,
  SUSTAINABLE_ALTERNATIVES_CATALOG,
} from '@/data/recommendationsCatalog';

export const PROFILE_CONTEXTS: Record<UserProfile, string> = {
  commuter:
    'daily urban commuter who travels regularly and is heavily exposed to vehicular exhaust and roadside particulate matter',
  family:
    'family with children and toddlers, focused on safeguarding respiratory development, indoor air safety, and school commute timing',
  elderly:
    'older adult with heightened sensitivity to air pollution, vulnerable to cardiovascular and pulmonary irritation',
  athlete:
    'active runner/athlete who requires high ventilation volumes and must strictly optimize workout timing around atmospheric smog inversions',
  'remote-worker':
    'home-based professional seeking optimal indoor microclimate, productivity, and evidence-based home air hacks',
  student:
    'student navigating university/school commutes, seeking practical, budget-conscious, low-emission alternatives',
};

export const CATEGORY_GUIDANCE: Record<AQICategory, string> = {
  Good: 'Air quality is satisfactory. Maintain sustainable daily habits and keep indoor spaces ventilated.',
  Moderate: 'Air quality is acceptable. Sensitive individuals should avoid heavy exertion during peak rush hours.',
  'Unhealthy for Sensitive Groups':
    'Children, elderly, and those with respiratory issues should restrict prolonged outdoor exposure and keep windows sealed during inversion periods.',
  Unhealthy:
    'Everyone should reduce strenuous outdoor activities. Sensitive groups should stay indoors with air purification and wear well-fitted N95 masks if outside.',
  'Very Unhealthy':
    'Health alert: Severe air pollution with high particulate concentration. Restrict all non-essential outdoor trips, run HEPA air purifiers, and activate smog defense routines.',
  Hazardous:
    'Emergency smog conditions: Atmospheric inversion trapping hazardous particulates. Stay strictly indoors, seal entryways, operate continuous HEPA filtration, and avoid all combustion.',
};

function buildPersonalizedAdvice(
  aqiData: AQIData,
  profile: UserProfile,
  preferences: UserPreferences
): string {
  const categoryGuidance = CATEGORY_GUIDANCE[aqiData.category] || CATEGORY_GUIDANCE.Moderate;
  const householdNotes = [
    preferences.hasChildren &&
      'Given that you have young children at home, protecting their developing lungs during winter smog inversions is paramount—keep indoor play spaces strictly filtered and avoid outdoor exertion during early morning smog spikes.',
    preferences.hasElderly &&
      'Because you care for elderly family members, be cautious of sudden cardiovascular strain caused by cold-air particulate inhalation. Ensure bedroom air is continuously purified.',
    preferences.hasRespiratoryIssues &&
      'With existing respiratory vulnerabilities in your household, maintain an N95 mask protocol and run HEPA air filtration continuously.',
    preferences.hasPets &&
      'We have customized plant recommendations to ensure non-toxic indoor species that are 100% pet-safe.',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    `Welcome! As a ${profile} in ${aqiData.city}, here is your tailored urban air quality guidance: ` +
    `The current air quality is categorized as ${aqiData.category} with an AQI of ${aqiData.aqi} ` +
    `(dominant pollutant: ${aqiData.dominantPollutant || 'PM2.5'}). ${categoryGuidance}` +
    (householdNotes ? ` ${householdNotes}` : '') +
    ' Taking proactive steps like precision ventilation timing, deploying air-purifying greenery, and choosing clean transit options creates an immediate protective shield for your loved ones while reducing community emissions.'
  );
}

/**
 * Deterministic rule-based recommendation engine used when Gemini API keys are unset
 * or upstream AI calls fail, guaranteeing uninterrupted personalized guidance.
 */
export function getFallbackRecommendations(
  aqiData: AQIData,
  userContext: UserContext
): RecommendationResponse {
  const profile = userContext?.profile || 'commuter';
  const preferences = { ...NEUTRAL_USER_PREFERENCES, ...(userContext?.preferences || {}) };
  const isSevere = aqiData.aqi >= 200;
  const isModerateOrHigh = aqiData.aqi > 100;

  const buildProfileRoutine = PROFILE_ROUTINE_BUILDERS[profile] || PROFILE_ROUTINE_BUILDERS.commuter;

  return {
    routines: [
      ...buildProfileRoutine({ transportMode: preferences.transportMode, isSevere }),
      ...createUniversalRoutines(isModerateOrHigh, isSevere),
    ],
    indoorHacks: createIndoorHacksCatalog(preferences.hasPets),
    alternatives: SUSTAINABLE_ALTERNATIVES_CATALOG,
    personalizedAdvice: buildPersonalizedAdvice(aqiData, profile, preferences),
    smogAlertNotice: isSevere
      ? `⚠️ URGENT WINTER SMOG ALERT in ${aqiData.city}: Current AQI is ${aqiData.aqi} (${aqiData.category}). Ground-level temperature inversion is trapping hazardous particulate matter. Avoid all outdoor exertion, keep windows sealed, and operate continuous HEPA filtration.`
      : undefined,
    generatedAt: new Date().toISOString(),
  };
}
