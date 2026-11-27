import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AppError, CityNotFoundError, UpstreamServiceError } from '../src/lib/errors';
import { aiOutputSchema, aqiQuerySchema } from '../src/lib/validation';
import { getFallbackRecommendations } from '../src/lib/fallbackRecommendations';
import { AQIData } from '../src/types';

describe('Error Classes & Zod Query/AI Schemas', () => {
  it('constructs structured HTTP error classes with expected status codes', () => {
    const notFound = new CityNotFoundError('Atlantis');
    assert.ok(notFound instanceof AppError);
    assert.strictEqual(notFound.statusCode, 404);
    assert.match(notFound.message, /Atlantis/);

    const upstreamDown = new UpstreamServiceError('Geocoding service', 503);
    assert.ok(upstreamDown instanceof AppError);
    assert.strictEqual(upstreamDown.statusCode, 502);
    assert.match(upstreamDown.message, /503/);
  });

  it('validates valid and out-of-bounds AQI query parameters', () => {
    const validCity = aqiQuerySchema.safeParse({ city: 'Delhi', country: 'IN' });
    assert.strictEqual(validCity.success, true);

    const validCoords = aqiQuerySchema.safeParse({ lat: '28.6', lon: '77.2' });
    assert.strictEqual(validCoords.success, true);

    const invalidLat = aqiQuerySchema.safeParse({ lat: '120', lon: '77.2' });
    assert.strictEqual(invalidLat.success, false);

    const emptyCity = aqiQuerySchema.safeParse({ city: '   ' });
    assert.strictEqual(emptyCity.success, false);
  });

  it('validates Gemini structured JSON output schema', () => {
    const sampleAqi: AQIData = {
      city: 'Delhi',
      country: 'India',
      location: 'Delhi, India',
      coordinates: { latitude: 28.6, longitude: 77.2 },
      aqi: 220,
      category: 'Very Unhealthy',
      pollutants: [],
      timestamp: new Date().toISOString(),
      source: 'Open-Meteo',
      sourceUrl: 'https://open-meteo.com',
    };
    const fallback = getFallbackRecommendations(sampleAqi, {
      profile: 'student',
      location: 'Delhi',
      preferences: {
        hasChildren: false,
        hasElderly: false,
        hasRespiratoryIssues: false,
        hasPets: false,
        commuteDistance: 'short',
        transportMode: 'public',
        homeType: 'shared',
        hasAirPurifier: false,
        hasPlants: false,
      },
    });

    const parsed = aiOutputSchema.safeParse(fallback);
    assert.strictEqual(parsed.success, true, 'Fallback recommendations output must satisfy aiOutputSchema');
  });
});
