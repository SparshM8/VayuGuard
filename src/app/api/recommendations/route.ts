import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/recommendations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aqiData, userContext } = body;

    if (!aqiData || typeof aqiData.aqi !== 'number' || !aqiData.category) {
      return NextResponse.json(
        { error: 'Valid aqiData object with numeric AQI and category is required' },
        { status: 400 }
      );
    }

    if (!userContext || !userContext.profile) {
      return NextResponse.json(
        { error: 'Valid userContext with user profile is required' },
        { status: 400 }
      );
    }

    const recommendations = await generateRecommendations(aqiData, userContext);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Recommendations API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
