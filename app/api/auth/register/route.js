import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/authSchema';
import { hashPassword, signJwtToken } from '@/lib/auth';
import { findUserByEmail, createUser } from '@/lib/dataService';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password, role } = validation.data;

    // Check duplicate
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      fullName,
      email,
      phone,
      password: passwordHash,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=145A46&color=ffffff`,
      isVerified: role === 'admin',
      status: 'active',
    });

    const token = signJwtToken({
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful! Welcome to PitchConnect.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}

