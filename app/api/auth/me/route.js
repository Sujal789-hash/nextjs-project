import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { findUserById, getStartupByUserId, getInvestorByUserId } from '@/lib/dataService';

export async function GET(request) {
  try {
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await findUserById(authUser.id);
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 404 });
    }

    let profile = null;
    if (user.role === 'startup') {
      profile = await getStartupByUserId(user._id);
    } else if (user.role === 'investor') {
      profile = await getInvestorByUserId(user._id);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        status: user.status,
      },
      profile,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

