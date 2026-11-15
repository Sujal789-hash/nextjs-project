import { NextResponse } from 'next/server';
import { getInvestorById } from '@/lib/dataService';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const investor = await getInvestorById(id);

    if (!investor) {
      return NextResponse.json({ success: false, message: 'Investor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      investor,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

