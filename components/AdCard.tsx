'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    subCategory: string;
    mediaUrls: string[];
    aiImageUrl: string | null;
    aiHashtags: string[];
    createdAt: Date;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

// ... (formatPrice and formatTimeAgo functions are unchanged)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  
  return Math.floor(seconds) + 's ago';
};
// ...

const AdCard: React.FC<AdCardProps> = ({ ad, currentUserId, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isOwner = currentUserId === ad.author.id;
  const images = ad.aiImageUrl ? [ad.aiImageUrl, ...ad.mediaUrls] : ad.mediaUrls;
  const hasMultipleImages = images.length > 1;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {/* ... (Author info) ... */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {ad.author.image ? (
              <Image
                src={ad.author.image}
                alt={ad.author.name || 'User'}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              ad.author.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {ad.author.name || 'Anonymous'}
            </h3>
            <p 
              className="text-xs text-gray-500 flex items-center gap-1"
              suppressHydrationWarning={true}
            >
              {formatTimeAgo(ad.createdAt)} · 
              <span className="text-indigo-600">{ad.category}</span>
            </p>
          </div>
        </div>
        
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
                >
                  <button
                    // --- THIS IS THE FIX ---
                    // We stop the event propagation here, on the button itself.
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(ad.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ... (Rest of the AdCard component is unchanged) ... */}
      {/* Content */}
      <div className="px-4 pb-3">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{ad.title}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {ad.description}
        </p>
        
        {/* Hashtags */}
        {ad.aiHashtags && ad.aiHashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {ad.aiHashtags.slice(0, 5).map((tag, idx) => (
              <span key={idx} className="text-xs text-indigo-600 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image/Media */}
      {images.length > 0 && (
        <div className="relative bg-black">
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            <Image
              src={images[currentImageIndex]}
              alt={ad.title}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              style={{ objectFit: 'contain' }}
              className="absolute inset-0"
            />
          </div>
          
          {hasMultipleImages && (
            <>
              {/* Navigation Buttons */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Price & Actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-indigo-600">
            {formatPrice(ad.price)}
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {ad.subCategory.replace(/_/g, ' ')}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Message
          </button>
          <button className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;