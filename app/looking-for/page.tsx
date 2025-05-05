import React from 'react';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import SearchFilterSort from '@/components/SearchFilterSort';
import GameListingCard from '@/components/GameListingCard';

// Sample data for Looking For listings
const wantedGames = [
  {
    id: 1,
    title: 'Looking for Gloomhaven',
    description: 'Willing to trade or buy Gloomhaven. Must be in good condition.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 2,
    location: 'Portland, OR'
  },
  {
    id: 2,
    title: 'Wanted: Everdell',
    description: 'Seeking Everdell with all expansions. Can trade multiple games.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 5,
    location: 'Seattle, WA'
  },
  {
    id: 3,
    title: 'ISO Ark Nova',
    description: 'In search of Ark Nova. Can pay or trade for it.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 1,
    location: 'Eugene, OR'
  }
];

export default function LookingFor() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar activePage="looking" />
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        <SearchFilterSort />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wantedGames.map(game => (
            <GameListingCard 
              key={game.id}
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
              postedDaysAgo={game.postedDaysAgo}
              location={game.location}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 