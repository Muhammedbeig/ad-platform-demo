import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';
import {
  generateVerificationToken,
  sendVerificationEmail,
} from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    if (password.length < 6) {
      return new NextResponse('Password must be at least 6 characters', {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return new NextResponse('User with this email already exists', {
        status: 409,
      });
    }

    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
      },
    });

    // --- DEBUGGING ---
    console.log('User created:', user.id);
    try {
      console.log('Generating token...');
      const verificationToken = await generateVerificationToken(user.email!);
      console.log('Token generated:', verificationToken.token);
      console.log('Sending email...');
      await sendVerificationEmail(user.email!, verificationToken.token);
      console.log('Email sent successfully.');
    } catch (emailError) {
      // This will show the error in your terminal
      console.error('VERIFICATION_EMAIL_ERROR', emailError);
    }
    // --- END DEBUGGING ---

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        message: 'Account created. Please check your email to verify.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('REGISTRATION_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}