import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return new NextResponse('Missing token', { status: 400 });
    }

    // Find the token in our custom model
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return new NextResponse('Invalid or expired token', { status: 400 });
    }

    // Check if expired
    const hasExpired = new Date(verificationToken.expires) < new Date();
    if (hasExpired) {
      return new NextResponse('Invalid or expired token', { status: 400 });
    }

    // Token is valid. Update the user.
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: new Date(),
        // We must also set the email here again because it's part of the
        // unique key with emailVerified for the adapter.
        email: (await prisma.user.findUnique({where: {id: verificationToken.userId}}))?.email
      },
    });

    // Delete the used token
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json(
      { message: 'Email verified successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('VERIFICATION_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}