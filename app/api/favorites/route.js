import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getFavorites, toggleFavorite } from '@/lib/dataService';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, favorites: [] });
    }

    const favorites = await getFavorites(user.id);
    return NextResponse.json({ success: true, favorites });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Please login to save favorites' }, { status: 401 });
    }

    const body = await request.json();
    const { targetType, targetId } = body;

    if (!targetType || !targetId) {
      return NextResponse.json({ success: false, message: 'Invalid target details' }, { status: 400 });
    }

    const result = await toggleFavorite(user.id, targetType, targetId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

