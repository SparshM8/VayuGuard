import { NextRequest, NextResponse } from 'next/server';
import { fetchAQIData, fetchAQIByCoordinates, searchCities, getAQIColor, getAQIDescription } from '@/lib/aqidata';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  const country = searchParams.get('country') || 'IN';
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const action = searchParams.get('action');

  try {
    // City autocomplete search
    if (action === 'search') {
      const query = searchParams.get('q') || '';
      const sanitized = query.replace(/[^\w\s-]/gi, '').slice(0, 50);
      const cities = await searchCities(sanitized);
      return NextResponse.json({ cities });
    }

    // Geolocation lookup by coordinates (HTML5 Geolocation / "Use My Location")
    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return NextResponse.json(
          { error: 'Invalid coordinate bounds. Latitude must be -90 to 90, Longitude -180 to 180.' },
          { status: 400 }
        );
      }

      const cityName = searchParams.get('cityName') || undefined;
      const countryName = searchParams.get('countryName') || undefined;
      const aqiData = await fetchAQIByCoordinates(latitude, longitude, cityName, countryName);

      return NextResponse.json({
        ...aqiData,
        color: getAQIColor(aqiData.category),
        description: getAQIDescription(aqiData.category),
      });
    }

    // Lookup by city name
    if (!city || city.trim().length === 0) {
      return NextResponse.json(
        { error: 'City parameter is required (e.g., ?city=Delhi)' },
        { status: 400 }
      );
    }

    const sanitizedCity = city.trim().slice(0, 80);
    const sanitizedCountry = country.trim().slice(0, 10);
    const aqiData = await fetchAQIData(sanitizedCity, sanitizedCountry);

    return NextResponse.json({
      ...aqiData,
      color: getAQIColor(aqiData.category),
      description: getAQIDescription(aqiData.category),
    });
  } catch (error) {
    console.error('AQI API route error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch air quality data';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
