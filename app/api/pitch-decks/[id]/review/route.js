import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import {
  getStartupById,
  getInvestorByUserId,
  addReview,
  createNotification,
} from '@/lib/dataService';

export async function POST(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'investor') {
      return NextResponse.json(
        { success: false, message: 'Only registered investors can submit pitch reviews' },
        { status: 403 }
      );
    }

    const investor = await getInvestorByUserId(user.id);
    if (!investor) {
      return NextResponse.json(
        { success: false, message: 'Investor profile not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      startupId,
      businessModelRating,
      marketOpportunityRating,
      productInnovationRating,
      financialProjectionsRating,
      overallRating,
      writtenFeedback,
      interestLevel,
    } = body;

    if (!startupId || !writtenFeedback) {
      return NextResponse.json(
        { success: false, message: 'Startup ID and written feedback are required' },
        { status: 400 }
      );
    }

    const startup = await getStartupById(startupId);
    if (!startup) {
      return NextResponse.json(
        { success: false, message: 'Target startup not found' },
        { status: 404 }
      );
    }

    const review = await addReview({
      startupId,
      investorId: investor._id,
      pitchDeckId: params.id !== 'general' ? params.id : null,
      businessModelRating: Number(businessModelRating) || 4,
      marketOpportunityRating: Number(marketOpportunityRating) || 4,
      productInnovationRating: Number(productInnovationRating) || 4,
      financialProjectionsRating: Number(financialProjectionsRating) || 4,
      overallRating: Number(overallRating) || 4,
      writtenFeedback,
      interestLevel: interestLevel || 'Moderate',
    });

    // Send notification to startup founder
    await createNotification({
      userId: startup.userId,
      title: 'New Pitch Deck Review',
      message: `${investor.fullName} from ${investor.organization} reviewed your pitch deck (${review.overallRating}/5 stars).`,
      type: 'feedback',
      link: '/pitch-decks',
    });

    return NextResponse.json({
      success: true,
      message: 'Review and rating submitted successfully',
      review,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

