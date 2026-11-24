import { describe, it } from 'node:test';
import assert from 'node:assert';
import { geocodeCity, fetchAQIData, searchCities } from '../src/lib/aqidata';

describe('Real-time Data & Geocoding Integration', () => {
  it('correctly geocodes a major global city (Delhi, IN)', async () => {
    const geo = await geocodeCity('Delhi', 'IN');
    assert.strictEqual(geo.name, 'Delhi');
    assert.strictEqual(geo.countryCode, 'IN');
    assert.ok(Math.abs(geo.latitude - 28.6) < 1.0, 'Latitude should be ~28.6');
    assert.ok(Math.abs(geo.longitude - 77.2) < 1.0, 'Longitude should be ~77.2');
  });

  it('rejects nonexistent city queries gracefully', async () => {
    await assert.rejects(
      async () => {
        await geocodeCity('NonExistentCityXYZ99999');
      },
      /not found/i
    );
  });

  it('searches for cities and returns autocomplete array', async () => {
    const results = await searchCities('Lon');
    assert.ok(Array.isArray(results), 'Should return array');
    assert.ok(results.length > 0, 'Should find matching cities for "Lon"');
    assert.ok(results[0].city && results[0].country, 'Results should have city and country');
  });

  it('fetches real live air quality telemetry with all required pollutants', async () => {
    const data = await fetchAQIData('Delhi', 'IN');
    assert.ok(data.city && data.city.length > 0, 'Must have resolved city name');
    assert.ok(typeof data.aqi === 'number' && data.aqi >= 0, 'AQI must be non-negative number');
    assert.ok(data.category && data.category.length > 0, 'Category must be defined');
    assert.ok(data.source && data.source.length > 0, 'Data source attribution must be present');
    assert.ok(data.timestamp && data.timestamp.length > 0, 'Timestamp must be present');
    assert.strictEqual(data.pollutants.length, 6, 'Must contain 6 key pollutants');
    assert.ok(data.pollutants.some(p => p.code === 'pm25'), 'Must contain PM2.5');
    assert.ok(data.pollutants.some(p => p.code === 'pm10'), 'Must contain PM10');
    assert.ok(data.hourlyForecast && data.hourlyForecast.length > 0, 'Hourly forecast must be populated');
  });
});
