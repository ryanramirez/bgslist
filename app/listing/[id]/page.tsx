'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { getGameListing, starGameListing, unstarGameListing, hasUserStarredListing } from '@/lib/firestore';
import { GameListing } from '@/lib/models';
import { getTimeAgo } from '@/lib/utils';

export default function ListingDetail() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState<GameListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEmail, setShowEmail] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const listingId = params.id as string;
        const listingData = await getGameListing(listingId);
        
        if (listingData) {
          setListing(listingData);
          
          // Check if user has starred this listing
          if (user) {
            const hasStarred = await hasUserStarredListing(listingId, user.uid);
            setIsStarred(hasStarred);
          }
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load the listing. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
  }, [params.id, user]);
  
  const toggleStar = async () => {
    if (!user || !listing || isToggling) return;
    
    setIsToggling(true);
    
    try {
      if (isStarred) {
        // Unstar
        const success = await unstarGameListing(listing.id, user.uid);
        if (success) {
          setIsStarred(false);
          // Update local listing star count
          setListing(prev => prev ? {
            ...prev,
            starCount: (prev.starCount || 1) - 1
          } : null);
        }
      } else {
        // Star
        const success = await starGameListing(listing.id, user.uid);
        if (success) {
          setIsStarred(true);
          // Update local listing star count
          setListing(prev => prev ? {
            ...prev,
            starCount: (prev.starCount || 0) + 1
          } : null);
        }
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    } finally {
      setIsToggling(false);
    }
  };
  
  const copyToClipboard = async (text: string, setStateFn: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      await navigator.clipboard.writeText(text);
      setStateFn(true);
      setTimeout(() => setStateFn(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const copyEmail = () => {
    if (listing?.userEmail) {
      copyToClipboard(listing.userEmail, setEmailCopied);
    }
  };
  
  const copyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    copyToClipboard(url, setLinkCopied);
  };
  
  const handlePrevImage = () => {
    if (!listing?.imageUrls || listing.imageUrls.length <= 1) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? listing.imageUrls!.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextImage = () => {
    if (!listing?.imageUrls || listing.imageUrls.length <= 1) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === listing.imageUrls!.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </main>
    );
  }
  
  if (error || !listing) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {error || 'Listing not found'}
              </h2>
              <button
                onClick={() => router.back()}
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  const hasImages = listing.imageUrls && listing.imageUrls.length > 0;
  const currentImage = hasImages && listing.imageUrls ? listing.imageUrls[currentImageIndex] : null;
  const hasMultipleImages = hasImages && listing.imageUrls && listing.imageUrls.length > 1;
  const isSelling = listing.type === 'selling';
  const showPrice = isSelling && !listing.tradeOnly;
  
  // Determine the active navbar tab based on listing type
  const activeNavTab = listing.type === 'offering' 
    ? 'offering' 
    : listing.type === 'wanting' 
      ? 'looking' 
      : 'selling';
  
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar activePage={activeNavTab} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-amber-600 hover:text-amber-800 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Listings
          </button>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image gallery */}
            {hasImages ? (
              <div className="relative">
                <div className="w-full h-96 relative">
                  {currentImage && (
                    <Image 
                      src={currentImage}
                      alt={listing.title}
                      fill
                      className="object-contain"
                    />
                  )}
                  
                  {/* Type and price badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {/* Price or trade-only badge */}
                    {showPrice && (
                      <div className="bg-amber-500 text-white px-3 py-1 rounded-md font-semibold shadow-md">
                        ${listing.price?.toFixed(2)}
                      </div>
                    )}
                    
                    {listing.tradeOnly && (
                      <div className="bg-amber-500 text-white px-3 py-1 rounded-md font-semibold shadow-md">
                        Trade welcome
                      </div>
                    )}
                  </div>
                  
                  {/* Image navigation arrows */}
                  {hasMultipleImages && (
                    <>
                      <button 
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
                        aria-label="Previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail navigation */}
                {hasMultipleImages && listing.imageUrls && (
                  <div className="flex overflow-x-auto py-2 gap-2 px-4 pb-4">
                    {listing.imageUrls.map((url, index) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 relative border-2 ${currentImageIndex === index ? 'border-amber-500' : 'border-transparent'} rounded-md overflow-hidden`}
                        onClick={() => selectImage(index)}
                      >
                        <Image 
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-gray-400"
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
            
            {/* Listing details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <div className="flex items-center space-x-2">
                  {/* Star/Like button */}
                  <button 
                    className={`transition-colors duration-300 ${isStarred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'} p-2`}
                    onClick={toggleStar}
                    disabled={!user || isToggling}
                    title={user ? (isStarred ? "Remove from favorites" : "Add to favorites") : "Sign in to star listings"}
                  >
                    <div className="flex flex-col items-center">
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
                      <span className="text-xs mt-1">{listing.starCount || 0}</span>
                    </div>
                  </button>
                  
                  {/* Share button */}
                  <button 
                    className="text-gray-500 hover:text-amber-500 p-2"
                    onClick={copyLink}
                    title="Share listing"
                  >
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-xs mt-1">Share</span>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Listing meta information */}
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <span>{listing.location}</span>
                <span className="mx-2">•</span>
                <span>{getTimeAgo(listing.createdAt)}</span>
                {listing.condition && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Condition: {
                      listing.condition === 'new' ? 'New' :
                      listing.condition === 'likeNew' ? 'Like New' :
                      listing.condition === 'veryGood' ? 'Very Good' :
                      listing.condition === 'good' ? 'Good' :
                      listing.condition === 'fair' ? 'Fair' :
                      listing.condition
                    }</span>
                  </>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </div>
              
              {/* Reply section */}
              <div className="border-t pt-6">
                <button 
                  onClick={() => setShowEmail(!showEmail)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md mr-4"
                >
                  {showEmail ? 'Hide Contact Info' : 'Reply to Listing'}
                </button>
                
                {showEmail && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">Email:</span>
                      <span className="font-medium">{listing.userEmail}</span>
                      <button 
                        onClick={copyEmail}
                        className="ml-3 text-amber-600 hover:text-amber-800"
                        title="Copy email address"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                        </svg>
                      </button>
                    </div>
                    {emailCopied && (
                      <p className="text-green-600 text-sm mt-1">Email copied to clipboard!</p>
                    )}
                  </div>
                )}
                
                {linkCopied && (
                  <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md shadow-lg">
                    Link copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 