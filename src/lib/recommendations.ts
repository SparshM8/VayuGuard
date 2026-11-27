import { GoogleGenerativeAI } from '@google/generative-ai';
import { AQIData, RecommendationResponse, UserContext } from '@/types';
import { NEUTRAL_USER_PREFERENCES } from './constants';
import {
  CATEGORY_GUIDANCE,
  getFallbackRecommendations,
  PROFILE_CONTEXTS,
} from './fallbackRecommendations';
import { aiOutputSchema } from './validation';

export { getFallbackRecommendations };

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function buildPrompt(aqiData: AQIData, userContext: UserContext): string {
  const profile = userContext?.profile || 'commuter';
  const preferences = { ...NEUTRAL_USER_PREFERENCES, ...(userContext?.preferences || {}) };
  const profileDesc = PROFILE_CONTEXTS[profile] || PROFILE_CONTEXTS.commuter;
  const categoryGuidance = CATEGORY_GUIDANCE[aqiData.category] || CATEGORY_GUIDANCE.Moderate;

  const contextDetails = [
    preferences.hasChildren && 'Has young children at home (high priority for respiratory protection)',
    preferences.hasElderly && 'Has elderly family members residing in household',
    preferences.hasRespiratoryIssues && 'Household member with asthma or chronic respiratory vulnerability',
    preferences.hasPets && 'Has domestic pets (avoid pet-toxic houseplants like Peace Lily or Aloe)',
    `Commute distance: ${preferences.commuteDistance}`,
    `Primary transport mode: ${preferences.transportMode}`,
    `Housing type: ${preferences.homeType}`,
    preferences.hasAirPurifier ? 'Currently owns an air purifier' : 'Does not currently own an air purifier',
    preferences.hasPlants ? 'Already maintains indoor plants' : 'Does not currently have indoor plants',
  ]
    .filter(Boolean)
    .join(', ');

  const dominantPollutantInfo = aqiData.dominantPollutant
    ? `Dominant Pollutant: ${aqiData.dominantPollutant}`
    : '';

  return `You are an elite Urban Air Quality and Environmental Health Assistant. Your mission is to provide deeply personalized, actionable, and quantified guidance for an urban resident navigating air pollution and winter smog.

USER PROFILE & CONTEXT:
- Profile: ${profile} (${profileDesc})
- Location: ${aqiData.city}, ${aqiData.country}
- Context Details: ${contextDetails}

REAL-TIME AIR QUALITY METRICS:
- Overall AQI: ${aqiData.aqi} (${aqiData.category})
- Dominant Pollutant: ${dominantPollutantInfo}
- Measurement Timestamp: ${aqiData.timestamp}
- Data Source: ${aqiData.source}
- Detailed Pollutants:
${aqiData.pollutants.map((p) => `  * ${p.name}: ${p.value} ${p.unit} (Sub-index AQI: ${p.aqi})`).join('\n')}

ATMOSPHERIC HEALTH GUIDANCE:
${categoryGuidance}

INSTRUCTIONS:
Generate a strictly structured JSON response with exactly the following schema. Focus on real-world winter smog defense, low-emission daily routines, indoor air quality hacks (including pet safety if applicable), and high-impact sustainable alternatives with quantified CO2 and health impact metrics.

{
  "routines": [
    {
      "id": "routine-1",
      "title": "string (concise actionable title)",
      "description": "string (specific execution steps tailored to user profile and current AQI)",
      "category": "commute" | "activity" | "lifestyle" | "indoor",
      "impact": "high" | "medium" | "low",
      "emissionReduction": "string (quantified estimate, e.g., 'Cuts PM2.5 inhalation by ~45%')",
      "healthBenefit": "string (precise physiological or health impact)",
      "difficulty": "easy" | "moderate" | "hard",
      "estimatedTime": "string (e.g., '10 min prep', 'Daily habit')",
      "icon": "string (valid Lucide icon name, e.g. 'bus', 'sun', 'shield', 'home', 'filter', 'walk', 'bike', 'car')"
    }
  ],
  "indoorHacks": [
    {
      "id": "hack-1",
      "title": "string (hack title, e.g. 'Snake Plant (Sansevieria)' or 'Corsi-Rosenthal Box')",
      "description": "string (clear installation/usage instructions)",
      "category": "plants" | "ventilation" | "purification" | "habits" | "maintenance",
      "effectiveness": number (0-100),
      "cost": "free" | "low" | "medium" | "high",
      "maintenance": "none" | "low" | "medium" | "high",
      "suitableFor": ["array", "of", "contexts"],
      "icon": "string (valid Lucide icon name, e.g. 'plant', 'wind', 'filter', 'leaf', 'package')"
    }
  ],
  "alternatives": [
    {
      "id": "alt-1",
      "currentPractice": "string (what user currently does)",
      "alternative": "string (sustainable alternative proposed)",
      "category": "transport" | "energy" | "waste" | "consumption" | "indoor",
      "co2Reduction": "string (quantified annual CO2 reduction)",
      "healthImpact": "string (specific health outcome)",
      "costImpact": "string (quantified financial impact/savings)",
      "difficulty": "easy" | "moderate" | "hard",
      "explanation": "string (scientific justification explaining why this makes a difference)",
      "icon": "string (valid Lucide icon name, e.g. 'rotate-ccw', 'zap', 'recycle', 'bus')"
    }
  ],
  "personalizedAdvice": "string (a warm, expert, empowering 2-3 paragraph explanation specifically addressing their profile and current AQI)",
  "smogAlertNotice": "string (if AQI > 150, provide an urgent 1-sentence winter smog caution, else null)"
}

Requirements:
- Return 4-6 routines, 4-5 indoor hacks, and 3-4 sustainable alternatives.
- Avoid vague generic advice; mention specific times, tools (HEPA H13, N95/FFP2, NASA clean air plants), and numbers.
- Return ONLY valid JSON, with NO surrounding Markdown backticks or commentary.`;
}

/**
 * Generates personalized routines, indoor air hacks, and sustainable alternatives
 * using Google Gemini with Zod runtime schema validation and resilient local fallback.
 */
export async function generateRecommendations(
  aqiData: AQIData,
  userContext: UserContext
): Promise<RecommendationResponse> {
  if (!genAI || !apiKey.trim()) {
    return getFallbackRecommendations(aqiData, userContext);
  }

  try {
    const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = buildPrompt(aqiData, userContext);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON object from Gemini response');
    }

    const validated = aiOutputSchema.parse(JSON.parse(jsonMatch[0]));
    const fallbackNotice =
      aqiData.aqi >= 200
        ? 'Severe winter smog alert in effect for your area. Exercise extreme caution.'
        : undefined;

    return {
      routines: validated.routines,
      indoorHacks: validated.indoorHacks,
      alternatives: validated.alternatives,
      personalizedAdvice: validated.personalizedAdvice,
      smogAlertNotice: validated.smogAlertNotice ?? fallbackNotice,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('Gemini API call failed or returned invalid schema, falling back locally:', error);
    return getFallbackRecommendations(aqiData, userContext);
  }
}
