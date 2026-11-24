import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateAQI, getAQICategory, getAQIColor, getAQIDescription, findSafeVentilationWindows } from '../src/lib/aqidata';
import { HourlyDataPoint } from '../src/types';

describe('AQI Calculation & Category Engine', () => {
  it('correctly calculates PM2.5 AQI across standard EPA breakpoints', () => {
    // 0 - 12 μg/m3 -> Good (0 - 50)
    assert.strictEqual(calculateAQI('pm25', 0), 0);
    assert.strictEqual(calculateAQI('pm25', 12.0), 50);

    // 12.1 - 35.4 μg/m3 -> Moderate (51 - 100)
    const moderateAqi = calculateAQI('pm25', 25.0);
    assert.ok(moderateAqi >= 51 && moderateAqi <= 100, `Expected moderate, got ${moderateAqi}`);

    // 55.5 - 150.4 μg/m3 -> Unhealthy (151 - 200)
    const unhealthyAqi = calculateAQI('pm25', 100.0);
    assert.ok(unhealthyAqi >= 151 && unhealthyAqi <= 200, `Expected unhealthy, got ${unhealthyAqi}`);

    // Hazardous (> 250.5 μg/m3)
    const hazardousAqi = calculateAQI('pm25', 300.0);
    assert.ok(hazardousAqi >= 301, `Expected hazardous, got ${hazardousAqi}`);
  });

  it('correctly calculates PM10 AQI sub-indices', () => {
    assert.strictEqual(calculateAQI('pm10', 0), 0);
    assert.strictEqual(calculateAQI('pm10', 54), 50);
    const pm10Aqi = calculateAQI('pm10', 100);
    assert.ok(pm10Aqi >= 51 && pm10Aqi <= 100);
  });

  it('correctly determines AQI category strings', () => {
    assert.strictEqual(getAQICategory(35), 'Good');
    assert.strictEqual(getAQICategory(85), 'Moderate');
    assert.strictEqual(getAQICategory(130), 'Unhealthy for Sensitive Groups');
    assert.strictEqual(getAQICategory(175), 'Unhealthy');
    assert.strictEqual(getAQICategory(245), 'Very Unhealthy');
    assert.strictEqual(getAQICategory(380), 'Hazardous');
  });

  it('returns valid hex color codes for each AQI category', () => {
    const categories = [
      'Good',
      'Moderate',
      'Unhealthy for Sensitive Groups',
      'Unhealthy',
      'Very Unhealthy',
      'Hazardous'
    ] as const;

    categories.forEach(cat => {
      const color = getAQIColor(cat);
      assert.match(color, /^#[0-9A-Fa-f]{6}$/, `Color ${color} for ${cat} must be valid 6-char hex`);
    });
  });

  it('returns informative descriptions for all categories', () => {
    const desc = getAQIDescription('Hazardous');
    assert.ok(desc.toLowerCase().includes('emergency'), 'Hazardous description should mention emergency conditions');
  });

  it('finds best and worst ventilation windows from hourly data', () => {
    const mockHourly: HourlyDataPoint[] = [
      { time: '2026-11-24T06:00', hour: '6 AM', aqi: 280, pm25: 180, pm10: 250, category: 'Very Unhealthy' },
      { time: '2026-11-24T14:00', hour: '2 PM', aqi: 75, pm25: 22, pm10: 45, category: 'Moderate' },
      { time: '2026-11-24T21:00', hour: '9 PM', aqi: 310, pm25: 210, pm10: 290, category: 'Hazardous' },
    ];

    const result = findSafeVentilationWindows(mockHourly);
    assert.strictEqual(result.bestAqi, 75);
    assert.ok(result.bestWindow.includes('2 PM'));
    assert.strictEqual(result.worstAqi, 310);
    assert.ok(result.worstWindow.includes('9 PM'));
  });
});
