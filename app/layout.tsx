import React from 'react';
import { auth } from '@/lib/auth';
import AuthProvider from '@/components/auth/AuthProvider';
import Header from '@/components/Header';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  // This type was 'React.React.Node' 
  // It is now corrected to 'React.ReactNode'
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider session={session}>
          <Header /> 
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}