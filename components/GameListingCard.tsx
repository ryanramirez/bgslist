import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { starGameListing, unstarGameListing, hasUserStarredListing } from '@/lib/firestore';

type GameListingCardProps = {
  listingId: string;
  userId?: string; // Current user's ID (optional, if not logged in)
  title: string;
  description: string;
  imageUrl?: string;
  timeAgo: string;
  location: string;
  price?: number;
  tradeOnly?: boolean;
  type?: 'offering' | 'selling' | 'wanting';
};

export default function GameListingCard({ 
  listingId,
  userId,
  title, 
  description, 
  imageUrl, 
  timeAgo,
  location,
  price,
  tradeOnly = false,
  type = 'offering'
}: GameListingCardProps) {
  const hasImage = imageUrl && imageUrl.trim() !== '';
  const [isStarred, setIsStarred] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Check if the user has starred this listing
  useEffect(() => {
    const checkStarredStatus = async () => {
      if (!userId) return;
      
      try {
        const hasStarred = await hasUserStarredListing(listingId, userId);
        setIsStarred(hasStarred);
      } catch (error) {
        console.error('Error checking star status:', error);
      }
    };
    
    checkStarredStatus();
  }, [listingId, userId]);

  const toggleStar = async (e: React.MouseEvent) => {
    // Prevent navigation when clicking the star button
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId || isToggling) return;
    
    setIsToggling(true);
    
    try {
      if (isStarred) {
        // Unstar
        const success = await unstarGameListing(listingId, userId);
        if (success) {
          setIsStarred(false);
        }
      } else {
        // Star
        const success = await starGameListing(listingId, userId);
        if (success) {
          setIsStarred(true);
        }
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    } finally {
      setIsToggling(false);
    }
  };

  // Determine price display
  const showPrice = type === 'selling' && !tradeOnly;
  const priceDisplay = showPrice && price !== undefined 
    ? `$${price.toFixed(2)}` 
    : '';
  
  // Show trade badge for trade-only listings
  const showTradeBadge = tradeOnly;

  return (
    <Link href={`/listing/${listingId}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
        <div className="relative h-48 w-full">
          {hasImage ? (
            <Image 
              src={imageUrl} 
              alt={title} 
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          
          {/* Price and Trade Only indicators */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {priceDisplay && (
              <div className="bg-amber-500 text-white px-2 py-1 rounded-md font-semibold shadow-md">
                {priceDisplay}
              </div>
            )}
            
            {showTradeBadge && (
              <div className="bg-amber-500 text-white px-2 py-1 rounded-md font-semibold shadow-md">
                Trade welcome
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button 
              className={`transition-colors duration-300 ${isStarred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
              onClick={toggleStar}
              disabled={!userId || isToggling}
              title={userId ? (isStarred ? "Remove from favorites" : "Add to favorites") : "Sign in to star listings"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className={`w-6 h-6 ${isToggling ? 'animate-pulse' : ''}`}
                fill={isStarred ? "currentColor" : "none"}
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={isStarred ? 0 : 2} 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 mt-1">{description}</p>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>{timeAgo}</span>
            <span>{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 