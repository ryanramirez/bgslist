import React from 'react';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import SearchFilterSort from '@/components/SearchFilterSort';
import GameListingCard from '@/components/GameListingCard';

// Sample data for game listings
const gameListings = [
  {
    id: 1,
    title: 'Wingspan',
    description: 'Only played 2 times, looking for a good trade for 2 weeks.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 3,
    location: 'Bend, OR'
  },
  {
    id: 2,
    title: 'Wingspan',
    description: 'Only played 2 times, looking for a good trade for 2 weeks.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 3,
    location: 'Bend, OR'
  },
  {
    id: 3,
    title: 'Wingspan',
    description: 'Only played 2 times, looking for a good trade for 2 weeks.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 3,
    location: 'Bend, OR'
  },
  {
    id: 4,
    title: 'Wingspan',
    description: 'Only played 2 times, looking for a good trade for 2 weeks.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 3,
    location: 'Bend, OR'
  },
  {
    id: 5,
    title: 'Wingspan',
    description: 'Only played 2 times, looking for a good trade for 2 weeks.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 3,
    location: 'Bend, OR'
  },
  {
    id: 6,
    title: 'Wingspan',
    description: 'Only played 2 times, looking for a good trade for 2 weeks.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 3,
    location: 'Bend, OR'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar activePage="offering" />
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        <SearchFilterSort />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameListings.map(game => (
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