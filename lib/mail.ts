import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend(process.env.RESEND_API_KEY);

// Base URL for links (from .env)
const domain = process.env.NEXTAUTH_URL || 'http://localhost:3000';

/**
 * Generates a new verification token and saves it to the DB.
 */
export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found.');
  }

  // Delete any existing token for this user
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  // Create the new token
  const verificationToken = await prisma.emailVerificationToken.create({
    data: {
      token,
      expires,
      userId: user.id,
    },
  });

  return verificationToken;
}

/**
 * Sends the verification email using Resend.
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${domain}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Auth Demo <onboarding@resend.dev>', // Use your verified domain
      to: [email],
      subject: 'Verify your email address',
      // We can use a simple HTML string or React component
      html: `
        <h1>Welcome!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('EMAIL_SEND_ERROR', error);
    throw new Error('Failed to send verification email.');
  }
}