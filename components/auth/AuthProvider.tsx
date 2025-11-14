"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth'; // Import the Session type

// Define the props interface
interface AuthProviderProps {
  children: React.ReactNode;
  session: Session | null; // The session can be null
}

/**
 * This is a client-side component that wraps the app in NextAuth's SessionProvider.
 * Your root layout (a server component) will fetch the session and pass it here.
 */
export default function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}