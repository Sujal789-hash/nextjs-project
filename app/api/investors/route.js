import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getInvestors, upsertInvestor } from '@/lib/dataService';
import { investorProfileSchema } from '@/lib/validations/authSchema';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const industry = searchParams.get('industry') || '';
    const stage = searchParams.get('stage') || '';
    const location = searchParams.get('location') || '';
    const minCheck = Number(searchParams.get('minCheck')) || 0;
    const maxCheck = Number(searchParams.get('maxCheck')) || 0;
    const featured = searchParams.get('featured');

    let investors = await getInvestors();

    if (search) {
      const q = search.toLowerCase();
      investors = investors.filter(
        (i) =>
          i.fullName?.toLowerCase().includes(q) ||
          i.organization?.toLowerCase().includes(q) ||
          i.biography?.toLowerCase().includes(q)
      );
    }

    if (industry && industry !== 'All') {
      investors = investors.filter((i) =>
        i.preferredIndustries?.some((ind) => ind.toLowerCase() === industry.toLowerCase())
      );
    }

    if (stage && stage !== 'All') {
      investors = investors.filter((i) =>
        i.preferredStages?.some((stg) => stg.toLowerCase() === stage.toLowerCase())
      );
    }

    if (location && location !== 'All') {
      investors = investors.filter((i) =>
        i.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minCheck > 0) {
      investors = investors.filter((i) => i.checkSizeMax >= minCheck);
    }

    if (maxCheck > 0) {
      investors = investors.filter((i) => i.checkSizeMin <= maxCheck);
    }

    if (featured === 'true') {
      investors = investors.filter((i) => i.isFeatured);
    }

    return NextResponse.json({ success: true, count: investors.length, investors });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'investor' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = investorProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await upsertInvestor(user.id, {
      ...validation.data,
      preferredIndustries: body.preferredIndustries || ['FinTech', 'AI & Machine Learning'],
      preferredStages: body.preferredStages || ['Seed', 'Series A'],
      portfolioCompanies: body.portfolioCompanies || [],
      availableMeetingSlots: body.availableMeetingSlots || [],
      contactPreferences: body.contactPreferences || {
        emailMeetingAlerts: true,
        acceptDirectPitches: true,
        preferredMeetingLength: 30,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Investor profile updated successfully',
      investor: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

