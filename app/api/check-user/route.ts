import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter your email and password.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Scenario 1: User does not exist
    if (!user) {
      return NextResponse.json(
        { error: 'No user found! You need to Sign Up!' },
        { status: 404 }
      );
    }

    // Handle users who signed up via OAuth (e.g., Google)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'This account was created with Google. Sign in with Google.' },
        { status: 400 }
      );
    }

    // Scenario 2: Email not verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Email not verified! Check your inbox.' },
        { status: 403 }
      );
    }

    // Check password
    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password! Try again.' },
        { status: 401 }
      );
    }

    // All checks passed
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}