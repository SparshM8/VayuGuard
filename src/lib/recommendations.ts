import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  AQIData, 
  UserContext, 
  RecommendationResponse, 
  RoutineSuggestion, 
  IndoorAirQualityHack, 
  SustainableAlternative, 
  UserProfile, 
  AQICategory 
} from '@/types';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const PROFILE_CONTEXTS: Record<UserProfile, string> = {
  commuter: 'daily urban commuter who travels regularly and is heavily exposed to vehicular exhaust and roadside particulate matter',
  family: 'family with children and toddlers, focused on safeguarding respiratory development, indoor air safety, and school commute timing',
  elderly: 'older adult with heightened sensitivity to air pollution, vulnerable to cardiovascular and pulmonary irritation',
  athlete: 'active runner/athlete who requires high ventilation volumes and must strictly optimize workout timing around atmospheric smog inversions',
  'remote-worker': 'home-based professional seeking optimal indoor microclimate, productivity, and evidence-based home air hacks',
  student: 'student navigating university/school commutes, seeking practical, budget-conscious, low-emission alternatives',
};

const CATEGORY_GUIDANCE: Record<AQICategory, string> = {
  'Good': 'Air quality is satisfactory. Maintain sustainable daily habits and keep indoor spaces ventilated.',
  'Moderate': 'Air quality is acceptable. Sensitive individuals should avoid heavy exertion during peak rush hours.',
  'Unhealthy for Sensitive Groups': 'Children, elderly, and those with respiratory issues should restrict prolonged outdoor exposure and keep windows sealed during inversion periods.',
  'Unhealthy': 'Everyone should reduce strenuous outdoor activities. Sensitive groups should stay indoors with air purification and wear well-fitted N95 masks if outside.',
  'Very Unhealthy': 'Health alert: Severe air pollution with high particulate concentration. Restrict all non-essential outdoor trips, run HEPA air purifiers, and activate smog defense routines.',
  'Hazardous': 'Emergency smog conditions: Atmospheric inversion trapping hazardous particulates. Stay strictly indoors, seal entryways, operate continuous HEPA filtration, and avoid all combustion.',
};

function buildPrompt(aqiData: AQIData, userContext: UserContext): string {
  const { profile, preferences } = userContext;
  const profileDesc = PROFILE_CONTEXTS[profile] || PROFILE_CONTEXTS.commuter;
  const categoryGuidance = CATEGORY_GUIDANCE[aqiData.category];

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
  ].filter(Boolean).join(', ');

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
${aqiData.pollutants.map(p => `  * ${p.name}: ${p.value} ${p.unit} (Sub-index AQI: ${p.aqi})`).join('\n')}

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

export async function generateRecommendations(
  aqiData: AQIData, 
  userContext: UserContext
): Promise<RecommendationResponse> {
  // If no Gemini API key configured, use the intelligent fallback engine
  if (!genAI || !apiKey.trim()) {
    return getFallbackRecommendations(aqiData, userContext);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = buildPrompt(aqiData, userContext);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON object from Gemini response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      routines: Array.isArray(parsed.routines) ? parsed.routines : [],
      indoorHacks: Array.isArray(parsed.indoorHacks) ? parsed.indoorHacks : [],
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : [],
      personalizedAdvice: parsed.personalizedAdvice || 'Stay safe and monitor local air quality trends.',
      smogAlertNotice: parsed.smogAlertNotice || (aqiData.aqi >= 200 ? 'Severe winter smog alert in effect for your area. Exercise extreme caution.' : undefined),
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('Gemini API call failed or encountered error, falling back to local recommendation engine:', error);
    return getFallbackRecommendations(aqiData, userContext);
  }
}

export function getFallbackRecommendations(
  aqiData: AQIData, 
  userContext: UserContext
): RecommendationResponse {
  const { profile, preferences } = userContext;
  const aqi = aqiData.aqi;
  const isSevere = aqi >= 200;
  const isModerateOrHigh = aqi > 100;

  // 1. Context-tailored Low-Emission Daily Routines
  const routines: RoutineSuggestion[] = [];

  if (profile === 'family') {
    routines.push({
      id: 'routine-family-1',
      title: 'Synchronize School Drop-offs with Air Quality Windows',
      description: isSevere 
        ? 'Morning winter inversion traps heavy smog until 9:00 AM. If possible, coordinate delayed drop-offs or ensure children wear snug-fit pediatric N95/KN95 masks during travel.'
        : 'Avoid idling car engines in school zones. Switch to walking or cycling if AQI remains under 100.',
      category: 'commute',
      impact: 'high',
      emissionReduction: 'Reduces child particulate inhalation by 50-70%',
      healthBenefit: 'Protects developing alveolar tissues from deep PM2.5 penetration',
      difficulty: 'moderate',
      estimatedTime: 'Daily routine',
      icon: 'baby',
    });
    routines.push({
      id: 'routine-family-2',
      title: 'Create a Sealed Indoor "Clean Air Play Haven"',
      description: 'Designate the central living room or children bedroom as a sealed clean zone. Keep doors and windows closed, run a HEPA purifier, and replace outdoor active play with indoor educational activities during smog spikes.',
      category: 'indoor',
      impact: 'high',
      emissionReduction: 'Maintains indoor PM2.5 below 15 μg/m³ even when outside is 200+',
      healthBenefit: 'Lowers acute asthma episodes and bronchitis risks in young children',
      difficulty: 'easy',
      estimatedTime: '15 min setup',
      icon: 'home',
    });
  } else if (profile === 'commuter') {
    routines.push({
      id: 'routine-commuter-1',
      title: 'Shift to Metro / Electric Public Transit',
      description: preferences.transportMode === 'car'
        ? 'Switch your solo car drive to electric rail or rapid metro transit. If driving is essential, ensure your car cabin AC is set to "Internal Recirculation" to block outdoor exhaust fumes.'
        : 'Continue using public transit and wear an N95 mask while waiting on roadside platforms.',
      category: 'commute',
      impact: 'high',
      emissionReduction: 'Cuts personal transport emissions by ~75% (~2.4 kg CO₂/commute)',
      healthBenefit: 'Avoids breathing toxic nitrogen dioxide and ultra-fine diesel soot',
      difficulty: preferences.transportMode === 'car' ? 'moderate' : 'easy',
      estimatedTime: 'Standard commute time',
      icon: 'bus',
    });
  } else if (profile === 'athlete') {
    routines.push({
      id: 'routine-athlete-1',
      title: 'Reschedule Workouts to Mid-Afternoon or Indoor Gym',
      description: isSevere
        ? 'Atmospheric temperature inversion is strongest between 6:00 AM - 9:00 AM and after 8:00 PM. Move all cardio, running, and high-intensity sessions indoors to an air-filtered gym.'
        : 'Check hourly AQI before outdoor runs; exercise between 1:00 PM and 4:00 PM when solar warming disperses trapped boundary-layer pollution.',
      category: 'activity',
      impact: 'high',
      emissionReduction: 'Reduces pollutant intake during heavy breathing by up to 80%',
      healthBenefit: 'Prevents exercise-induced airway inflammation and reduced lung capacity',
      difficulty: 'moderate',
      estimatedTime: 'Schedule adjustment',
      icon: 'dumbbell',
    });
  } else if (profile === 'elderly') {
    routines.push({
      id: 'routine-elderly-1',
      title: 'Stay Indoors During Early Morning Smog Inversion',
      description: 'Cold winter air traps particulates near the ground in early mornings. Postpone morning balcony strolls until after 11:00 AM when the sun disperses the fog.',
      category: 'lifestyle',
      impact: 'high',
      emissionReduction: 'Avoids peak particulate exposure periods',
      healthBenefit: 'Significantly reduces strain on heart and blood pressure spikes',
      difficulty: 'easy',
      estimatedTime: 'Daily habit',
      icon: 'elderly',
    });
  } else if (profile === 'student') {
    routines.push({
      id: 'routine-student-1',
      title: 'Campus Micro-Mobility & Reusable Pollution Masking',
      description: 'Use campus electric shuttles or shared bicycles. Keep a washable mask with replaceable N95 filter inserts in your backpack for walking between lecture halls.',
      category: 'commute',
      impact: 'medium',
      emissionReduction: 'Zero tailpipe emissions on campus journeys',
      healthBenefit: 'Blocks dust and particulate matter between classes',
      difficulty: 'easy',
      estimatedTime: '5 min daily',
      icon: 'graduation-cap',
    });
  } else {
    routines.push({
      id: 'routine-remote-1',
      title: 'Optimized Clean-Air Work From Home Setup',
      description: 'Keep your home office door closed, place an air-purifying plant on your desk, and run a quiet air purifier. Ventilate only during clean afternoon hours.',
      category: 'indoor',
      impact: 'high',
      emissionReduction: 'Zero commute emissions + 60% cleaner breathing zone',
      healthBenefit: 'Improves focus, reduces fatigue and tension headaches',
      difficulty: 'easy',
      estimatedTime: 'All day',
      icon: 'home',
    });
  }

  // Universal high-impact routines
  routines.push({
    id: 'routine-mask-universal',
    title: isModerateOrHigh ? 'Deploy N95 / KN95 Mask for All Outdoor Steps' : 'Carry Lightweight Mask for Sudden Smog Spikes',
    description: isModerateOrHigh
      ? 'Cloth and surgical masks do not filter PM2.5. Always wear a sealed N95 or KN95 respirator whenever stepping onto roadside sidewalks or commuting.'
      : 'Maintain an N95 respirator in your bag for sudden traffic snarls or evening pollution spikes.',
    category: 'lifestyle',
    impact: isSevere ? 'high' : 'medium',
    emissionReduction: 'Filters out 95%+ of sub-micron particles (PM2.5 & PM0.1)',
    healthBenefit: 'Prevents systemic entry of combustion toxins into bloodstream',
    difficulty: 'easy',
    estimatedTime: '1 minute',
    icon: 'shield',
  });

  routines.push({
    id: 'routine-ventilation-timing',
    title: 'Precision Ventilation: Open Windows Only During Clean Windows',
    description: 'During winter smog season, never open windows between 7:00 PM and 9:00 AM. Open windows for 15 minutes of cross-ventilation only between 1:00 PM and 3:30 PM when ambient air is warmest and most dispersed.',
    category: 'indoor',
    impact: 'high',
    emissionReduction: 'Prevents 60-80% of outdoor smog from infiltrating your living room',
    healthBenefit: 'Balances indoor CO₂ levels without flooding home with toxic PM2.5',
    difficulty: 'easy',
    estimatedTime: '15 min midday',
    icon: 'wind',
  });

  routines.push({
    id: 'routine-clean-transit',
    title: 'Trip Chaining & Anti-Idling Habits',
    description: 'Combine multiple errands into a single trip rather than taking multiple cold engine starts. Turn off car or two-wheeler engine at red lights exceeding 20 seconds.',
    category: 'commute',
    impact: 'medium',
    emissionReduction: 'Saves 15-20% fuel and curbs localized CO/PM hotspots',
    healthBenefit: 'Cuts local ground-level toxic exhaust in residential neighborhoods',
    difficulty: 'easy',
    estimatedTime: 'Ongoing habit',
    icon: 'car',
  });

  // 2. Indoor Air Quality Hacks
  const indoorHacks: IndoorAirQualityHack[] = [
    {
      id: 'hack-snake-plant',
      title: 'Snake Plant (Sansevieria trifasciata)',
      description: 'NASA Clean Air Study champion: Operates Crassulacean Acid Metabolism (CAM), absorbing CO₂ and releasing fresh oxygen during the night while filtering formaldehyde and xylene. Ideal for bedrooms.',
      category: 'plants',
      effectiveness: 78,
      cost: 'low',
      maintenance: 'low',
      suitableFor: ['bedrooms', 'apartments', 'low-light spaces'],
      icon: 'plant',
    },
    {
      id: 'hack-spider-plant',
      title: 'Spider Plant (Chlorophytum comosum)',
      description: preferences.hasPets 
        ? '100% Pet-Safe Non-Toxic Plant! Removes carbon monoxide, benzene, and formaldehyde. Extremely resilient and easy to propagate in water or soil.'
        : 'Removes up to 90% of toxic airborne formaldehyde within 24 hours. Safe for pets and families, easy to grow in hanging baskets.',
      category: 'plants',
      effectiveness: 72,
      cost: 'low',
      maintenance: 'low',
      suitableFor: ['living rooms', 'pet owners', 'study tables'],
      icon: 'leaf',
    },
    {
      id: 'hack-corsi-rosenthal',
      title: 'DIY Corsi-Rosenthal Box Air Cleaner',
      description: 'A budget-friendly hack built with a 20-inch box fan and 4 MERV-13 furnace filters taped together into a cube. Delivers Clean Air Delivery Rates (CADR) rivaling $500 commercial purifiers for under $60.',
      category: 'purification',
      effectiveness: 92,
      cost: 'low',
      maintenance: 'medium',
      suitableFor: ['classrooms', 'living rooms', 'budget conscious', 'high smog'],
      icon: 'package',
    },
    {
      id: 'hack-microfiber-damp',
      title: 'Damp Microfiber Mopping (Zero-Resuspension Protocol)',
      description: 'Never dry-sweep during smog season; dry sweeping resuspends settling toxic PM10 into the breathing zone. Use a damp microfiber mop with warm water to physically trap and wash away particulate dust.',
      category: 'habits',
      effectiveness: 65,
      cost: 'free',
      maintenance: 'low',
      suitableFor: ['all homes', 'allergies', 'asthma', 'pets'],
      icon: 'droplet',
    },
    {
      id: 'hack-window-weatherstripping',
      title: 'Silicone Weatherstrip Window Sealing',
      description: 'Apply peel-and-stick silicone foam weatherstripping along window frames and balcony sliding door gaps. Prevents ambient winter smog from seeping into bedrooms through microscopic building crevices.',
      category: 'maintenance',
      effectiveness: 80,
      cost: 'low',
      maintenance: 'low',
      suitableFor: ['older apartments', 'high-floor units', 'roadside homes'],
      icon: 'home',
    },
  ];

  // 3. Sustainable Alternatives with Justified Impact
  const alternatives: SustainableAlternative[] = [
    {
      id: 'alt-metro-commute',
      currentPractice: 'Driving single-occupant fossil fuel car to workplace',
      alternative: 'Electric Metro / Rapid Bus Transit + Last-Mile Electric Scooter',
      category: 'transport',
      co2Reduction: '~2,400 kg CO₂ per year',
      healthImpact: 'Reduces direct personal exposure to roadside PM2.5 by ~65%; adds 25 minutes of healthy daily active movement',
      costImpact: 'Saves approx $1,600 - $2,500 (₹1.2L - ₹2L) annually on fuel, parking, and vehicle depreciation',
      difficulty: 'moderate',
      explanation: 'Passenger cars emit roughly 404 grams of CO₂ per mile, plus carcinogenic volatile organic compounds and nitrogen oxides. Rail-based electric transit consumes less than 15% of energy per passenger-kilometer, directly eliminating rush-hour tailpipe exhaust in congested urban centers.',
      icon: 'bus',
    },
    {
      id: 'alt-induction-cooking',
      currentPractice: 'Cooking on unventilated LPG or natural gas cooktops',
      alternative: 'Smart Induction Cooktop with Range Hood / Window Exhaust Fan',
      category: 'indoor',
      co2Reduction: '~220 kg CO₂ per year',
      healthImpact: 'Eliminates indoor NO₂ and carbon monoxide spikes; reduces childhood asthma incidence risk by up to 42%',
      costImpact: 'Upfront cost $60 - $120; operational energy cost is 15-20% cheaper than LPG cylinders due to 90% thermal efficiency',
      difficulty: 'moderate',
      explanation: 'Gas cooking produces high indoor concentrations of nitrogen dioxide (NO₂), carbon monoxide, and formaldehyde that frequently exceed WHO outdoor safety limits. Induction cookers use electromagnetic fields to heat cookware directly with 90% energy transfer and zero combustion emissions.',
      icon: 'zap',
    },
    {
      id: 'alt-waste-composting',
      currentPractice: 'Throwing organic household food waste into municipal trash (or burning leaves)',
      alternative: 'Aerate Home Balcony Composting or Community Bio-waste Processing',
      category: 'waste',
      co2Reduction: '~350 kg CO₂ equivalent (prevents anaerobic methane generation)',
      healthImpact: 'Completely eliminates burning of dry leaves and garden waste, preventing toxic dioxin and black carbon plumes in the neighborhood',
      costImpact: 'Produces free rich organic plant fertilizer; reduces landfill municipal processing costs',
      difficulty: 'easy',
      explanation: 'Organic waste in landfills decomposes anaerobically, generating methane which is 28x more potent than CO₂ as a greenhouse gas. Aerobic composting creates nutrient-rich soil humus while preventing hazardous open-waste burning.',
      icon: 'recycle',
    },
    {
      id: 'alt-energy-smart-control',
      currentPractice: 'Leaving appliances, standby power, and heaters on unmonitored',
      alternative: 'Smart Programmable Plugs & Thermostatic Oil-Filled Radiator',
      category: 'energy',
      co2Reduction: '~280 kg CO₂ per year',
      healthImpact: 'Eliminates open glowing-coil heaters that burn airborne dust and create toxic acrolein fumes indoors',
      costImpact: 'Saves 10-15% on monthly electricity bills ($80 - $150 / year)',
      difficulty: 'easy',
      explanation: 'Traditional glowing wire space heaters burn microscopic room dust and generate unpleasant acrolein and carbon monoxide. Oil-filled sealed radiators gently warm the room without drying out mucous membranes or causing dust burning.',
      icon: 'battery',
    },
  ];

  const personalizedAdvice = `Welcome! As a ${profile} in ${aqiData.city}, here is your tailored urban air quality guidance: The current air quality is categorized as ${aqiData.category} with an AQI of ${aqiData.aqi} (dominant pollutant: ${aqiData.dominantPollutant || 'PM2.5'}). ${CATEGORY_GUIDANCE[aqiData.category]} ${
    preferences.hasChildren ? 'Given that you have young children at home, protecting their developing lungs during winter smog inversions is paramount—keep indoor play spaces strictly filtered and avoid outdoor exertion during early morning smog spikes.' : ''
  } ${
    preferences.hasElderly ? 'Because you care for elderly family members, be cautious of sudden cardiovascular strain caused by cold-air particulate inhalation. Ensure bedroom air is continuously purified.' : ''
  } ${
    preferences.hasRespiratoryIssues ? 'With existing respiratory vulnerabilities in your household, maintain an N95 mask protocol and run HEPA air filtration continuously.' : ''
  } ${
    preferences.hasPets ? 'We have customized plant recommendations to ensure non-toxic indoor species that are 100% pet-safe.' : ''
  } Taking proactive steps like precision ventilation timing, deploying air-purifying greenery, and choosing clean transit options creates an immediate protective shield for your loved ones while reducing community emissions.`;

  const smogAlertNotice = isSevere 
    ? `⚠️ URGENT WINTER SMOG ALERT in ${aqiData.city}: Current AQI is ${aqiData.aqi} (${aqiData.category}). Ground-level temperature inversion is trapping hazardous particulate matter. Avoid all outdoor exertion, keep windows sealed, and operate continuous HEPA filtration.`
    : undefined;

  return {
    routines,
    indoorHacks,
    alternatives,
    personalizedAdvice,
    smogAlertNotice,
    generatedAt: new Date().toISOString(),
  };
}
