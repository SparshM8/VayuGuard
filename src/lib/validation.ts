import { z } from 'zod';

/** Validates GET /api/aqidata query parameters across search, coordinate lookup, and city lookup modes. */
export const aqiQuerySchema = z.object({
  action: z.enum(['search']).optional(),
  q: z.string().max(50).optional(),
  city: z.string().trim().min(1).max(80).optional(),
  country: z.string().trim().max(10).default('IN'),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  cityName: z.string().trim().max(80).optional(),
  countryName: z.string().trim().max(80).optional(),
});

export const userProfileSchema = z.enum([
  'commuter',
  'family',
  'elderly',
  'athlete',
  'remote-worker',
  'student',
]);

export const aqiCategorySchema = z.enum([
  'Good',
  'Moderate',
  'Unhealthy for Sensitive Groups',
  'Unhealthy',
  'Very Unhealthy',
  'Hazardous',
]);

export const userPreferencesSchema = z
  .object({
    hasChildren: z.boolean().default(false),
    hasElderly: z.boolean().default(false),
    hasRespiratoryIssues: z.boolean().default(false),
    hasPets: z.boolean().default(false),
    commuteDistance: z.enum(['short', 'medium', 'long']).default('medium'),
    transportMode: z.enum(['car', 'public', 'bike', 'walk', 'mixed']).default('car'),
    homeType: z.enum(['apartment', 'house', 'shared']).default('apartment'),
    hasAirPurifier: z.boolean().default(false),
    hasPlants: z.boolean().default(false),
  })
  .partial();

export const recommendationRequestSchema = z.object({
  aqiData: z.object({
    city: z.string().min(1),
    country: z.string().optional().default('Global'),
    location: z.string().optional().default(''),
    coordinates: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
      })
      .optional()
      .default({ latitude: 0, longitude: 0 }),
    aqi: z.number().min(0),
    category: aqiCategorySchema,
    pollutants: z
      .array(
        z.object({
          name: z.string(),
          code: z.string(),
          value: z.number(),
          unit: z.string(),
          aqi: z.number(),
          description: z.string().optional().default(''),
        })
      )
      .optional()
      .default([]),
    timestamp: z.string().optional().default(() => new Date().toISOString()),
    source: z.string().optional().default('Open-Meteo Air Quality Engine'),
    sourceUrl: z.string().optional().default('https://open-meteo.com/en/docs/air-quality-api'),
    dominantPollutant: z.string().optional(),
    isSmogSevere: z.boolean().optional(),
  }),
  userContext: z.object({
    profile: userProfileSchema,
    location: z.string().optional().default(''),
    preferences: userPreferencesSchema.optional(),
  }),
});

export const aiOutputSchema = z.object({
  routines: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        category: z.enum(['commute', 'activity', 'lifestyle', 'indoor']),
        impact: z.enum(['high', 'medium', 'low']),
        emissionReduction: z.string(),
        healthBenefit: z.string(),
        difficulty: z.enum(['easy', 'moderate', 'hard']),
        estimatedTime: z.string(),
        icon: z.string(),
      })
    )
    .default([]),
  indoorHacks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        category: z.enum(['plants', 'ventilation', 'purification', 'habits', 'maintenance']),
        effectiveness: z.number(),
        cost: z.enum(['free', 'low', 'medium', 'high']),
        maintenance: z.enum(['none', 'low', 'medium', 'high']),
        suitableFor: z.array(z.string()).default([]),
        icon: z.string(),
      })
    )
    .default([]),
  alternatives: z
    .array(
      z.object({
        id: z.string(),
        currentPractice: z.string(),
        alternative: z.string(),
        category: z.enum(['transport', 'energy', 'waste', 'consumption', 'indoor']),
        co2Reduction: z.string(),
        healthImpact: z.string(),
        costImpact: z.string(),
        difficulty: z.enum(['easy', 'moderate', 'hard']),
        explanation: z.string(),
        icon: z.string(),
      })
    )
    .default([]),
  personalizedAdvice: z.string().min(1),
  smogAlertNotice: z.string().nullable().optional(),
});
