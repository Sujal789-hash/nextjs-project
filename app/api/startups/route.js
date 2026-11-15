import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getStartups, upsertStartup } from '@/lib/dataService';
import { startupProfileSchema } from '@/lib/validations/authSchema';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const industry = searchParams.get('industry') || '';
    const stage = searchParams.get('stage') || '';
    const featured = searchParams.get('featured');

    let startups = await getStartups();

    if (search) {
      const q = search.toLowerCase();
      startups = startups.filter(
        (s) =>
          s.startupName?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.founderName?.toLowerCase().includes(q)
      );
    }

    if (industry && industry !== 'All') {
      startups = startups.filter((s) => s.industry === industry);
    }

    if (stage && stage !== 'All') {
      startups = startups.filter((s) => s.startupStage === stage);
    }

    if (featured === 'true') {
      startups = startups.filter((s) => s.isFeatured);
    }

    return NextResponse.json({ success: true, count: startups.length, startups });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'startup' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = startupProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await upsertStartup(user.id, validation.data);

    return NextResponse.json({
      success: true,
      message: 'Startup profile updated successfully',
      startup: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

