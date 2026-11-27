import { AQICategory, HourlyDataPoint } from '@/types';
import { AQI_CATEGORY_THEMES } from './constants';

interface BreakpointRange {
  min: number;
  max: number;
  aqiMin: number;
  aqiMax: number;
}

/** US-EPA pollutant concentration breakpoints used for sub-index interpolation. */
const POLLUTANT_AQI_BREAKPOINTS: Record<string, BreakpointRange[]> = {
  pm25: [
    { min: 0.0, max: 12.0, aqiMin: 0, aqiMax: 50 },
    { min: 12.1, max: 35.4, aqiMin: 51, aqiMax: 100 },
    { min: 35.5, max: 55.4, aqiMin: 101, aqiMax: 150 },
    { min: 55.5, max: 150.4, aqiMin: 151, aqiMax: 200 },
    { min: 150.5, max: 250.4, aqiMin: 201, aqiMax: 300 },
    { min: 250.5, max: 350.4, aqiMin: 301, aqiMax: 400 },
    { min: 350.5, max: 500.4, aqiMin: 401, aqiMax: 500 },
  ],
  pm10: [
    { min: 0, max: 54, aqiMin: 0, aqiMax: 50 },
    { min: 55, max: 154, aqiMin: 51, aqiMax: 100 },
    { min: 155, max: 254, aqiMin: 101, aqiMax: 150 },
    { min: 255, max: 354, aqiMin: 151, aqiMax: 200 },
    { min: 355, max: 424, aqiMin: 201, aqiMax: 300 },
    { min: 425, max: 504, aqiMin: 301, aqiMax: 400 },
    { min: 505, max: 604, aqiMin: 401, aqiMax: 500 },
  ],
  o3: [
    { min: 0, max: 54, aqiMin: 0, aqiMax: 50 },
    { min: 55, max: 70, aqiMin: 51, aqiMax: 100 },
    { min: 71, max: 85, aqiMin: 101, aqiMax: 150 },
    { min: 86, max: 105, aqiMin: 151, aqiMax: 200 },
    { min: 106, max: 200, aqiMin: 201, aqiMax: 300 },
  ],
  no2: [
    { min: 0, max: 53, aqiMin: 0, aqiMax: 50 },
    { min: 54, max: 100, aqiMin: 51, aqiMax: 100 },
    { min: 101, max: 360, aqiMin: 101, aqiMax: 150 },
    { min: 361, max: 649, aqiMin: 151, aqiMax: 200 },
    { min: 650, max: 1249, aqiMin: 201, aqiMax: 300 },
    { min: 1250, max: 2049, aqiMin: 301, aqiMax: 500 },
  ],
  so2: [
    { min: 0, max: 35, aqiMin: 0, aqiMax: 50 },
    { min: 36, max: 75, aqiMin: 51, aqiMax: 100 },
    { min: 76, max: 185, aqiMin: 101, aqiMax: 150 },
    { min: 186, max: 304, aqiMin: 151, aqiMax: 200 },
    { min: 305, max: 604, aqiMin: 201, aqiMax: 300 },
    { min: 605, max: 1004, aqiMin: 301, aqiMax: 500 },
  ],
  co: [
    { min: 0, max: 4.4, aqiMin: 0, aqiMax: 50 },
    { min: 4.5, max: 9.4, aqiMin: 51, aqiMax: 100 },
    { min: 9.5, max: 12.4, aqiMin: 101, aqiMax: 150 },
    { min: 12.5, max: 15.4, aqiMin: 151, aqiMax: 200 },
    { min: 15.5, max: 30.4, aqiMin: 201, aqiMax: 300 },
    { min: 30.5, max: 50.4, aqiMin: 301, aqiMax: 500 },
  ],
};

/**
 * Calculates the US-EPA Air Quality Index sub-index for a pollutant using
 * piecewise linear breakpoint interpolation.
 */
export function calculateAQI(pollutant: string, value: number): number {
  const key = pollutant.toLowerCase().replace(/[^a-z0-9]/g, '');
  const breakpoints = POLLUTANT_AQI_BREAKPOINTS[key];
  if (!breakpoints || !Number.isFinite(value) || value < 0) return 0;

  for (const bp of breakpoints) {
    if (value >= bp.min && value <= bp.max) {
      const aqi = ((bp.aqiMax - bp.aqiMin) / (bp.max - bp.min)) * (value - bp.min) + bp.aqiMin;
      return Math.round(aqi);
    }
  }

  // Handle concentrations between discrete EPA breakpoint steps or above the ceiling
  for (let i = 0; i < breakpoints.length - 1; i++) {
    if (value > breakpoints[i].max && value < breakpoints[i + 1].min) {
      return breakpoints[i].aqiMax;
    }
  }

  const highest = breakpoints[breakpoints.length - 1];
  if (value > highest.max) {
    return Math.min(500, Math.round(highest.aqiMax + (value - highest.max) * 0.5));
  }

  return 0;
}

/** Maps a numeric US-EPA AQI value to its official health category. */
export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

/** Returns the hex color token associated with an AQI category. */
export function getAQIColor(category: AQICategory): string {
  return AQI_CATEGORY_THEMES[category]?.hexColor || '#6B7280';
}

/** Returns the standard health advisory description for an AQI category. */
export function getAQIDescription(category: AQICategory): string {
  return AQI_CATEGORY_THEMES[category]?.description || 'Air quality status available.';
}

/**
 * Scans 24-hour forecast entries to identify the cleanest midday window for
 * ventilation/errands and the worst peak-smog inversion window.
 */
export function findSafeVentilationWindows(hourly: HourlyDataPoint[]): {
  bestWindow: string;
  bestAqi: number;
  worstWindow: string;
  worstAqi: number;
} {
  if (!hourly || hourly.length === 0) {
    return {
      bestWindow: '12:00 PM - 3:00 PM',
      bestAqi: 85,
      worstWindow: '8:00 PM - 8:00 AM (Winter Inversion)',
      worstAqi: 250,
    };
  }

  let minAqi = Infinity;
  let minIdx = 0;
  let maxAqi = -Infinity;
  let maxIdx = 0;

  hourly.forEach((point, idx) => {
    if (point.aqi < minAqi) {
      minAqi = point.aqi;
      minIdx = idx;
    }
    if (point.aqi > maxAqi) {
      maxAqi = point.aqi;
      maxIdx = idx;
    }
  });

  const bestHour = hourly[minIdx]?.hour || '2 PM';
  const worstHour = hourly[maxIdx]?.hour || '8 AM';

  return {
    bestWindow: `Around ${bestHour}`,
    bestAqi: minAqi,
    worstWindow: `Around ${worstHour}`,
    worstAqi: maxAqi,
  };
}
