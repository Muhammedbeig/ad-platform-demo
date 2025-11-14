import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';
import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          // Return null - this will show generic "CredentialsSignin" error
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          // Scenario 1: User does not exist
          if (!user) {
            // Return null - error will be handled on client
            return null;
          }

          // Handle users who signed up via OAuth (e.g., Google)
          if (!user.passwordHash) {
            // Return null - we'll handle this on the client side
            return null;
          }

          // Scenario 2: Email not verified (CHECKED FIRST)
          if (!user.emailVerified) {
            // Return null - we'll handle this on the client side
            return null;
          }

          // Check password (CHECKED SECOND)
          const isValidPassword = await compare(password, user.passwordHash);
          if (!isValidPassword) {
            // Return null - wrong password
            return null;
          }

          // Success - return user object
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    // Google Provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);