'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdCard from './AdCard';

interface AdCardWrapperProps {
  ad: any;
  currentUserId?: string;
}

const AdCardWrapper: React.FC<AdCardWrapperProps> = ({ ad, currentUserId }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    // --- DEBUGGING: Check if this function is called ---
    console.log("handleDelete called with id:", id);

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      console.log("User cancelled deletion.");
      return;
    }

    // --- DEBUGGING: Check if confirmation passed ---
    console.log("User confirmed deletion. Sending request...");
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log("Post deleted successfully.");
        router.refresh();
      } else {
        const data = await res.json();
        console.error("Failed to delete post:", data.error);
        alert(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the post');
    }

    setIsDeleting(false);
  };

  if (isDeleting) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Deleting post...</p>
      </div>
    );
  }

  return (
    <AdCard
      ad={ad}
      currentUserId={currentUserId}
      onDelete={handleDelete}
    />
);
};

export default AdCardWrapper;