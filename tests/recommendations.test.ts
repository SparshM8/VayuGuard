import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getFallbackRecommendations } from '../src/lib/recommendations';
import { AQIData, UserContext } from '../src/types';

describe('Recommendations & Smog Strategy Engine', () => {
  const baseAqiData: AQIData = {
    city: 'Delhi',
    country: 'India',
    location: 'National Capital Territory of Delhi',
    coordinates: { latitude: 28.65, longitude: 77.23 },
    aqi: 265,
    category: 'Very Unhealthy',
    pollutants: [
      { name: 'PM2.5', code: 'pm25', value: 165.2, unit: 'μg/m³', aqi: 265, description: '' },
      { name: 'PM10', code: 'pm10', value: 240.0, unit: 'μg/m³', aqi: 145, description: '' },
    ],
    timestamp: new Date().toISOString(),
    source: 'Open-Meteo Air Quality Engine',
    sourceUrl: 'https://open-meteo.com',
    isSmogSevere: true,
    dominantPollutant: 'PM2.5',
  };

  it('generates customized routines for Family with Children', () => {
    const familyContext: UserContext = {
      profile: 'family',
      location: 'Delhi',
      preferences: {
        hasChildren: true,
        hasElderly: false,
        hasRespiratoryIssues: false,
        hasPets: true,
        commuteDistance: 'medium',
        transportMode: 'car',
        homeType: 'apartment',
        hasAirPurifier: true,
        hasPlants: true,
      },
    };

    const rec = getFallbackRecommendations(baseAqiData, familyContext);
    assert.ok(rec.routines.length >= 4, 'Should generate at least 4 routines');
    assert.ok(rec.indoorHacks.length >= 4, 'Should generate at least 4 indoor hacks');
    assert.ok(rec.alternatives.length >= 3, 'Should generate at least 3 alternatives');

    // Child-specific routines
    const hasChildNotice = rec.routines.some(r => r.title.toLowerCase().includes('school') || r.description.toLowerCase().includes('children'));
    assert.ok(hasChildNotice, 'Family recommendations should mention children or school routines');

    // Pet safety plant check
    const hasPetSafeHack = rec.indoorHacks.some(h => h.title.includes('Spider') && h.description.includes('Pet'));
    assert.ok(hasPetSafeHack, 'Pet-owning families should receive pet-safe plant advice');
  });

  it('triggers emergency winter smog alert when AQI is Very Unhealthy or Hazardous', () => {
    const commuterContext: UserContext = {
      profile: 'commuter',
      location: 'Delhi',
      preferences: {
        hasChildren: false,
        hasElderly: false,
        hasRespiratoryIssues: false,
        hasPets: false,
        commuteDistance: 'long',
        transportMode: 'car',
        homeType: 'apartment',
        hasAirPurifier: false,
        hasPlants: false,
      },
    };

    const rec = getFallbackRecommendations(baseAqiData, commuterContext);
    assert.ok(rec.smogAlertNotice, 'Should trigger smog alert notice when AQI is 265');
    assert.ok(rec.smogAlertNotice.includes('SMOG ALERT'), 'Notice text should contain alert warning');
  });

  it('provides quantified CO2 and health impact justifications in alternatives', () => {
    const athleteContext: UserContext = {
      profile: 'athlete',
      location: 'Delhi',
      preferences: {
        hasChildren: false,
        hasElderly: false,
        hasRespiratoryIssues: false,
        hasPets: false,
        commuteDistance: 'short',
        transportMode: 'bike',
        homeType: 'house',
        hasAirPurifier: true,
        hasPlants: true,
      },
    };

    const rec = getFallbackRecommendations(baseAqiData, athleteContext);
    rec.alternatives.forEach(alt => {
      assert.ok(alt.co2Reduction && alt.co2Reduction.length > 0, `Alternative ${alt.id} must include quantified CO2 reduction`);
      assert.ok(alt.healthImpact && alt.healthImpact.length > 0, `Alternative ${alt.id} must explain health impact`);
      assert.ok(alt.costImpact && alt.costImpact.length > 0, `Alternative ${alt.id} must explain cost impact`);
      assert.ok(alt.explanation && alt.explanation.length > 0, `Alternative ${alt.id} must provide scientific justification`);
    });
  });
});
