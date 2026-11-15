import { NextResponse } from 'next/server';
import { getStartupById, getPitchDecks, getReviews } from '@/lib/dataService';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const startup = await getStartupById(id);

    if (!startup) {
      return NextResponse.json({ success: false, message: 'Startup not found' }, { status: 404 });
    }

    const pitchDecks = await getPitchDecks(startup._id);
    const reviews = await getReviews(startup._id);

    return NextResponse.json({
      success: true,
      startup,
      pitchDecks,
      reviews,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

