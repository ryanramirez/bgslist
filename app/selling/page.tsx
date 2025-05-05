import React from 'react';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import SearchFilterSort from '@/components/SearchFilterSort';
import GameListingCard from '@/components/GameListingCard';

// Sample data for Selling listings
const sellingGames = [
  {
    id: 1,
    title: 'Selling Ticket to Ride',
    description: 'Selling Ticket to Ride, played once. Like new condition. $40',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 1,
    location: 'Bend, OR'
  },
  {
    id: 2,
    title: 'Catan for Sale',
    description: 'Catan with Seafarers expansion. Gently used. $35 for both.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 4,
    location: 'Redmond, OR'
  },
  {
    id: 3,
    title: 'Terraforming Mars',
    description: 'Selling Terraforming Mars with sleeve cards. $45',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 2,
    location: 'Bend, OR'
  }
];

export default function Selling() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar activePage="selling" />
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        <SearchFilterSort />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellingGames.map(game => (
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