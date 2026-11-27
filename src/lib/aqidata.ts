import { AQIData, CitySearchResult, HourlyDataPoint, Pollutant } from '@/types';
import {
  calculateAQI,
  findSafeVentilationWindows,
  getAQICategory,
  getAQIColor,
  getAQIDescription,
} from './aqiMath';

export {
  calculateAQI,
  findSafeVentilationWindows,
  getAQICategory,
  getAQIColor,
  getAQIDescription,
};

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

interface GeocodingRawItem {
  name: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  latitude: number;
  longitude: number;
}

interface OpenMeteoCurrentRaw {
  time?: string;
  pm2_5?: number;
  pm10?: number;
  carbon_monoxide?: number;
  nitrogen_dioxide?: number;
  sulphur_dioxide?: number;
  ozone?: number;
  us_aqi?: number;
}

interface OpenMeteoHourlyRaw {
  time?: string[];
  pm2_5?: number[];
  pm10?: number[];
  us_aqi?: number[];
}

interface PollutantSpec {
  name: string;
  code: string;
  value: number;
  unit: string;
  description: string;
}

function buildPollutantMetrics(current: OpenMeteoCurrentRaw): {
  pollutants: Pollutant[];
  overallAQI: number;
  dominantPollutant: string;
  pm25Value: number;
} {
  const pm25Value = Number(current.pm2_5 ?? 0);
  const pm10Value = Number(current.pm10 ?? 0);
  const coValueMg = Number((Number(current.carbon_monoxide ?? 0) / 1000).toFixed(2));
  const no2Value = Number(current.nitrogen_dioxide ?? 0);
  const so2Value = Number(current.sulphur_dioxide ?? 0);
  const o3Value = Number(current.ozone ?? 0);

  const specs: PollutantSpec[] = [
    {
      name: 'PM2.5',
      code: 'pm25',
      value: Number(pm25Value.toFixed(1)),
      unit: 'μg/m³',
      description: 'Fine particulate matter that penetrates deep into lungs and bloodstream',
    },
    {
      name: 'PM10',
      code: 'pm10',
      value: Number(pm10Value.toFixed(1)),
      unit: 'μg/m³',
      description: 'Inhalable coarse dust, road dust, and pollen',
    },
    {
      name: 'NO₂',
      code: 'no2',
      value: Number(no2Value.toFixed(1)),
      unit: 'μg/m³',
      description: 'Nitrogen dioxide from vehicular emissions and industrial combustion',
    },
    {
      name: 'O₃',
      code: 'o3',
      value: Number(o3Value.toFixed(1)),
      unit: 'μg/m³',
      description: 'Ground-level ozone formed by smog photochemistry',
    },
    {
      name: 'SO₂',
      code: 'so2',
      value: Number(so2Value.toFixed(1)),
      unit: 'μg/m³',
      description: 'Sulfur dioxide from thermal power plants and fuel combustion',
    },
    {
      name: 'CO',
      code: 'co',
      value: coValueMg,
      unit: 'mg/m³',
      description: 'Carbon monoxide from incomplete vehicular combustion',
    },
  ];

  const pollutants: Pollutant[] = specs.map((spec) => ({
    ...spec,
    aqi: calculateAQI(spec.code, spec.value),
  }));

  const sortedByAqi = [...pollutants].sort((a, b) => b.aqi - a.aqi);
  const computedMaxAQI = sortedByAqi[0]?.aqi ?? 0;
  const reportedUsAqi = current.us_aqi ? Math.round(Number(current.us_aqi)) : 0;

  return {
    pollutants,
    overallAQI: Math.max(computedMaxAQI, reportedUsAqi),
    dominantPollutant: sortedByAqi[0]?.name ?? 'PM2.5',
    pm25Value,
  };
}

function buildHourlyForecast(hourly?: OpenMeteoHourlyRaw): HourlyDataPoint[] {
  if (!hourly || !Array.isArray(hourly.time)) return [];

  const { time: times, pm2_5: hourlyPm25 = [], pm10: hourlyPm10 = [], us_aqi: hourlyUsAqi = [] } = hourly;
  const cutoffMs = Date.now() - 3_600_000;
  const foundIdx = times.findIndex((t) => new Date(t).getTime() >= cutoffMs);
  const startIndex = foundIdx >= 0 ? foundIdx : 0;

  return times.slice(startIndex, startIndex + 24).map((isoTime, offset) => {
    const idx = startIndex + offset;
    const pm25 = Number((hourlyPm25[idx] || 0).toFixed(1));
    const rawAqi = hourlyUsAqi[idx] || calculateAQI('pm25', pm25);
    const aqiVal = Math.round(rawAqi);

    return {
      time: isoTime,
      hour: new Date(isoTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      aqi: aqiVal,
      pm25,
      pm10: Number((hourlyPm10[idx] || 0).toFixed(1)),
      category: getAQICategory(aqiVal),
    };
  });
}

/**
 * Resolves a city name (and optional country code filter) to geographic coordinates
 * via Open-Meteo's Geocoding API.
 */
export async function geocodeCity(
  city: string,
  country?: string
): Promise<{
  name: string;
  admin1?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}> {
  const query = encodeURIComponent(city.trim());
  const url = `${GEOCODING_BASE_URL}/search?name=${query}&count=5&language=en&format=json`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`Geocoding service unavailable (status ${res.status})`);
  }

  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found. Please verify spelling or try a nearby major city.`);
  }

  const results: GeocodingRawItem[] = data.results;
  const countryMatch = country
    ? results.find((r) => r.country_code?.toLowerCase() === country.toLowerCase())
    : undefined;
  const selected = countryMatch || results[0];

  return {
    name: selected.name,
    admin1: selected.admin1,
    country: selected.country || (country ? country.toUpperCase() : 'Global'),
    countryCode: selected.country_code?.toUpperCase() || 'IN',
    latitude: selected.latitude,
    longitude: selected.longitude,
  };
}

/** Fetches live air quality telemetry and 24-hour forecast for a named city. */
export async function fetchAQIData(city: string, country: string = 'IN'): Promise<AQIData> {
  const geo = await geocodeCity(city, country);
  return fetchAQIByCoordinates(geo.latitude, geo.longitude, geo.name, geo.country, geo.admin1);
}

/** Fetches live air quality telemetry and 24-hour forecast for explicit coordinates. */
export async function fetchAQIByCoordinates(
  latitude: number,
  longitude: number,
  cityName?: string,
  countryName?: string,
  regionName?: string
): Promise<AQIData> {
  const url =
    `${AIR_QUALITY_BASE_URL}/air-quality?latitude=${latitude}&longitude=${longitude}` +
    '&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi' +
    '&hourly=pm2_5,pm10,us_aqi&forecast_days=2&timezone=auto';

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Air quality service returned status ${res.status}`);
  }

  const data = await res.json();
  const current: OpenMeteoCurrentRaw | undefined = data.current;
  if (!current) {
    throw new Error('No current air quality measurements available for this location.');
  }

  const { pollutants, overallAQI, dominantPollutant, pm25Value } = buildPollutantMetrics(current);
  const category = getAQICategory(overallAQI);
  const resolvedCountry = countryName || 'Earth';

  return {
    location: regionName ? `${regionName}, ${resolvedCountry}` : resolvedCountry,
    city: cityName || 'Current Location',
    country: resolvedCountry,
    coordinates: {
      latitude: Number(latitude.toFixed(4)),
      longitude: Number(longitude.toFixed(4)),
    },
    aqi: overallAQI,
    category,
    pollutants,
    timestamp: current.time ? new Date(current.time).toISOString() : new Date().toISOString(),
    source: 'Open-Meteo Air Quality Engine (CAMS & CPCB Ground Reference)',
    sourceUrl: 'https://open-meteo.com/en/docs/air-quality-api',
    hourlyForecast: buildHourlyForecast(data.hourly),
    dominantPollutant,
    isSmogSevere: overallAQI >= 200 || pm25Value >= 120,
  };
}

/** Searches global cities for autocomplete suggestions. Returns an empty array on failure. */
export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return (data.results as GeocodingRawItem[]).map((r) => ({
      city: r.name,
      state: r.admin1,
      country: r.country || '',
      countryCode: r.country_code?.toUpperCase() || '',
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}
