import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import AdCardWrapper from '@/components/AdCardWrapper';

export default async function HomePage() {
  const session = await auth();
  const ads = await prisma.ad.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Latest Posts</h1>
          <p className="text-gray-600 text-sm mt-1">
            Discover amazing deals from our community
          </p>
        </div>

        {/* Ad Feed */}
        <div className="space-y-6">
          {ads.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share something amazing!</p>
            </div>
          )}

          {ads.map((ad) => (
            <AdCardWrapper
              key={ad.id}
              ad={ad}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}