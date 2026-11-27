import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAQIByCoordinates,
  fetchAQIData,
  getAQIColor,
  getAQIDescription,
  searchCities,
} from '@/lib/aqidata';
import { AppError } from '@/lib/errors';
import { aqiQuerySchema } from '@/lib/validation';
import { AQIData } from '@/types';

function formatAQIResponse(aqiData: AQIData) {
  return NextResponse.json({
    ...aqiData,
    color: getAQIColor(aqiData.category),
    description: getAQIDescription(aqiData.category),
  });
}

/**
 * GET /api/aqidata
 * Supports city autocomplete (`?action=search&q=...`), GPS coordinate lookup (`?lat=...&lon=...`),
 * and named city lookup (`?city=...&country=...`).
 */
export async function GET(request: NextRequest) {
  const rawParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = aqiQuerySchema.safeParse(rawParams);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters.',
        details: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      },
      { status: 400 }
    );
  }

  const { action, q, city, country, lat, lon, cityName, countryName } = parsed.data;

  try {
    if (action === 'search') {
      const sanitized = (q || '').replace(/[^\w\s-]/gi, '').slice(0, 50);
      const cities = await searchCities(sanitized);
      return NextResponse.json({ cities });
    }

    if (lat !== undefined && lon !== undefined) {
      const aqiData = await fetchAQIByCoordinates(lat, lon, cityName, countryName);
      return formatAQIResponse(aqiData);
    }

    if (!city) {
      return NextResponse.json(
        { error: 'Either a city name (?city=Delhi) or coordinates (?lat=...&lon=...) are required.' },
        { status: 400 }
      );
    }

    const aqiData = await fetchAQIData(city, country);
    return formatAQIResponse(aqiData);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error('AQI API route unexpected error:', error);
    return NextResponse.json(
      { error: 'Unable to fetch air quality data at the moment. Please try again.' },
      { status: 500 }
    );
  }
}
