import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/recommendations';
import { NEUTRAL_USER_PREFERENCES } from '@/lib/constants';
import { recommendationRequestSchema } from '@/lib/validation';
import { AQIData, UserContext } from '@/types';

/**
 * POST /api/recommendations
 * Validates telemetry + user profile payloads with Zod and returns Gemini-generated
 * (or fallback-generated) low-emission routines, indoor hacks, and alternatives.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = recommendationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request payload for recommendations',
          details: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
        },
        { status: 400 }
      );
    }

    const { aqiData: rawAqi, userContext: rawContext } = parsed.data;
    const normalizedAqiData: AQIData = {
      ...rawAqi,
      pollutants: rawAqi.pollutants.map((p) => ({
        ...p,
        description: p.description ?? '',
      })),
    };

    const normalizedUserContext: UserContext = {
      profile: rawContext.profile,
      location: rawContext.location || normalizedAqiData.city,
      preferences: {
        ...NEUTRAL_USER_PREFERENCES,
        ...(rawContext.preferences || {}),
      },
    };

    const recommendations = await generateRecommendations(normalizedAqiData, normalizedUserContext);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Recommendations API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
