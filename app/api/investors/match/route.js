import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getInvestors, getStartupByUserId, getStartupById } from '@/lib/dataService';
import { calculateMatchScore } from '@/lib/matching';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedStartupId = searchParams.get('startupId');

    const authUser = getUserFromRequest(request);
    let startup = null;

    if (requestedStartupId) {
      startup = await getStartupById(requestedStartupId);
    } else if (authUser) {
      startup = await getStartupByUserId(authUser.id);
    }

    const allInvestors = await getInvestors();

    const matches = allInvestors.map((investor) => {
      const matchResult = calculateMatchScore(startup, investor);
      return {
        investor,
        matchPercentage: matchResult.score,
        reasons: matchResult.reasons,
        matchingPreferences: matchResult.matchingPreferences,
        suggestedAction: matchResult.suggestedAction,
      };
    });

    // Sort descending by match percentage
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return NextResponse.json({
      success: true,
      startupUsed: startup
        ? {
            id: startup._id,
            name: startup.startupName,
            industry: startup.industry,
            stage: startup.startupStage,
            fundingRequired: startup.fundingRequired,
          }
        : null,
      matches,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

