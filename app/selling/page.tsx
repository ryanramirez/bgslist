'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import SearchFilterSort from '@/components/SearchFilterSort';
import GameListingCard from '@/components/GameListingCard';
import { getAllListings } from '@/lib/firestore';
import { GameListing } from '@/lib/models';
import { useAuth } from '@/context/AuthContext';
import { getTimeAgo } from '@/lib/utils';

export default function Selling() {
  const { user } = useAuth();
  const [gameListings, setGameListings] = useState<GameListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Add a last loaded timestamp to ensure fresh data
  const [lastLoaded, setLastLoaded] = useState(Date.now());

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        console.log('Fetching selling listings from Firestore...');
        const type = 'selling'; // Type for selling listings
        console.log(`Querying for listings with type: ${type}`);
        const listings = await getAllListings(type);
        console.log(`Got ${listings.length} listings:`, listings);
        setGameListings(listings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
    
    // Set up a focus event listener to refresh data when the page regains focus,
    // but only if enough time has passed since the last refresh
    const handleFocus = () => {
      const now = Date.now();
      const timeSinceLastLoad = now - lastLoaded;
      const minRefreshInterval = 30 * 1000; // 30 seconds in milliseconds
      
      if (timeSinceLastLoad > minRefreshInterval) {
        console.log('Page regained focus, refreshing data');
        setLastLoaded(now);
      } else {
        console.log('Page regained focus, but skipping refresh (too soon)');
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [lastLoaded]); // Re-run when lastLoaded changes

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar activePage="selling" />
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        <SearchFilterSort />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : gameListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameListings.map(game => (
              <GameListingCard 
                key={game.id}
                listingId={game.id}
                userId={user?.uid}
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrls && game.imageUrls.length > 0 ? game.imageUrls[0] : undefined}
                timeAgo={getTimeAgo(game.createdAt)}
                location={game.location}
                price={game.price}
                tradeOnly={game.tradeOnly}
                type={game.type}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No listings found. 
              {user ? (
                <span> <a href="/create-listing" className="text-amber-500 hover:underline">Create one now!</a></span>
              ) : (
                <span> <a href="/auth/signin" className="text-amber-500 hover:underline">Sign in</a> to create one!</span>
              )}
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 