import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateImpactMetrics } from '../src/lib/impactCalculator';
import { recommendationRequestSchema } from '../src/lib/validation';
import { getIcon } from '../src/lib/icons';

describe('Impact Calculator & Schema Validation', () => {
  it('computes positive CO2, PM2.5, cost, and tree metrics when sustainable habits are enabled', () => {
    const metrics = calculateImpactMetrics({
      commuteDistanceKm: 15,
      transitSwitched: true,
      plantCount: 4,
      purifierHours: 10,
      useInduction: true,
      compostWaste: true,
    });

    assert.ok(metrics.totalCo2SavedKg > 1000, 'Switching a 15km commute should save >1,000 kg CO2/yr');
    assert.ok(metrics.totalDailyPm25Avoided > 50, 'Purifier + transit switch + plants should avoid >50 μg/day');
    assert.ok(metrics.totalFinancialSavedUsd > 500, 'Fuel + energy savings should exceed $500/yr');
    assert.strictEqual(metrics.totalFinancialSavedInr, metrics.totalFinancialSavedUsd * 83);
    assert.ok(metrics.treeEquivalent >= 1, 'Tree equivalent should be >= 1');
  });

  it('returns zero impact when all interventions are disabled and inputs clamped safely', () => {
    const metrics = calculateImpactMetrics({
      commuteDistanceKm: -10,
      transitSwitched: false,
      plantCount: -2,
      purifierHours: 0,
      useInduction: false,
      compostWaste: false,
    });

    assert.strictEqual(metrics.totalCo2SavedKg, 0);
    assert.strictEqual(metrics.totalDailyPm25Avoided, 0);
    assert.strictEqual(metrics.totalFinancialSavedUsd, 0);
    assert.strictEqual(metrics.treeEquivalent, 0);
  });

  it('validates partial recommendation payloads with defaults and rejects invalid payloads', () => {
    const validPartial = recommendationRequestSchema.safeParse({
      aqiData: { city: 'Delhi', aqi: 180, category: 'Unhealthy' },
      userContext: { profile: 'family' },
    });
    assert.strictEqual(validPartial.success, true);

    const invalidPayload = recommendationRequestSchema.safeParse({
      aqiData: { city: '', aqi: -5, category: 'InvalidTier' },
      userContext: { profile: 'unknown-persona' },
    });
    assert.strictEqual(invalidPayload.success, false);
  });

  it('resolves known icons and safely falls back for unknown icon strings', () => {
    const busIcon = getIcon('bus');
    const fallbackIcon = getIcon('non-existent-icon-xyz');
    assert.strictEqual(typeof busIcon, 'object');
    assert.strictEqual(typeof fallbackIcon, 'object');
    assert.notStrictEqual(busIcon, fallbackIcon);
  });
});
