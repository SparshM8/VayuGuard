import {
  IndoorAirQualityHack,
  RoutineSuggestion,
  SustainableAlternative,
  UserProfile,
} from '@/types';

export interface ProfileRoutineContext {
  transportMode: string;
  isSevere: boolean;
}

export const PROFILE_ROUTINE_BUILDERS: Record<
  UserProfile,
  (ctx: ProfileRoutineContext) => RoutineSuggestion[]
> = {
  family: ({ isSevere }) => [
    {
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
    },
    {
      id: 'routine-family-2',
      title: 'Create a Sealed Indoor "Clean Air Play Haven"',
      description:
        'Designate the central living room or children bedroom as a sealed clean zone. Keep doors and windows closed, run a HEPA purifier, and replace outdoor active play with indoor educational activities during smog spikes.',
      category: 'indoor',
      impact: 'high',
      emissionReduction: 'Maintains indoor PM2.5 below 15 μg/m³ even when outside is 200+',
      healthBenefit: 'Lowers acute asthma episodes and bronchitis risks in young children',
      difficulty: 'easy',
      estimatedTime: '15 min setup',
      icon: 'home',
    },
  ],
  commuter: ({ transportMode }) => [
    {
      id: 'routine-commuter-1',
      title: 'Shift to Metro / Electric Public Transit',
      description:
        transportMode === 'car'
          ? 'Switch your solo car drive to electric rail or rapid metro transit. If driving is essential, ensure your car cabin AC is set to "Internal Recirculation" to block outdoor exhaust fumes.'
          : 'Continue using public transit and wear an N95 mask while waiting on roadside platforms.',
      category: 'commute',
      impact: 'high',
      emissionReduction: 'Cuts personal transport emissions by ~75% (~2.4 kg CO₂/commute)',
      healthBenefit: 'Avoids breathing toxic nitrogen dioxide and ultra-fine diesel soot',
      difficulty: transportMode === 'car' ? 'moderate' : 'easy',
      estimatedTime: 'Standard commute time',
      icon: 'bus',
    },
  ],
  athlete: ({ isSevere }) => [
    {
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
    },
  ],
  elderly: () => [
    {
      id: 'routine-elderly-1',
      title: 'Stay Indoors During Early Morning Smog Inversion',
      description:
        'Cold winter air traps particulates near the ground in early mornings. Postpone morning balcony strolls until after 11:00 AM when the sun disperses the fog.',
      category: 'lifestyle',
      impact: 'high',
      emissionReduction: 'Avoids peak particulate exposure periods',
      healthBenefit: 'Significantly reduces strain on heart and blood pressure spikes',
      difficulty: 'easy',
      estimatedTime: 'Daily habit',
      icon: 'elderly',
    },
  ],
  student: () => [
    {
      id: 'routine-student-1',
      title: 'Campus Micro-Mobility & Reusable Pollution Masking',
      description:
        'Use campus electric shuttles or shared bicycles. Keep a washable mask with replaceable N95 filter inserts in your backpack for walking between lecture halls.',
      category: 'commute',
      impact: 'medium',
      emissionReduction: 'Zero tailpipe emissions on campus journeys',
      healthBenefit: 'Blocks dust and particulate matter between classes',
      difficulty: 'easy',
      estimatedTime: '5 min daily',
      icon: 'graduation-cap',
    },
  ],
  'remote-worker': () => [
    {
      id: 'routine-remote-1',
      title: 'Optimized Clean-Air Work From Home Setup',
      description:
        'Keep your home office door closed, place an air-purifying plant on your desk, and run a quiet air purifier. Ventilate only during clean afternoon hours.',
      category: 'indoor',
      impact: 'high',
      emissionReduction: 'Zero commute emissions + 60% cleaner breathing zone',
      healthBenefit: 'Improves focus, reduces fatigue and tension headaches',
      difficulty: 'easy',
      estimatedTime: 'All day',
      icon: 'home',
    },
  ],
};

export function createUniversalRoutines(
  isModerateOrHigh: boolean,
  isSevere: boolean
): RoutineSuggestion[] {
  return [
    {
      id: 'routine-mask-universal',
      title: isModerateOrHigh
        ? 'Deploy N95 / KN95 Mask for All Outdoor Steps'
        : 'Carry Lightweight Mask for Sudden Smog Spikes',
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
    },
    {
      id: 'routine-ventilation-timing',
      title: 'Precision Ventilation: Open Windows Only During Clean Windows',
      description:
        'During winter smog season, never open windows between 7:00 PM and 9:00 AM. Open windows for 15 minutes of cross-ventilation only between 1:00 PM and 3:30 PM when ambient air is warmest and most dispersed.',
      category: 'indoor',
      impact: 'high',
      emissionReduction: 'Prevents 60-80% of outdoor smog from infiltrating your living room',
      healthBenefit: 'Balances indoor CO₂ levels without flooding home with toxic PM2.5',
      difficulty: 'easy',
      estimatedTime: '15 min midday',
      icon: 'wind',
    },
    {
      id: 'routine-clean-transit',
      title: 'Trip Chaining & Anti-Idling Habits',
      description:
        'Combine multiple errands into a single trip rather than taking multiple cold engine starts. Turn off car or two-wheeler engine at red lights exceeding 20 seconds.',
      category: 'commute',
      impact: 'medium',
      emissionReduction: 'Saves 15-20% fuel and curbs localized CO/PM hotspots',
      healthBenefit: 'Cuts local ground-level toxic exhaust in residential neighborhoods',
      difficulty: 'easy',
      estimatedTime: 'Ongoing habit',
      icon: 'car',
    },
  ];
}

export function createIndoorHacksCatalog(hasPets: boolean): IndoorAirQualityHack[] {
  return [
    {
      id: 'hack-snake-plant',
      title: 'Snake Plant (Sansevieria trifasciata)',
      description:
        'NASA Clean Air Study champion: Operates Crassulacean Acid Metabolism (CAM), absorbing CO₂ and releasing fresh oxygen during the night while filtering formaldehyde and xylene. Ideal for bedrooms.',
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
      description: hasPets
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
      description:
        'A budget-friendly hack built with a 20-inch box fan and 4 MERV-13 furnace filters taped together into a cube. Delivers Clean Air Delivery Rates (CADR) rivaling $500 commercial purifiers for under $60.',
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
      description:
        'Never dry-sweep during smog season; dry sweeping resuspends settling toxic PM10 into the breathing zone. Use a damp microfiber mop with warm water to physically trap and wash away particulate dust.',
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
      description:
        'Apply peel-and-stick silicone foam weatherstripping along window frames and balcony sliding door gaps. Prevents ambient winter smog from seeping into bedrooms through microscopic building crevices.',
      category: 'maintenance',
      effectiveness: 80,
      cost: 'low',
      maintenance: 'low',
      suitableFor: ['older apartments', 'high-floor units', 'roadside homes'],
      icon: 'home',
    },
  ];
}

export const SUSTAINABLE_ALTERNATIVES_CATALOG: SustainableAlternative[] = [
  {
    id: 'alt-metro-commute',
    currentPractice: 'Driving single-occupant fossil fuel car to workplace',
    alternative: 'Electric Metro / Rapid Bus Transit + Last-Mile Electric Scooter',
    category: 'transport',
    co2Reduction: '~2,400 kg CO₂ per year',
    healthImpact:
      'Reduces direct personal exposure to roadside PM2.5 by ~65%; adds 25 minutes of healthy daily active movement',
    costImpact: 'Saves approx $1,600 - $2,500 (₹1.2L - ₹2L) annually on fuel, parking, and vehicle depreciation',
    difficulty: 'moderate',
    explanation:
      'Passenger cars emit roughly 404 grams of CO₂ per mile, plus carcinogenic volatile organic compounds and nitrogen oxides. Rail-based electric transit consumes less than 15% of energy per passenger-kilometer, directly eliminating rush-hour tailpipe exhaust in congested urban centers.',
    icon: 'bus',
  },
  {
    id: 'alt-induction-cooking',
    currentPractice: 'Cooking on unventilated LPG or natural gas cooktops',
    alternative: 'Smart Induction Cooktop with Range Hood / Window Exhaust Fan',
    category: 'indoor',
    co2Reduction: '~220 kg CO₂ per year',
    healthImpact:
      'Eliminates indoor NO₂ and carbon monoxide spikes; reduces childhood asthma incidence risk by up to 42%',
    costImpact:
      'Upfront cost $60 - $120; operational energy cost is 15-20% cheaper than LPG cylinders due to 90% thermal efficiency',
    difficulty: 'moderate',
    explanation:
      'Gas cooking produces high indoor concentrations of nitrogen dioxide (NO₂), carbon monoxide, and formaldehyde that frequently exceed WHO outdoor safety limits. Induction cookers use electromagnetic fields to heat cookware directly with 90% energy transfer and zero combustion emissions.',
    icon: 'zap',
  },
  {
    id: 'alt-waste-composting',
    currentPractice: 'Throwing organic household food waste into municipal trash (or burning leaves)',
    alternative: 'Aerate Home Balcony Composting or Community Bio-waste Processing',
    category: 'waste',
    co2Reduction: '~350 kg CO₂ equivalent (prevents anaerobic methane generation)',
    healthImpact:
      'Completely eliminates burning of dry leaves and garden waste, preventing toxic dioxin and black carbon plumes in the neighborhood',
    costImpact: 'Produces free rich organic plant fertilizer; reduces landfill municipal processing costs',
    difficulty: 'easy',
    explanation:
      'Organic waste in landfills decomposes anaerobically, generating methane which is 28x more potent than CO₂ as a greenhouse gas. Aerobic composting creates nutrient-rich soil humus while preventing hazardous open-waste burning.',
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
    explanation:
      'Traditional glowing wire space heaters burn microscopic room dust and generate unpleasant acrolein and carbon monoxide. Oil-filled sealed radiators gently warm the room without drying out mucous membranes or causing dust burning.',
    icon: 'battery',
  },
];
