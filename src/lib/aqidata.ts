import { AQIData, Pollutant, AQICategory, HourlyDataPoint, CitySearchResult } from '@/types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

// EPA Standard Breakpoints for AQI calculation
const POLLUTANT_AQI_BREAKPOINTS: Record<string, Array<{ min: number; max: number; aqiMin: number; aqiMax: number }>> = {
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

interface GeocodingRawItem {
  name: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  latitude: number;
  longitude: number;
}

export function calculateAQI(pollutant: string, value: number): number {
  const key = pollutant.toLowerCase().replace(/[^a-z0-9]/g, '');
  const breakpoints = POLLUTANT_AQI_BREAKPOINTS[key];
  if (!breakpoints || value < 0) return 0;

  for (const bp of breakpoints) {
    if (value >= bp.min && value <= bp.max) {
      const aqi = ((bp.aqiMax - bp.aqiMin) / (bp.max - bp.min)) * (value - bp.min) + bp.aqiMin;
      return Math.round(aqi);
    }
  }

  // If value exceeds highest breakpoint
  const highest = breakpoints[breakpoints.length - 1];
  if (value > highest.max) {
    return Math.min(500, Math.round(highest.aqiMax + ((value - highest.max) * 0.5)));
  }

  return 0;
}

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAQIColor(category: AQICategory): string {
  const colors: Record<AQICategory, string> = {
    'Good': '#10B981',
    'Moderate': '#F59E0B',
    'Unhealthy for Sensitive Groups': '#F97316',
    'Unhealthy': '#EF4444',
    'Very Unhealthy': '#8B5CF6',
    'Hazardous': '#881337',
  };
  return colors[category] || '#6B7280';
}

export function getAQIDescription(category: AQICategory): string {
  const descriptions: Record<AQICategory, string> = {
    'Good': 'Air quality is satisfactory, and air pollution poses little or no risk to health.',
    'Moderate': 'Air quality is acceptable. Sensitive individuals may experience mild respiratory symptoms.',
    'Unhealthy for Sensitive Groups': 'Children, elderly, and people with lung or heart disease are at greater risk of health effects.',
    'Unhealthy': 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.',
    'Very Unhealthy': 'Health alert: Serious risk of health effects increased for the entire population. Avoid prolonged outdoor exertion.',
    'Hazardous': 'Emergency conditions: The entire population is likely to experience severe respiratory distress. Stay strictly indoors.',
  };
  return descriptions[category] || 'Air quality status available.';
}

export async function geocodeCity(city: string, country?: string): Promise<{
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
    headers: { 'Accept': 'application/json' },
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
  let selected = results[0];
  if (country) {
    const matched = results.find(
      (r) => r.country_code?.toLowerCase() === country.toLowerCase()
    );
    if (matched) selected = matched;
  }

  return {
    name: selected.name,
    admin1: selected.admin1,
    country: selected.country || (country ? country.toUpperCase() : 'Global'),
    countryCode: selected.country_code?.toUpperCase() || 'IN',
    latitude: selected.latitude,
    longitude: selected.longitude,
  };
}

export async function fetchAQIData(city: string, country: string = 'IN'): Promise<AQIData> {
  const geo = await geocodeCity(city, country);
  return await fetchAQIByCoordinates(
    geo.latitude, 
    geo.longitude, 
    geo.name, 
    geo.country, 
    geo.admin1
  );
}

export async function fetchAQIByCoordinates(
  latitude: number,
  longitude: number,
  cityName?: string,
  countryName?: string,
  regionName?: string
): Promise<AQIData> {
  const url = `${AIR_QUALITY_BASE_URL}/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi&hourly=pm2_5,pm10,us_aqi&forecast_days=2&timezone=auto`;

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Air quality service returned status ${res.status}`);
  }

  const data = await res.json();
  const current = data.current;
  if (!current) {
    throw new Error('No current air quality measurements available for this location.');
  }

  // Calculate pollutant sub-indices
  const pm25Value = Number(current.pm2_5 ?? 0);
  const pm10Value = Number(current.pm10 ?? 0);
  const coValueRaw = Number(current.carbon_monoxide ?? 0);
  const coValueMg = Number((coValueRaw / 1000).toFixed(2));
  const no2Value = Number(current.nitrogen_dioxide ?? 0);
  const so2Value = Number(current.sulphur_dioxide ?? 0);
  const o3Value = Number(current.ozone ?? 0);

  const pm25AQI = calculateAQI('pm25', pm25Value);
  const pm10AQI = calculateAQI('pm10', pm10Value);
  const coAQI = calculateAQI('co', coValueMg);
  const no2AQI = calculateAQI('no2', no2Value);
  const so2AQI = calculateAQI('so2', so2Value);
  const o3AQI = calculateAQI('o3', o3Value);

  // Model-calculated US AQI or maximum sub-index
  const computedMaxAQI = Math.max(pm25AQI, pm10AQI, no2AQI, so2AQI, o3AQI, coAQI);
  const reportedUsAqi = current.us_aqi ? Math.round(Number(current.us_aqi)) : 0;
  const overallAQI = Math.max(computedMaxAQI, reportedUsAqi);
  const category = getAQICategory(overallAQI);

  // Determine dominant pollutant
  const subindices = [
    { name: 'PM2.5', aqi: pm25AQI },
    { name: 'PM10', aqi: pm10AQI },
    { name: 'NO₂', aqi: no2AQI },
    { name: 'O₃', aqi: o3AQI },
    { name: 'SO₂', aqi: so2AQI },
    { name: 'CO', aqi: coAQI },
  ];
  subindices.sort((a, b) => b.aqi - a.aqi);
  const dominantPollutant = subindices[0].name;

  const pollutants: Pollutant[] = [
    {
      name: 'PM2.5',
      code: 'pm25',
      value: Number(pm25Value.toFixed(1)),
      unit: 'μg/m³',
      aqi: pm25AQI,
      description: 'Fine particulate matter that penetrates deep into lungs and bloodstream',
    },
    {
      name: 'PM10',
      code: 'pm10',
      value: Number(pm10Value.toFixed(1)),
      unit: 'μg/m³',
      aqi: pm10AQI,
      description: 'Inhalable coarse dust, road dust, and pollen',
    },
    {
      name: 'NO₂',
      code: 'no2',
      value: Number(no2Value.toFixed(1)),
      unit: 'μg/m³',
      aqi: no2AQI,
      description: 'Nitrogen dioxide from vehicular emissions and industrial combustion',
    },
    {
      name: 'O₃',
      code: 'o3',
      value: Number(o3Value.toFixed(1)),
      unit: 'μg/m³',
      aqi: o3AQI,
      description: 'Ground-level ozone formed by smog photochemistry',
    },
    {
      name: 'SO₂',
      code: 'so2',
      value: Number(so2Value.toFixed(1)),
      unit: 'μg/m³',
      aqi: so2AQI,
      description: 'Sulfur dioxide from thermal power plants and fuel combustion',
    },
    {
      name: 'CO',
      code: 'co',
      value: coValueMg,
      unit: 'mg/m³',
      aqi: coAQI,
      description: 'Carbon monoxide from incomplete vehicular combustion',
    },
  ];

  // Parse hourly forecast for safe window prediction
  const hourlyForecast: HourlyDataPoint[] = [];
  if (data.hourly && Array.isArray(data.hourly.time)) {
    const times: string[] = data.hourly.time;
    const hourlyPm25: number[] = data.hourly.pm2_5 || [];
    const hourlyPm10: number[] = data.hourly.pm10 || [];
    const hourlyUsAqi: number[] = data.hourly.us_aqi || [];

    const nowIso = new Date().toISOString();
    let startIndex = 0;
    const foundIdx = times.findIndex(t => new Date(t).getTime() >= new Date(nowIso).getTime() - 3600000);
    if (foundIdx >= 0) startIndex = foundIdx;

    const sliceTimes = times.slice(startIndex, startIndex + 24);
    for (let i = 0; i < sliceTimes.length; i++) {
      const idx = startIndex + i;
      const rawAqi = hourlyUsAqi[idx] || calculateAQI('pm25', hourlyPm25[idx] || 0);
      const aqiVal = Math.round(rawAqi);
      const dateObj = new Date(sliceTimes[i]);
      const hourStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

      hourlyForecast.push({
        time: sliceTimes[i],
        hour: hourStr,
        aqi: aqiVal,
        pm25: Number((hourlyPm25[idx] || 0).toFixed(1)),
        pm10: Number((hourlyPm10[idx] || 0).toFixed(1)),
        category: getAQICategory(aqiVal),
      });
    }
  }

  const resolvedCity = cityName || 'Current Location';
  const resolvedCountry = countryName || 'Earth';
  const locationLabel = regionName ? `${regionName}, ${resolvedCountry}` : resolvedCountry;

  return {
    location: locationLabel,
    city: resolvedCity,
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
    hourlyForecast,
    dominantPollutant,
    isSmogSevere: overallAQI >= 200 || pm25Value >= 120,
  };
}

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    const rawResults: GeocodingRawItem[] = data.results;
    return rawResults.map((r) => ({
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

  hourly.forEach((h, idx) => {
    if (h.aqi < minAqi) {
      minAqi = h.aqi;
      minIdx = idx;
    }
    if (h.aqi > maxAqi) {
      maxAqi = h.aqi;
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
