'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import SearchFilterSort from '@/components/SearchFilterSort';
import GameListingCard from '@/components/GameListingCard';
import { getAllListings } from '@/lib/firestore';
import { GameListing } from '@/lib/models';

export default function Home() {
  const [gameListings, setGameListings] = useState<GameListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listings = await getAllListings('offering');
        setGameListings(listings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar activePage="offering" />
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
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrl}
                postedDaysAgo={getDaysAgo(game.createdAt)}
                location={game.location}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings found. Be the first to add one!</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Helper function to calculate days ago
function getDaysAgo(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
} 